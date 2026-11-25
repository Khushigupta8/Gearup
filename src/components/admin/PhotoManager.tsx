'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { useRef, useState, useSyncExternalStore, useTransition } from 'react';
import { addPhotos, addPromosToBike, deletePhoto, movePhoto, updatePhotoCaption } from '@/app/admin/(panel)/stock/bike-actions';
import { DocCleanup } from '@/components/admin/DocCleanup';
import { PromoPicker } from '@/components/admin/PromoPicker';
import { PHOTO_MAX_SIDE } from '@/lib/media-guide';
import { applyFrame } from '@/lib/photo-tools';
import { resizeImage } from '@/lib/resize-image';

/** Remembers the staff member's last choice for the frame / clean-up ticks on this device. */
const prefListeners = new Set<() => void>();
function usePref(key: string, initial: boolean) {
  const read = () => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : saved === '1';
    } catch {
      return initial;
    }
  };
  const v = useSyncExternalStore(
    (cb) => {
      prefListeners.add(cb);
      return () => prefListeners.delete(cb);
    },
    read,
    () => initial,
  );
  const set = (next: boolean) => {
    try {
      localStorage.setItem(key, next ? '1' : '0');
    } catch {}
    prefListeners.forEach((cb) => cb());
  };
  return [v, set] as const;
}

type Kind = 'main' | 'detail' | 'receipt';
export type AdminPhoto = { id: string; url: string; caption: string | null };

const copy: Record<Kind, { title: string; hint: string; captionHint: string; maxSide: number }> = {
  main: {
    title: 'Main photos',
    hint: 'The good shots for the gallery. The first photo is the listing picture.',
    captionHint: 'e.g. Side view',
    maxSide: PHOTO_MAX_SIDE.main,
  },
  detail: {
    title: 'Detailed pictures',
    hint: 'Close-ups of every mark, scratch and sign of wear. Shown in their own section on the bike page.',
    captionHint: 'e.g. Light scuff on left pannier',
    maxSide: PHOTO_MAX_SIDE.detail,
  },
  receipt: {
    title: 'Receipts & invoices',
    hint: 'Service receipts and invoices. Shown under History so buyers can read them.',
    captionHint: 'e.g. Service at 18,500 miles, Sep 2026',
    maxSide: PHOTO_MAX_SIDE.receipt,
  },
};

