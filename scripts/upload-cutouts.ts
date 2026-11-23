/**
 * Uploads bike cut-outs (transparent PNGs named <slug>.png) and saves them on the bikes.
 *   npx tsx scripts/upload-cutouts.ts <folder>
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

(async () => {
  const dir = process.argv[2];
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.png'))) {
    const slug = f.replace(/\.png$/, '');
    const bike = await db.bike.findUnique({ where: { slug }, select: { id: true } });
    if (!bike) continue;
    const buf = await sharp(readFileSync(join(dir, f))).webp({ quality: 92, alphaQuality: 100 }).toBuffer();
    const blob = await put(`bikes/${bike.id}/cutout/${slug}.webp`, buf, { access: 'public', contentType: 'image/webp', addRandomSuffix: true });
    await db.bike.update({ where: { id: bike.id }, data: { cutoutUrl: blob.url } });
    console.log('cutout', slug, Math.round(buf.length / 1024) + 'KB');
  }
  await db.$disconnect();
})();
