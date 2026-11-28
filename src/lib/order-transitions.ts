export function canTransitionOrder(from: string, to: string) {
  if (from === to) return false;
  if (['completed', 'cancelled', 'refunded', 'pending_payment'].includes(from)) return false;
  if (from === 'payment_review') return to === 'refunded';
  return ['reserved', 'in_preparation', 'ready', 'out_for_delivery', 'completed', 'cancelled', 'refunded'].includes(to);
}
