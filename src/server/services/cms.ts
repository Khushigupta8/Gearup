import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Metadata } from 'next';
import { defaultBusiness, legalPages, type Business, type LegalPage, type LegalSlug, type SeoEntry } from '@/lib/cms';
import { db } from '../db';

/** Website content edited in /admin/website. Cached; every CMS save calls updateTag('cms'). */
export const CMS_TAG = 'cms';
const KEY = ['cms', process.env.VERCEL_DEPLOYMENT_ID ?? 'local'];

const settingsRows = unstable_cache(() => db.setting.findMany(), [...KEY, 'settings'], { tags: [CMS_TAG] });

async function setting<T>(key: string): Promise<T | undefined> {
  return (await settingsRows()).find((s) => s.key === key)?.value as T | undefined;
}

export async function getBusiness(): Promise<Business> {
  const saved = (await setting<Partial<Business>>('business')) ?? {};
  return {
    ...defaultBusiness,
    ...saved,
    socials: { ...defaultBusiness.socials, ...(saved.socials ?? {}) },
    trustpilot: { ...defaultBusiness.trustpilot, ...(saved.trustpilot ?? {}) },
  };
}

export async function getSeo(): Promise<Record<string, SeoEntry>> {
  return (await setting<Record<string, SeoEntry>>('seo')) ?? {};
}

export async function getLegalPage(slug: LegalSlug): Promise<LegalPage> {
  return (await setting<LegalPage>(`page:${slug}`)) ?? { title: legalPages[slug].title, body: '' };
}

/**
 * Page metadata with the CMS override applied. Use as:
 *   export const generateMetadata = () => pageMetadata('/finance', { title: '...', description: '...' });
 */
export async function pageMetadata(path: string, fallback: Metadata): Promise<Metadata> {
  const seo = (await getSeo())[path];
  if (!seo?.title && !seo?.description) return fallback;
  return {
    ...fallback,
    ...(seo.title ? { title: { absolute: seo.title } } : {}),
    ...(seo.description ? { description: seo.description } : {}),
  };
}

const faqRows = unstable_cache(
  () => db.faq.findMany({ where: { active: true }, orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }] }),
  [...KEY, 'faqs'],
  { tags: [CMS_TAG] },
);

export async function getFaqs(section: string) {
  return (await faqRows()).filter((f) => f.section === section);
}

const reviewRows = unstable_cache(
  () => db.review.findMany({ where: { active: true }, orderBy: [{ featured: 'desc' }, { date: 'desc' }] }),
  [...KEY, 'reviews'],
  { tags: [CMS_TAG] },
);

/** Active reviews, featured first. Dates come back as strings from the cache. */
export async function getReviews() {
  return (await reviewRows()).map((r) => ({ ...r, date: new Date(r.date) }));
}

const bannerRows = unstable_cache(
  () => db.banner.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
  [...KEY, 'banners'],
  { tags: [CMS_TAG] },
);

/** Banners for a placement that are switched on and inside their start/end dates. */
export async function getBanners(placement: string) {
  const now = Date.now();
  return (await bannerRows()).filter(
    (b) =>
      b.placement === placement &&
      (!b.startsAt || new Date(b.startsAt).getTime() <= now) &&
      (!b.endsAt || new Date(b.endsAt).getTime() >= now),
  );
}
