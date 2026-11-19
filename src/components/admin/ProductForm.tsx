'use client';

import { upload } from '@vercel/blob/client';
import { startTransition, useActionState, useState, type FormEvent } from 'react';
import { createDiscountCode, saveProduct, toggleDiscountCode, type ShopResult } from '@/app/admin/(panel)/accessories/actions';
import { resizeImage } from '@/lib/resize-image';

type Variant = { id?: string; name: string; price: string; wasPrice: string; stock: string; remove?: boolean };
export type ProductValues = {
  id?: string;
  name: string;
  brand: string;
  categoryId: string;
  meta: string;
  flagText: string;
  description: string;
  image: string;
  popularity: number;
  active: boolean;
  variants: Variant[];
};

function Msg({ state }: { state: ShopResult }) {
  if (!state) return null;
  return <span className={state.ok ? 'adm-ok' : 'adm-err'}>{state.ok ? state.message : state.error}</span>;
}

export function ProductForm({ values, categories }: { values: ProductValues; categories: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState<ShopResult, FormData>(saveProduct, null);
  const [variants, setVariants] = useState<Variant[]>(values.variants.length ? values.variants : [{ name: 'Standard', price: '', wasPrice: '', stock: '0' }]);
  const [image, setImage] = useState(values.image);
  const [uploading, setUploading] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }

  async function onImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const small = await resizeImage(file, 1400);
      const blob = await upload(`products/${small.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`, small, { access: 'public', handleUploadUrl: '/api/admin/upload' });
      setImage(blob.url);
    } finally {
      setUploading(false);
    }
  }

  const set = (i: number, patch: Partial<Variant>) => setVariants((vs) => vs.map((v, n) => (n === i ? { ...v, ...patch } : v)));

  return (
    <form onSubmit={submit} className="adm-bikeform">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <input type="hidden" name="image" value={image} />
      <section className="adm-card adm-sec">
        <h2>Product</h2>
        <div className="adm-prodtop">
          <label className="adm-prodimg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {image ? <img src={image} alt="" /> : <span>Add photo</span>}
            <input type="file" accept="image/*" hidden onChange={(e) => onImage(e.target.files?.[0])} />
            <small>{uploading ? 'Uploading…' : 'Click to change'}</small>
          </label>
          <div className="adm-grid" style={{ flex: 1 }}>
            <label className="adm-field wide">
              <span>Name</span>
              <input name="name" defaultValue={values.name} required />
            </label>
            <label className="adm-field">
              <span>Brand</span>
              <input name="brand" defaultValue={values.brand} />
            </label>
            <label className="adm-field">
              <span>Category</span>
              <select name="categoryId" defaultValue={values.categoryId}>
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="adm-field">
              <span>Flag on photo</span>
              <input name="flagText" defaultValue={values.flagText} placeholder='e.g. "Best seller"' />
            </label>
            <label className="adm-field">
              <span>Sort order</span>
              <input name="popularity" type="number" defaultValue={values.popularity} />
              <small className="adm-muted">Lower shows first in &quot;Most popular&quot;.</small>
            </label>
            <label className="adm-field wide">
              <span>Short spec line</span>
              <input name="meta" defaultValue={values.meta} placeholder="e.g. ECE 22.06 · Sizes XS to XXL" />
            </label>
            <label className="adm-field wide">
              <span>Description</span>
              <textarea name="description" rows={3} defaultValue={values.description} />
            </label>
          </div>
        </div>
        <div className="adm-checks">
          <label>
            <input type="checkbox" name="active" defaultChecked={values.active} /> Show in the shop
          </label>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2>Sizes, prices & stock</h2>
        <table className="adm-table adm-mini">
          <thead>
            <tr>
              <th>Size / option</th>
              <th>Price (£)</th>
              <th>Was (£)</th>
              <th>In stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr key={i} style={v.remove ? { opacity: 0.4 } : undefined}>
                <td>
                  {v.id && <input type="hidden" name={`variant[${i}][id]`} value={v.id} />}
                  {v.remove && <input type="hidden" name={`variant[${i}][remove]`} value="1" />}
                  <input name={`variant[${i}][name]`} value={v.name} onChange={(e) => set(i, { name: e.target.value })} style={{ width: 120 }} />
                </td>
                <td>
                  <input name={`variant[${i}][price]`} value={v.price} onChange={(e) => set(i, { price: e.target.value })} inputMode="decimal" style={{ width: 100 }} />
                </td>
                <td>
                  <input name={`variant[${i}][wasPrice]`} value={v.wasPrice} onChange={(e) => set(i, { wasPrice: e.target.value })} inputMode="decimal" style={{ width: 100 }} />
                </td>
                <td>
                  <input name={`variant[${i}][stock]`} value={v.stock} onChange={(e) => set(i, { stock: e.target.value })} inputMode="numeric" style={{ width: 80 }} />
                </td>
                <td>
                  <button type="button" className="adm-link-btn dark" onClick={() => (v.id ? set(i, { remove: !v.remove }) : setVariants((vs) => vs.filter((_, n) => n !== i)))}>
                    {v.remove ? 'Undo' : 'Remove'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="adm-btn adm-btn-sm mt1"
          style={{ marginTop: 10 }}
          onClick={() => setVariants((vs) => [...vs, { name: '', price: vs[vs.length - 1]?.price ?? '', wasPrice: '', stock: '0' }])}
        >
          + Add size
        </button>
      </section>

      <div className="adm-savebar">
        <Msg state={state} />
        <button className="adm-btn adm-btn-red" disabled={pending || uploading}>
          {pending ? 'Saving…' : values.id ? 'Save product' : 'Create product'}
        </button>
      </div>
    </form>
  );
}

export function NewCodeForm() {
  const [state, action, pending] = useActionState<ShopResult, FormData>(createDiscountCode, null);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(() => action(data));
  }
  return (
    <form onSubmit={submit} className="adm-card adm-sec">
      <h2>New discount code</h2>
      <div className="adm-grid">
        <label className="adm-field">
          <span>Code</span>
          <input name="code" required placeholder="e.g. SPRING15" style={{ textTransform: 'uppercase' }} />
        </label>
        <label className="adm-field">
          <span>Type</span>
          <select name="kind" defaultValue="percent">
            <option value="percent">% off</option>
            <option value="amount">£ off</option>
          </select>
        </label>
        <label className="adm-field">
          <span>Amount</span>
          <input name="value" required inputMode="decimal" placeholder="15" />
        </label>
        <label className="adm-field">
          <span>Applies to</span>
          <select name="appliesTo" defaultValue="accessories">
            <option value="accessories">Kit only</option>
            <option value="all">Kit (and future bike offers)</option>
          </select>
        </label>
        <label className="adm-field">
          <span>Ends on (optional)</span>
          <input name="endsAt" type="date" />
        </label>
        <label className="adm-field">
          <span>Max uses (optional)</span>
          <input name="maxUses" inputMode="numeric" />
        </label>
      </div>
      <div className="adm-formfoot" style={{ marginTop: 12 }}>
        <Msg state={state} />
        <button className="adm-btn adm-btn-sm" disabled={pending}>
          Create code
        </button>
      </div>
    </form>
  );
}

export function CodeToggle({ id, active }: { id: string; active: boolean }) {
  const [on, setOn] = useState(active);
  return (
    <input
      type="checkbox"
      checked={on}
      aria-label="Active"
      onChange={(e) => {
        setOn(e.target.checked);
        startTransition(() => toggleDiscountCode(id, e.target.checked));
      }}
    />
  );
}