export function PhotoManager({ bikeId, kind, photos }: { bikeId: string; kind: Kind; photos: AdminPhoto[] }) {
  const c = copy[kind];
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [frame, setFrame] = usePref('gu-frame-main', true);
  const [cleanup, setCleanup] = usePref('gu-clean-docs', true);
  const [toClean, setToClean] = useState<File[] | null>(null);
  const [picker, setPicker] = useState(false);

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError('');
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (input.current) input.current.value = '';
    if (!list.length) return;
    if (list.length > 40) return setError('Choose up to 40 photos at a time.');
    if (kind === 'receipt' && cleanup) setToClean(list);
    else void uploadFiles(list, false);
  }

  /** ready = already processed (cleaned documents): upload as they are. */
  async function uploadFiles(list: File[], ready: boolean) {
    const done: { url: string; caption: string }[] = [];
    let uploadError = '';
    try {
      for (const [i, file] of list.entries()) {
        setProgress(`Uploading ${i + 1} of ${list.length}…`);
        const small = ready
          ? file
          : kind === 'main' && frame
            ? await applyFrame(file, c.maxSide)
            : await resizeImage(file, c.maxSide);
        const safe = small.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
        const blob = await upload(`bikes/${bikeId}/${kind}/${safe}`, small, { access: 'public', handleUploadUrl: '/api/admin/upload' });
        done.push({ url: blob.url, caption: '' });
      }
    } catch (e) {
      uploadError = e instanceof Error ? e.message : 'Upload failed. Try again.';
    }
    // Save successful uploads once, even when a later file failed. Never repeat a failed
    // save automatically: the first request may have committed before the connection dropped.
    try {
      if (done.length) {
        setProgress('Saving…');
        await addPhotos(bikeId, kind, done);
      }
      if (uploadError) setError(uploadError);
    } catch {
      setError('The photos uploaded, but we could not confirm they were saved. Refresh the bike before uploading them again.');
    } finally {
      router.refresh();
      setProgress('');
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
            {c.title} <span className="adm-count">{photos.length}</span>
          </h2>
          <p className="adm-muted">{c.hint}</p>
        </div>
        <div className="adm-sec-acts">
          {kind === 'main' && (
            <button type="button" className="adm-btn adm-btn-sm adm-btn-line" disabled={!!progress} onClick={() => setPicker(true)}>
              + From promo library
            </button>
          )}
          <label className={`adm-btn adm-btn-sm ${progress ? 'is-disabled' : ''}`}>
            {progress || '+ Add photos'}
            <input ref={input} type="file" accept="image/*" multiple hidden disabled={!!progress} onChange={(e) => onFiles(e.target.files)} />
          </label>
        </div>
      </div>
      {kind === 'main' && (
        <label className="adm-check adm-opt">
          <input type="checkbox" checked={frame} onChange={(e) => setFrame(e.target.checked)} />
          <span>
            <b>Add GearUp frame</b> to new photos (logo top right, “Nationwide delivery / Apply now for finance” bar along the bottom). Photos are
            saved 4:3.
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brand/photo-frame.png" alt="" className="adm-frame-prev" />
        </label>
      )}
      {kind === 'receipt' && (
        <label className="adm-check adm-opt">
          <input type="checkbox" checked={cleanup} onChange={(e) => setCleanup(e.target.checked)} />
          <span>
            <b>Clean up documents</b> before upload: finds the page, removes the background, straightens it and whitens the paper. You can adjust the
            corners and rotate before it uploads.
          </span>
        </label>
      )}
      {toClean && (
        <DocCleanup
          files={toClean}
          maxSide={c.maxSide}
          onCancel={() => setToClean(null)}
          onDone={(cleaned) => {
            setToClean(null);
            // Cleaned files are already sized; originals kept with "skip" still need shrinking.
            void (async () => {
              const ready = await Promise.all(
                cleaned.map((f) => (toClean.includes(f) ? resizeImage(f, c.maxSide) : Promise.resolve(f))),
              );
              await uploadFiles(ready, true);
            })();
          }}
        />
      )}
      {picker && (
        <PromoPicker
          onCancel={() => setPicker(false)}
          onPick={(ids) =>
            startTransition(async () => {
              setPicker(false);
              await addPromosToBike(bikeId, ids);
              router.refresh();
            })
          }
        />
      )}
      {error && <p className="adm-err">{error}</p>}
      {photos.length === 0 ? (
        <button type="button" className="adm-drop" onClick={() => input.current?.click()} disabled={!!progress}>
          No photos yet. Click to choose photos (you can pick several at once).
        </button>
      ) : (
        <ul className={`adm-photos ${kind === 'receipt' ? 'receipts' : ''} ${pending ? 'is-busy' : ''}`}>
          {photos.map((p, i) => (
            <li key={p.id}>
              <a href={p.url} target="_blank" rel="noopener" className="adm-photo-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" loading="lazy" />
                {kind === 'main' && i === 0 && <span className="adm-tag">Listing photo</span>}
              </a>
              <input
                className="adm-caption"
                defaultValue={p.caption ?? ''}
                placeholder={c.captionHint}
                aria-label="Caption"
                onBlur={(e) => {
                  if (e.target.value !== (p.caption ?? '')) run(() => updatePhotoCaption(p.id, e.target.value));
                }}
              />
              <div className="adm-photo-acts">
                <button type="button" onClick={() => run(() => movePhoto(p.id, -1))} disabled={i === 0} aria-label="Move earlier">
                  ←
                </button>
                <button type="button" onClick={() => run(() => movePhoto(p.id, 1))} disabled={i === photos.length - 1} aria-label="Move later">
                  →
                </button>
                {confirmId === p.id ? (
                  <button type="button" className="danger" onClick={() => run(() => deletePhoto(p.id))}>
                    Confirm delete
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
