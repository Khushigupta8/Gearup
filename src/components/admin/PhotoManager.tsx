'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { addPhotos, deletePhoto, movePhoto, updatePhotoCaption } from '@/app/admin/(panel)/stock/bike-actions';
import { resizeImage } from '@/lib/resize-image';

type Kind = 'main' | 'detail' | 'receipt';
export type AdminPhoto = { id: string; url: string; caption: string | null };

const copy: Record<Kind, { title: string; hint: string; captionHint: string; maxSide: number }> = {
  main: {
    title: 'Main photos',
    hint: 'The good shots for the gallery. The first photo is the listing picture.',
    captionHint: 'e.g. Side view',
    maxSide: 2000,
  },
  detail: {
    title: 'Detailed pictures',
    hint: 'Close-ups of every mark, scratch and sign of wear. Shown in their own section on the bike page.',
    captionHint: 'e.g. Light scuff on left pannier',
    maxSide: 2000,
  },
  receipt: {
    title: 'Receipts & invoices',
    hint: 'Service receipts and invoices. Shown under History so buyers can read them.',
    captionHint: 'e.g. Service at 18,500 miles, Sep 2026',
    maxSide: 2400,
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

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError('');
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const done: { url: string; caption: string }[] = [];
    try {
      for (const [i, file] of list.entries()) {
        setProgress(`Uploading ${i + 1} of ${list.length}…`);
        const small = await resizeImage(file, c.maxSide);
        const safe = small.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
        const blob = await upload(`bikes/${bikeId}/${kind}/${safe}`, small, { access: 'public', handleUploadUrl: '/api/admin/upload' });
        done.push({ url: blob.url, caption: '' });
      }
      setProgress('Saving…');
      await addPhotos(bikeId, kind, done);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed. Try again.');
      if (done.length) await addPhotos(bikeId, kind, done); // keep what did upload
      router.refresh();
    } finally {
      setProgress('');
      if (input.current) input.current.value = '';
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
        <label className={`adm-btn adm-btn-sm ${progress ? 'is-disabled' : ''}`}>
          {progress || '+ Add photos'}
          <input ref={input} type="file" accept="image/*" multiple hidden disabled={!!progress} onChange={(e) => onFiles(e.target.files)} />
        </label>
      </div>
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
