/**
 * One-off import of Rahim's Facebook Marketplace stock (23 Nov 2026).
 *   npx tsx scripts/import-fb-bikes.ts <manifest.json> <photos dir>            (dry run)
 *   npx tsx scripts/import-fb-bikes.ts <manifest.json> <photos dir> --commit   (writes + uploads)
 *   ... --commit --archive-samples   also archives every other bike (the sample stock)
 * Photos are named gearup-fb-<slug>-NN.jpg. "detail" numbers become Detailed pictures; "skip" numbers are ignored.
 */
import { config } from 'dotenv';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type BikeStyle } from '../src/generated/prisma/client';

config({ path: '.env.local' });
config();
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! }) });

type Row = {
  slug: string; make: string; model: string; variant?: string; year: number; plate: string; reg: string | null; price: number; miles: number; cc: number;
  style: BikeStyle; gear: string; colour: string; owners: number | null; warranty: number; detail: number[]; skip: number[]; headline: string;
  features: string[]; description: string; nPhotos: number;
};

const areas = ['Engine & drivetrain', 'Brakes & ABS', 'Suspension & steering', 'Wheels & tyres', 'Electrics & lights', 'Frame, bodywork & road test'];

async function main() {
  const [manifestPath, dir, ...flags] = process.argv.slice(2);
  const commit = flags.includes('--commit');
  const rows = JSON.parse(readFileSync(manifestPath, 'utf8')) as Row[];
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  for (const r of rows) {
    const exists = await db.bike.findUnique({ where: { slug: r.slug }, select: { id: true } });
    if (exists) {
      console.log('skip (exists)', r.slug);
      continue;
    }
    const nums = Array.from({ length: r.nPhotos }, (_, i) => i + 1).filter((n) => !r.skip.includes(n));
    const main = nums.filter((n) => !r.detail.includes(n));
    const detail = nums.filter((n) => r.detail.includes(n));
    console.log(`${commit ? 'add' : 'would add'} ${r.slug}: ${main.length} main, ${detail.length} detailed, £${r.price}`);
    if (!commit) continue;

    const bike = await db.bike.create({
      data: {
        slug: r.slug, status: 'available', visible: true, publishedAt: new Date(), featured: ['2021-lexmoto-lxr-125', '2026-keeway-rks-125', '2024-lexmoto-titan-125', '2020-hyosung-gv125s-aquila', '2021-keeway-tx-125'].includes(r.slug),
        registration: r.reg, make: r.make, model: r.model, variant: r.variant ?? null, year: r.year, plate: r.plate, condition: 'used',
        mileage: r.miles, engineCc: r.cc, style: r.style, colour: r.colour, licence: 'cbt', fuel: 'Petrol', gearbox: r.gear, owners: r.owners, keys: 2,
        price: r.price * 100, freeWarrantyMonths: r.warranty, showWarrantyBadge: r.warranty > 0,
        headline: r.headline, description: r.description, features: r.features,
        specRows: [['Make', r.make], ['Model', `${r.model}${r.variant ? ` ${r.variant}` : ''}`], ['Year', r.plate], ['Engine', `${r.cc}cc`], ['Gearbox', r.gear], ['Colour', r.colour], ['Mileage', `${r.miles.toLocaleString('en-GB')} miles`], ['Licence', 'CBT / learner legal'], ['Keys', '2']],
        inspectionReport: { date: today, results: areas.map((a) => [a, 'Passed']) },
        history: {
          create: [
            { title: 'HPI clear', note: 'Not stolen, scrapped or written off. Report present.', sortOrder: 0 },
            { title: r.slug === '2026-keeway-rks-125' ? '3 years MOT' : 'Fresh 12 months MOT', note: 'With certificate', sortOrder: 1 },
            { title: 'Fully serviced', note: 'By GearUp before sale', sortOrder: 2 },
          ],
        },
      },
    });

    let order = 0;
    for (const [kind, list] of [['main', main], ['detail', detail]] as const) {
      order = 0;
      for (const n of list) {
        const file = join(dir, `gearup-fb-${r.slug}-${String(n).padStart(2, '0')}.jpg`);
        const buf = await sharp(readFileSync(file)).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toBuffer();
        const blob = await put(`bikes/${bike.id}/${kind}/${r.slug}-${n}.webp`, buf, { access: 'public', contentType: 'image/webp', addRandomSuffix: true });
        await db.bikePhoto.create({
          data: { bikeId: bike.id, kind, url: blob.url, caption: kind === 'detail' ? 'Close-up of marks and wear' : null, sortOrder: order++ },
        });
      }
    }
    console.log('  uploaded', main.length + detail.length, 'photos');
  }

  if (commit && flags.includes('--archive-samples')) {
    const keep = rows.map((r) => r.slug);
    const res = await db.bike.updateMany({ where: { slug: { notIn: keep }, status: { not: 'archived' } }, data: { status: 'archived', featured: false } });
    console.log('archived sample bikes:', res.count);
  }
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
