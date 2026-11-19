/**
 * Sets the main admin's email and password from .env.local (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD).
 * Updates the existing admin (the oldest admin account) instead of creating a second one,
 * and signs out all of that admin's sessions. Run: npm run admin:login
 */
import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

config({ path: '.env.local' });
config();

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! }) });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local');
  if (password.length < 8) throw new Error('Password must be at least 8 characters');

  const admin =
    (await db.user.findUnique({ where: { email } })) ??
    (await db.user.findFirst({ where: { role: 'admin' }, orderBy: { createdAt: 'asc' } }));
  if (!admin) throw new Error('No admin found. Run npm run db:seed first.');

  const hash = await hashPassword(password);
  await db.$transaction([
    db.user.update({ where: { id: admin.id }, data: { email, role: 'admin', emailVerified: true } }),
    db.account.deleteMany({ where: { userId: admin.id, providerId: 'credential' } }),
    db.account.create({ data: { id: randomUUID(), userId: admin.id, accountId: admin.id, providerId: 'credential', password: hash } }),
    db.session.deleteMany({ where: { userId: admin.id } }),
  ]);
  console.log(`✓ admin login is now ${email} (all old sessions signed out)`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
