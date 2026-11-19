'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useEffect, useState, type FormEvent } from 'react';
import { addCost, deleteCost, markSold, saveAcquisition, setArchived, type FormResult } from '@/app/admin/(panel)/stock/bike-actions';

const gbp = (pence: number) => `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/** Submit a server action without React resetting the form; refresh the page on success. */
function useSubmit(action: (d: FormData) => void, state: FormResult, resetOnOk = false) {
  const router = useRouter();
  const [form, setForm] = useState<HTMLFormElement | null>(null);
  useEffect(() => {
    if (state?.ok) {
      if (resetOnOk) form?.reset();
      router.refresh();
    }
  }, [state, form, resetOnOk, router]);
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForm(e.currentTarget);
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
}

function Msg({ state }: { state: FormResult }) {
  if (!state) return null;
  return <span className={state.ok ? 'adm-ok' : 'adm-err'}>{state.ok ? state.message : state.error}</span>;
}

export type MoneyProps = {
  bikeId: string;
  pricePence: number;
  status: string;
  acquisition: { source: string; purchasePrice: number; purchasedAt: string; sellerName: string | null; vatType: string; notes: string | null } | null;
  costs: { id: string; category: string; amount: number; note: string | null; incurredAt: string }[];
  sold: { soldPrice: number | null; soldAt: string | null; buyer: string | null };
};

export function BikeMoneyPanels({ bikeId, pricePence, status, acquisition, costs, sold }: MoneyProps) {
  const router = useRouter();
  const [acqState, acqAction, acqPending] = useActionState<FormResult, FormData>(saveAcquisition, null);
  const [costState, costAction, costPending] = useActionState<FormResult, FormData>(addCost, null);
  const [soldState, soldAction, soldPending] = useActionState<FormResult, FormData>(markSold, null);
  const submitAcq = useSubmit(acqAction, acqState);
  const submitCost = useSubmit(costAction, costState, true);
  const submitSold = useSubmit(soldAction, soldState);

  const totalCosts = costs.reduce((s, c) => s + c.amount, 0);
  const purchase = acquisition?.purchasePrice ?? 0;
  const sale = sold.soldPrice ?? pricePence;
  const margin = sale - purchase - totalCosts;

  return (
    <>
      <section className="adm-card adm-sec">
        <div className="adm-sec-head">
          <div>
            <h2>Purchase & costs</h2>
            <p className="adm-muted">Only staff see this. Used for profit per bike.</p>
          </div>
          <div className="adm-margin">
            <small>{sold.soldPrice ? 'Profit on sale' : 'Margin at asking price'}</small>
            <b className={margin < 0 ? 'neg' : ''}>{acquisition ? gbp(margin) : '–'}</b>
            <small>
              {gbp(sale)} − {gbp(purchase)} bought − {gbp(totalCosts)} costs
            </small>
          </div>
        </div>

        <form onSubmit={submitAcq} className="adm-grid">
          <input type="hidden" name="bikeId" value={bikeId} />
          <label className="adm-field">
            <span>Bought from</span>
            <select name="source" defaultValue={acquisition?.source ?? 'trade'}>
              <option value="trade">Trade</option>
              <option value="private">Private seller</option>
              <option value="part_exchange">Part-exchange</option>
              <option value="auction">Auction</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="adm-field">
            <span>Purchase price (£)</span>
            <input name="purchasePricePounds" type="number" required defaultValue={acquisition ? acquisition.purchasePrice / 100 : ''} />
          </label>
          <label className="adm-field">
            <span>Date bought</span>
            <input name="purchasedAt" type="date" defaultValue={acquisition?.purchasedAt ?? ''} />
          </label>
          <label className="adm-field">
            <span>Seller name</span>
            <input name="sellerName" defaultValue={acquisition?.sellerName ?? ''} />
          </label>
          <label className="adm-field">
            <span>VAT</span>
            <select name="vatType" defaultValue={acquisition?.vatType ?? 'margin'}>
              <option value="margin">Margin scheme</option>
              <option value="qualifying">VAT qualifying</option>
            </select>
          </label>
          <label className="adm-field">
            <span>Notes</span>
            <input name="notes" defaultValue={acquisition?.notes ?? ''} />
          </label>
          <div className="adm-formfoot wide">
            <Msg state={acqState} />
            <button className="adm-btn adm-btn-sm" disabled={acqPending}>
              {acqPending ? 'Saving…' : 'Save purchase'}
            </button>
          </div>
        </form>

        <h3 className="adm-h3">Prep costs</h3>
        {costs.length > 0 && (
          <table className="adm-table adm-mini">
            <tbody>
              {costs.map((c) => (
                <tr key={c.id}>
                  <td>{c.incurredAt}</td>
                  <td className="adm-cap">{c.category}</td>
                  <td>{c.note}</td>
                  <td className="adm-num">{gbp(c.amount)}</td>
                  <td className="adm-num">
                    <button
                      type="button"
                      className="adm-link-btn dark"
                      onClick={() =>
                        startTransition(async () => {
                          await deleteCost(c.id);
                          router.refresh();
                        })
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <form onSubmit={submitCost} className="adm-inline adm-costform">
          <input type="hidden" name="bikeId" value={bikeId} />
          <select name="category" defaultValue="parts" aria-label="Cost type">
            <option value="parts">Parts</option>
            <option value="labour">Labour</option>
            <option value="mot">MOT</option>
            <option value="valet">Valet</option>
            <option value="transport">Transport</option>
            <option value="other">Other</option>
          </select>
          <input name="amountPounds" type="number" step="0.01" min="0.01" required placeholder="£" aria-label="Amount" />
          <input name="note" placeholder="Note (e.g. rear tyre)" aria-label="Note" />
          <button className="adm-btn adm-btn-sm" disabled={costPending}>
            Add cost
          </button>
          <Msg state={costState} />
        </form>
      </section>

      <section className="adm-card adm-sec">
        <h2>Sale</h2>
        {status === 'sold' ? (
          <p>
            Sold for <b>{gbp(sold.soldPrice ?? 0)}</b>
            {sold.soldAt && <> on {sold.soldAt}</>}
            {sold.buyer && <> to {sold.buyer}</>}. Not shown on the website.
          </p>
        ) : (
          <form onSubmit={submitSold} className="adm-grid">
            <input type="hidden" name="bikeId" value={bikeId} />
            <label className="adm-field">
              <span>Sold price (£)</span>
              <input name="soldPricePounds" type="number" required defaultValue={pricePence / 100} />
            </label>
            <label className="adm-field">
              <span>Date sold</span>
              <input name="soldAt" type="date" />
            </label>
            <label className="adm-field">
              <span>Buyer name</span>
              <input name="buyerName" />
            </label>
            <label className="adm-field">
              <span>Buyer email</span>
              <input name="buyerEmail" type="email" />
            </label>
            <label className="adm-field">
              <span>Buyer phone</span>
              <input name="buyerPhone" />
            </label>
            <div className="adm-formfoot wide">
              <Msg state={soldState} />
              <button className="adm-btn adm-btn-sm" disabled={soldPending}>
                {soldPending ? 'Saving…' : 'Mark as sold'}
              </button>
            </div>
          </form>
        )}
        <div className="adm-danger">
          <button
            type="button"
            className="adm-link-btn dark"
            onClick={() =>
              startTransition(async () => {
                await setArchived(bikeId, status !== 'archived');
                router.refresh();
              })
            }
          >
            {status === 'archived' ? 'Restore from archive (as draft)' : 'Archive this bike (hide from stock list and website)'}
          </button>
        </div>
      </section>
    </>
  );
}
