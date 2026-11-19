import { z } from 'zod';

/** Form helpers: empty inputs become undefined/null instead of "" */
const text = z
  .string()
  .trim()
  .transform((v) => v || null)
  .nullable()
  .optional();
const int = (min = 0, max = 10_000_000) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : Number(String(v).replace(/[^0-9.-]/g, ''))), z.number().int().min(min).max(max));
const optInt = (min = 0, max = 10_000_000) =>
  z.preprocess((v) => (v === '' || v == null ? null : Number(String(v).replace(/[^0-9.-]/g, ''))), z.number().int().min(min).max(max).nullable());
const bool = z.preprocess((v) => v === 'on' || v === 'true' || v === true, z.boolean());
const lines = z.preprocess(
  (v) =>
    String(v ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean),
  z.array(z.string()),
);

export const bikeStatuses = ['draft', 'in_preparation', 'available', 'reserved', 'sold', 'archived'] as const;
export const bikeStyles = ['sports', 'naked', 'adventure', 'cruiser', 'classic', 'tourer', 'scooter', 'enduro'] as const;
export const licences = ['cbt', 'a2', 'full_a'] as const;

/** Everything on the "Details" and "Price & website" sections of the bike form. Money in whole pounds. */
export const bikeFormSchema = z.object({
  registration: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase().replace(/\s+/g, ' ') || null)
    .nullable()
    .optional(),
  vin: text,
  make: z.string().trim().min(1, 'Make is required'),
  model: z.string().trim().min(1, 'Model is required'),
  variant: text,
  year: int(1950, 2100),
  plate: text,
  condition: z.enum(['new', 'used']),
  mileage: int(0, 500_000),
  engineCc: int(0, 3000),
  style: z.enum(bikeStyles),
  colour: text,
  licence: z.preprocess((v) => (v === '' ? null : v), z.enum(licences).nullable()),
  fuel: text,
  gearbox: text,
  owners: optInt(0, 50),
  keys: optInt(0, 10),
  motExpiry: z.preprocess((v) => (v ? new Date(String(v)) : null), z.date().nullable()),

  pricePounds: int(0, 1_000_000),
  wasPricePounds: optInt(0, 1_000_000),
  status: z.enum(bikeStatuses),
  visible: bool,
  featured: bool,
  freeWarrantyMonths: z.coerce.number().int().refine((n) => [0, 3, 6, 12, 24].includes(n)),
  freeWarrantyValuePounds: optInt(0, 10_000),
  showWarrantyBadge: bool,
  showA2Badge: bool,
  flagText: text,

  headline: text,
  description: text,
  features: lines,
  highlights: lines,
  /** "Label: value" per line */
  specText: z.string().optional(),
  /** "Title | note" per line */
  historyText: z.string().optional(),
  seoTitle: text,
  seoDescription: text,
});

export type BikeFormInput = z.infer<typeof bikeFormSchema>;

export function parseSpec(text = ''): [string, string][] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(':');
      return i === -1 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    });
}

export function parseHistory(text = ''): { title: string; note: string | null }[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split('|');
      return { title: title.trim(), note: rest.join('|').trim() || null };
    });
}

export const acquisitionSchema = z.object({
  source: z.enum(['trade', 'private', 'part_exchange', 'auction', 'other']),
  purchasePricePounds: int(0, 1_000_000),
  purchasedAt: z.preprocess((v) => (v ? new Date(String(v)) : new Date()), z.date()),
  sellerName: text,
  vatType: z.enum(['margin', 'qualifying']),
  notes: text,
});

export const costSchema = z.object({
  category: z.enum(['parts', 'labour', 'mot', 'valet', 'transport', 'other']),
  amountPounds: z.preprocess((v) => Number(String(v ?? '').replace(/[^0-9.]/g, '')), z.number().min(0.01).max(100_000)),
  note: text,
});

export const soldSchema = z.object({
  soldPricePounds: int(0, 1_000_000),
  soldAt: z.preprocess((v) => (v ? new Date(String(v)) : new Date()), z.date()),
  buyerName: text,
  buyerEmail: z.preprocess((v) => (v === '' ? null : v), z.email().nullable().optional()),
  buyerPhone: text,
});
