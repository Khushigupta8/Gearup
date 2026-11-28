export function mergeBasketLines(lines: { variantId: string; qty: number }[]) {
  const quantities = new Map<string, number>();
  for (const line of lines) quantities.set(line.variantId, (quantities.get(line.variantId) ?? 0) + line.qty);
  return Array.from(quantities, ([variantId, qty]) => ({ variantId, qty }));
}
