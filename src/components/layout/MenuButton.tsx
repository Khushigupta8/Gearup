'use client';

import { Icon } from '@/components/ui/Icon';

export function MenuButton() {
  return (
    <button className="burger" aria-label="Menu" onClick={() => document.body.classList.toggle('menu-open')}>
      <Icon name="menu" />
    </button>
  );
}
