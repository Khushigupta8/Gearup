'use client';

import { useSyncExternalStore } from 'react';

/**
 * Accessories basket, kept in the browser (localStorage) so it survives page loads.
 * Only variant ids and quantities are stored; prices are always re-checked on the server.
 */

export type BasketLine = { variantId: string; qty: number };
export type Basket = { lines: BasketLine[]; code?: string };

const KEY = 'gu-basket';
const EMPTY: Basket = { lines: [] };
let cache: Basket | null = null;
const listeners = new Set<() => void>();

function read(): Basket {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Basket) : EMPTY;
    cache = { lines: Array.isArray(parsed.lines) ? parsed.lines.filter((l) => l.variantId && l.qty > 0) : [], code: parsed.code };
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Basket) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: basket lasts for this page only */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function useBasket(): Basket {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const basket = {
  add(variantId: string, qty = 1) {
    const b = read();
    const existing = b.lines.find((l) => l.variantId === variantId);
    const lines = existing ? b.lines.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(10, l.qty + qty) } : l)) : [...b.lines, { variantId, qty }];
    write({ ...b, lines });
  },
  setQty(variantId: string, qty: number) {
    const b = read();
    write({ ...b, lines: qty <= 0 ? b.lines.filter((l) => l.variantId !== variantId) : b.lines.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(10, qty) } : l)) });
  },
  setCode(code?: string) {
    write({ ...read(), code: code?.trim().toUpperCase() || undefined });
  },
  clear() {
    write(EMPTY);
  },
};

export const basketCount = (b: Basket) => b.lines.reduce((n, l) => n + l.qty, 0);
