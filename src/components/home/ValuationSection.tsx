'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const copy = {
  px: {
    tab: 'Part-exchange',
    title: (
      <>
        What&apos;s your
        <br />
        bike worth?
      </>
    ),
    text: 'Pop in your reg. We will come back with a real offer, not a guess, and you can use it as the deposit on your next bike.',
    points: ['Free, no-obligation valuation', 'Use it as your deposit', 'We collect it when we deliver your new bike'],
    boxTitle: 'Instant part-ex value',
    button: 'Value my bike',
  },
  sell: {
    tab: 'Sell your bike',
    title: (
      <>
        Sell your
        <br />
        bike to us.
      </>
    ),
    text: 'Old bike sat in the shed? We buy any make in any condition, pay by instant bank transfer and collect it from your door.',
    points: ['Offer within 24 hours', 'Instant bank transfer, no fees', 'Free collection nationwide'],
    boxTitle: 'Instant cash offer',
    button: 'Get my cash offer',
  },
};
type Mode = keyof typeof copy;

/** Home "What's your bike worth?" band with a part-exchange / sell toggle. */
export function ValuationSection() {
  const [mode, setMode] = useState<Mode>('px');
  const c = copy[mode];

  return (
    <section className="val" id="value">
      <div className="wrap">
        <div className="vcopy">
          <div className="vp">
            <h2 className="disp">{c.title}</h2>
            <p>{c.text}</p>
            <ul>
              {c.points.map((p) => (
                <li key={p}>
                  <Icon name="check" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <form className="valbox" onSubmit={(e) => e.preventDefault()}>
          <div className="vtabs" role="tablist">
            {(Object.keys(copy) as Mode[]).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={m === mode} className={m === mode ? 'on' : undefined} onClick={() => setMode(m)}>
                {copy[m].tab}
              </button>
            ))}
          </div>
          <h3>{c.boxTitle}</h3>
          <label className="sr" htmlFor="rg2">
            Registration
          </label>
          <div className="plate">
            <span>
              <i></i>UK
            </span>
            <input id="rg2" placeholder="ENTER REG" maxLength={8} />
          </div>
          <div className="row">
            <div className="sel">
              <label className="sr" htmlFor="ml2">
                Mileage
              </label>
              <input id="ml2" placeholder="Mileage" inputMode="numeric" />
            </div>
            <div className="sel">
              <label className="sr" htmlFor="cd2">
                Condition
              </label>
              <select id="cd2">
                <option>Condition</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Needs work</option>
              </select>
              <Icon name="down" />
            </div>
          </div>
          <button className="btn btn-red">
            <span>{c.button}</span> <Icon name="right" />
          </button>
          <small>Takes under a minute. No spam, ever.</small>
        </form>
      </div>
    </section>
  );
}
