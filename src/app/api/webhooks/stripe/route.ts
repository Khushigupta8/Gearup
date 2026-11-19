import type Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { markOrderPaid, stripe } from '@/server/services/checkout';

/**
 * Stripe → us. Configure in Stripe: Developers → Webhooks → endpoint
 *   https://<site>/api/webhooks/stripe   events: checkout.session.completed, checkout.session.expired
 * and put its signing secret in STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 501 });

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, request.headers.get('stripe-signature') ?? '', secret);
  } catch {
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === 'paid') {
      const pi = typeof session.payment_intent === 'string' ? await stripe.paymentIntents.retrieve(session.payment_intent, { expand: ['latest_charge'] }) : null;
      const charge = pi?.latest_charge as Stripe.Charge | null | undefined;
      await markOrderPaid(orderId, { amount: session.amount_total ?? 0, providerRef: pi?.id ?? session.id, receiptUrl: charge?.receipt_url });
    }
  }

  if (event.type === 'checkout.session.expired') {
    const orderId = event.data.object.metadata?.orderId;
    if (orderId) await db.order.updateMany({ where: { id: orderId, status: 'pending_payment' }, data: { status: 'cancelled' } });
  }

  return NextResponse.json({ received: true });
}
