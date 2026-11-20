'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from 'react';
import {
  deleteBanner,
  deleteFaq,
  deleteReview,
  moveBanner,
  moveFaq,
  saveBusiness,
  saveFaq,
  saveHeroSlide,
  saveLegalPage,
  saveReview,
  saveSeo,
  setBannerActive,
  setFaqActive,
  setReviewActive,
  type CmsResult,
} from '@/app/admin/(panel)/website/actions';
import type { Business, LegalPage, SeoEntry } from '@/lib/cms';
import { resizeImage } from '@/lib/resize-image';

type Action = (prev: CmsResult, form: FormData) => Promise<CmsResult>;

/** Form + server action with a saved / error line. onSaved runs after a successful save. */
function CmsForm({ action, children, className = 'adm-card adm-sec', onSaved, submit = 'Save' }: { action: Action; children: ReactNode; className?: string; onSaved?: () => void; submit?: string }) {
  const [state, run, pending] = useActionState<CmsResult, FormData>(action, null);
  const router = useRouter();
  const handled = useRef<CmsResult>(null);
  const savedCb = useRef(onSaved);
  useEffect(() => {
    savedCb.current = onSaved;
  });
  useEffect(() => {
    if (state?.ok && handled.current !== state) {
      handled.current = state;
      savedCb.current?.();
      router.refresh();
    }
  }, [state, router]);
  return (
    <form action={run} className={className}>
      {children}
      <div className="adm-formfoot">
        {state && (state.ok ? <span className="adm-ok">{state.message}</span> : <span className="adm-err">{state.error}</span>)}
        <button className="adm-btn adm-btn-red" disabled={pending}>
          {pending ? 'Saving…' : submit}
        </button>
      </div>
    </form>
  );
}

function useRun() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return [
    pending,
    (fn: () => Promise<unknown>) =>
      start(async () => {
        await fn();
        router.refresh();
      }),
  ] as const;
}

function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  const [ask, setAsk] = useState(false);
  return ask ? (
    <button type="button" className="danger" onClick={onConfirm}>
      Confirm delete
    </button>
  ) : (
    <button type="button" onClick={() => setAsk(true)}>
      Delete
    </button>
  );
}

// ───────────── business ─────────────

export function BusinessForm({ biz }: { biz: Business }) {
  return (
    <CmsForm action={saveBusiness}>
      <h2>Contact details</h2>
      <div className="adm-grid">
        <label className="adm-field">
          Phone (as shown)
          <input type="text" name="phone" defaultValue={biz.phone} />
        </label>
        <label className="adm-field">
          WhatsApp number
          <input type="text" name="whatsapp" defaultValue={biz.whatsapp} />
          <small className="adm-muted">With country code, no spaces: 447440721478</small>
        </label>
        <label className="adm-field">
          Email
          <input type="email" name="email" defaultValue={biz.email} />
        </label>
        <label className="adm-field wide">
          Showroom address
          <textarea name="address" rows={3} defaultValue={biz.address} placeholder={'Unit 1, Example Road\nTown\nAB1 2CD'} />
          <small className="adm-muted">Shown in the footer. One line per row.</small>
        </label>
        <label className="adm-field wide">
          Opening hours
          <textarea name="hours" rows={4} defaultValue={biz.hours.map(([d, t]) => `${d} | ${t}`).join('\n')} />
          <small className="adm-muted">One line each: day | time. For example “Saturday | 9:00 to 16:00”.</small>
        </label>
        <label className="adm-field wide">
          Footer legal line
          <input type="text" name="legalLine" defaultValue={biz.legalLine} placeholder="GearUp Motorcycles Ltd, company no. 12345678. Authorised and regulated by the FCA, FRN 000000." />
        </label>
      </div>

      <h3 className="adm-h3">Red strip at the top of every page</h3>
      <label className="adm-field wide">
        <textarea name="promos" rows={4} defaultValue={biz.promos.join('\n')} />
        <small className="adm-muted">One message per line, up to 6. Keep each short.</small>
      </label>

      <h3 className="adm-h3">Social media</h3>
      <p className="adm-muted" style={{ marginTop: 0 }}>
        Paste the full link to each page. Icons appear in the footer only for the ones filled in.
      </p>
      <div className="adm-grid">
        {(
          [
            ['facebook', 'Facebook'],
            ['instagram', 'Instagram'],
            ['tiktok', 'TikTok'],
            ['youtube', 'YouTube'],
            ['x', 'X (Twitter)'],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="adm-field">
            {label}
            <input type="text" name={k} defaultValue={biz.socials[k]} placeholder="https://" />
          </label>
        ))}
      </div>

      <h3 className="adm-h3">Trustpilot</h3>
      <div className="adm-grid">
        <label className="adm-field">
          Rating (out of 5)
          <input type="number" name="tpRating" step="0.1" min="0" max="5" defaultValue={biz.trustpilot.rating} />
        </label>
        <label className="adm-field">
          Number of reviews
          <input type="number" name="tpCount" min="0" defaultValue={biz.trustpilot.count} />
        </label>
        <label className="adm-field">
          Trustpilot page link
          <input type="text" name="tpUrl" defaultValue={biz.trustpilot.url} placeholder="https://uk.trustpilot.com/review/…" />
        </label>
      </div>
    </CmsForm>
  );
}

