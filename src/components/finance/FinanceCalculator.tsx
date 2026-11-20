'use client';

import { useState, type CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import { monthlyPayment } from '@/lib/format';

const gbp = (v: number, d = 0) => '£' + v.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
const terms = [24, 36, 48, 60];

/** Finance page calculator: price and deposit sliders, term buttons, monthly and total payable (19.9% APR rep). */
export function FinanceCalculator() {
  const [price, setPrice] = useState(6495);
  const [deposit, setDeposit] = useState(650);
  const [months, setMonths] = useState(48);
  const amount = Math.max(price - deposit, 0);
  const monthly = amount ? monthlyPayment(amount, months) : 0;
  const pct = (v: number, min: number, max: number) => ({ '--p': `${((v - min) / (max - min)) * 100}%` }) as CSSProperties;

  return (
    <div className="slider">
      <div className="top">
        <label htmlFor="rng">Bike price</label>
        <output id="rngOut">{gbp(price)}</output>
      </div>
      <input type="range" id="rng" min={1495} max={17995} step={100} value={price} style={pct(price, 1495, 17995)} onChange={(e) => setPrice(+e.target.value)} />
      <div className="top">
        <label htmlFor="depRng">Your deposit or part-ex</label>
        <output id="depOut">{gbp(deposit)}</output>
      </div>
      <input type="range" id="depRng" min={0} max={4000} step={50} value={deposit} style={pct(deposit, 0, 4000)} onChange={(e) => setDeposit(+e.target.value)} />
      <div className="top" style={{ marginBottom: 12 }}>
        <label>Term</label>
      </div>
      <div className="terms" role="group" aria-label="Term">
        {terms.map((n) => (
          <button key={n} type="button" className={n === months ? 'on' : undefined} aria-pressed={n === months} onClick={() => setMonths(n)}>
            {n / 12} yrs
          </button>
        ))}
      </div>
      <div className="mo">
        <b id="moOut">
          {gbp(monthly, 2)}
          <small>/month</small>
        </b>
        <a href="#apply" className="btn btn-red">
          Check eligibility <Icon name="right" />
        </a>
      </div>
      <div className="tline">
        <span>Total payable, including deposit</span>
        <b id="totOut">{gbp(amount ? monthly * months + deposit : 0, 2)}</b>
      </div>
      <div className="tline">
        <span>Interest rate</span>
        <b>19.9% APR representative</b>
      </div>
    </div>
  );
}
