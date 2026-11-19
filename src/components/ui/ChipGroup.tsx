'use client';

import { useState, type ReactNode } from 'react';

/** Single-select row of buttons (chips, segment toggles). Visual only until filtering is wired to the API. */
export function ChipGroup({
  items,
  className,
  itemClassName,
  style,
  label,
}: {
  items: ReactNode[];
  className: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  label?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className={className} style={style} role="group" aria-label={label}>
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={i === active}
          className={[itemClassName, i === active && 'on'].filter(Boolean).join(' ') || undefined}
          onClick={() => setActive(i)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
