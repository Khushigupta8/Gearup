import 'server-only';
import { db } from '../db';
import type { Prisma } from '@/generated/prisma/client';
import { mergeBasketLines } from '@/lib/basket-lines';

export type PricedLine = {
  variantId: string;
  productSlug: string;
  name: string;
  size: string | null;
  image: string | null;
  unit: number; // pence
  qty: number;
  total: number;
  inStock: boolean;
};

export type KitQuote = {
  lines: PricedLine[];
  itemsTotal: number;
  discount: { code: string; label: string; amount: number } | null;
  codeError: string | null;
  postage: number;
  missing: string[]; // variant ids that no longer exist
};

/** Kit postage: free with a bike or on collection; otherwise £4.99, free over £75. */
export function postageFor(itemsTotal: number, opts: { withBike: boolean; fulfilment: 'collection' | 'delivery' }) {
  if (opts.withBike || opts.fulfilment === 'collection' || itemsTotal === 0) return 0;
  return itemsTotal >= 7500 ? 0 : 499;
}

/** Re-prices basket lines from the database and applies a discount code. Never trusts browser prices. */
export async function quoteKit(
  input: { variantId: string; qty: number }[],
  code: string | undefined,
  opts: { withBike: boolean; fulfilment: 'collection' | 'delivery' },
  client: Prisma.TransactionClient = db,
): Promise<KitQuote> {
  const wanted = mergeBasketLines(input);
  const variants = await client.productVariant.findMany({
    where: { id: { in: wanted.map((l) => l.variantId) }, product: { active: true } },
    include: { product: true, orderItems: { where: { order: { status: 'pending_payment', holdExpiresAt: { gt: new Date() } } }, select: { quantity: true } } },
  });

  const lines: PricedLine[] = [];
  const missing: string[] = [];
  for (const l of wanted) {
    const v = variants.find((x) => x.id === l.variantId);
    if (!v) {
      missing.push(l.variantId);
      continue;
    }
    const qty = l.qty;
    const held = v.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    lines.push({
      variantId: v.id,
      productSlug: v.product.slug,
      name: v.product.name,
      size: v.name === 'Standard' ? null : v.name,
      image: v.product.images[0] ?? null,
      unit: v.price,
      qty,
      total: v.price * qty,
      inStock: Number.isInteger(qty) && qty > 0 && qty <= 10 && v.stockQty - held >= qty,
    });
  }
  const itemsTotal = lines.reduce((s, l) => s + l.total, 0);

  let discount: KitQuote['discount'] = null;
  let codeError: string | null = null;
  const c = code?.trim().toUpperCase();
  if (c) {
    const dc = await client.discountCode.findUnique({ where: { code: c } });
    const now = new Date();
    if (!dc || !dc.active || (dc.startsAt && dc.startsAt > now) || (dc.endsAt && dc.endsAt < now)) codeError = 'That code isn’t valid.';
    else if (dc.maxUses != null && dc.timesUsed >= dc.maxUses) codeError = 'That code has been used up.';
    else if (dc.appliesTo === 'bikes') codeError = 'That code is for bikes, not kit.';
    else if (itemsTotal === 0) codeError = 'Add some kit to use this code.';
    else {
      const amount = dc.percentOff ? Math.round((itemsTotal * dc.percentOff) / 100) : Math.min(itemsTotal, dc.amountOff ?? 0);
      discount = { code: dc.code, amount, label: dc.percentOff ? `${dc.code} (${dc.percentOff}% off kit)` : `${dc.code} (£${((dc.amountOff ?? 0) / 100).toFixed(2)} off)` };
    }
  }

  return { lines, itemsTotal, discount, codeError, postage: postageFor(itemsTotal, opts), missing };
}

/** Business settings from the Setting table, with defaults. */
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.setting.findUnique({ where: { key } });
  return (row?.value as T | undefined) ?? fallback;
}
