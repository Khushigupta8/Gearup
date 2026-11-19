import type { MetadataRoute } from 'next';
import { bikes } from '@/data/bikes';
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

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...bikes.map((b) => ({ url: `${site.url}/used-bikes/${b.slug}` })),
  ];
}
