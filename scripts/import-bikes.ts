/**
 * Imports bikes from a CSV (one row per bike) into the DMS. Use for migrating Rahim's current stock.
 *
 *   npm run import:bikes -- path/to/stock.csv            (dry run: shows what would happen)
 *   npm run import:bikes -- path/to/stock.csv --commit   (writes to the database)
 *
 * Columns: see scripts/bike-import-template.csv. Rows with a registration that already exists are updated.
 * Photo columns take URLs separated by "|"; each photo is copied into our Blob storage.
 * Imported bikes are "draft" unless the status column says otherwise, so staff can check them first.
 */
import { config } from 'dotenv';
import { readFileSync } from 'node:fs';
import { put } from '@vercel/blob';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type BikeStatus, type BikeStyle, type Licence, type PhotoKind } from '../src/generated/prisma/client';

config({ path: '.env.local' });
config();

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! }) });

const STYLES: BikeStyle[] = ['sports', 'naked', 'adventure', 'cruiser', 'classic', 'tourer', 'scooter', 'enduro'];
const STATUSES: BikeStatus[] = ['draft', 'in_preparation', 'available', 'reserved', 'sold', 'archived'];
const LICENCES: Record<string, Licence> = { cbt: 'cbt', a2: 'a2', 'full a': 'full_a', full_a: 'full_a', a: 'full_a' };

/** Minimal CSV parser (quotes, commas and newlines inside quotes). */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim()));
  const keys = header.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));
}

const int = (v: string) => (v ? Math.round(Number(v.replace(/[^0-9.]/g, ''))) : null);
const pence = (v: string) => (v ? Math.round(Number(v.replace(/[^0-9.]/g, '')) * 100) : null);
const split = (v: string) => (v ? v.split('|').map((x) => x.trim()).filter(Boolean) : []);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

async function copyPhoto(url: string, bikeSlug: string, kind: PhotoKind, n: number) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return url; // keep the original URL if storage isn't set up
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photo download failed (${res.status}): ${url}`);
  const type = res.headers.get('content-type') ?? 'image/jpeg';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const blob = await put(`bikes/import/${bikeSlug}/${kind}/${String(n + 1).padStart(2, '0')}.${ext}`, await res.arrayBuffer(), {
    access: 'public',
    contentType: type,
    addRandomSuffix: true,
  });
  return blob.url;
}

async function main() {
  const file = process.argv[2];
  const commit = process.argv.includes('--commit');
  if (!file) throw new Error('Usage: npm run import:bikes -- stock.csv [--commit]');

  const rows = parseCsv(readFileSync(file, 'utf8'));
  console.log(`${rows.length} rows in ${file}${commit ? '' : ' (dry run: add --commit to save)'}`);
  const problems: string[] = [];

  for (const [i, r] of rows.entries()) {
    const line = i + 2;
    const make = r.make;
    const model = r.model;
    const year = int(r.year);
    const style = (r.style || '').toLowerCase() as BikeStyle;
    const price = pence(r.price);
    if (!make || !model || !year || price == null || !STYLES.includes(style)) {
      problems.push(`row ${line}: needs make, model, year, price and a style (${STYLES.join(', ')})`);
      continue;
    }
    const status = (STATUSES.includes(r.status as BikeStatus) ? r.status : 'draft') as BikeStatus;
    const registration = r.registration ? r.registration.toUpperCase() : null;
    const data = {
      registration,
      make,
      model,
      variant: r.variant || null,
      year,
      mileage: int(r.mileage) ?? 0,
      engineCc: int(r.engine_cc) ?? 0,
      style,
      colour: r.colour || null,
      licence: LICENCES[(r.licence || '').toLowerCase()] ?? null,
      owners: int(r.owners),
      price,
      wasPrice: pence(r.was_price),
      status,
      freeWarrantyMonths: [3, 6, 12, 24].includes(int(r.free_warranty_months) ?? 0) ? int(r.free_warranty_months)! : 0,
      description: r.description || null,
      features: split(r.features),
      publishedAt: status === 'available' ? new Date() : null,
    };
    const existing = registration ? await db.bike.findFirst({ where: { registration } }) : null;
    console.log(`row ${line}: ${existing ? 'update' : 'create'} ${year} ${make} ${model}${registration ? ` (${registration})` : ''}`);
    if (!commit) continue;

    let bike = existing;
    if (existing) bike = await db.bike.update({ where: { id: existing.id }, data });
    else {
      let slug = slugify(`${year} ${make} ${model}`);
      for (let n = 2; await db.bike.findUnique({ where: { slug } }); n++) slug = `${slugify(`${year} ${make} ${model}`)}-${n}`;
      bike = await db.bike.create({ data: { ...data, slug } });
    }

    if (r.purchase_price) {
      const acq = { source: 'trade' as const, purchasePrice: pence(r.purchase_price)!, purchasedAt: r.purchase_date ? new Date(r.purchase_date) : new Date() };
      await db.acquisition.upsert({ where: { bikeId: bike!.id }, create: { bikeId: bike!.id, ...acq }, update: acq });
    }

    for (const [col, kind] of [['photos', 'main'], ['detail_photos', 'detail'], ['receipt_photos', 'receipt']] as const) {
      const urls = split(r[col]);
      if (!urls.length) continue;
      await db.bikePhoto.deleteMany({ where: { bikeId: bike!.id, kind } });
      for (const [n, url] of urls.entries()) {
        try {
          const stored = await copyPhoto(url, bike!.slug, kind, n);
          await db.bikePhoto.create({ data: { bikeId: bike!.id, kind, url: stored, sortOrder: n } });
        } catch (e) {
          problems.push(`row ${line}: ${e instanceof Error ? e.message : e}`);
        }
      }
    }
  }

  if (problems.length) console.log(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  console.log(commit ? '\nDone. Check the bikes in Admin → Stock, then set them to Available.' : '\nDry run only.');
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
