'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { addPromoAssets, deletePromo, movePromo, updatePromo } from '@/app/admin/(panel)/promos/actions';
import { PHOTO_MAX_SIDE } from '@/lib/media-guide';
import { resizeImage } from '@/lib/resize-image';

type Promo = { id: string; title: string; url: string; active: boolean; uses: number };

const titleFromFile = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+\s*[-_.]\s*/, '')
    .replace(/[-_]+/g, ' ')
    .trim() || 'Promo banner';

export function PromoLibrary({ promos }: { promos: Promo[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError('');
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const done: { url: string; title: string; width?: number; height?: number }[] = [];
    try {
      for (const [i, file] of list.entries()) {
        setProgress(`Uploading ${i + 1} of ${list.length}…`);
        const small = await resizeImage(file, PHOTO_MAX_SIDE.promo, 0.9);
        const bmp = await createImageBitmap(small);
        const safe = small.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
        const blob = await upload(`promos/${safe}`, small, { access: 'public', handleUploadUrl: '/api/admin/upload' });
        done.push({ url: blob.url, title: titleFromFile(file.name), width: bmp.width, height: bmp.height });
        bmp.close();
      }
      setProgress('Saving…');
      await addPromoAssets(done);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed. Try again.');
      if (done.length) await addPromoAssets(done);
    } finally {
      setProgress('');
      if (input.current) input.current.value = '';
      router.refresh();
    }
  }

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <section className="adm-card adm-sec">
      <div className="adm-sec-head">
        <div>
          <h2>
            Banners <span className="adm-count">{promos.length}</span>
          </h2>
          <p className="adm-muted">Hidden banners stay on bikes that already use them but don&apos;t show in the picker.</p>
        </div>
        <label className={`adm-btn adm-btn-sm ${progress ? 'is-disabled' : ''}`}>
          {progress || '+ Upload banners'}
          <input ref={input} type="file" accept="image/*" multiple hidden disabled={!!progress} onChange={(e) => onFiles(e.target.files)} />
        </label>
      </div>
      {error && <p className="adm-err">{error}</p>}
      {promos.length === 0 ? (
        <button type="button" className="adm-drop" onClick={() => input.current?.click()} disabled={!!progress}>
          No banners yet. Click to upload (you can pick several at once).
        </button>
      ) : (
        <ul className={`adm-photos adm-promos ${pending ? 'is-busy' : ''}`}>
          {promos.map((p, i) => (
            <li key={p.id} className={p.active ? undefined : 'is-off'}>
              <a href={p.url} target="_blank" rel="noopener" className="adm-photo-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" loading="lazy" />
                {!p.active && <span className="adm-tag dark">Hidden</span>}
              </a>
              <input
                className="adm-caption"
                defaultValue={p.title}
                aria-label="Banner name"
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== p.title) run(() => updatePromo(p.id, { title: v }));
                }}
              />
              <small className="adm-muted">{p.uses ? `On ${p.uses} bike${p.uses === 1 ? '' : 's'}` : 'Not used yet'}</small>
              <div className="adm-photo-acts">
                <button type="button" onClick={() => run(() => movePromo(p.id, -1))} disabled={i === 0} aria-label="Move earlier">
                  ←
                </button>
                <button type="button" onClick={() => run(() => movePromo(p.id, 1))} disabled={i === promos.length - 1} aria-label="Move later">
                  →
                </button>
                <button type="button" onClick={() => run(() => updatePromo(p.id, { active: !p.active }))}>
                  {p.active ? 'Hide' : 'Show'}
                </button>
                {confirmId === p.id ? (
                  <button type="button" className="danger" onClick={() => run(() => deletePromo(p.id))}>
                    Confirm
                  </button>
                ) : (
                  <button type="button" onClick={() => setConfirmId(p.id)}>
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
