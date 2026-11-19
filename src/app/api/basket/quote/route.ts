import { NextResponse } from 'next/server';
import { z } from 'zod';
import { quoteKit } from '@/server/services/pricing';

const schema = z.object({
  lines: z.array(z.object({ variantId: z.string().max(40), qty: z.number().int().min(1).max(10) })).max(30),
  code: z.string().max(40).optional(),
  withBike: z.boolean().default(false),
  fulfilment: z.enum(['collection', 'delivery']).default('delivery'),
});

/** Prices the browser's basket (used by the basket, checkout and reserve pages). */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  const { lines, code, withBike, fulfilment } = parsed.data;
  return NextResponse.json(await quoteKit(lines, code, { withBike, fulfilment }));
}
