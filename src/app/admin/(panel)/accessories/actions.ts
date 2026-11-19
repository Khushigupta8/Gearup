'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';
import { PRODUCTS_TAG } from '@/server/services/shop';

export type ShopResult = { ok: true; message?: string } | { ok: false; error: string } | null;

const text = z.string().trim().max(300).transform((v) => v || null);
const pence = z.preprocess((v) => Math.round(Number(String(v ?? '').replace(/[^0-9.]/g, '')) * 100), z.number().int().min(0).max(10_000_000));
const optPence = z.preprocess((v) => (String(v ?? '').trim() === '' ? null : Math.round(Number(String(v).replace(/[^0-9.]/g, '')) * 100)), z.number().int().min(0).nullable());

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Add a product name').max(160),
  brand: text,
  categoryId: z.string().transform((v) => v || null),
  meta: text,
  flagText: text,
  description: z.string().trim().max(5000).transform((v) => v || null),
  image: z.string().trim().max(500).transform((v) => v || null),
  popularity: z.coerce.number().int().min(0).max(9999).default(100),
  active: z.preprocess((v) => v === 'on', z.boolean()),
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export async function saveProduct(_prev: ShopResult, form: FormData): Promise<ShopResult> {
  await requireStaff();
  const parsed = productSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  const { id, image, ...d } = parsed.data;

  // Variant rows: variant[n][field]
  const rows = new Map<string, Record<string, string>>();
  for (const [k, v] of form.entries()) {
    const m = /^variant\[(\d+)\]\[(\w+)\]$/.exec(k);
    if (m) rows.set(m[1], { ...(rows.get(m[1]) ?? {}), [m[2]]: String(v) });
  }
  const variants = [...rows.values()]
    .filter((r) => r.name?.trim() || r.price?.trim())
    .map((r) =>
      z
        .object({ id: z.string().optional(), name: z.string().trim().min(1).max(40), price: pence, wasPrice: optPence, stock: z.coerce.number().int().min(0).max(9999), remove: z.string().optional() })
        .parse({ ...r, id: r.id || undefined }),
    );
  if (!variants.filter((v) => !v.remove).length) return { ok: false, error: 'Add at least one size/price (use "Standard" if it has no sizes).' };

  const data = { ...d, images: image ? [image] : [] };
  const product = id
    ? await db.product.update({ where: { id }, data })
    : await db.product.create({ data: { ...data, slug: `${slugify(d.name)}-${Date.now().toString(36).slice(-4)}` } });

  for (const v of variants) {
    if (v.id && v.remove) {
      const used = await db.orderItem.count({ where: { variantId: v.id } });
      if (used) await db.productVariant.update({ where: { id: v.id }, data: { stockQty: 0 } });
      else await db.productVariant.delete({ where: { id: v.id } });
    } else if (v.id) {
      await db.productVariant.update({ where: { id: v.id }, data: { name: v.name, price: v.price, wasPrice: v.wasPrice, stockQty: v.stock } });
    } else if (!v.remove) {
      await db.productVariant.create({ data: { productId: product.id, name: v.name, price: v.price, wasPrice: v.wasPrice, stockQty: v.stock } });
    }
  }
  updateTag(PRODUCTS_TAG);
  revalidatePath('/admin/accessories');
  if (!id) redirect(`/admin/accessories/${product.id}?created=1`);
  return { ok: true, message: d.active ? 'Saved. Live in the shop.' : 'Saved (hidden from the shop).' };
}

const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{3,20}$/, 'Codes are 3 to 20 letters or numbers'),
  kind: z.enum(['percent', 'amount']),
  value: z.coerce.number().positive().max(100_000),
  appliesTo: z.enum(['accessories', 'all']),
  endsAt: z.preprocess((v) => (v ? new Date(String(v)) : null), z.date().nullable()),
  maxUses: z.preprocess((v) => (v === '' || v == null ? null : Number(v)), z.number().int().positive().nullable()),
});

export async function createDiscountCode(_prev: ShopResult, form: FormData): Promise<ShopResult> {
  await requireStaff();
  const parsed = codeSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the code.' };
  const d = parsed.data;
  if (d.kind === 'percent' && d.value > 100) return { ok: false, error: 'A percentage can’t be over 100.' };
  try {
    await db.discountCode.create({
      data: {
        code: d.code,
        percentOff: d.kind === 'percent' ? Math.round(d.value) : null,
        amountOff: d.kind === 'amount' ? Math.round(d.value * 100) : null,
        appliesTo: d.appliesTo,
        endsAt: d.endsAt,
        maxUses: d.maxUses,
      },
    });
  } catch {
    return { ok: false, error: 'That code already exists.' };
  }
  revalidatePath('/admin/accessories/codes');
  return { ok: true, message: `${d.code} created.` };
}

export async function toggleDiscountCode(id: string, active: boolean) {
  await requireStaff();
  await db.discountCode.update({ where: { id }, data: { active } });
  revalidatePath('/admin/accessories/codes');
}
