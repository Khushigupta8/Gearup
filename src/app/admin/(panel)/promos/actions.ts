'use server';

import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';

/** Promo banner library (client, 19 Nov): upload once, add to any bike's gallery. */

const LIB = '/admin/promos';

export async function addPromoAssets(items: { url: string; title: string; width?: number; height?: number }[]) {
  const user = await requireStaff();
  const list = z
    .array(z.object({ url: z.url(), title: z.string().trim().min(1).max(120), width: z.number().int().optional(), height: z.number().int().optional() }))
    .min(1)
    .max(30)
    .parse(items);
  const last = await db.promoAsset.aggregate({ _max: { sortOrder: true } });
  let order = (last._max.sortOrder ?? -1) + 1;
  await db.promoAsset.createMany({ data: list.map((p) => ({ ...p, sortOrder: order++ })) });
  await db.auditLog.create({ data: { userId: user.id, action: 'promo.add', entity: 'promo_asset', entityId: '-', changes: { count: list.length } } });
  revalidatePath(LIB);
}

export async function updatePromo(id: string, data: { title?: string; active?: boolean }) {
  await requireStaff();
  const d = z.object({ title: z.string().trim().min(1).max(120).optional(), active: z.boolean().optional() }).parse(data);
  await db.promoAsset.update({ where: { id }, data: d });
  revalidatePath(LIB);
}

export async function movePromo(id: string, direction: -1 | 1) {
  await requireStaff();
  const all = await db.promoAsset.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  const i = all.findIndex((p) => p.id === id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= all.length) return;
  [all[i], all[j]] = [all[j], all[i]];
  await db.$transaction(all.map((p, n) => db.promoAsset.update({ where: { id: p.id }, data: { sortOrder: n } })));
  revalidatePath(LIB);
}

/**
 * Removes a banner from the library. Bikes that already use it keep it (they point at the same file),
 * so the file is only deleted from storage when no bike photo uses it.
 */
export async function deletePromo(id: string) {
  const user = await requireStaff();
  const promo = await db.promoAsset.delete({ where: { id } });
  const inUse = await db.bikePhoto.count({ where: { url: promo.url } });
  if (!inUse && promo.url.includes('.blob.vercel-storage.com')) await del(promo.url).catch(() => undefined);
  await db.auditLog.create({ data: { userId: user.id, action: 'promo.delete', entity: 'promo_asset', entityId: id, changes: { inUse } } });
  revalidatePath(LIB);
}

/** Active banners for the picker on the bike page. */
export async function listActivePromos() {
  await requireStaff();
  return db.promoAsset.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }], select: { id: true, title: true, url: true } });
}
