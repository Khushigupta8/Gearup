'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

/** Dropdown filter on the listing (budget, year, mileage): changes one URL param. */
export function FilterSelect({ name, label, options }: { name: string; label: string; options: [value: string, text: string][] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <div className="sel">
      <select
        aria-label={label}
        value={params.get(name) ?? ''}
        onChange={(e) => {
          const next = new URLSearchParams(params);
          if (e.target.value) next.set(name, e.target.value);
          else next.delete(name);
          const q = next.toString();
          router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
        }}
      >
        <option value="">{label}</option>
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
      <Icon name="down" />
    </div>
  );
}
