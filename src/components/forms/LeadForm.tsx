'use client';

import { usePathname } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { site } from '@/lib/site';

export type LeadType = 'enquiry' | 'viewing' | 'finance' | 'part_exchange' | 'sell_bike' | 'insurance' | 'workshop' | 'newsletter';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

function labelFor(form: HTMLFormElement, c: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  if (c.id) {
    const l = form.querySelector(`label[for="${CSS.escape(c.id)}"]`);
    if (l) return clean(l.textContent);
  }
  const wrap = c.closest('label');
  if (wrap) return clean(wrap.textContent);
  return c.getAttribute('aria-label') || ('placeholder' in c ? c.placeholder : '') || c.name || 'Field';
}

/** The question above a group of radio cards, e.g. "What is it about?" (data-q on the group wins). */
function groupLabel(form: HTMLFormElement, radio: HTMLInputElement) {
  const q = radio.closest<HTMLElement>('[data-q]');
  if (q?.dataset.q) return q.dataset.q;
  const box = radio.closest('.radios, .rcards, .opts') ?? radio.closest('label')?.parentElement;
  for (let el: Element | null | undefined = box; el && el !== form; el = el.parentElement) {
    for (let sib = el.previousElementSibling; sib; sib = sib.previousElementSibling) {
      if (sib.matches('.qlbl, .h4, h2, h3, h4, legend, label')) return clean(sib.textContent).replace(/^\d+\s*/, '');
    }
  }
  return 'Option';
}

/** Reads every field into a readable { label: value } record for the CRM. */
function collect(form: HTMLFormElement) {
  const fields: Record<string, string> = {};
  const name: string[] = [];
  let email = '';
  let phone = '';
  let message = '';
  let consent = false;
  const seen = new Set<string>();
  form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((c) => {
    const type = c instanceof HTMLInputElement ? c.type : '';
    if (['file', 'hidden', 'submit', 'password'].includes(type) || c.name === 'website') return;
    if (type === 'radio') {
      if (seen.has(c.name)) return;
      seen.add(c.name);
      const checked = form.querySelector<HTMLInputElement>(`input[type=radio][name="${CSS.escape(c.name)}"]:checked`);
      if (checked) fields[groupLabel(form, c as HTMLInputElement).slice(0, 90)] = clean(checked.closest('label')?.querySelector('b')?.textContent) || labelFor(form, checked);
      return;
    }
    const label = labelFor(form, c);
    if (type === 'checkbox') {
      const box = c as HTMLInputElement;
      if (/offer|news|marketing|email me/i.test(label)) consent = box.checked;
      if (box.checked) fields[label.slice(0, 90)] = 'Yes';
      return;
    }
    let value = c.value.trim();
    if (c instanceof HTMLSelectElement && c.selectedIndex >= 0) value = clean(c.options[c.selectedIndex].text);
    if (!value) return;
    if (type === 'email') email = value;
    else if (/mobile|phone|tel/i.test(label) || type === 'tel') phone = value;
    else if (/first name|last name|full name|your name|^name$/i.test(label)) name.push(value);
    else if (c instanceof HTMLTextAreaElement) message = value;
    fields[label.slice(0, 90)] = value.slice(0, 2000);
  });
  return { fields, name: name.join(' '), email, phone, message, consent };
}

/**
 * Website enquiry form: keeps the page's own markup (children) and sends every field to the CRM
 * (/api/leads). Radio cards inside get their "on" state handled here.
 */
export function LeadForm({
  type,
  className,
  success,
  children,
  id,
}: {
  /** 'contact' = viewing when the answers mention a viewing or video call, otherwise a general enquiry. */
  type: LeadType | 'contact';
  className?: string;
  /** Shown in place of the form once it is sent. */
  success: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  function onChange(e: ChangeEvent<HTMLFormElement>) {
    const t = e.target as unknown as HTMLInputElement;
    if (t.type !== 'radio' || !t.closest('.rcard')) return;
    e.currentTarget.querySelectorAll<HTMLInputElement>(`input[type=radio][name="${CSS.escape(t.name)}"]`).forEach((r) => {
      r.closest('.rcard')?.classList.toggle('on', r.checked);
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = collect(form);
    if (!data.email && data.phone.replace(/\D/g, '').length < 7) {
      setError('Please add your email or mobile number so we can reply.');
      return;
    }
    setState('sending');
    setError('');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: type === 'contact' ? (/viewing|video/i.test(Object.values(data.fields).join(' ')) ? 'viewing' : 'enquiry') : type,
        name: data.name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        message: data.message || undefined,
        fields: data.fields,
        sourcePage: pathname,
        marketingConsent: data.consent,
        website: (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '',
      }),
    }).catch(() => null);
    if (res?.ok) {
      setState('done');
      return;
    }
    const body = await res?.json().catch(() => null);
    setError(body?.error ?? `Something went wrong. Please call us on ${site.phone.display}.`);
    setState('idle');
  }

  if (state === 'done') return <div className={className} id={id}>{success}</div>;

  return (
    <form className={className} id={id} onSubmit={onSubmit} onChange={onChange} data-react="1" aria-busy={state === 'sending'}>
      {children}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      {error && (
        <p className="ferr" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
