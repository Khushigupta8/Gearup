'use client';

import { basketCount, useBasket } from '@/lib/basket';

/** Live item count on the header basket icon. */
export function BasketCount() {
  const n = basketCount(useBasket());
  return n > 0 ? <i>{n}</i> : null;
}
