'use client';

import { startTransition, useActionState, useState, type FormEvent } from 'react';
import { updateMyDetails, type AccountResult } from '@/app/(site)/(account)/account/actions';
import { authClient } from '@/lib/auth-client';

type Values = { firstName: string; lastName: string; phone: string; addressLine1: string; town: string; postcode: string; marketingConsent: boolean };

export function DetailsForm({ c }: { c: Values }) {
  const [state, action, pending] = useActionState<AccountResult, FormData>(updateMyDetails, null);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="frow">
        <div className="fl">
          <label htmlFor="dfn">First name</label>
          <input id="dfn" name="firstName" defaultValue={c.firstName} required autoComplete="given-name" />
        </div>
        <div className="fl">
          <label htmlFor="dln">Last name</label>
          <input id="dln" name="lastName" defaultValue={c.lastName} autoComplete="family-name" />
        </div>
      </div>
      <div className="frow">
        <div className="fl">
          <label htmlFor="dph">Mobile</label>
          <input id="dph" name="phone" defaultValue={c.phone} autoComplete="tel" placeholder="07..." />
          <small>We text your tracking updates here.</small>
        </div>
        <div className="fl">
          <label htmlFor="dpc">Postcode</label>
          <input id="dpc" name="postcode" defaultValue={c.postcode} autoComplete="postal-code" style={{ textTransform: 'uppercase' }} />
        </div>
      </div>
      <div className="frow">
        <div className="fl">
          <label htmlFor="dad">Address</label>
          <input id="dad" name="addressLine1" defaultValue={c.addressLine1} autoComplete="address-line1" placeholder="House number and street" />
        </div>
        <div className="fl">
          <label htmlFor="dtn">Town</label>
          <input id="dtn" name="town" defaultValue={c.town} autoComplete="address-level2" />
        </div>
      </div>
      <label className="chk">
        <input type="checkbox" name="marketingConsent" defaultChecked={c.marketingConsent} />
        Send me new arrivals and offers. You can stop these at any time.
      </label>
      <div className="formfoot">
        {state && <span className={state.ok ? 'okmsg' : 'formerr'}>{state.ok ? state.message : state.error}</span>}
        <button className="btn btn-ink" disabled={pending}>
          {pending ? 'Saving…' : 'Save details'}
        </button>
      </div>
    </form>
  );
}

export function ChangePasswordForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    const { error } = await authClient.changePassword({
      currentPassword: String(f.get('current')),
      newPassword: String(f.get('next')),
      revokeOtherSessions: true,
    });
    setBusy(false);
    if (error) setMsg({ ok: false, text: 'Your current password is wrong, or the new one is shorter than 8 characters.' });
    else {
      setMsg({ ok: true, text: 'Password changed. Other devices have been signed out.' });
      form.reset();
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="frow">
        <div className="fl">
          <label htmlFor="pcur">Current password</label>
          <input id="pcur" name="current" type="password" required autoComplete="current-password" />
        </div>
        <div className="fl">
          <label htmlFor="pnew">New password</label>
          <input id="pnew" name="next" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
        </div>
      </div>
      <div className="formfoot">
        {msg && <span className={msg.ok ? 'okmsg' : 'formerr'}>{msg.text}</span>}
        <button className="btn btn-ink" disabled={busy}>
          {busy ? 'Saving…' : 'Change password'}
        </button>
      </div>
    </form>
  );
}
