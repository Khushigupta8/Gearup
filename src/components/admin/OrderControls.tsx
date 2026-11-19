'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { saveOrderNotes, setOrderStatus, setStage } from '@/app/admin/(panel)/sales/actions';
import { orderStatus, type OrderStatusKey } from '@/lib/orders';

export function StageList({ orderId, stages }: { orderId: string; stages: { id: string; name: string; doneAt: string | null }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <ul className={`adm-stages${pending ? ' is-busy' : ''}`}>
      {stages.map((s) => (
        <li key={s.id}>
          <label>
            <input
              type="checkbox"
              checked={Boolean(s.doneAt)}
              onChange={(e) =>
                start(async () => {
                  await setStage(orderId, s.id, e.target.checked);
                  router.refresh();
                })
              }
            />
            <span>
              <b>{s.name}</b>
              {s.doneAt && <small>{new Date(s.doneAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

const flow: OrderStatusKey[] = ['reserved', 'in_preparation', 'ready', 'out_for_delivery', 'completed'];

export function StatusControls({ orderId, status, hasBike }: { orderId: string; status: OrderStatusKey; hasBike: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState<OrderStatusKey | null>(null);
  const run = (s: OrderStatusKey) =>
    start(async () => {
      await setOrderStatus(orderId, s as Parameters<typeof setOrderStatus>[1]);
      setConfirm(null);
      router.refresh();
    });

  if (status === 'pending_payment') return <p className="adm-muted">Waiting for the customer to finish paying. Unpaid holds release after 30 minutes.</p>;
  if (status === 'cancelled' || status === 'refunded') return <p className="adm-muted">This order is {orderStatus[status].label.toLowerCase()}.</p>;

  return (
    <div className="adm-stack">
      <div className="adm-flow">
        {flow.map((s) => (
          <button key={s} type="button" className={s === status ? 'on' : undefined} disabled={pending || s === status} onClick={() => (s === 'completed' ? setConfirm(s) : run(s))}>
            {orderStatus[s].label}
          </button>
        ))}
      </div>
      {confirm === 'completed' && (
        <p className="adm-confirm">
          {hasBike ? 'This marks the bike as sold to this customer and takes it off the website for good. ' : ''}
          <button type="button" className="adm-btn adm-btn-sm adm-btn-red" onClick={() => run('completed')} disabled={pending}>
            Yes, complete the sale
          </button>
        </p>
      )}
      {status !== 'completed' &&
        (confirm === 'cancelled' ? (
          <p className="adm-confirm">
            {hasBike ? 'The bike goes back on sale. ' : ''}Refund the payment in Stripe as well.{' '}
            <button type="button" className="adm-btn adm-btn-sm adm-btn-red" onClick={() => run('cancelled')} disabled={pending}>
              Yes, cancel the order
            </button>
          </p>
        ) : (
          <button type="button" className="adm-link-btn dark" onClick={() => setConfirm('cancelled')}>
            Cancel this order
          </button>
        ))}
    </div>
  );
}

export function OrderNotes({ orderId, notes }: { orderId: string; notes: string }) {
  const [value, setValue] = useState(notes);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  return (
    <div className="adm-stack">
      <textarea rows={4} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Delivery date, balance agreed, anything the team should know" />
      <div className="adm-formfoot">
        {saved && <span className="adm-ok">Saved.</span>}
        <button
          type="button"
          className="adm-btn adm-btn-sm"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await saveOrderNotes(orderId, value);
              setSaved(true);
            })
          }
        >
          Save notes
        </button>
      </div>
    </div>
  );
}
