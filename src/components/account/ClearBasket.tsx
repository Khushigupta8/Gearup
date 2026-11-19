'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { basket } from '@/lib/basket';

/** After a successful payment we land here with ?clear=1: empty the browser basket, then tidy the URL. */
export function ClearBasket() {
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (params.get('clear') !== '1') return;
    basket.clear();
    const next = new URLSearchParams(params);
    next.delete('clear');
    router.replace(`${window.location.pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
  }, [params, router]);
  return null;
}
