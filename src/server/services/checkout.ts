import 'server-only';
import { revalidateTag } from 'next/cache';
import Stripe from 'stripe';
import type { Fulfilment } from '@/generated/prisma/client';
import { db } from '../db';
import { BIKES_TAG } from './bikes';
import { renderEmail, sendEmail } from './email';
import { getSetting, quoteKit } from './pricing';

/**
 * Checkout for a £99 bike reservation and/or accessories.
 * Payments go through Stripe Checkout when STRIPE_SECRET_KEY is set.
 * ALLOW_TEST_PAYMENTS=1 (local only, never on Vercel) adds a fake "pay" page for testing without Stripe.
 */

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const testPaymentsAllowed = !stripe && process.env.ALLOW_TEST_PAYMENTS === '1';

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const gbp = (p: number) => `£${(p / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export type CheckoutInput = {
  customerId: string;
  email: string;
  bikeSlug?: string;
  lines: { variantId: string; qty: number }[];
  code?: string;
  fulfilment: Fulfilment;
  deliveryPostcode?: string;
  deliveryAddress?: string;
  balanceMethod?: string;
  partExReg?: string;
  cancelPath: string;
};

async function nextReference() {
  const year = new Date().getFullYear();
  const count = await db.order.count({ where: { reference: { startsWith: `GU-${year}-` } } });
  return `GU-${year}-${String(count + 1).padStart(4, '0')}`;
}

/** Is someone else part-way through paying for this bike? Expired holds are released here. */
async function bikeIsHeld(bikeId: string) {
  const now = new Date();
  await db.order.updateMany({ where: { bikeId, status: 'pending_payment', holdExpiresAt: { lt: now } }, data: { status: 'cancelled' } });
  return (await db.order.count({ where: { bikeId, status: 'pending_payment', holdExpiresAt: { gte: now } } })) > 0;
}

export async function startCheckout(input: CheckoutInput): Promise<{ url: string } | { error: string }> {
  const bike = input.bikeSlug
    ? await db.bike.findUnique({ where: { slug: input.bikeSlug }, include: { photos: { where: { kind: 'main' }, orderBy: { sortOrder: 'asc' }, take: 1 } } })
    : null;
  if (input.bikeSlug) {
    if (!bike || !bike.visible || bike.status !== 'available') return { error: 'Sorry, this bike has just been reserved by someone else.' };
    if (await bikeIsHeld(bike.id)) return { error: 'Someone is paying for this bike right now. Try again in 30 minutes, or call us.' };
  }

  const quote = await quoteKit(input.lines, input.code, { withBike: Boolean(bike), fulfilment: input.fulfilment });
  if (quote.codeError && input.code) return { error: quote.codeError };
  const outOfStock = quote.lines.filter((l) => !l.inStock);
  if (outOfStock.length) return { error: `Sorry, not enough stock of: ${outOfStock.map((l) => l.name).join(', ')}.` };
  if (!bike && quote.lines.length === 0) return { error: 'Your basket is empty.' };

  const deposit = bike ? await getSetting<number>('reservation.depositPence', 9900) : 0;
  const holdMinutes = await getSetting<number>('reservation.holdMinutes', 30);
  const discount = quote.discount?.amount ?? 0;
  const dueToday = deposit + quote.itemsTotal - discount + quote.postage;

  const order = await db.order.create({
    data: {
      reference: await nextReference(),
      customerId: input.customerId,
      bikeId: bike?.id ?? null,
      status: 'pending_payment',
      fulfilment: input.fulfilment,
      depositAmount: deposit,
      deliveryFee: quote.postage,
      itemsTotal: quote.itemsTotal,
      discountCode: quote.discount?.code ?? null,
      discountTotal: discount,
      balanceDue: bike ? bike.price - deposit : 0,
      holdExpiresAt: new Date(Date.now() + holdMinutes * 60_000),
      deliveryPostcode: input.deliveryPostcode?.toUpperCase() || null,
      deliveryAddress: input.deliveryAddress || null,
      balanceMethod: input.balanceMethod || null,
      partExReg: input.partExReg?.toUpperCase() || null,
      items: { create: quote.lines.map((l) => ({ variantId: l.variantId, name: l.size ? `${l.name} (${l.size})` : l.name, unitPrice: l.unit, quantity: l.qty })) },
    },
  });

  if (stripe) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    if (bike) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: deposit,
          product_data: {
            name: `Reservation deposit: ${bike.year} ${bike.make} ${bike.model}`,
            description: `Taken off the £${(bike.price / 100).toLocaleString('en-GB')} price of the bike.`,
            images: bike.photos[0]?.url.startsWith('http') ? [bike.photos[0].url] : undefined,
          },
        },
      });
    }
    for (const l of quote.lines) {
      lineItems.push({
        quantity: l.qty,
        price_data: { currency: 'gbp', unit_amount: l.unit, product_data: { name: l.size ? `${l.name} (${l.size})` : l.name } },
      });
    }
    if (quote.postage) lineItems.push({ quantity: 1, price_data: { currency: 'gbp', unit_amount: quote.postage, product_data: { name: 'UK postage' } } });

    const coupon = discount ? await stripe.coupons.create({ amount_off: discount, currency: 'gbp', duration: 'once', name: quote.discount!.label, max_redemptions: 1 }) : null;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: input.email,
      line_items: lineItems,
      discounts: coupon ? [{ coupon: coupon.id }] : undefined,
      metadata: { orderId: order.id, reference: order.reference },
      payment_intent_data: { metadata: { orderId: order.id, reference: order.reference } },
      expires_at: Math.floor(Date.now() / 1000) + Math.max(30, holdMinutes) * 60,
      success_url: `${siteUrl()}/checkout/success?order=${order.reference}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}${input.cancelPath}`,
    });
    await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
    return { url: session.url! };
  }

  if (testPaymentsAllowed) return { url: `/checkout/test?order=${order.reference}` };

  await db.order.delete({ where: { id: order.id } });
  return { error: `Online payment isn’t switched on yet. Call us on 0744 072 1478 and we will take the ${gbp(dueToday)} over the phone.` };
}

/** Marks an order paid (Stripe webhook, success page or test payment). Safe to call more than once. */
export async function markOrderPaid(orderId: string, payment: { amount: number; providerRef: string; provider?: string; receiptUrl?: string | null }) {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true, customer: true, bike: true } });
  if (!order || order.status !== 'pending_payment') return order;
  if (await db.payment.findUnique({ where: { providerRef: payment.providerRef } })) return order;

  const firstStage = await db.prepStageTemplate.findFirst({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
  const now = new Date();
  await db.$transaction([
    db.order.update({
      where: { id: order.id },
      data: { status: order.bikeId ? 'reserved' : 'in_preparation', amountPaid: payment.amount, paidAt: now, holdExpiresAt: null },
    }),
    db.payment.create({
      data: { orderId: order.id, amount: payment.amount, provider: payment.provider ?? 'stripe', providerRef: payment.providerRef, status: 'succeeded', receiptUrl: payment.receiptUrl ?? null },
    }),
    ...order.items.filter((i) => i.variantId).map((i) => db.productVariant.update({ where: { id: i.variantId! }, data: { stockQty: { decrement: i.quantity } } })),
    ...(order.discountCode ? [db.discountCode.update({ where: { code: order.discountCode }, data: { timesUsed: { increment: 1 } } })] : []),
    ...(order.bikeId ? [db.bike.update({ where: { id: order.bikeId }, data: { status: 'reserved', reservedAt: now } })] : []),
    ...(order.bikeId && firstStage ? [db.orderStage.create({ data: { orderId: order.id, templateId: firstStage.id, doneAt: now } })] : []),
  ]);
  if (order.bikeId) revalidateTag(BIKES_TAG, { expire: 0 });

  // Emails (skipped until Resend is set up)
  const bikeName = order.bike ? `${order.bike.year} ${order.bike.make} ${order.bike.model}` : null;
  const rows: [string, string][] = [
    ['Order', order.reference],
    ...(bikeName ? ([['Bike', bikeName], ['Deposit paid', gbp(order.depositAmount)], ['Balance due', gbp(order.balanceDue)]] as [string, string][]) : []),
    ...order.items.map((i) => [`${i.quantity} × ${i.name}`, gbp(i.unitPrice * i.quantity)] as [string, string]),
    ...(order.discountTotal ? ([[`Discount ${order.discountCode}`, `−${gbp(order.discountTotal)}`]] as [string, string][]) : []),
    ['Paid today', gbp(payment.amount)],
    ['How you get it', order.fulfilment === 'delivery' ? `Delivery${order.deliveryPostcode ? ` to ${order.deliveryPostcode}` : ''}` : 'Collect from the showroom'],
  ];
  const customerMail = renderEmail({
    heading: bikeName ? 'Your bike is reserved' : 'Thanks for your order',
    paragraphs: bikeName
      ? [`Thanks ${order.customer.firstName}. The ${bikeName} is off sale and reserved for you.`, 'We will text you within the hour, then you can follow the full PDI in your account.']
      : [`Thanks ${order.customer.firstName}. We are getting your kit ready and will let you know when it’s on its way.`],
    rows,
    cta: { label: bikeName ? 'Track my bike' : 'View my order', href: `${siteUrl()}${bikeName ? '/account' : '/account/orders'}` },
  });
  const staffMail = renderEmail({
    heading: bikeName ? `Reserved: ${bikeName}` : `New kit order ${order.reference}`,
    paragraphs: [`${order.customer.firstName} ${order.customer.lastName ?? ''} paid ${gbp(payment.amount)}.`],
    rows: [...rows, ['Customer', [order.customer.email, order.customer.phone].filter(Boolean).join(' · ')]],
    cta: { label: 'Open in admin', href: `${siteUrl()}/admin/sales/${order.id}` },
  });
  await Promise.allSettled([
    order.customer.email ? sendEmail({ to: order.customer.email, subject: `GearUp order ${order.reference}`, ...customerMail }) : null,
    sendEmail({ to: process.env.STAFF_NOTIFY_EMAIL ?? 'sales@gearupmotorcycles.co.uk', subject: `${bikeName ? 'Bike reserved' : 'Kit order'}: ${order.reference}`, ...staffMail }),
  ]);
  return order;
}

/** Called by the success page: confirms with Stripe directly in case the webhook is slow. */
export async function confirmStripeSession(sessionId: string) {
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.latest_charge'] });
  const orderId = session.metadata?.orderId;
  if (!orderId || session.payment_status !== 'paid') return null;
  const pi = session.payment_intent as Stripe.PaymentIntent | null;
  const charge = pi?.latest_charge as Stripe.Charge | null | undefined;
  return markOrderPaid(orderId, { amount: session.amount_total ?? 0, providerRef: pi?.id ?? session.id, receiptUrl: charge?.receipt_url });
}
