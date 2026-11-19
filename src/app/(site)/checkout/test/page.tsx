import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { money } from '@/lib/orders';
import { getUser } from '@/server/auth';
import { db } from '@/server/db';
import { testPaymentsAllowed } from '@/server/services/checkout';
import { payTestOrder } from '../actions';

export const metadata: Metadata = { title: 'Test payment', robots: { index: false } };

/** Stand-in for Stripe Checkout while testing locally without Stripe keys. Never available on the live site. */
export default async function TestPaymentPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  if (!testPaymentsAllowed) notFound();
  const { order: ref } = await searchParams;
  const user = await getUser();
  const order = ref ? await db.order.findUnique({ where: { reference: ref }, include: { customer: true, items: true, bike: true } }) : null;
  if (!order || !user || order.customer.userId !== user.id) notFound();
  const total = order.depositAmount + order.itemsTotal - order.discountTotal + order.deliveryFee;

  return (
    <section className="sec" style={{ paddingTop: 40 }}>
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="formcard">
          <p className="notice">
            <Icon name="info" />
            <span>
              <b>Test mode.</b> Stripe isn&apos;t connected yet, so this page stands in for the card payment. It only exists on a developer&apos;s computer.
            </span>
          </p>
          <h2 className="mt2">Order {order.reference}</h2>
          <dl className="ddl">
            {order.bike && (
              <>
                <dt>Deposit</dt>
                <dd>
                  {money(order.depositAmount)} for {order.bike.year} {order.bike.make} {order.bike.model}
                </dd>
              </>
            )}
            {order.items.map((i) => (
              <span key={i.id} style={{ display: 'contents' }}>
                <dt>
                  {i.quantity} × {i.name}
                </dt>
                <dd>{money(i.unitPrice * i.quantity)}</dd>
              </span>
            ))}
            {order.discountTotal > 0 && (
              <>
                <dt>Discount {order.discountCode}</dt>
                <dd>−{money(order.discountTotal)}</dd>
              </>
            )}
            {order.deliveryFee > 0 && (
              <>
                <dt>Postage</dt>
                <dd>{money(order.deliveryFee)}</dd>
              </>
            )}
            <dt>
              <b>Total</b>
            </dt>
            <dd>
              <b>{money(total)}</b>
            </dd>
          </dl>
          <form action={payTestOrder} className="mt2">
            <input type="hidden" name="ref" value={order.reference} />
            <button className="btn btn-red" style={{ width: '100%' }}>
              <Icon name="lock" />
              Pay {money(total)} (test)
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
