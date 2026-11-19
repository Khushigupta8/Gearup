import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Prisma } from '@/generated/prisma/client';
import type { Bike, BikeBadge, BikeDetail, Photo } from '@/types';
import { db } from '../db';

/**
 * Website-facing stock. Reads the DMS tables and returns the shape the pages already use.
 * Cached; every DMS change calls revalidateTag('bikes') so the site updates within seconds.
 */

export const BIKES_TAG = 'bikes';

const withPhotos = {
  photos: { orderBy: { sortOrder: 'asc' } },
  history: { orderBy: { sortOrder: 'asc' } },
} satisfies Prisma.BikeInclude;

type BikeRow = Prisma.BikeGetPayload<{ include: typeof withPhotos }>;

const licenceLabel = { cbt: 'CBT / learner', a2: 'A2', full_a: 'Full A' } as const;

const pounds = (pence: number) => Math.round(pence / 100);

function badgeFor(b: BikeRow): BikeBadge | undefined {
  if (b.freeWarrantyMonths > 0 && b.showWarrantyBadge) return { kind: 'warranty', months: b.freeWarrantyMonths };
  if (b.flagText) return { kind: 'flag', text: b.flagText, red: Boolean(b.wasPrice) };
  if (b.showA2Badge) return { kind: 'flag', text: 'A2 compatible' };
  return undefined;
}

function photosOf(b: BikeRow, kind: 'main' | 'detail' | 'receipt'): Photo[] {
  return b.photos.filter((p) => p.kind === kind).map((p) => ({ src: p.url, label: p.caption ?? '' }));
}

function toBike(b: BikeRow): Bike {
  const gallery = photosOf(b, 'main');
  const hasDetail = Boolean(b.headline || b.description || gallery.length > 1);

  const detail: BikeDetail | undefined = hasDetail
    ? {
        plate: b.plate ?? String(b.year),
        owners: b.owners ?? 0,
        colour: b.colour ?? '',
        licence: b.licence ? licenceLabel[b.licence] : '',
        fuel: b.fuel ?? '',
        gearbox: b.gearbox ?? '',
        warrantyWorth: b.freeWarrantyValue ? pounds(b.freeWarrantyValue) : undefined,
        gallery,
        detailPhotos: photosOf(b, 'detail'),
        receipts: photosOf(b, 'receipt'),
        headline: b.headline ?? '',
        overview: (b.description ?? '').split(/\n\s*\n/).filter(Boolean),
        features: b.features,
        spec: (b.specRows as [string, string][] | null) ?? [],
        inspection: (b.inspectionReport as BikeDetail['inspection'] | null) ?? { date: '', results: [] },
        history: b.history.map((h) => [h.title, h.note ?? ''] as [string, string]),
      }
    : undefined;

  return {
    slug: b.slug,
    make: b.make,
    model: b.model,
    year: b.year,
    price: pounds(b.price),
    wasPrice: b.wasPrice ? pounds(b.wasPrice) : undefined,
    mileage: b.mileage,
    engineCc: b.engineCc,
    style: b.style,
    image: gallery[0]?.src ?? '/assets/images/placeholders/receipt.svg',
    badge: badgeFor(b),
    status: b.status === 'reserved' ? 'reserved' : b.status === 'sold' ? 'sold' : 'available',
    registration: b.registration ?? undefined,
    featured: b.featured,
    highlights: b.highlights.length ? b.highlights : undefined,
    detail,
  };
}

/**
 * Raw rows for the website, cached under the 'bikes' tag. Only DB rows are cached (not the mapped
 * shape), so changing toBike() never serves stale data. Dates come back as strings from the cache.
 */
const getPublicBikeRows = unstable_cache(
  () =>
    db.bike.findMany({
      where: { visible: true, status: { in: ['available', 'reserved'] } },
      include: withPhotos,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    }),
  // a fresh cache per deployment, so a deploy never serves rows cached by older code
  ['public-bike-rows', process.env.VERCEL_DEPLOYMENT_ID ?? 'local'],
  { tags: [BIKES_TAG] },
);

/** Bikes shown on the website: visible and available or reserved, newest first. */
export async function getPublicBikes(): Promise<Bike[]> {
  return (await getPublicBikeRows()).map(toBike);
}

export async function getPublicBike(slug: string): Promise<Bike | undefined> {
  return (await getPublicBikes()).find((b) => b.slug === slug);
}
