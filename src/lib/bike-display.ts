/** Card badges show transmission type; the full gearbox value stays in specifications. */
export function transmissionLabel(gearbox?: string): string | undefined {
  const value = gearbox?.trim();
  if (!value) return undefined;
  if (/semi[\s-]*automatic/i.test(value)) return 'Semi-automatic';
  if (/automatic|\bcvt\b/i.test(value)) return 'Automatic';
  if (/manual/i.test(value)) return 'Manual';
  return value;
}
