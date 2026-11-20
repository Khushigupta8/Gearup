'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Lightbox } from '@/components/bikes/Lightbox';
import type { Photo } from '@/types';

/**
 * Thumbnail grid that opens a full-screen viewer. Used for the bike's detailed (damage) photos
 * and for receipt scans in the History tab.
 */
export function PhotoGrid({ photos, kind = 'photo' }: { photos: Photo[]; kind?: 'photo' | 'receipt' }) {
  const [open, setOpen] = useState<number | null>(null);

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
      <Lightbox items={photos} index={open} onChange={setOpen} />
    </>
  );
}