// ───────────── SEO ─────────────

function Counted({ name, defaultValue, max, placeholder, area }: { name: string; defaultValue: string; max: number; placeholder: string; area?: boolean }) {
  const [n, setN] = useState(defaultValue.length);
  const props = { name, defaultValue, placeholder, maxLength: max, onChange: (e: { target: { value: string } }) => setN(e.target.value.length) };
  return (
    <div className="adm-counted">
      {area ? <textarea rows={2} {...props} /> : <input type="text" {...props} />}
      <small className={n > max - 10 ? 'warn' : undefined}>
        {n}/{max}
      </small>
    </div>
  );
}

export function SeoForm({ pages, seo }: { pages: { path: string; label: string }[]; seo: Record<string, SeoEntry> }) {
  return (
    <CmsForm action={saveSeo}>
      <p className="adm-muted" style={{ marginTop: 0 }}>
        What Google shows for each page. Leave a box empty to keep the built-in text. Titles about 50–60 characters, descriptions 140–160.
      </p>
      <div className="adm-seo">
        {pages.map((p) => (
          <div key={p.path} className="adm-seo-row">
            <div>
              <b>{p.label}</b>
              <small className="adm-muted">{p.path}</small>
            </div>
            <Counted name={`t:${p.path}`} defaultValue={seo[p.path]?.title ?? ''} max={70} placeholder="Page title (built-in text used if empty)" />
            <Counted name={`d:${p.path}`} defaultValue={seo[p.path]?.description ?? ''} max={170} placeholder="Description" area />
          </div>
        ))}
      </div>
    </CmsForm>
  );
}

// ───────────── terms / privacy ─────────────

export function LegalForm({ slug, page, path }: { slug: string; page: LegalPage; path: string }) {
  return (
    <CmsForm action={saveLegalPage}>
      <input type="hidden" name="slug" value={slug} />
      <div className="adm-sec-head">
        <h2>{page.title}</h2>
        <a href={path} target="_blank" rel="noopener" className="adm-link">
          View page ↗
        </a>
      </div>
      <label className="adm-field wide">
        Title
        <input type="text" name="title" defaultValue={page.title} />
      </label>
      <label className="adm-field wide" style={{ marginTop: 12 }}>
        Text
        <textarea name="body" rows={16} defaultValue={page.body} placeholder={'## 1. About us\n\nGearUp Motorcycles Ltd is…\n\n## 2. Reserving a bike\n\n…'} />
        <small className="adm-muted">
          Leave a blank line between paragraphs. Start a line with ## for a heading. Links: [text](https://example.com). Until text is added, the page shows a short
          “being updated” note and Google is told not to list it.
        </small>
      </label>
    </CmsForm>
  );
}

// ───────────── FAQs ─────────────

type FaqRow = { id: string; question: string; answer: string; active: boolean };

export function FaqManager({ section, faqs }: { section: string; faqs: FaqRow[] }) {
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [pending, run] = useRun();
  const close = () => setEditing(null);

  const form = (f?: FaqRow) => (
    <CmsForm action={saveFaq} className="adm-inlineform" onSaved={close} submit={f ? 'Save' : 'Add question'}>
      <input type="hidden" name="section" value={section} />
      {f && <input type="hidden" name="id" value={f.id} />}
      <label className="adm-field wide">
        Question
        <input type="text" name="question" defaultValue={f?.question} autoFocus />
      </label>
      <label className="adm-field wide">
        Answer
        <textarea name="answer" rows={4} defaultValue={f?.answer} />
        <small className="adm-muted">Link to a page with [text](/page), e.g. [warranty](/warranty).</small>
      </label>
      <button type="button" className="adm-link-btn dark" onClick={close}>
        Cancel
      </button>
    </CmsForm>
  );

  return (
    <section className="adm-card adm-sec">
      <div className="adm-sec-head">
        <h2>
          Questions <span className="adm-count">{faqs.length}</span>
        </h2>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setEditing('new')}>
          + Add question
        </button>
      </div>
      {editing === 'new' && form()}
      <ol className={`adm-faqs ${pending ? 'is-busy' : ''}`}>
        {faqs.map((f, i) =>
          editing === f.id ? (
            <li key={f.id}>{form(f)}</li>
          ) : (
            <li key={f.id} className={f.active ? undefined : 'is-off'}>
              <div>
                <b>{f.question}</b>
                <p>{f.answer}</p>
                {!f.active && <span className="adm-pill">Hidden</span>}
              </div>
              <div className="adm-photo-acts">
                <button type="button" disabled={i === 0} onClick={() => run(() => moveFaq(f.id, -1))} aria-label="Move up">
                  ↑
                </button>
                <button type="button" disabled={i === faqs.length - 1} onClick={() => run(() => moveFaq(f.id, 1))} aria-label="Move down">
                  ↓
                </button>
                <button type="button" onClick={() => setEditing(f.id)}>
                  Edit
                </button>
                <button type="button" onClick={() => run(() => setFaqActive(f.id, !f.active))}>
                  {f.active ? 'Hide' : 'Show'}
                </button>
                <ConfirmDelete onConfirm={() => run(() => deleteFaq(f.id))} />
              </div>
            </li>
          ),
        )}
      </ol>
      {!faqs.length && editing !== 'new' && <p className="adm-muted">No questions in this section yet.</p>}
    </section>
  );
}

