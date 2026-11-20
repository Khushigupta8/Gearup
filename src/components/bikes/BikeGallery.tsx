'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Lightbox, type LightboxItem } from '@/components/bikes/Lightbox';

type Photo = { src: string; label: string };

/** Seconds each photo shows before the gallery moves on by itself (client, 19 Nov). */
const AUTOPLAY_MS = 7000;

/**
 * Bike page gallery: main photo, prev/next, counter and a scrollable thumbnail strip.
 * Moves on every 7 seconds; pauses while the customer is on (or pressing) the gallery and
 * while the full-screen viewer is open. Tapping the main photo opens it full size.
 */
export function BikeGallery({ photos, alt, badge, video }: { photos: Photo[]; alt: string; badge?: ReactNode; video?: string | null }) {
  const [cur, setCur] = useState(0);
  const [hold, setHold] = useState(false);
  const [viewer, setViewer] = useState<number | null>(null);
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

  // Autoplay: restart the 7s timer whenever the photo changes, so a manual step gets a full 7s too.
  useEffect(() => {
    if (photos.length < 2 || hold || viewer !== null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => {
      if (!document.hidden) show(curRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [cur, hold, viewer, photos.length, show]);

  const items: LightboxItem[] = [
    ...photos.map((p) => ({ src: p.src, label: p.label })),
    ...(video ? [{ src: video, label: 'Walkaround video', video: true }] : []),
  ];
  const closeViewer = (i: number | null) => {
    // Keep the gallery on whichever photo the customer was looking at full size.
    if (i === null && viewer !== null && viewer < photos.length && viewer !== curRef.current) show(viewer);
    setViewer(i);
  };

  const scrollBy = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <div
      className="gal"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHold(false)}
      onPointerDown={() => setHold(true)}
      onPointerUp={(e) => e.pointerType !== 'mouse' && setHold(false)}
      onPointerCancel={() => setHold(false)}
    >
      <div className="gal-main">
        <button type="button" className="gal-open" aria-label="View photo full size" onClick={() => setViewer(curRef.current)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mainSrc} alt={`${alt}, ${photos[cur]?.label.toLowerCase()}`} className={fading ? 'fade' : undefined} />
          <span className="gal-zoom" aria-hidden="true">
            <Icon name="search" />
          </span>
        </button>
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
          {video && (
            <button type="button" className="tb vid" aria-label="Play walkaround video" onClick={() => setViewer(photos.length)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0]?.src} alt="" loading="lazy" />
              <Icon name="play" />
              <span>Video</span>
            </button>
          )}
        </div>
        <button type="button" className="ts-nav r" aria-label="Scroll photos right" disabled={edges.end} onClick={() => scrollBy(1)}>
          <Icon name="right" />
        </button>
      </div>
      <Lightbox items={items} index={viewer} onChange={closeViewer} />
    </div>
  );
}
