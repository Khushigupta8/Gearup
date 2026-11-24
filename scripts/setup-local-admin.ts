import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

config({ path: '.env.local', quiet: true });
const url = new URL(process.env.DATABASE_URL ?? '');
if (!['localhost', '127.0.0.1'].includes(url.hostname) || url.pathname !== '/gearup_local') {
  throw new Error('This command is only for the isolated gearup_local database.');
}
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url.toString() }) });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error('Set local admin credentials in .env.local first.');
  const user = await db.user.upsert({ where: { email }, update: { role: 'admin' },
    create: { id: randomUUID(), email, name: 'GearUp Local Admin', emailVerified: true, role: 'admin' } });
  const account = await db.account.findFirst({ where: { userId: user.id, providerId: 'credential' } });
  const hash = await hashPassword(password);
  if (account) await db.account.update({ where: { id: account.id }, data: { password: hash } });
  else await db.account.create({ data: { id: randomUUID(), accountId: user.id, userId: user.id, providerId: 'credential', password: hash } });
  console.log('Local admin ready. Login credentials are in .env.local.');
}
main().catch(() => { console.error('Could not create the local admin. Check the local database and environment.'); process.exitCode = 1; }).finally(() => db.$disconnect());