// ───────────── reviews ─────────────

type ReviewRow = { id: string; author: string; rating: number; body: string; source: string; date: string; featured: boolean; active: boolean };

export function ReviewManager({ reviews }: { reviews: ReviewRow[] }) {
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [pending, run] = useRun();
  const close = () => setEditing(null);

  const form = (r?: ReviewRow) => (
    <CmsForm action={saveReview} className="adm-inlineform" onSaved={close} submit={r ? 'Save' : 'Add review'}>
      {r && <input type="hidden" name="id" value={r.id} />}
      <div className="adm-grid">
        <label className="adm-field">
          Name
          <input type="text" name="author" defaultValue={r?.author} placeholder="e.g. David L." autoFocus />
        </label>
        <label className="adm-field">
          Stars
          <select name="rating" defaultValue={r?.rating ?? 5}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="adm-field">
          Date
          <input type="date" name="date" defaultValue={r?.date} />
        </label>
        <label className="adm-field">
          Source
          <input type="text" name="source" defaultValue={r?.source ?? 'Trustpilot'} />
        </label>
      </div>
      <label className="adm-field wide">
        Review
        <textarea name="body" rows={4} defaultValue={r?.body} />
      </label>
      <label className="adm-check">
        <input type="checkbox" name="featured" defaultChecked={r?.featured} /> Show first (big quote on the home page)
      </label>
      <button type="button" className="adm-link-btn dark" onClick={close}>
        Cancel
      </button>
    </CmsForm>
  );

  return (
    <section className="adm-card adm-sec">
      <div className="adm-sec-head">
        <div>
          <h2>
            Reviews <span className="adm-count">{reviews.length}</span>
          </h2>
          <p className="adm-muted">The home page shows the first three that are switched on, featured first, then newest.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setEditing('new')}>
          + Add review
        </button>
      </div>
      {editing === 'new' && form()}
      <ol className={`adm-faqs ${pending ? 'is-busy' : ''}`}>
        {reviews.map((r) =>
          editing === r.id ? (
            <li key={r.id}>{form(r)}</li>
          ) : (
            <li key={r.id} className={r.active ? undefined : 'is-off'}>
              <div>
                <b>
                  {'★'.repeat(r.rating)} {r.author} · {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {r.source}
                </b>
                <p>{r.body}</p>
                {r.featured && <span className="adm-pill s-available">Featured</span>} {!r.active && <span className="adm-pill">Hidden</span>}
              </div>
              <div className="adm-photo-acts">
                <button type="button" onClick={() => setEditing(r.id)}>
                  Edit
                </button>
                <button type="button" onClick={() => run(() => setReviewActive(r.id, !r.active))}>
                  {r.active ? 'Hide' : 'Show'}
                </button>
                <ConfirmDelete onConfirm={() => run(() => deleteReview(r.id))} />
              </div>
            </li>
          ),
        )}
      </ol>
    </section>
  );
}

// ───────────── home hero slides ─────────────

type SlideRow = { id: string; title: string; subtitle: string | null; imageUrl: string | null; linkUrl: string | null; active: boolean; startsAt: string; endsAt: string };

