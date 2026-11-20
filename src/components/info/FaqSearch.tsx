'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** FAQ page search: hides questions that don't match and opens the ones that do. */
export function FaqSearch() {
  const [q, setQ] = useState('');
  const [none, setNone] = useState(false);

  function run(value: string) {
    setQ(value);
    const term = value.trim().toLowerCase();
    let hits = 0;
    document.querySelectorAll<HTMLDetailsElement>('.fhub .fgrp details').forEach((d) => {
      const match = !term || (d.textContent ?? '').toLowerCase().includes(term);
      d.hidden = !match;
      if (term) d.open = match;
      if (match) hits++;
    });
    document.querySelectorAll<HTMLElement>('.fhub .fgrp').forEach((g) => {
      g.hidden = Boolean(term) && !g.querySelector('details:not([hidden])');
    });
    setNone(Boolean(term) && hits === 0);
  }

  return (
    <>
      <form
        className="fsearch"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
          document.querySelector('.fhub')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        <Icon name="search" />
        <label className="sr" htmlFor="fq">
          Search help
        </label>
        <input id="fq" placeholder="Search, e.g. delivery price" value={q} onChange={(e) => run(e.target.value)} />
        <button className="btn btn-red" type="submit">
          Search
        </button>
      </form>
      {none && <p style={{ marginTop: 10, color: '#d2d2d8' }}>No answers match that. Try another word, or call us on 0744 072 1478.</p>}
    </>
  );
}
