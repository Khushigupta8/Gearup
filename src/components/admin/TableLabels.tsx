'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Phone layout for admin tables: copies each column heading onto its cells (data-label), so CSS can show
 * every row as a card with labelled values instead of a table that scrolls sideways.
 */
export function TableLabels() {
  const pathname = usePathname();
  useEffect(() => {
    const label = () =>
      document.querySelectorAll<HTMLTableElement>('.adm-table').forEach((t) => {
        const heads = [...t.querySelectorAll('thead th')].map((th) => th.textContent?.trim() ?? '');
        t.querySelectorAll('tbody tr').forEach((tr) =>
          [...tr.children].forEach((td, i) => {
            if (heads[i] && !td.hasAttribute('data-label')) td.setAttribute('data-label', heads[i]);
          }),
        );
      });
    label();
    const obs = new MutationObserver(label);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [pathname]);
  return null;
}
