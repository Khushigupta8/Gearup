'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Photo } from '@/types';

/**
 * Thumbnail grid that opens a full-screen viewer. Used for the bike's detailed (damage) photos
 * and for receipt scans in the History tab.
 */
export function PhotoGrid({ photos, kind = 'photo' }: { photos: Photo[]; kind?: 'photo' | 'receipt' }) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback((dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <div className={kind === 'receipt' ? 'pgrid receipts' : 'pgrid'}>
        {photos.map((p, i) => (
          <button key={`${p.src}-${i}`} type="button" className="pg-item" onClick={() => setOpen(i)} aria-label={`Open ${p.label}`}>
            <span className="pg-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" loading="lazy" />
              <span className="pg-zoom">
                <Icon name="search" />
              </span>
            </span>
            <span className="pg-cap">{p.label}</span>
          </button>
        ))}
      </div>

      {current && open !== null && (
        <div className="lbox" role="dialog" aria-modal="true" aria-label={current.label} onClick={() => setOpen(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.label} />
            <figcaption>
              <span>{current.label}</span>
              <span>
                {open + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
          <button type="button" className="lb-close" aria-label="Close" onClick={() => setOpen(null)}>
            <Icon name="x" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="lb-nav l"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                <Icon name="left" />
              </button>
              <button
                type="button"
                className="lb-nav r"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                <Icon name="right" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
