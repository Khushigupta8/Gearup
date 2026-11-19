/** Order labels and money helpers shared by account and admin screens. */

export const orderStatus = {
  pending_payment: { label: 'Awaiting payment', pill: '' },
  reserved: { label: 'Reserved', pill: 'r' },
  in_preparation: { label: 'In prep', pill: 'r' },
  ready: { label: 'Ready', pill: 'g' },
  out_for_delivery: { label: 'Out for delivery', pill: 'r' },
  completed: { label: 'Completed', pill: 'g' },
  cancelled: { label: 'Cancelled', pill: '' },
  refunded: { label: 'Refunded', pill: '' },
} as const;

export type OrderStatusKey = keyof typeof orderStatus;

/** £1,234.56 from pence */
export const money = (pence: number) => `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const shortDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
