import 'server-only';
import { revalidateTag } from 'next/cache';
import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { lockInventory } from './inventory-lock';
import { PRODUCTS_TAG } from './shop';
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
export const testPaymentsAllowed = !stripe && !process.env.VERCEL && process.env.ALLOW_TEST_PAYMENTS === '1';

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

function nextReference() {
  return `GU-${new Date().getFullYear()}-${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
}

export async function startCheckout(input: CheckoutInput): Promise<{ url: string } | { error: string }> {
  const [depositSetting, holdSetting] = await Promise.all([getSetting<number>('reservation.depositPence', 9900), getSetting<number>('reservation.holdMinutes', 30)]);
  const allocation = await db.$transaction(async (tx) => {
    await lockInventory(tx);
    const now = new Date();
    await tx.order.updateMany({ where: { status: 'pending_payment', holdExpiresAt: { lt: now } }, data: { status: 'cancelled' } });
    const bike = input.bikeSlug ? await tx.bike.findUnique({ where: { slug: input.bikeSlug }, include: { photos: { where: { kind: 'main' }, orderBy: { sortOrder: 'asc' }, take: 1 } } }) : null;
    if (input.bikeSlug) {
      if (!bike || !bike.visible || bike.status !== 'available') return { error: 'Sorry, this bike has just been reserved by someone else.' };
      if (await tx.order.count({ where: { bikeId: bike.id, status: 'pending_payment', holdExpiresAt: { gt: now } } })) return { error: 'Someone is paying for this bike right now. Please try again after their payment hold expires, or call us.' };
    }
    const quote = await quoteKit(input.lines, input.code, { withBike: Boolean(bike), fulfilment: input.fulfilment }, tx);
    if (quote.missing.length) return { error: 'An item in your basket is no longer available. Please update your basket.' };
    if (quote.codeError && input.code) return { error: quote.codeError };
    if (quote.lines.some((line) => !line.inStock)) return { error: 'Sorry, not enough stock is available. Some items may be held by another customer. Please update your basket or try again later.' };
    if (!bike && !quote.lines.length) return { error: 'Your basket is empty.' };
    const deposit = bike ? depositSetting : 0;
    const discount = quote.discount?.amount ?? 0;
    const dueToday = deposit + quote.itemsTotal - discount + quote.postage;
    if (!stripe && !testPaymentsAllowed) return { error: `Online payment isn’t switched on yet. Please contact the showroom to arrange payment of ${gbp(dueToday)}.` };
    // Match Stripe's minimum checkout expiry; all active order items reserve inventory until this time.
    const holdMinutes = Math.min(24 * 60, Math.max(30, holdSetting));
    const order = await tx.order.create({ data: {
      reference: nextReference(), customerId: input.customerId, bikeId: bike?.id ?? null,
      status: 'pending_payment', fulfilment: input.fulfilment, depositAmount: deposit,
      deliveryFee: quote.postage, itemsTotal: quote.itemsTotal, discountCode: quote.discount?.code ?? null,
      discountTotal: discount, balanceDue: bike ? Math.max(0, bike.price - deposit) : 0,
      holdExpiresAt: new Date(now.getTime() + holdMinutes * 60_000),
      deliveryPostcode: input.deliveryPostcode?.toUpperCase() || null, deliveryAddress: input.deliveryAddress || null,
      balanceMethod: input.balanceMethod || null, partExReg: input.partExReg?.toUpperCase() || null,
      items: { create: quote.lines.map((line) => ({ variantId: line.variantId, name: line.size ? `${line.name} (${line.size})` : line.name, unitPrice: line.unit, quantity: line.qty })) },
    } });
    return { order, bike, quote, deposit, discount, holdMinutes };
  }, { maxWait: 10000, timeout: 15000 });
  if ('error' in allocation) return { error: allocation.error! };
  const { order, bike, quote, deposit, discount, holdMinutes } = allocation;

  try {
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

    return { error: 'Payment is unavailable.' };
  } catch (error) {
    // A failed provider request must not leave inventory held for a checkout that never opened.
    await db.order.updateMany({ where: { id: order.id, status: 'pending_payment' }, data: { status: 'cancelled', holdExpiresAt: null } });
    throw error;
  }
}

/** Marks an order paid (Stripe webhook, success page or test payment). Safe to call more than once. */
export async function markOrderPaid(orderId: string, payment: { amount: number; providerRef: string; provider?: string; receiptUrl?: string | null }) {
  const settled = await db.$transaction(async (tx) => {
    await lockInventory(tx);
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true, customer: true, bike: true } });
    if (!order || order.amountPaid > 0 || !['pending_payment', 'cancelled'].includes(order.status)) return { order, changed: false, review: false };
    if (await tx.payment.findUnique({ where: { providerRef: payment.providerRef } })) return { order, changed: false, review: false };
    const expected = order.depositAmount + order.itemsTotal - order.discountTotal + order.deliveryFee;
    const quantities = new Map<string, number>();
    for (const item of order.items) if (item.variantId) quantities.set(item.variantId, (quantities.get(item.variantId) ?? 0) + item.quantity);
    let review = payment.amount !== expected || order.status !== 'pending_payment';
    const now = new Date();
    for (const [variantId, qty] of quantities) {
      const variant = await tx.productVariant.findUnique({ where: { id: variantId }, include: { orderItems: { where: { orderId: { not: order.id }, order: { status: 'pending_payment', holdExpiresAt: { gt: now } } }, select: { quantity: true } } } });
      if (!variant || variant.stockQty - variant.orderItems.reduce((sum, item) => sum + item.quantity, 0) < qty) review = true;
    }
    if (order.items.some((item) => !item.variantId)) review = true;
    if (order.bikeId && (!order.bike || order.bike.status !== 'available' || await tx.order.count({ where: { id: { not: order.id }, bikeId: order.bikeId, status: 'pending_payment', holdExpiresAt: { gt: now } } }))) review = true;
    if (!review) {
      for (const [variantId, qty] of quantities) {
        // Conditional writes also protect against stock being changed directly in the DMS.
        const changed = await tx.productVariant.updateMany({ where: { id: variantId, stockQty: { gte: qty } }, data: { stockQty: { decrement: qty } } });
        if (changed.count !== 1) throw new Error('Inventory changed while completing payment; retry settlement.');
      }
      if (order.bikeId) {
        const changed = await tx.bike.updateMany({ where: { id: order.bikeId, status: 'available' }, data: { status: 'reserved', reservedAt: now } });
        if (changed.count !== 1) throw new Error('Bike changed while completing payment; retry settlement.');
      }
      if (order.discountCode) await tx.discountCode.update({ where: { code: order.discountCode }, data: { timesUsed: { increment: 1 } } });
      const firstStage = order.bikeId ? await tx.prepStageTemplate.findFirst({ where: { active: true }, orderBy: { sortOrder: 'asc' } }) : null;
      if (firstStage) await tx.orderStage.upsert({ where: { orderId_templateId: { orderId: order.id, templateId: firstStage.id } }, create: { orderId: order.id, templateId: firstStage.id, doneAt: now }, update: {} });
    }
    await tx.payment.create({ data: { orderId: order.id, amount: payment.amount, provider: payment.provider ?? 'stripe', providerRef: payment.providerRef, status: 'succeeded', receiptUrl: payment.receiptUrl ?? null } });
    const updated = await tx.order.update({ where: { id: order.id }, data: { status: review ? 'payment_review' : order.bikeId ? 'reserved' : 'in_preparation', amountPaid: payment.amount, paidAt: now, holdExpiresAt: null, ...(review ? { notes: [order.notes, 'Payment needs review: amount or stock availability changed. Resolve or refund the payment before fulfilment.'].filter(Boolean).join('\n') } : {}) }, include: { customer: true, items: true, bike: true } });
    return { order: updated, changed: true, review };
  }, { maxWait: 10000, timeout: 15000 });
  const { order, review } = settled;
  if (!order || !settled.changed) return order;
  revalidateTag(BIKES_TAG, { expire: 0 });
  revalidateTag(PRODUCTS_TAG, { expire: 0 });

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
    heading: review ? 'Your payment needs review' : bikeName ? 'Your bike is reserved' : 'Thanks for your order',
    paragraphs: review ? ['We received your payment, but availability or the amount needs to be checked. Your order is not confirmed yet. Our team will contact you to resolve this or arrange a refund.'] : bikeName
      ? [`Thanks ${order.customer.firstName}. The ${bikeName} is off sale and reserved for you.`, 'We will text you within the hour to arrange the next steps.']
      : [`Thanks ${order.customer.firstName}. We are getting your kit ready and will let you know when it’s on its way.`],
    rows,
    cta: { label: bikeName ? 'View my reservation' : 'View my order', href: `${siteUrl()}${bikeName ? '/account' : '/account/orders'}` },
  });
  const staffMail = renderEmail({
    heading: review ? `Payment review required: ${order.reference}` : bikeName ? `Reserved: ${bikeName}` : `New kit order ${order.reference}`,
    paragraphs: [`${order.customer.firstName} ${order.customer.lastName ?? ''} paid ${gbp(payment.amount)}.`],
    rows: [...rows, ['Customer', [order.customer.email, order.customer.phone].filter(Boolean).join(' · ')]],
    cta: { label: 'Open in admin', href: `${siteUrl()}/admin/sales/${order.id}` },
  });
  await Promise.allSettled([
    order.customer.email ? sendEmail({ to: order.customer.email, subject: `GearUp order ${order.reference}`, ...customerMail }) : null,
    sendEmail({ to: process.env.STAFF_NOTIFY_EMAIL ?? 'sales@gearupmotorcycles.co.uk', subject: `${review ? 'Payment review required' : bikeName ? 'Bike reserved' : 'Kit order'}: ${order.reference}`, ...staffMail }),
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
