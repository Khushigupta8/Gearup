'use client';

import type { ReactNode } from 'react';

/**
 * Quick "enter your reg" box that jumps to the full form below and copies the reg into it.
 * copy: [box input id, full-form input id] pairs; target: the section to scroll to.
 */
export function JumpForm({ className, copy, target, children }: { className?: string; copy: [from: string, to: string][]; target: string; children: ReactNode }) {
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        for (const [from, to] of copy) {
          const src = document.getElementById(from) as HTMLInputElement | HTMLSelectElement | null;
          const dst = document.getElementById(to) as HTMLInputElement | HTMLSelectElement | null;
          if (src && dst && src.value && !(src instanceof HTMLSelectElement && src.selectedIndex === 0)) {
            dst.value = dst instanceof HTMLInputElement && from.endsWith('r') ? src.value.toUpperCase() : src.value;
          }
        }
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      {children}
    </form>
  );
}
