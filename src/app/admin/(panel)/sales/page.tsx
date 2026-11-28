import type { Metadata } from 'next';
import Link from 'next/link';
import type { Prisma } from '@/generated/prisma/client';
import { timeAgo } from '@/lib/crm';
import { money, orderStatus } from '@/lib/orders';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Sales & reservations' };

const requestTime = () => Date.now();

const views = [
  ['active', 'Active'],
  ['review', 'Payment review'],
  ['bikes', 'Bike reservations'],
  ['kit', 'Kit orders'],
  ['completed', 'Completed'],
  ['all', 'All'],
] as const;

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = 'active' } = await searchParams;
  const now = requestTime();
  const where: Prisma.OrderWhereInput = {
    ...(view === 'active' ? { status: { in: ['payment_review', 'reserved', 'in_preparation', 'ready', 'out_for_delivery'] } } : {}),
    ...(view === 'review' ? { status: 'payment_review' } : {}),
    ...(view === 'bikes' ? { bikeId: { not: null }, status: { not: 'pending_payment' } } : {}),
    ...(view === 'kit' ? { bikeId: null, status: { not: 'pending_payment' } } : {}),
    ...(view === 'completed' ? { status: 'completed' } : {}),
  };
  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { customer: true, bike: { select: { year: true, make: true, model: true } }, items: true },
  });

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Sales & reservations</h1>
          <p className="adm-muted">£99 reservations and kit orders paid online. Open one to complete the sale or cancel.</p>
        </div>
      </header>
      <div className="adm-tabs">
        {views.map(([v, l]) => (
          <Link key={v} href={`/admin/sales?view=${v}`} className={view === v ? 'on' : undefined}>
            {l}
          </Link>
        ))}
      </div>
      {orders.length === 0 ? (
        <p className="adm-empty">No orders here yet.</p>
      ) : (
        <div className="adm-card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>What</th>
                <th className="adm-num">Paid</th>
                <th className="adm-num">Balance</th>
                <th>Status</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/sales/${o.id}`} className="adm-rowlink">
                      <b>{o.reference}</b>
                    </Link>
                  </td>
                  <td>
                    {[o.customer.firstName, o.customer.lastName].filter(Boolean).join(' ')}
                    <small className="adm-sub">{o.customer.phone ?? o.customer.email}</small>
                  </td>
                  <td className="adm-about">
                    {[o.bike && `${o.bike.year} ${o.bike.make} ${o.bike.model}`, o.items.length && `${o.items.reduce((n, i) => n + i.quantity, 0)} kit`].filter(Boolean).join(' + ')}
                  </td>
                  <td className="adm-num">{money(o.amountPaid)}</td>
                  <td className="adm-num">{o.balanceDue ? money(o.balanceDue) : ''}</td>
                  <td>
                    <span className={`adm-stage os-${o.status}`}>{orderStatus[o.status].label}</span>
                  </td>
                  <td className="adm-nowrap">{timeAgo(o.createdAt, now)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
