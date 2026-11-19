import type { MetadataRoute } from 'next';
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
  // Add one entry per bike once stock comes from the API.
  return pages.map((path) => ({ url: `${site.url}${path}` }));
}
