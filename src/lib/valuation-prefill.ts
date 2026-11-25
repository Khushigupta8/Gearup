export type ValuationQuery = { registration?: string | string[]; mileage?: string | string[] };

/** Bound URL-supplied values before showing them in either valuation form. */
export function valuationPrefill(query: ValuationQuery) {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';
  const registration = first(query.registration).toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim().slice(0, 8);
  const miles = first(query.mileage).replace(/[,\s]/g, '');
  const mileage = /^\d{1,6}$/.test(miles) && Number(miles) <= 500_000 ? String(Number(miles)) : '';
  return { registration, mileage };
}

export function valuationHref(path: '/part-exchange' | '/sell-your-bike', registration: string, mileage: string) {
  const values = valuationPrefill({ registration, mileage });
  const query = new URLSearchParams();
  if (values.registration) query.set('registration', values.registration);
  if (values.mileage) query.set('mileage', values.mileage);
  return `${path}${query.size ? `?${query}` : ''}#${path === '/part-exchange' ? 'details' : 'value'}`;
}
