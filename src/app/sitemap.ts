import type { MetadataRoute } from 'next';
import { getPublicBikes } from '@/server/services/bikes';
import { getPublishedPosts } from '@/server/services/blog';
import { site } from '@/lib/site';

// Include current stock without querying the database during next build.
export const dynamic = 'force-dynamic';

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
  '/blog',
  '/warranty',
  '/faq',
  '/about',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bikes, posts] = await Promise.all([getPublicBikes(), getPublishedPosts()]);
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...bikes.map((b) => ({ url: `${site.url}/used-bikes/${b.slug}` })),
    ...posts.map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: post.updatedAt })),
  ];
}
