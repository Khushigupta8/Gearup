import 'server-only';
import type { Prisma } from '@/generated/prisma/client';

/** Serialize inventory allocation across server instances, not just this Node process. */
export async function lockInventory(tx: Prisma.TransactionClient) {
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(7142501)::text`;
}
