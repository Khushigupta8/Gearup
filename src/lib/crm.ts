/** Labels shared by the CRM screens (safe for client components). */

export const leadTypes = {
  enquiry: 'Enquiry',
  viewing: 'Viewing',
  finance: 'Finance',
  part_exchange: 'Part-exchange',
  sell_bike: 'Sell your bike',
  insurance: 'Insurance',
  stock_alert: 'Stock alert',
  newsletter: 'Newsletter',
  workshop: 'Workshop',
} as const;

export const leadStages = {
  new: 'New',
  contacted: 'Contacted',
  viewing_booked: 'Viewing booked',
  negotiating: 'Negotiating',
  won: 'Won',
  lost: 'Lost',
} as const;

export type LeadTypeKey = keyof typeof leadTypes;
export type LeadStageKey = keyof typeof leadStages;

export const activityKinds = { note: 'Note', call: 'Call', email: 'Email', whatsapp: 'WhatsApp', update: 'Update' } as const;

export function timeAgo(date: Date, now = Date.now()): string {
  const s = Math.round((now - date.getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
