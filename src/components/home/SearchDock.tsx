'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

function Select({ id, label, options }: { id: string; label: string; options: (string | [value: string, text: string])[] }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className="sel">
        <select id={id}>
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
export function SearchDock({ makes = [] }: { makes?: string[] }) {
  const [tab, setTab] = useState<'buy' | 'val'>('buy');
  const router = useRouter();

  function search() {
    const val = (id: string) => (document.getElementById(id) as HTMLSelectElement | null)?.value ?? '';
    const q = new URLSearchParams();
    if (val('mk')) q.set('make', val('mk'));
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
          <div className="dock-box">
            <Select id="mk" label="Make" options={[['', 'Any make'], ...makes.map((m) => [m.toLowerCase().replace(/[^a-z0-9]/g, ''), m] as [string, string])]} />
            <Select id="md" label="Model" options={[['', 'Any model']]} />
            <Select
              id="bs"
              label="Style"
              options={[['', 'Any style'], ['sports', 'Sportsbike'], ['naked', 'Naked'], ['adventure', 'Adventure'], ['cruiser', 'Cruiser'], ['classic', 'Classic'], ['scooter', 'Scooter/Moped']]}
            />
            <Select
              id="bg"
              label="Budget"
              options={[['', 'Any budget'], ['monthly=100', 'Up to £100 a month'], ['monthly=150', 'Up to £150 a month'], ['monthly=200', 'Up to £200 a month'], ['max=5000', 'Up to £5,000'], ['max=8000', 'Up to £8,000']]}
            />
            <button className="btn btn-red" type="button" onClick={search}>
              Search <Icon name="search" />
            </button>
          </div>
        </div>
        <div className="dock-panel" id="p-val" hidden={tab !== 'val'}>
          <div className="dock-box dock-val">
            <div>
              <label htmlFor="rg">Your registration</label>
              <div className="plate">
                <span>
                  <i></i>UK
                </span>
                <input id="rg" placeholder="AB12 CDE" maxLength={8} />
              </div>
            </div>
            <div>
              <label htmlFor="ml">Mileage</label>
              <div className="sel">
                <input id="ml" placeholder="e.g. 8,500" inputMode="numeric" />
              </div>
            </div>
            <Select id="pt" label="I want to" options={['Part-exchange it', 'Sell it to GearUp']} />
            <button className="btn btn-red" type="button" onClick={() => router.push('/part-exchange')}>
              Get valuation <Icon name="right" />
            </button>
          </div>
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
