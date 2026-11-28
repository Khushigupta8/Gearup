import type { Metadata } from 'next';
import Link from 'next/link';
import { AccountPage } from '@/components/account/AccountPage';
import { Icon } from '@/components/ui/Icon';
import { money, orderStatus } from '@/lib/orders';
import { getAccount } from '@/server/account';
import { db } from '@/server/db';

export const metadata: Metadata = {
  title: 'My orders · My account',
  description: 'Your GearUp orders: bike reservations and accessories, with their status.',
  robots: { index: false },
};

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ paid?: string }> }) {
  const { paid } = await searchParams;
  const { customer } = await getAccount();
  const orders = await db.order.findMany({
    where: { customerId: customer.id, status: { not: 'pending_payment' } },
    orderBy: { createdAt: 'desc' },
    include: { bike: { select: { year: true, make: true, model: true } }, items: true },
  });

  const paidOrder = orders.find((order) => order.reference === paid && order.amountPaid > 0);

  return (
    <AccountPage crumb="My orders" title="My" em="orders">
      {paidOrder && (
        <div className="success">
          <Icon name="check" />
          Payment received for order {paidOrder.reference}. {paidOrder.status === 'payment_review' ? 'Your order needs review and is not confirmed yet. We will contact you to resolve this or arrange a refund.' : 'Thank you! We will contact you when your order is ready.'}
        </div>
      )}
      <div className="apanel">
        <div className="ph">
          <h3>My orders</h3>
          <small>Bikes and accessories</small>
        </div>
        {orders.length === 0 ? (
          <p className="muted">
            No orders yet. <Link href="/used-bikes">Find a bike</Link> or <Link href="/accessories">shop kit</Link>.
          </p>
        ) : (
          <table className="olist">
            <thead>
              <tr>
                <th>Order</th>
                <th>Item</th>
                <th className="hm">Date</th>
                <th className="hm">Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const s = orderStatus[o.status];
                const what = [o.bike ? `${o.bike.year} ${o.bike.make} ${o.bike.model}` : null, o.items.length ? `${o.items.reduce((n, i) => n + i.quantity, 0)} kit item(s)` : null]
                  .filter(Boolean)
                  .join(' + ');
                return (
                  <tr key={o.id}>
                    <td>
                      <b>{o.reference}</b>
                    </td>
                    <td>{what}</td>
                    <td className="hm">{o.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="hm">{money(o.amountPaid)}</td>
                    <td>
                      <span className={`pill ${s.pill}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AccountPage>
  );
}
