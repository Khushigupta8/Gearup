'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Runs the old page scripts (tabs, calculators, forms, sort/filter) for pages still shown through LegacyPage. */
export function LegacyScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const stamp = Date.now();
    // Module scripts with a fresh URL run again on every page visit, each in its own scope.
    const tags = ['ui.js', 'sort-filter.js'].map((name) => {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = `/legacy-js/${name}?v=${stamp}`;
      document.body.appendChild(s);
      return s;
    });
    return () => tags.forEach((t) => t.remove());
  }, [pathname]);

  return null;
}
