'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listActivePromos } from '@/app/admin/(panel)/promos/actions';

type Promo = { id: string; title: string; url: string };

/** Pick banners from the promo library to add to a bike's main photos. */
export function PromoPicker({ onPick, onCancel }: { onPick: (ids: string[]) => void; onCancel: () => void }) {
  const [promos, setPromos] = useState<Promo[] | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);

  useEffect(() => {
    listActivePromos()
      .then(setPromos)
      .catch(() => setPromos([]));
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label="Promo library" onClick={onCancel}>
      <div className="adm-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="adm-modal-head">
          <div>
            <h2>Add from promo library</h2>
            <p className="adm-muted">Tick the banners to add. They go at the end of this bike&apos;s photos; use the arrows to move them.</p>
          </div>
          <button type="button" className="adm-x" aria-label="Close" onClick={onCancel}>
            ×
          </button>
        </header>
        {promos === null ? (
          <p className="adm-muted">Loading…</p>
        ) : promos.length === 0 ? (
          <p className="adm-muted">
            The library is empty.{' '}
            <Link href="/admin/promos" className="adm-link">
              Upload banners →
            </Link>
          </p>
        ) : (
          <ul className="adm-pick">
            {promos.map((p) => {
              const n = chosen.indexOf(p.id);
              return (
                <li key={p.id}>
                  <button type="button" className={n >= 0 ? 'on' : undefined} aria-pressed={n >= 0} onClick={() => toggle(p.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="" loading="lazy" />
                    {n >= 0 && <span className="adm-pick-n">{n + 1}</span>}
                    <span className="adm-pick-t">{p.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <footer className="adm-modal-foot">
          <Link href="/admin/promos" className="adm-link" target="_blank">
            Manage library ↗
          </Link>
          <button type="button" className="adm-btn adm-btn-red" disabled={!chosen.length} onClick={() => onPick(chosen)}>
            Add {chosen.length || ''} banner{chosen.length === 1 ? '' : 's'}
          </button>
        </footer>
      </div>
    </div>
  );
}
