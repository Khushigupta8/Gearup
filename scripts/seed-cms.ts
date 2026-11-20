/**
 * Fills the CMS tables with the website's current content (FAQs, reviews, home hero slides), so staff
 * start from what is live. Safe to run again: it only fills sections/tables that are empty.
 *   npx tsx scripts/seed-cms.ts
 */
import { config } from 'dotenv';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

config({ path: '.env.local' });
config();
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! }) });

type Seed = { faqs: { section: string; question: string; answer: string; sortOrder: number }[]; reviews: { author: string; date: string; body: string }[] };

const hero = [
  { title: '2018 Triumph Street Triple RS', subtitle: 'Naked roadster', imageUrl: '/assets/images/hero/triumph-street-triple-rs.webp', linkUrl: '/used-bikes/2018-triumph-street-triple-rs' },
  { title: '2023 Lexmoto LXR 125', subtitle: 'Learner legal', imageUrl: '/assets/images/hero/lexmoto-lxr-125.webp', linkUrl: '/used-bikes' },
  { title: '2020 Kawasaki Ninja ZX-6R', subtitle: 'Supersport', imageUrl: '/assets/images/hero/kawasaki-ninja-zx6r.webp', linkUrl: '/used-bikes/2020-kawasaki-ninja-zx6r' },
  { title: '2019 BMW R 1250 GS', subtitle: 'Adventure', imageUrl: '/assets/images/hero/bmw-r1250gs.webp', linkUrl: '/used-bikes/2019-bmw-r1250gs' },
];

async function main() {
  const seed = JSON.parse(readFileSync('prisma/cms-seed.json', 'utf8')) as Seed;
  const existing = new Set((await db.faq.groupBy({ by: ['section'] })).map((g) => g.section));
  const faqs = seed.faqs.filter((f) => !existing.has(f.section));
  if (faqs.length) await db.faq.createMany({ data: faqs });
  console.log('faqs added:', faqs.length);

  if (!(await db.review.count())) {
    await db.review.createMany({
      data: seed.reviews.map((r, i) => ({ author: r.author, body: r.body, date: new Date(r.date), rating: 5, source: 'Trustpilot', featured: i === 0 })),
    });
    console.log('reviews added:', seed.reviews.length);
  }

  if (!(await db.banner.count({ where: { placement: 'home_hero' } }))) {
    await db.banner.createMany({ data: hero.map((h, i) => ({ ...h, placement: 'home_hero', sortOrder: i })) });
    console.log('hero slides added:', hero.length);
  }
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
