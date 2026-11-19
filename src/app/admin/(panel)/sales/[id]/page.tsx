import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderNotes, StageList, StatusControls } from '@/components/admin/OrderControls';
import { money, orderStatus } from '@/lib/orders';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Order' };

const balanceLabel: Record<string, string> = { finance: 'Finance', bank_transfer: 'Bank transfer', part_exchange: 'Part-exchange' };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { customer: true, bike: true, items: true, payments: { orderBy: { createdAt: 'asc' } }, stages: true },
  });
  if (!order) notFound();
  const templates = order.bike ? await db.prepStageTemplate.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }) : [];
  const c = order.customer;
  const name = [c.firstName, c.lastName].filter(Boolean).join(' ');
  const paidToday = order.depositAmount + order.itemsTotal - order.discountTotal + order.deliveryFee;

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/sales" className="adm-back">
            ← Sales
          </Link>
          <h1>Order {order.reference}</h1>
          <p className="adm-muted">
            <span className={`adm-stage os-${order.status}`}>{orderStatus[order.status].label}</span> placed {order.createdAt.toLocaleString('en-GB')}
            {order.paidAt && ` · paid ${order.paidAt.toLocaleString('en-GB')}`}
          </p>
        </div>
      </header>

      <div className="adm-edit">
        <div className="adm-edit-main">
          <section className="adm-card adm-sec">
            <h2>Status</h2>
            <StatusControls orderId={order.id} status={order.status} hasBike={Boolean(order.bike)} />
          </section>

          {order.bike && (
            <section className="adm-card adm-sec">
              <div className="adm-sec-head">
                <div>
                  <h2>Prep stages</h2>
                  <p className="adm-muted">Tick each one as it&apos;s done. The customer sees it in Track my bike straight away.</p>
                </div>
              </div>
              <StageList
                orderId={order.id}
                stages={templates.map((t) => ({ id: t.id, name: t.name, doneAt: order.stages.find((s) => s.templateId === t.id)?.doneAt?.toISOString() ?? null }))}
              />
            </section>
          )}

          <section className="adm-card adm-sec">
            <h2>What they bought</h2>
            <table className="adm-table adm-mini">
              <tbody>
                {order.bike && (
                  <tr>
                    <td>
                      <Link href={`/admin/stock/${order.bike.id}`} className="adm-link">
                        {order.bike.year} {order.bike.make} {order.bike.model}
                      </Link>{' '}
                      ({order.bike.registration ?? 'no reg'})
                    </td>
                    <td className="adm-num">Deposit {money(order.depositAmount)}</td>
                  </tr>
                )}
                {order.items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      {i.quantity} × {i.name}
                    </td>
                    <td className="adm-num">{money(i.unitPrice * i.quantity)}</td>
                  </tr>
                ))}
                {order.discountTotal > 0 && (
                  <tr>
                    <td>Discount {order.discountCode}</td>
                    <td className="adm-num">−{money(order.discountTotal)}</td>
                  </tr>
                )}
                {order.deliveryFee > 0 && (
                  <tr>
                    <td>Postage</td>
                    <td className="adm-num">{money(order.deliveryFee)}</td>
                  </tr>
                )}
                <tr>
                  <td>
                    <b>Paid online</b>
                  </td>
                  <td className="adm-num">
                    <b>{money(order.amountPaid || paidToday)}</b>
                  </td>
                </tr>
                {order.bike && (
                  <tr>
                    <td>
                      <b>Balance to collect</b>
                    </td>
                    <td className="adm-num">
                      <b>{money(order.balanceDue)}</b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {order.payments.map((p) => (
              <p key={p.id} className="adm-muted" style={{ fontSize: 13 }}>
                Payment {money(p.amount)} via {p.provider} · {p.providerRef}
                {p.receiptUrl && (
                  <>
                    {' '}
                    ·{' '}
                    <a href={p.receiptUrl} target="_blank" rel="noopener" className="adm-link">
                      receipt
                    </a>
                  </>
                )}
              </p>
            ))}
          </section>
        </div>

        <aside className="adm-edit-side">
          <section className="adm-card adm-sec adm-stack">
            <h2>Customer</h2>
            <p>
              <b>{name}</b>
              <br />
              {c.email}
              <br />
              {c.phone}
            </p>
            <Link href={`/admin/customers/${c.id}`} className="adm-link">
              Open customer →
            </Link>
          </section>
          <section className="adm-card adm-sec adm-stack">
            <h2>{order.fulfilment === 'delivery' ? 'Delivery' : 'Collection'}</h2>
            <p>{order.fulfilment === 'delivery' ? [order.deliveryAddress, order.deliveryPostcode].filter(Boolean).join(', ') : 'Collect from the showroom: call to book a time.'}</p>
            {order.balanceMethod && <p>Balance by: {balanceLabel[order.balanceMethod] ?? order.balanceMethod}</p>}
            {order.partExReg && <p>Part-exchange: {order.partExReg}</p>}
          </section>
          <section className="adm-card adm-sec">
            <h2>Notes</h2>
            <OrderNotes orderId={order.id} notes={order.notes ?? ''} />
          </section>
        </aside>
      </div>
    </>
  );
}