function SlideImage({ defaultValue }: { defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [busy, setBusy] = useState('');
  const input = useRef<HTMLInputElement>(null);
  async function onFile(file?: File) {
    if (!file) return;
    setBusy('Uploading…');
    try {
      const small = file.type === 'image/png' ? file : await resizeImage(file, 1600, 0.9);
      const safe = small.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const blob = await upload(`cms/hero/${safe}`, small, { access: 'public', handleUploadUrl: '/api/admin/upload' });
      setUrl(blob.url);
      setBusy('');
    } catch (e) {
      setBusy(e instanceof Error ? e.message : 'Upload failed');
    }
  }
  return (
    <div className="adm-field">
      Bike picture
      <input type="hidden" name="imageUrl" value={url} />
      <div className="adm-slideimg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {url ? <img src={url} alt="" /> : <span className="adm-muted">No picture</span>}
        <label className="adm-btn adm-btn-sm adm-btn-line">
          {busy || (url ? 'Change' : 'Upload')}
          <input ref={input} type="file" accept="image/png,image/webp,image/jpeg" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
      <small className="adm-muted">Best: a cut-out of the bike on a transparent background (PNG or WebP), about 1600 px wide.</small>
    </div>
  );
}

export function HeroManager({ slides, bikes }: { slides: SlideRow[]; bikes: { slug: string; name: string }[] }) {
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [pending, run] = useRun();
  const close = () => setEditing(null);

  const form = (sl?: SlideRow) => (
    <CmsForm action={saveHeroSlide} className="adm-inlineform" onSaved={close} submit={sl ? 'Save' : 'Add slide'}>
      {sl && <input type="hidden" name="id" value={sl.id} />}
      <div className="adm-grid">
        <SlideImage defaultValue={sl?.imageUrl} />
        <div className="adm-field" style={{ gap: 12 }}>
          <label className="adm-field">
            Bike name
            <input type="text" name="title" defaultValue={sl?.title} placeholder="2019 BMW R 1250 GS" />
          </label>
          <label className="adm-field">
            Small label above
            <input type="text" name="subtitle" defaultValue={sl?.subtitle ?? ''} placeholder="Adventure" />
          </label>
          <label className="adm-field">
            Links to
            <input type="text" name="linkUrl" list="hero-bikes" defaultValue={sl?.linkUrl ?? '/used-bikes'} />
            <datalist id="hero-bikes">
              <option value="/used-bikes">All motorbikes</option>
              {bikes.map((b) => (
                <option key={b.slug} value={`/used-bikes/${b.slug}`}>
                  {b.name}
                </option>
              ))}
            </datalist>
            <small className="adm-muted">Link it to a bike in stock and its live price shows on the slide.</small>
          </label>
          <div className="adm-inline">
            <label className="adm-field">
              Show from (optional)
              <input type="date" name="startsAt" defaultValue={sl?.startsAt} />
            </label>
            <label className="adm-field">
              Until (optional)
              <input type="date" name="endsAt" defaultValue={sl?.endsAt} />
            </label>
          </div>
        </div>
      </div>
      <button type="button" className="adm-link-btn dark" onClick={close}>
        Cancel
      </button>
    </CmsForm>
  );

  return (
    <section className="adm-card adm-sec">
      <div className="adm-sec-head">
        <div>
          <h2>
            Home page hero <span className="adm-count">{slides.length}</span>
          </h2>
          <p className="adm-muted">The rotating bikes at the top of the home page, in this order.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setEditing('new')}>
          + Add slide
        </button>
      </div>
      {editing === 'new' && form()}
      <ol className={`adm-faqs adm-slides ${pending ? 'is-busy' : ''}`}>
        {slides.map((sl, i) =>
          editing === sl.id ? (
            <li key={sl.id}>{form(sl)}</li>
          ) : (
            <li key={sl.id} className={sl.active ? undefined : 'is-off'}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {sl.imageUrl && <img src={sl.imageUrl} alt="" className="adm-slidethumb" />}
              <div>
                <b>{sl.title}</b>
                <p>
                  {sl.subtitle} · {sl.linkUrl}
                  {(sl.startsAt || sl.endsAt) && ` · ${sl.startsAt || '…'} to ${sl.endsAt || '…'}`}
                </p>
                {!sl.active && <span className="adm-pill">Hidden</span>}
              </div>
              <div className="adm-photo-acts">
                <button type="button" disabled={i === 0} onClick={() => run(() => moveBanner(sl.id, -1))} aria-label="Move up">
                  ↑
                </button>
                <button type="button" disabled={i === slides.length - 1} onClick={() => run(() => moveBanner(sl.id, 1))} aria-label="Move down">
                  ↓
                </button>
                <button type="button" onClick={() => setEditing(sl.id)}>
                  Edit
                </button>
                <button type="button" onClick={() => run(() => setBannerActive(sl.id, !sl.active))}>
                  {sl.active ? 'Hide' : 'Show'}
                </button>
                <ConfirmDelete onConfirm={() => run(() => deleteBanner(sl.id))} />
              </div>
            </li>
          ),
        )}
      </ol>
    </section>
  );
}
