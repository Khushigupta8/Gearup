'use client';

import { useState, type ReactNode } from 'react';

/** Button tabs (.tabs) with one visible pane. */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode; className?: string }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            aria-controls={t.id}
            className={t.id === active ? 'on' : undefined}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={t.id} role="tabpanel" className={['tabpane', t.className].filter(Boolean).join(' ')} hidden={t.id !== active}>
          {t.content}
        </div>
      ))}
    </>
  );
}
