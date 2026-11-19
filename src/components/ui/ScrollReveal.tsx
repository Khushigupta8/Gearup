'use client';

import { useEffect } from 'react';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Fades matching elements in as they scroll into view (CSS: .rv / .rv.in).
 * Content stays visible without JS and for reduced-motion users.
 */
export function ScrollReveal({ selector }: { selector: string }) {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || reducedMotion()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    els.forEach((el, i) => {
      el.classList.add('rv');
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.classList.add('in');
          io.unobserve(el);
          timers.push(
            window.setTimeout(() => {
              el.style.transitionDelay = '';
              el.classList.remove('rv', 'in');
            }, 900),
          );
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      els.forEach((el) => {
        el.classList.remove('rv', 'in');
        el.style.transitionDelay = '';
      });
    };
  }, [selector]);

  return null;
}

/** "Shop by style": bikes ride in once when the grid scrolls into view. */
export function RideIn({ selector }: { selector: string }) {
  useEffect(() => {
    const g = document.querySelector<HTMLElement>(selector);
    if (!g || !('IntersectionObserver' in window) || reducedMotion()) return;
    g.classList.add('ridein');
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        g.classList.add('go');
        timer = window.setTimeout(() => g.classList.remove('ridein', 'go'), 1700);
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    io.observe(g);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      g.classList.remove('ridein', 'go');
    };
  }, [selector]);

  return null;
}
