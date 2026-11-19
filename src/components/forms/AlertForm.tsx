'use client';

import { usePathname } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';

/** "Tell me when a match arrives" stock alert. Creates a stock_alert lead in the CRM. */
export function AlertForm({ doneText = 'Alert set. We will be in touch when a match arrives.' }: { doneText?: string }) {
  const pathname = usePathname();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const contact = String(form.get('contact') ?? '').trim();
    const isEmail = contact.includes('@');
    setState('sending');
    setError('');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'stock_alert',
        email: isEmail ? contact : undefined,
        phone: isEmail ? undefined : contact,
        fields: { 'Looking for': String(form.get('style') ?? 'Any style') },
        sourcePage: pathname,
        marketingConsent: true,
        website: String(form.get('website') ?? ''),
      }),
    }).catch(() => null);
    if (res?.ok) {
      setState('done');
      return;
    }
    const data = await res?.json().catch(() => null);
    setError(data?.error ?? 'Something went wrong. Please call us on 0744 072 1478.');
    setState('idle');
  }

  return (
    <form className="alertform" onSubmit={submit} data-react="1">
      {state === 'done' ? (
        <div className="success" style={{ gridColumn: '1/-1' }}>
          <Icon name="check" />
          {doneText}
        </div>
      ) : (
        <>
          <div className="sel">
            <label className="sr" htmlFor="al1">
              Style
            </label>
            <select id="al1" name="style">
              <option>Any style</option>
              <option>Adventure</option>
              <option>Naked</option>
              <option>Sportsbike</option>
              <option>125cc</option>
            </select>
            <Icon name="down" />
          </div>
          <div>
            <label className="sr" htmlFor="al2">
              Email or mobile
            </label>
            <input id="al2" name="contact" placeholder="Email or mobile" required />
          </div>
          {/* hidden from people; bots fill it */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
          <button className="btn btn-red" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Alert me'}
          </button>
          {error && (
            <p role="alert" style={{ gridColumn: '1/-1', color: 'var(--red)', fontSize: 14, margin: 0 }}>
              {error}
            </p>
          )}
        </>
      )}
    </form>
  );
}
