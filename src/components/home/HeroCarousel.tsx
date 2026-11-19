'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export type HeroSlide = { href: string; image: string; name: string; kicker: string; price: string; monthly: string };

/** Home hero: bike cut-outs that rotate every 2s, pause on hover, and stop for reduced-motion users. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [cur, setCur] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const stop = useCallback(() => window.clearInterval(timer.current), []);
  const start = useCallback(() => {
    stop();
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = window.setInterval(() => setCur((c) => (c + 1) % slides.length), 2000);
  }, [slides.length, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <div className="stage hstage" aria-roledescription="carousel" aria-label="Bikes in stock" onMouseEnter={stop} onMouseLeave={start}>
      {slides.map((s, i) => (
        <Link key={s.name} href={s.href} className={i === cur ? 'hslide on' : 'hslide'} aria-hidden={i !== cur} tabIndex={i === cur ? undefined : -1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.image} alt={s.name} loading={i === 0 ? undefined : 'lazy'} />
          <span className="spot">
            <small>{s.kicker}</small>
            <strong>{s.name}</strong>
            <span className="pp">
              <b>{s.price}</b>
              <span>or {s.monthly}/mo</span>
            </span>
          </span>
        </Link>
      ))}
      <div className="sticker">
        <b>3</b>
        <i>
          Months free
          <br />
          warranty
        </i>
      </div>
      <div className="hdots">
        {slides.map((s, i) => (
          <button
            key={s.name}
            type="button"
            aria-label={`Show bike ${i + 1}`}
            className={i === cur ? 'on' : undefined}
            onClick={() => {
              setCur(i);
              start();
            }}
          />
        ))}
      </div>
    </div>
  );
}
