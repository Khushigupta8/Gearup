'use server';

import { updateTag } from 'next/cache';
import { z } from 'zod';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';
import { BIKES_TAG } from '@/server/services/bikes';

const quickUpdate = z.object({
  id: z.string().min(1),
  pricePounds: z.coerce.number().int().min(0).max(1_000_000),
  status: z.enum(['draft', 'in_preparation', 'available', 'reserved', 'sold', 'archived']),
  visible: z.coerce.boolean(),
});

export type QuickUpdateResult = { ok: true } | { ok: false; error: string };

/** Stock list inline edit: price, status, visible. Updates the website immediately. */
export async function quickUpdateBike(_prev: QuickUpdateResult | null, form: FormData): Promise<QuickUpdateResult> {
  const user = await requireStaff();
  const parsed = quickUpdate.safeParse({
    id: form.get('id'),
    pricePounds: form.get('price'),
    status: form.get('status'),
    visible: form.get('visible') === 'on',
  });
  if (!parsed.success) return { ok: false, error: 'Check the price and status.' };

  const { id, pricePounds, status, visible } = parsed.data;
  const before = await db.bike.findUnique({ where: { id }, select: { price: true, status: true, visible: true } });
  if (!before) return { ok: false, error: 'Bike not found.' };

  const now = new Date();
  const price = pricePounds * 100;
  await db.bike.update({
    where: { id },
    data: {
      price,
      status,
      visible,
      // lifecycle dates follow the status
      // first time on sale only; coming back from reserved keeps its place in the list
      ...(status === 'available' && ['draft', 'in_preparation'].includes(before.status) ? { publishedAt: now } : {}),
      ...(status === 'reserved' && before.status !== 'reserved' ? { reservedAt: now } : {}),
      ...(status === 'sold' && before.status !== 'sold' ? { soldAt: now } : {}),
    },
  });
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'bike.quick_update',
      entity: 'bike',
      entityId: id,
      changes: { before, after: { price, status, visible } },
    },
  });

  updateTag(BIKES_TAG);
  return { ok: true };
}
