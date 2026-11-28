'use client';

import type { ReactNode } from 'react';

/**
 * Quick "enter your reg" box that jumps to the full form below and copies the reg into it.
 * copy: [box input id, full-form input id] pairs; target: the section to scroll to.
 */
export function JumpForm({ className, copy, target, children, condition }: { className?: string; copy: [from: string, to: string][]; target: string; children: ReactNode; condition?: { from: string; name: string } }) {
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
        if (condition) {
          const src = document.getElementById(condition.from) as HTMLSelectElement | null;
          const radio = Array.from(document.querySelectorAll<HTMLInputElement>(`#${CSS.escape(target)} input[type=radio][name="${CSS.escape(condition.name)}"]`)).find((r) => r.value === src?.value);
          radio?.click();
        }
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      {children}
    </form>
  );
}
