'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { makeKey, modelKey } from '@/lib/bike-filters';
import { styleLabels } from '@/lib/bikes';
import { valuationHref } from '@/lib/valuation-prefill';
import type { Bike } from '@/types';
import { Icon } from '@/components/ui/Icon';

function Select({ id, label, options, value, onChange }: { id: string; label: string; options: (string | [value: string, text: string])[]; value?: string; onChange?: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className="sel">
        <select id={id} name={id} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined}>
          {options.map((o) => {
            const [value, text] = Array.isArray(o) ? o : [o, o];
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        <Icon name="down" />
      </div>
    </div>
  );
}

/** Home search bar under the hero: "Find a bike" / "Value my bike" tabs. */
export function SearchDock({ stock }: { stock: Pick<Bike, 'make' | 'model' | 'style'>[] }) {
  const [tab, setTab] = useState<'buy' | 'val'>('buy');
  const router = useRouter();
  const [make, setMake] = useState('');
  const makes = [...new Set(stock.map((bike) => bike.make))].sort();
  const models = [...new Map(stock.filter((bike) => !make || makeKey(bike.make) === make).map((bike) => [modelKey(bike.model), bike.model])).entries()].sort((a, b) => a[1].localeCompare(b[1]));

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const val = (id: string) => String(form.get(id) ?? '');
    const q = new URLSearchParams();
    if (val('mk')) q.set('make', val('mk'));
    if (val('md')) q.set('model', val('md'));
    if (val('bs')) q.set('style', val('bs'));
    const [k, v] = val('bg').split('=');
    if (k && v) q.set(k, v);
    const s = q.toString();
    router.push(s ? `/used-bikes?${s}` : '/used-bikes');
  }

  return (
    <div className="dock">
      <div className="wrap">
        <div className="dock-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'buy'} className={tab === 'buy' ? 'on' : undefined} onClick={() => setTab('buy')}>
            Find a bike
          </button>
          <button type="button" role="tab" aria-selected={tab === 'val'} className={tab === 'val' ? 'on' : undefined} onClick={() => setTab('val')}>
            Value my bike
          </button>
        </div>
        <div className="dock-panel" id="p-buy" hidden={tab !== 'buy'}>
          <form className="dock-box" onSubmit={search}>
            <Select id="mk" label="Make" value={make} onChange={setMake} options={[['', 'Any make'], ...makes.map((m) => [makeKey(m), m] as [string, string])]} />
            <Select key={make} id="md" label="Model" options={[['', 'Any model'], ...models]} />
            <Select
              id="bs"
              label="Style"
              options={[['', 'Any style'], ...Object.entries(styleLabels).filter(([key]) => stock.some((bike) => bike.style === key))]}
            />
            <Select
              id="bg"
              label="Budget"
              options={[['', 'Any budget'], ['monthly=100', 'Up to £100 a month'], ['monthly=150', 'Up to £150 a month'], ['monthly=200', 'Up to £200 a month'], ['max=5000', 'Up to £5,000'], ['max=8000', 'Up to £8,000']]}
            />
            <button className="btn btn-red" type="submit">
              Search <Icon name="search" />
            </button>
          </form>
        </div>
        <div className="dock-panel" id="p-val" hidden={tab !== 'val'}>
          <form className="dock-box dock-val" onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            router.push(valuationHref(form.get('pt') === 'sell' ? '/sell-your-bike' : '/part-exchange', String(form.get('registration') ?? ''), String(form.get('mileage') ?? '')));
          }}>
            <div>
              <label htmlFor="rg">Your registration</label>
              <div className="plate">
                <span>
                  <i></i>UK
                </span>
                <input id="rg" name="registration" placeholder="AB12 CDE" maxLength={8} />
              </div>
            </div>
            <div>
              <label htmlFor="ml">Mileage</label>
              <div className="sel">
                <input id="ml" name="mileage" placeholder="e.g. 8,500" inputMode="numeric" />
              </div>
            </div>
            <Select id="pt" label="I want to" options={[['part-exchange', 'Part-exchange it'], ['sell', 'Sell it to GearUp']]} />
            <button className="btn btn-red" type="submit">
              Get valuation <Icon name="right" />
            </button>
          </form>
        </div>
        <div className="dock-meta">
          <span>Finance subject to status. Reservation deposit comes off the price of the bike.</span>
          <span>
            <Link href="/used-bikes?cc=125">125cc &amp; learner bikes</Link> · <Link href="/used-bikes">Browse all stock</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
