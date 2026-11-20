/**
 * Bulk-adds promo banners to the DMS promo library (same as Admin → Promo library → Upload).
 *   npx tsx scripts/add-promos.ts path/to/folder           (dry run)
 *   npx tsx scripts/add-promos.ts path/to/folder --commit
 * Images are converted to WebP (max 2000 px). Files already in the library (same title) are skipped.
 */
import { config } from 'dotenv';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

config({ path: '.env.local' });
config();

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! }) });

const titleFromFile = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+\s*[-_.]\s*/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

async function main() {
  const [dir, flag] = process.argv.slice(2);
  if (!dir) throw new Error('Usage: npx tsx scripts/add-promos.ts <folder> [--commit]');
  const commit = flag === '--commit';
  const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  const existing = new Set((await db.promoAsset.findMany({ select: { title: true } })).map((p) => p.title));
  const last = await db.promoAsset.aggregate({ _max: { sortOrder: true } });
  let order = (last._max.sortOrder ?? -1) + 1;
  const seen = new Map<string, number>();

  for (const f of files) {
    let title = titleFromFile(f) || 'Promo banner';
    // "Banner" x4 → "Banner 1", "Banner 2"… so staff can tell them apart.
    const n = (seen.get(title) ?? 0) + 1;
    seen.set(title, n);
    if (files.filter((x) => titleFromFile(x) === titleFromFile(f)).length > 1) title = `${title} ${n}`;
    if (existing.has(title)) {
      console.log('skip (exists)', title);
      continue;
    }
    const img = sharp(readFileSync(join(dir, f))).resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 });
    const buf = await img.toBuffer();
    const meta = await sharp(buf).metadata();
    console.log(commit ? 'add' : 'would add', title, `${meta.width}x${meta.height}`, `${Math.round(buf.length / 1024)} KB`);
    if (!commit) continue;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const blob = await put(`promos/${slug}.webp`, buf, { access: 'public', contentType: 'image/webp', addRandomSuffix: true });
    await db.promoAsset.create({ data: { title, url: blob.url, width: meta.width, height: meta.height, sortOrder: order++ } });
  }
  const bikes = await db.bike.findMany({ select: { slug: true, status: true, registration: true } });
  console.log('\nbikes:', bikes.map((b) => `${b.slug} (${b.status}${b.registration ? ', ' + b.registration : ''})`).join('\n  '));
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
