/**
 * Seeds the database with sample stock, prep stages, settings and the first admin login.
 * Safe to run more than once (upserts). Run: npm run db:seed
 *
 * Admin login comes from .env.local: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.
 */
import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Licence } from '../src/generated/prisma/client';
import { sampleBikes } from './seed-data/bikes';
import { categories, sampleProducts } from './seed-data/products';

config({ path: '.env.local' });
config();

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! }) });

const pence = (pounds: number) => Math.round(pounds * 100);

const FEATURED = ['2019-bmw-r1250gs', '2021-yamaha-mt07', '2020-kawasaki-z900', '2020-kawasaki-ninja-zx6r', '2020-honda-africa-twin'];

const licenceFrom: Record<string, Licence> = { 'Full A': 'full_a', A2: 'a2', CBT: 'cbt' };

async function seedBikes() {
  const now = Date.now();
  for (const [i, b] of sampleBikes.entries()) {
    const d = b.detail;
    const badge = b.badge;
    const data = {
      status: b.status === 'reserved' ? ('reserved' as const) : ('available' as const),
      visible: true,
      featured: FEATURED.includes(b.slug),
      registration: b.registration ?? null,
      make: b.make,
      model: b.model,
      year: b.year,
      plate: d?.plate ?? null,
      mileage: b.mileage,
      engineCc: b.engineCc,
      style: b.style,
      colour: d?.colour ?? null,
      licence: d ? (licenceFrom[d.licence] ?? null) : null,
      fuel: d?.fuel ?? 'Petrol',
      gearbox: d?.gearbox ?? null,
      owners: d?.owners ?? null,
      price: pence(b.price),
      wasPrice: b.wasPrice ? pence(b.wasPrice) : null,
      freeWarrantyMonths: badge?.kind === 'warranty' ? badge.months : 0,
      freeWarrantyValue: d?.warrantyWorth ? pence(d.warrantyWorth) : null,
      showWarrantyBadge: true,
      showA2Badge: badge?.kind === 'flag' && badge.text === 'A2 compatible',
      flagText: badge?.kind === 'flag' && badge.text !== 'A2 compatible' ? badge.text : null,
      headline: d?.headline ?? null,
      description: d ? d.overview.join('\n\n') : null,
      features: d?.features ?? [],
      highlights: b.highlights ?? [],
      specRows: d?.spec ?? undefined,
      inspectionReport: d?.inspection ?? undefined,
      publishedAt: new Date(now - i * 60_000), // keeps the sample order: newest first
      reservedAt: b.status === 'reserved' ? new Date(now) : null,
    };

    // Never overwrite a bike staff may have edited: only create missing sample bikes.
    if (await db.bike.findUnique({ where: { slug: b.slug }, select: { id: true } })) continue;
    const bike = await db.bike.create({ data: { slug: b.slug, ...data } });

    await db.bikePhoto.deleteMany({ where: { bikeId: bike.id } });
    await db.bikeHistoryEntry.deleteMany({ where: { bikeId: bike.id } });

    const main = d?.gallery ?? [{ src: b.image, label: 'Side view' }];
    const photos = [
      ...main.map((p, n) => ({ kind: 'main' as const, url: p.src, caption: p.label, sortOrder: n })),
      ...(d?.detailPhotos ?? []).map((p, n) => ({ kind: 'detail' as const, url: p.src, caption: p.label, sortOrder: n })),
      ...(d?.receipts ?? []).map((p, n) => ({ kind: 'receipt' as const, url: p.src, caption: p.label, sortOrder: n })),
    ];
    await db.bikePhoto.createMany({ data: photos.map((p) => ({ ...p, bikeId: bike.id })) });

    if (d?.history.length) {
      await db.bikeHistoryEntry.createMany({
        data: d.history.map(([title, note], n) => ({ bikeId: bike.id, title, note, sortOrder: n })),
      });
    }
  }
  console.log(`✓ ${sampleBikes.length} bikes`);
}

async function seedPrepStages() {
  const stages = ['Deposit paid', 'Full PDI', '120-point inspection', 'Valet', 'MOT', 'Ready for collection / delivery', 'Out for delivery', 'Delivered'];
  if ((await db.prepStageTemplate.count()) === 0) {
    await db.prepStageTemplate.createMany({ data: stages.map((name, sortOrder) => ({ name, sortOrder })) });
  }
  console.log('✓ prep stages');
}

async function seedSettings() {
  const settings: Record<string, unknown> = {
    'reservation.depositPence': 9900,
    'reservation.holdMinutes': 30,
    'delivery.ratePencePerMile': 230,
    'delivery.minimumPence': 4900,
    'business.name': 'GearUp Motorcycles',
    'business.phone': '0744 072 1478',
    'business.whatsapp': 'https://wa.me/447440721478',
    'business.email': 'sales@gearupmotorcycles.co.uk',
    'business.address': '',
    'business.companyNumber': '',
    'business.vatNumber': '',
  };
  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({ where: { key }, create: { key, value: value as never }, update: {} });
  }
  console.log('✓ settings');
}

async function seedShop() {
  for (const [i, c] of categories.entries()) {
    await db.productCategory.upsert({ where: { slug: c.slug }, create: { ...c, sortOrder: i }, update: { name: c.name, sortOrder: i } });
  }
  const cats = await db.productCategory.findMany();
  for (const p of sampleProducts) {
    const data = {
      name: p.name,
      brand: p.brand,
      category: { connect: { id: cats.find((c) => c.slug === p.category)!.id } },
      images: [p.image],
      meta: p.meta,
      flagText: p.flagText ?? null,
      rating: p.rating,
      reviewCount: p.reviewCount,
      popularity: p.popularity,
      active: true,
    };
    const product = await db.product.upsert({ where: { slug: p.slug }, create: { slug: p.slug, ...data }, update: data });
    if ((await db.productVariant.count({ where: { productId: product.id } })) === 0) {
      const sizes = p.sizes ?? ['Standard'];
      await db.productVariant.createMany({
        data: sizes.map((name) => ({
          productId: product.id,
          name,
          sku: `${p.slug}-${name}`.toUpperCase(),
          price: pence(p.price),
          wasPrice: p.wasPrice ? pence(p.wasPrice) : null,
          stockQty: p.stock,
        })),
      });
    }
  }
  // "10% off kit with any bike" from the accessories page
  await db.discountCode.upsert({
    where: { code: 'BIKE10' },
    create: { code: 'BIKE10', percentOff: 10, appliesTo: 'accessories', active: true },
    update: {},
  });
  console.log(`✓ ${sampleProducts.length} products, BIKE10 code`);
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('• skipped admin (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local)');
    return;
  }
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    await db.user.update({ where: { id: existing.id }, data: { role: 'admin' } });
    console.log(`✓ admin exists (${email})`);
    return;
  }
  const id = randomUUID();
  await db.user.create({
    data: {
      id,
      email,
      name: 'GearUp Admin',
      emailVerified: true,
      role: 'admin',
      accounts: { create: { id: randomUUID(), accountId: id, providerId: 'credential', password: await hashPassword(password) } },
    },
  });
  console.log(`✓ admin created (${email})`);
}

async function main() {
  await seedSettings();
  await seedPrepStages();
  await seedBikes();
  await seedShop();
  await seedAdmin();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
