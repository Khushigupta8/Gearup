'use client';

import { startTransition, useActionState, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { saveBike, type FormResult } from '@/app/admin/(panel)/stock/bike-actions';

export type BikeFormValues = {
  id?: string;
  registration?: string | null;
  vin?: string | null;
  make?: string;
  model?: string;
  variant?: string | null;
  year?: number;
  plate?: string | null;
  condition?: string;
  mileage?: number;
  engineCc?: number;
  style?: string;
  colour?: string | null;
  licence?: string | null;
  fuel?: string | null;
  gearbox?: string | null;
  owners?: number | null;
  keys?: number | null;
  motExpiry?: string | null; // yyyy-mm-dd
  pricePounds?: number;
  wasPricePounds?: number | null;
  status?: string;
  visible?: boolean;
  featured?: boolean;
  freeWarrantyMonths?: number;
  freeWarrantyValuePounds?: number | null;
  showWarrantyBadge?: boolean;
  showA2Badge?: boolean;
  flagText?: string | null;
  headline?: string | null;
  description?: string | null;
  features?: string[];
  highlights?: string[];
  specText?: string;
  historyText?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const styles = [
  ['naked', 'Naked'],
  ['sports', 'Sportsbike'],
  ['adventure', 'Adventure'],
  ['cruiser', 'Cruiser'],
  ['classic', 'Classic'],
  ['tourer', 'Tourer'],
  ['scooter', 'Scooter/Moped'],
  ['enduro', 'Enduro'],
];
const statuses = [
  ['draft', 'Draft (not on website)'],
  ['in_preparation', 'In preparation (not on website)'],
  ['available', 'Available'],
  ['reserved', 'Reserved'],
  ['sold', 'Sold'],
];

function Field({ label, name, error, hint, children, wide }: { label: string; name?: string; error?: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={['adm-field', wide && 'wide', error && 'has-err'].filter(Boolean).join(' ')} htmlFor={name}>
      <span>{label}</span>
      {children}
      {hint && !error && <small className="adm-muted">{hint}</small>}
      {error && <small className="adm-err">{error}</small>}
    </label>
  );
}

export function BikeForm({ values = {}, mode }: { values?: BikeFormValues; mode: 'new' | 'edit' }) {
  const [state, action, pending] = useActionState<FormResult, FormData>(saveBike, null);
  const err = (k: string) => (state && !state.ok ? state.fields?.[k] : undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [lookup, setLookup] = useState<{ busy: boolean; msg?: string; ok?: boolean }>({ busy: false });

  async function regLookup() {
    const form = formRef.current;
    if (!form) return;
    const reg = (form.elements.namedItem('registration') as HTMLInputElement).value;
    setLookup({ busy: true });
    const res = await fetch(`/api/admin/dvla?reg=${encodeURIComponent(reg)}`);
    const data = await res.json();
    if (!res.ok) {
      setLookup({ busy: false, msg: data.error, ok: false });
      return;
    }
    const set = (name: string, v: unknown) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      if (el && v != null && v !== '') el.value = String(v);
    };
    set('registration', data.registration);
    set('make', data.make);
    set('colour', data.colour);
    set('year', data.year);
    set('engineCc', data.engineCc);
    set('fuel', data.fuel);
    set('motExpiry', data.motExpiry);
    setLookup({ busy: false, msg: 'Filled in from the DVLA. Check the model and mileage.', ok: true });
  }

  // Submit without React's automatic form reset, so typed values survive a validation error.
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }

  const v = values;
  return (
    <form ref={formRef} onSubmit={submit} className="adm-bikeform" noValidate={false}>
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <section className="adm-card adm-sec">
        <h2>Registration</h2>
        <div className="adm-grid">
          <Field label="Registration" name="registration" error={err('registration')} hint="Pulled from the DVLA when the lookup is switched on.">
            <div className="adm-inline">
              <input id="registration" name="registration" defaultValue={v.registration ?? ''} className="adm-reg" placeholder="AB12 CDE" />
              <button type="button" className="adm-btn adm-btn-sm" onClick={regLookup} disabled={lookup.busy}>
                {lookup.busy ? 'Looking up…' : 'Look up'}
              </button>
            </div>
          </Field>
          <Field label="VIN (optional)" name="vin">
            <input id="vin" name="vin" defaultValue={v.vin ?? ''} />
          </Field>
        </div>
        {lookup.msg && <p className={lookup.ok ? 'adm-ok' : 'adm-err'}>{lookup.msg}</p>}
      </section>

      <section className="adm-card adm-sec">
        <h2>Bike details</h2>
        <div className="adm-grid">
          <Field label="Make" name="make" error={err('make')}>
            <input id="make" name="make" required defaultValue={v.make ?? ''} placeholder="BMW" />
          </Field>
          <Field label="Model" name="model" error={err('model')}>
            <input id="model" name="model" required defaultValue={v.model ?? ''} placeholder="R 1250 GS" />
          </Field>
          <Field label="Variant (optional)" name="variant">
            <input id="variant" name="variant" defaultValue={v.variant ?? ''} placeholder="Rallye TE" />
          </Field>
          <Field label="Year" name="year" error={err('year')}>
            <input id="year" name="year" type="number" required defaultValue={v.year ?? ''} />
          </Field>
          <Field label="Plate (shown on page)" name="plate" hint='e.g. "2019 (69 plate)"'>
            <input id="plate" name="plate" defaultValue={v.plate ?? ''} />
          </Field>
          <Field label="Condition" name="condition">
            <select id="condition" name="condition" defaultValue={v.condition ?? 'used'}>
              <option value="used">Used</option>
              <option value="new">New</option>
            </select>
          </Field>
          <Field label="Mileage" name="mileage" error={err('mileage')}>
            <input id="mileage" name="mileage" type="number" required defaultValue={v.mileage ?? ''} />
          </Field>
          <Field label="Engine (cc)" name="engineCc" error={err('engineCc')}>
            <input id="engineCc" name="engineCc" type="number" required defaultValue={v.engineCc ?? ''} />
          </Field>
          <Field label="Style" name="style">
            <select id="style" name="style" defaultValue={v.style ?? 'naked'}>
              {styles.map(([val, l]) => (
                <option key={val} value={val}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Licence" name="licence">
            <select id="licence" name="licence" defaultValue={v.licence ?? ''}>
              <option value="">Not set</option>
              <option value="cbt">CBT / learner (125cc)</option>
              <option value="a2">A2</option>
              <option value="full_a">Full A</option>
            </select>
          </Field>
          <Field label="Colour" name="colour">
            <input id="colour" name="colour" defaultValue={v.colour ?? ''} />
          </Field>
          <Field label="Fuel" name="fuel">
            <input id="fuel" name="fuel" defaultValue={v.fuel ?? 'Petrol'} />
          </Field>
          <Field label="Gearbox" name="gearbox">
            <input id="gearbox" name="gearbox" defaultValue={v.gearbox ?? ''} placeholder="Manual, 6-speed" />
          </Field>
          <Field label="Previous owners" name="owners">
            <input id="owners" name="owners" type="number" defaultValue={v.owners ?? ''} />
          </Field>
          <Field label="Keys" name="keys">
            <input id="keys" name="keys" type="number" defaultValue={v.keys ?? ''} />
          </Field>
          <Field label="MOT expiry" name="motExpiry">
            <input id="motExpiry" name="motExpiry" type="date" defaultValue={v.motExpiry ?? ''} />
          </Field>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2>Price & website</h2>
        <div className="adm-grid">
          <Field label="Price (£)" name="pricePounds" error={err('pricePounds')}>
            <input id="pricePounds" name="pricePounds" type="number" required defaultValue={v.pricePounds ?? ''} />
          </Field>
          <Field label="Was price (£)" name="wasPricePounds" hint="Shows a price drop with the old price crossed out.">
            <input id="wasPricePounds" name="wasPricePounds" type="number" defaultValue={v.wasPricePounds ?? ''} />
          </Field>
          <Field label="Status" name="status">
            <select id="status" name="status" defaultValue={v.status ?? 'draft'}>
              {statuses.map(([val, l]) => (
                <option key={val} value={val}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Free extended warranty" name="freeWarrantyMonths" hint="Every bike already has 30 days.">
            <select id="freeWarrantyMonths" name="freeWarrantyMonths" defaultValue={String(v.freeWarrantyMonths ?? 0)}>
              <option value="0">None</option>
              <option value="3">3 months free</option>
              <option value="6">6 months free</option>
              <option value="12">12 months free</option>
              <option value="24">24 months free</option>
            </select>
          </Field>
          <Field label="Warranty worth (£)" name="freeWarrantyValuePounds" hint='Shown as "Worth £349, included".'>
            <input id="freeWarrantyValuePounds" name="freeWarrantyValuePounds" type="number" defaultValue={v.freeWarrantyValuePounds ?? ''} />
          </Field>
          <Field label="Flag on photo" name="flagText" hint='e.g. "Just arrived", "Price drop"'>
            <input id="flagText" name="flagText" defaultValue={v.flagText ?? ''} />
          </Field>
        </div>
        <div className="adm-checks">
          <label>
            <input type="checkbox" name="visible" defaultChecked={v.visible ?? true} /> Show on website
          </label>
          <label>
            <input type="checkbox" name="featured" defaultChecked={v.featured ?? false} /> Featured on home page
          </label>
          <label>
            <input type="checkbox" name="showWarrantyBadge" defaultChecked={v.showWarrantyBadge ?? true} /> Show warranty ribbon
          </label>
          <label>
            <input type="checkbox" name="showA2Badge" defaultChecked={v.showA2Badge ?? false} /> Show &quot;A2 compatible&quot; flag
          </label>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2>Description</h2>
        <div className="adm-grid">
          <Field label="Headline" name="headline" wide hint='Overview tab title, e.g. "Ready for the long way round"'>
            <input id="headline" name="headline" defaultValue={v.headline ?? ''} />
          </Field>
          <Field label="Description" name="description" wide hint="Leave a blank line between paragraphs.">
            <textarea id="description" name="description" rows={6} defaultValue={v.description ?? ''} />
          </Field>
          <Field label="Features" name="features" hint="One per line (ticked list on the bike page).">
            <textarea id="features" name="features" rows={6} defaultValue={(v.features ?? []).join('\n')} />
          </Field>
          <Field label="Card highlights" name="highlights" hint="One per line. Shown on the big home-page card.">
            <textarea id="highlights" name="highlights" rows={6} defaultValue={(v.highlights ?? []).join('\n')} />
          </Field>
          <Field label="Specification" name="specText" hint="One per line: Label: value">
            <textarea id="specText" name="specText" rows={8} defaultValue={v.specText ?? ''} placeholder={'Power: 136 bhp\nMOT: October 2027'} />
          </Field>
          <Field label="History" name="historyText" hint="One per line: Title | note">
            <textarea id="historyText" name="historyText" rows={8} defaultValue={v.historyText ?? ''} placeholder={'HPI clear | Not stolen, scrapped or written off\nService at 18,500 miles | BMW dealer, Sep 2026'} />
          </Field>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2>Search engines (optional)</h2>
        <div className="adm-grid">
          <Field label="Page title" name="seoTitle" wide hint="Defaults to year, make, model and price.">
            <input id="seoTitle" name="seoTitle" defaultValue={v.seoTitle ?? ''} />
          </Field>
          <Field label="Description" name="seoDescription" wide>
            <textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={v.seoDescription ?? ''} />
          </Field>
        </div>
      </section>

      <div className="adm-savebar">
        {state && <span className={state.ok ? 'adm-ok' : 'adm-err'}>{state.ok ? state.message : state.error}</span>}
        <button className="adm-btn adm-btn-red" disabled={pending}>
          {pending ? 'Saving…' : mode === 'new' ? 'Create bike' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
