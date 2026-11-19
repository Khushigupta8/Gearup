import type { MetadataRoute } from 'next';
import { getPublicBikes } from '@/server/services/bikes';
import { site } from '@/lib/site';

const pages = [
  '',
  '/used-bikes',
  '/accessories',
  '/finance',
  '/part-exchange',
  '/sell-your-bike',
  '/insurance',
  '/workshop',
  '/delivery',
  '/warranty',
  '/faq',
  '/about',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bikes = await getPublicBikes();
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...bikes.map((b) => ({ url: `${site.url}/used-bikes/${b.slug}` })),
  ];
}
