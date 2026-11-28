import type { Metadata } from 'next';
import Link from 'next/link';
import { AccountPage } from '@/components/account/AccountPage';
import { Icon, type IconName } from '@/components/ui/Icon';
import { monthlyPayment } from '@/lib/format';
import { money, orderStatus, shortDate } from '@/lib/orders';
import { getAccount } from '@/server/account';
import { db } from '@/server/db';
import { PHASE2 } from '@/lib/features';

export const metadata: Metadata = {
  title: PHASE2 ? 'Track my bike · My account' : 'My reservation · My account',
  description: PHASE2
    ? 'Follow your bike through its pre-delivery inspection, pay the balance and track the delivery van live.'
    : 'Your reserved bike, deposit and balance.',
  robots: { index: false },
};

const stageIcons: IconName[] = ['card', 'wrench', 'wrench', 'check', 'award', 'award', 'truck', 'key'];

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ paid?: string }> }) {
  const { paid } = await searchParams;
  const { customer } = await getAccount();
  const order = await db.order.findFirst({
    where: { customerId: customer.id, bikeId: { not: null }, status: { notIn: ['pending_payment', 'cancelled', 'refunded'] } },
    orderBy: { createdAt: 'desc' },
    include: {
      bike: { include: { photos: { where: { kind: 'main' }, orderBy: { sortOrder: 'asc' }, take: 1 } } },
      stages: true,
      items: true,
    },
  });
  const templates = await db.prepStageTemplate.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });

  return (
    <AccountPage crumb={PHASE2 ? 'Track my bike' : 'My reservation'} title={PHASE2 ? 'Track' : 'My'} em={PHASE2 ? 'my bike' : 'reservation'}>
      {paid && order?.reference === paid && (
        <div className="success">
          <Icon name="check" />
          Payment received for order {paid}. {order.status === 'payment_review' ? 'Your order needs review and is not confirmed yet. We will contact you to resolve this or arrange a refund.' : 'Your bike is reserved and off sale. We will contact you about the next steps.'}
        </div>
      )}
      {!order || !order.bike ? (
        <div className="apanel">
          <div className="ph">
            <h3>No bike reserved yet</h3>
          </div>
          <p className="muted">
            {PHASE2
              ? 'When you reserve a bike for £99, you can follow its full PDI, 120-point inspection and delivery right here.'
              : 'When you reserve a bike for £99, your reservation, deposit and balance show here.'}
          </p>
          <Link href="/used-bikes" className="btn btn-red mt2">
            Find a bike <Icon name="right" />
          </Link>
        </div>
      ) : (
        (() => {
          const bike = order.bike;
          const doneIds = new Set(order.stages.filter((s) => s.doneAt).map((s) => s.templateId));
          const currentIndex = templates.findIndex((t) => !doneIds.has(t.id));
          const current = currentIndex === -1 ? templates.length : currentIndex;
          const name = `${bike.year} ${bike.make} ${bike.model}`;
          const doneAt = (id: string) => order.stages.find((s) => s.templateId === id)?.doneAt;
          const kit = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
          return (
            <>
              <div>
                <div className="ahd">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {bike.photos[0] && <img src={bike.photos[0].url} alt={name} />}
                  <div>
                    <small>
                      Order {order.reference} · {order.status === 'payment_review' ? 'paid' : 'reserved'} {shortDate(order.paidAt ?? order.createdAt)}
                    </small>
                    <h2>{name}</h2>
                  </div>
                  <div className="st">
                    <span>{PHASE2 ? (templates[current]?.name ?? orderStatus[order.status].label) : orderStatus[order.status].label}</span>
                    {PHASE2 && (
                      <small>
                        Stage {Math.min(current + 1, templates.length)} of {templates.length}
                      </small>
                    )}
                  </div>
                </div>
                <div className="ostat mt1">
                  <div>
                    <small>Order number</small>
                    <b>{order.reference}</b>
                  </div>
                  <div>
                    <small>Bike</small>
                    <b>
                      {bike.model} · £{(bike.price / 100).toLocaleString('en-GB')}
                    </b>
                  </div>
                  <div>
                    <small>Deposit paid</small>
                    <b>
                      {money(order.depositAmount)}
                      {order.paidAt ? ` · ${order.paidAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}
                    </b>
                  </div>
                  <div>
                    <small>{order.fulfilment === 'delivery' ? 'Delivery' : 'Collection'}</small>
                    <b>{order.fulfilment === 'delivery' ? (order.deliveryPostcode ?? 'Date to be booked') : 'We will call to book a time'}</b>
                  </div>
                </div>
              </div>

              <div className={PHASE2 ? 'amid' : 'amid solo'}>
                {/* Prep-stage progress is Phase 2 */}
                {PHASE2 && (
                <div className="apanel">
                  <div className="ph">
                    <h3>Your bike&apos;s progress</h3>
                    <small>Updated by our team as each job is done</small>
                  </div>
                  <ol className="timeline">
                    {templates.map((t, i) => {
                      const state = i < current ? 'd' : i === current ? 'n' : 'u';
                      const at = doneAt(t.id);
                      return (
                        <li key={t.id} className={state}>
                          <span className="tdot">
                            <Icon name={state === 'd' ? 'check' : (stageIcons[i] ?? 'check')} />
                          </span>
                          <div>
                            <h4>{t.name}</h4>
                            {state === 'n' && <p>This is happening now. We will tick it off here as soon as it&apos;s done.</p>}
                          </div>
                          <time>{at ? at.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : state === 'u' ? 'Coming up' : ''}</time>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                )}

                <div style={{ display: 'grid', gap: 22 }}>
                  <div className="apanel pay">
                    <div className="ph">
                      <h3>Balance and payment</h3>
                    </div>
                    <dl>
                      <dt>Cash price</dt>
                      <dd>{money(bike.price)}</dd>
                      {bike.freeWarrantyMonths > 0 && (
                        <>
                          <dt>{bike.freeWarrantyMonths} months warranty</dt>
                          <dd className="g">Free</dd>
                        </>
                      )}
                      <dt>Deposit paid</dt>
                      <dd className="g">−{money(order.depositAmount)}</dd>
                      {kit > 0 && (
                        <>
                          <dt>Kit paid with deposit</dt>
                          <dd className="g">{money(kit - order.discountTotal)}</dd>
                        </>
                      )}
                      <dt>Part-exchange</dt>
                      <dd>{order.partExReg ? `${order.partExReg} (valuing)` : <Link href="/account/part-exchange" style={{ color: 'var(--red)' }}>Add one</Link>}</dd>
                      <dt className="tot">Balance</dt>
                      <dd>{money(order.balanceDue)}</dd>
                    </dl>
                    <div className="notice mt2">
                      <Icon name="clock" />
                      <span>Pay the balance on collection or before delivery. We will confirm the date with you.</span>
                    </div>
                    <div className="acts">
                      <Link href="/finance" className="btn btn-ink">
                        Pay on finance instead
                      </Link>
                    </div>
                    <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
                      Finance example: {money(Math.round(monthlyPayment(bike.price / 100, 48) * 100))}/month over 48 months, 19.9% APR representative. Subject to status.
                    </p>
                  </div>
                  <div className="icard" style={{ padding: 20 }}>
                    <div className="h4" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Icon name="chat" />
                      Question about your bike?
                    </div>
                    <p style={{ marginTop: 6 }}>Call 0744 072 1478 or message us on WhatsApp. Quote order {order.reference}.</p>
                  </div>
                </div>
              </div>
            </>
          );
        })()
      )}
    </AccountPage>
  );
}
