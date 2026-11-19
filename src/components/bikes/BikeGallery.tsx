'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

type Photo = { src: string; label: string };

/** Bike page gallery: main photo, prev/next, counter and a scrollable thumbnail strip. */
export function BikeGallery({ photos, alt, badge }: { photos: Photo[]; alt: string; badge?: ReactNode }) {
  const [cur, setCur] = useState(0);
  const curRef = useRef(0);
  const [mainSrc, setMainSrc] = useState(photos[0]?.src);
  const [fading, setFading] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: true });
  const track = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  const show = useCallback(
    (i: number) => {
      const next = (i + photos.length) % photos.length;
      curRef.current = next;
      setCur(next);
      setFading(true);
      window.setTimeout(() => {
        setMainSrc(photos[next].src);
        setFading(false);
      }, 120);
      const t = track.current;
      const b = thumbs.current[next];
      if (t && b) {
        const left = b.offsetLeft - t.offsetLeft;
        if (left < t.scrollLeft || left + b.offsetWidth > t.scrollLeft + t.clientWidth) {
          t.scrollTo({ left: left - b.offsetWidth, behavior: 'smooth' });
        }
      }
    },
    [photos],
  );

  const updateEdges = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setEdges({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    updateEdges();
    window.addEventListener('resize', updateEdges);
    // Vertical mouse wheel scrolls the strip sideways (needs a non-passive listener).
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || t.scrollWidth <= t.clientWidth) return;
      const max = t.scrollWidth - t.clientWidth;
      if ((e.deltaY < 0 && t.scrollLeft > 0) || (e.deltaY > 0 && t.scrollLeft < max)) {
        e.preventDefault();
        t.scrollLeft += e.deltaY;
      }
    };
    t.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('resize', updateEdges);
      t.removeEventListener('wheel', onWheel);
    };
  }, [updateEdges]);

  const scrollBy = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <>
      <div className="gal-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mainSrc} alt={`${alt}, ${photos[cur]?.label.toLowerCase()}`} className={fading ? 'fade' : undefined} />
        {badge}
        <button type="button" className="gnav l" aria-label="Previous photo" onClick={() => show(curRef.current - 1)}>
          <Icon name="left" />
        </button>
        <button type="button" className="gnav r" aria-label="Next photo" onClick={() => show(curRef.current + 1)}>
          <Icon name="right" />
        </button>
        <span className="gcount">
          <svg className="i" style={{ width: 14, height: 14 }} aria-hidden="true">
            <use href="#i-cam" />
          </svg>
          <span>
            <b>{cur + 1}</b> / {photos.length} photos
          </span>
        </span>
      </div>
      <div className="tstrip">
        <button type="button" className="ts-nav l" aria-label="Scroll photos left" disabled={edges.start} onClick={() => scrollBy(-1)}>
          <Icon name="left" />
        </button>
        <div
          className="ts-track"
          tabIndex={0}
          aria-label="Bike photos"
          ref={track}
          onScroll={updateEdges}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              show(curRef.current + 1);
              e.preventDefault();
            }
            if (e.key === 'ArrowLeft') {
              show(curRef.current - 1);
              e.preventDefault();
            }
          }}
        >
          {photos.map((p, i) => (
            <button
              type="button"
              key={p.src + i}
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              className={i === cur ? 'tb on' : 'tb'}
              aria-label={`Photo ${i + 1}: ${p.label}`}
              onClick={() => show(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" loading="lazy" />
            </button>
          ))}
          <button type="button" className="tb vid" aria-label="Walkaround video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[photos.length - 1]?.src} alt="" loading="lazy" />
            <Icon name="play" />
            <span>Video</span>
          </button>
        </div>
        <button type="button" className="ts-nav r" aria-label="Scroll photos right" disabled={edges.end} onClick={() => scrollBy(1)}>
          <Icon name="right" />
        </button>
      </div>
    </>
  );
}
