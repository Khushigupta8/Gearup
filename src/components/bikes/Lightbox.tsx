'use client';

import { useCallback, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

export type LightboxItem = { src: string; label: string; video?: boolean };

/** YouTube / Vimeo links play in an iframe; anything else is treated as a video file. */
function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return null;
}

/** Full-screen viewer for photos (and the walkaround video). Esc closes, arrow keys step. */
export function Lightbox({ items, index, onChange }: { items: LightboxItem[]; index: number | null; onChange: (i: number | null) => void }) {
  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, step, onChange]);

  const current = index === null ? null : items[index];
  if (!current || index === null) return null;
  const embed = current.video ? embedUrl(current.src) : null;

  return (
    <div className="lbox" role="dialog" aria-modal="true" aria-label={current.label} onClick={() => onChange(null)}>
      <figure onClick={(e) => e.stopPropagation()} className={current.video ? 'is-video' : undefined}>
        {current.video ? (
          embed ? (
            <iframe src={embed} title={current.label} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          ) : (
            <video src={current.src} controls autoPlay playsInline preload="metadata" />
          )
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.src} alt={current.label} />
        )}
        <figcaption>
          <span>{current.label}</span>
          <span>
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
      <button type="button" className="lb-close" aria-label="Close" onClick={() => onChange(null)}>
        <Icon name="x" />
      </button>
      {items.length > 1 && (
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
  );
}
