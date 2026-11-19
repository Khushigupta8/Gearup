'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { gbp, monthlyPayment } from '@/lib/format';

const MIN = 1495;
const MAX = 14995;
const terms = [24, 36, 48, 60];

/** Bike price slider + term buttons showing the monthly payment (19.9% APR representative, £0 deposit). */
export function FinanceSlider({ initialPrice = 6495 }: { initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [months, setMonths] = useState(48);
  const pct = ((price - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="slider">
      <div className="top">
        <label htmlFor="rng">Bike price</label>
        <output htmlFor="rng">{gbp(price)}</output>
      </div>
      <input
        type="range"
        id="rng"
        min={MIN}
        max={MAX}
        step={100}
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        style={{ '--p': `${pct}%` } as React.CSSProperties}
      />
      <div className="terms" role="group" aria-label="Term">
        {terms.map((n) => (
          <button key={n} type="button" className={n === months ? 'on' : undefined} aria-pressed={n === months} onClick={() => setMonths(n)}>
            {n / 12} yrs
          </button>
        ))}
      </div>
      <div className="mo">
        <b>
          {gbp(monthlyPayment(price, months), 2)}
          <small>/month</small>
        </b>
        <Link href="/finance" className="btn btn-red">
          Apply now <Icon name="right" />
        </Link>
      </div>
    </div>
  );
}
