/** Parse pound amounts strictly; never turn invalid text or a negative value into £0. */
export function poundsToPence(value: unknown): number {
  const text = String(value ?? '').trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return NaN;
  return Math.round(Number(text) * 100);
}
