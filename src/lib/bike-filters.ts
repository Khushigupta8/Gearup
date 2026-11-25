import { monthlyPayment } from '@/lib/format';
import type { Bike } from '@/types';

/**
 * Motorbikes listing filters, read from the URL so links like /used-bikes?make=honda&cc=125 work.
 * Runs on the server against the cached stock list (fine up to a few thousand bikes).
 */

export type SearchParams = Record<string, string | string[] | undefined>;

export const ccBands = [
  { key: '50', label: '50cc moped', test: (cc: number) => cc <= 50 },
  { key: '125', label: '51cc to 125cc', test: (cc: number) => cc > 50 && cc <= 125 },
  { key: '500', label: '126cc to 500cc', test: (cc: number) => cc > 125 && cc <= 500 },
  { key: '900', label: '501cc to 900cc', test: (cc: number) => cc > 500 && cc <= 900 },
  { key: 'big', label: 'Over 900cc', test: (cc: number) => cc > 900 },
] as const;

export const licenceOptions = [
  { key: 'cbt', label: 'CBT / learner legal' },
  { key: 'a2', label: 'A2 compatible' },
  { key: 'full_a', label: 'Full A licence' },
] as const;

export const extraOptions = [
  { key: 'warranty', label: 'Free extended warranty' },
  { key: 'drop', label: 'Price drops' },
  { key: 'new', label: 'Just arrived' },
  { key: 'hide-reserved', label: 'Hide reserved bikes' },
] as const;

export const makeKey = (make: string) => make.toLowerCase().replace(/[^a-z0-9]/g, '');
export const modelKey = (model: string) => model.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Match words in any order, including registrations typed without spaces. */
export function matchesBikeSearch(bike: Pick<Bike, 'year' | 'make' | 'model' | 'registration'>, query: string): boolean {
  const normalise = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const words = normalise(query).match(/[a-z0-9]+/g) ?? [];
  const stock = normalise(`${bike.year} ${bike.make} ${bike.model} ${bike.registration ?? ''}`).replace(/[^a-z0-9]/g, '');
  return words.every((word) => stock.includes(word));
}

/** CBT for 125cc and under, A2 if flagged or set, otherwise the licence set in the DMS. */
export function licenceOf(b: Bike): 'cbt' | 'a2' | 'full_a' {
  if (b.engineCc <= 125) return 'cbt';
  if (b.licence === 'a2' || (b.badge?.kind === 'flag' && b.badge.text === 'A2 compatible')) return 'a2';
  return b.licence ?? 'full_a';
}

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? [v] : []).flatMap((x) => x.split(',')).map((x) => x.trim().toLowerCase()).filter(Boolean);
const num = (v: string | string[] | undefined) => {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export type Filters = {
  make: string[];
  model: string[];
  q?: string;
  style: string[];
  cc: string[];
  licence: string[];
  extra: string[];
  condition?: 'new' | 'used';
  min?: number;
  max?: number;
  monthly?: number;
  year?: number;
  miles?: number;
};

export function parseFilters(sp: SearchParams): Filters {
  const condition = list(sp.condition)[0];
  return {
    make: list(sp.make),
    model: list(sp.model),
    q: (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim().slice(0, 100) || undefined,
    style: list(sp.style),
    cc: list(sp.cc),
    licence: list(sp.licence),
    extra: list(sp.extra),
    condition: condition === 'new' || condition === 'used' ? condition : undefined,
    min: num(sp.min),
    max: num(sp.max),
    monthly: num(sp.monthly),
    year: num(sp.year),
    miles: num(sp.miles),
  };
}

/** Does a bike pass every filter except (optionally) one group? Used for both results and counts. */
function passes(b: Bike, f: Filters, skip?: keyof Filters): boolean {
  if (f.q && !matchesBikeSearch(b, f.q)) return false;
  if (skip !== 'make' && f.make.length && !f.make.some((m) => makeKey(b.make).startsWith(m))) return false;
  if (skip !== 'model' && f.model.length && !f.model.includes(modelKey(b.model))) return false;
  if (skip !== 'style' && f.style.length && !f.style.includes(b.style)) return false;
  if (skip !== 'cc' && f.cc.length && !ccBands.some((band) => f.cc.includes(band.key) && band.test(b.engineCc))) return false;
  if (skip !== 'licence' && f.licence.length && !f.licence.includes(licenceOf(b))) return false;
  if (skip !== 'condition' && f.condition && (b.condition ?? 'used') !== f.condition) return false;
  if (f.min && b.price < f.min) return false;
  if (f.max && b.price > f.max) return false;
  if (f.monthly && monthlyPayment(b.price, 48) > f.monthly) return false;
  if (f.year && b.year < f.year) return false;
  if (f.miles && b.mileage > f.miles) return false;
  if (skip !== 'extra') {
    if (f.extra.includes('warranty') && b.badge?.kind !== 'warranty') return false;
    if (f.extra.includes('drop') && !b.wasPrice) return false;
    if (f.extra.includes('new') && !(b.badge?.kind === 'flag' && /just arrived/i.test(b.badge.text))) return false;
    if (f.extra.includes('hide-reserved') && b.status === 'reserved') return false;
  }
  return true;
}

export function applyFilters(bikes: Bike[], f: Filters): Bike[] {
  return bikes.filter((b) => passes(b, f));
}

/** Count per option, ignoring that option's own group (so ticking Honda still shows Yamaha's count). */
export function countBy(bikes: Bike[], f: Filters, group: 'make' | 'model' | 'style' | 'cc' | 'licence' | 'extra' | 'condition', test: (b: Bike) => boolean) {
  return bikes.filter((b) => passes(b, f, group) && test(b)).length;
}

/** A URL for the listing with one param set to a single value (replacing any current value). */
export function setHref(sp: SearchParams, key: string, value: string): string {
  const base = toggleHref(sp, key);
  return `${base}${base.includes('?') ? '&' : '?'}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

/** A URL for the listing with one value toggled (or a param set/cleared). */
export function toggleHref(sp: SearchParams, key: string, value?: string): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    // Search text is one value: preserve commas, spacing and case while other filters change.
    const values = k === 'q' ? [Array.isArray(v) ? v[0] : v].filter((x): x is string => Boolean(x)) : list(v);
    for (const x of values) params.append(k, x);
  }
  const current = params.getAll(key);
  params.delete(key);
  if (value !== undefined) {
    const next = current.includes(value) ? current.filter((x) => x !== value) : [...current, value];
    for (const x of next) params.append(key, x);
  }
  const q = params.toString();
  return q ? `/used-bikes?${q}` : '/used-bikes';
}
