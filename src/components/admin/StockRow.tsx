'use client';

import { useActionState } from 'react';
import { quickUpdateBike, type QuickUpdateResult } from '@/app/admin/(panel)/stock/actions';

export type StockRowData = {
  id: string;
  slug: string;
  name: string;
  registration: string | null;
  image: string | null;
  pricePounds: number;
  status: string;
  visible: boolean;
  mileage: number;
  daysInStock: number;
  photoCounts: { main: number; detail: number; receipt: number };
};

const statuses = [
  ['draft', 'Draft'],
  ['in_preparation', 'In preparation'],
  ['available', 'Available'],
  ['reserved', 'Reserved'],
  ['sold', 'Sold'],
  ['archived', 'Archived'],
] as const;

/** One stock row with inline price / status / visible editing. */
export function StockRow({ bike }: { bike: StockRowData }) {
  const [state, action, pending] = useActionState<QuickUpdateResult | null, FormData>(quickUpdateBike, null);
  const formId = `bike-${bike.id}`;

  return (
    <tr>
      <td>
        <div className="adm-bike">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {bike.image ? <img src={bike.image} alt="" /> : <span className="adm-noimg" />}
          <div>
            <b>{bike.name}</b>
            <small>
              {bike.registration ?? 'No reg'} · {bike.mileage.toLocaleString('en-GB')} miles
            </small>
          </div>
        </div>
      </td>
      <td className="adm-num">
        <small className="adm-muted">
          {bike.photoCounts.main} / {bike.photoCounts.detail} / {bike.photoCounts.receipt}
        </small>
      </td>
      <td className="adm-num">{bike.daysInStock}d</td>
      <td>
        <div className="adm-money">
          £
          <input form={formId} name="price" type="number" min={0} step={5} defaultValue={bike.pricePounds} aria-label="Price in pounds" />
        </div>
      </td>
      <td>
        <select form={formId} name="status" defaultValue={bike.status} className={`adm-status s-${bike.status}`} aria-label="Status">
          {statuses.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </td>
      <td className="adm-center">
        <input form={formId} name="visible" type="checkbox" defaultChecked={bike.visible} aria-label="Show on website" />
      </td>
      <td className="adm-actions">
        <form id={formId} action={action}>
          <input type="hidden" name="id" value={bike.id} />
          <button className="adm-btn adm-btn-sm" disabled={pending}>
            {pending ? 'Saving…' : 'Save'}
          </button>
        </form>
        <a href={`/used-bikes/${bike.slug}`} target="_blank" rel="noopener" className="adm-link">
          View
        </a>
        {state && <span className={state.ok ? 'adm-ok' : 'adm-err'}>{state.ok ? 'Saved · live' : state.error}</span>}
      </td>
    </tr>
  );
}
