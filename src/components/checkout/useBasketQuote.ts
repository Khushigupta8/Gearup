'use client';

import { useEffect, useState } from 'react';
import { basket, useBasket } from '@/lib/basket';
import type { KitQuote } from '@/server/services/pricing';

export function useBasketQuote(withBike: boolean, fulfilment: 'collection' | 'delivery') {
  const b = useBasket();
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify([b.lines, b.code, withBike, fulfilment, attempt]);
  const [result, setResult] = useState<{ key: string; quote: KitQuote | null; error: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let live = true;
    const timeout = setTimeout(() => controller.abort(), 10000);
    fetch('/api/basket/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lines: b.lines, code: b.code, withBike, fulfilment }), signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Quote unavailable');
        const quote: KitQuote = await response.json();
        if (!Array.isArray(quote.lines) || !Array.isArray(quote.missing) || typeof quote.itemsTotal !== 'number' || typeof quote.postage !== 'number') throw new Error('Invalid quote');
        if (!live) return;
        setResult({ key, quote, error: '' });
        quote.missing.forEach((id) => basket.setQty(id, 0));
      })
      .catch(() => { if (live) setResult({ key, quote: null, error: 'We could not load your basket prices. Please try again.' }); })
      .finally(() => clearTimeout(timeout));
    return () => { live = false; clearTimeout(timeout); controller.abort(); };
    // The key includes every request input and the retry counter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { basket: b, quote: result?.key === key ? result.quote : null, error: result?.key === key ? result.error : '', retry: () => setAttempt((value) => value + 1) };
}
