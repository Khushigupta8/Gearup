import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { basketClearUrl } from '@/lib/checkout-urls';
import { confirmStripeSession } from '@/server/services/checkout';

/** Stripe sends the customer here after paying. Confirms the payment, then shows their account. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = url.searchParams.get('order') ?? '';
  const sessionId = url.searchParams.get('session_id');
  if (sessionId) await confirmStripeSession(sessionId).catch((e) => console.error('[stripe confirm]', e));

  const order = await db.order.findUnique({ where: { reference: ref }, select: { bikeId: true } });
  return NextResponse.redirect(new URL(basketClearUrl(order?.bikeId ? `/account?paid=${ref}` : `/account/orders?paid=${ref}`), url));
}
