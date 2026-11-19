'use client';

import { useState, type FormEvent } from 'react';
import { demoDeliveryQuote } from '@/lib/delivery';

/** Postcode box that shows an instant (demo) delivery price. */
export function DeliveryQuote({ inputId = 'pc' }: { inputId?: string }) {
  const [postcode, setPostcode] = useState('');
  const [result, setResult] = useState<ReturnType<typeof demoDeliveryQuote> | 'invalid' | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const pc = postcode.trim();
    setResult(pc.length < 2 ? 'invalid' : demoDeliveryQuote(pc));
  }

  return (
    <>
      <form onSubmit={submit}>
        <label className="sr" htmlFor={inputId}>
          Postcode
        </label>
        <input id={inputId} placeholder="Your postcode" maxLength={8} value={postcode} onChange={(e) => setPostcode(e.target.value)} />
        <button className="btn btn-ink" type="submit">
          Get price
        </button>
      </form>
      <p className="qout" aria-live="polite">
        {result === 'invalid' && 'Please enter a UK postcode.'}
        {result && result !== 'invalid' && (
          <>
            About <b>{result.miles} miles</b> away. Delivery: <b>£{result.price}</b>
            <br />
            <span style={{ fontSize: 12 }}>Demo figure. The live site uses real road distance.</span>
          </>
        )}
      </p>
    </>
  );
}
