'use client';

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import { addLeadNote, updateCustomer, updateLead, type CrmResult } from '@/app/admin/(panel)/leads/actions';
import { leadStages } from '@/lib/crm';

function Msg({ state }: { state: CrmResult }) {
  if (!state) return null;
  return <span className={state.ok ? 'adm-ok' : 'adm-err'}>{state.ok ? state.message : state.error}</span>;
}

/** Submit without React's form reset (keeps what was typed if there's an error). */
function submitWith(action: (d: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
}

export function LeadControls({
  id,
  stage,
  assignedToId,
  followUpAt,
  staff,
}: {
  id: string;
  stage: string;
  assignedToId: string | null;
  followUpAt: string | null;
  staff: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<CrmResult, FormData>(updateLead, null);
  return (
    <form onSubmit={submitWith(action)} className="adm-card adm-sec adm-stack">
      <h2>Pipeline</h2>
      <input type="hidden" name="id" value={id} />
      <label className="adm-field">
        <span>Stage</span>
        <select name="stage" defaultValue={stage}>
          {Object.entries(leadStages).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="adm-field">
        <span>Owner</span>
        <select name="assignedToId" defaultValue={assignedToId ?? ''}>
          <option value="">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className="adm-field">
        <span>Follow up on</span>
        <input type="date" name="followUpAt" defaultValue={followUpAt ?? ''} />
      </label>
      <div className="adm-formfoot">
        <Msg state={state} />
        <button className="adm-btn adm-btn-sm" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState<CrmResult, FormData>(addLeadNote, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} onSubmit={submitWith(action)} className="adm-noteform">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="adm-inline">
        <select name="kind" defaultValue="note" aria-label="Type">
          <option value="note">Note</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
        <span className="adm-muted">Log a call, message or note</span>
      </div>
      <textarea name="body" rows={3} placeholder="e.g. Called, coming to view Saturday 11am" required />
      <div className="adm-formfoot">
        <Msg state={state} />
        <button className="adm-btn adm-btn-sm" disabled={pending}>
          Add
        </button>
      </div>
    </form>
  );
}

export type CustomerValues = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  town: string | null;
  postcode: string | null;
  notes: string | null;
  marketingConsent: boolean;
};

export function CustomerForm({ c }: { c: CustomerValues }) {
  const [state, action, pending] = useActionState<CrmResult, FormData>(updateCustomer, null);
  return (
    <form onSubmit={submitWith(action)} className="adm-card adm-sec">
      <h2>Details</h2>
      <input type="hidden" name="id" value={c.id} />
      <div className="adm-grid">
        <label className="adm-field">
          <span>First name</span>
          <input name="firstName" defaultValue={c.firstName} required />
        </label>
        <label className="adm-field">
          <span>Last name</span>
          <input name="lastName" defaultValue={c.lastName ?? ''} />
        </label>
        <label className="adm-field">
          <span>Email</span>
          <input name="email" type="email" defaultValue={c.email ?? ''} />
        </label>
        <label className="adm-field">
          <span>Phone</span>
          <input name="phone" defaultValue={c.phone ?? ''} />
        </label>
        <label className="adm-field">
          <span>Address</span>
          <input name="addressLine1" defaultValue={c.addressLine1 ?? ''} />
        </label>
        <label className="adm-field">
          <span>Town</span>
          <input name="town" defaultValue={c.town ?? ''} />
        </label>
        <label className="adm-field">
          <span>Postcode</span>
          <input name="postcode" defaultValue={c.postcode ?? ''} />
        </label>
        <label className="adm-field wide">
          <span>Notes</span>
          <textarea name="notes" rows={3} defaultValue={c.notes ?? ''} />
        </label>
      </div>
      <div className="adm-checks">
        <label>
          <input type="checkbox" name="marketingConsent" defaultChecked={c.marketingConsent} /> Happy to receive offers and new-stock emails
        </label>
      </div>
      <div className="adm-formfoot" style={{ marginTop: 12 }}>
        <Msg state={state} />
        <button className="adm-btn adm-btn-sm" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
