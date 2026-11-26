import 'server-only';
import { unstable_cache } from 'next/cache';
import { blogPostSchema, type BlogPost } from '@/lib/blog';
import { db } from '@/server/db';
import { CMS_TAG } from './cms';

async function readPosts(): Promise<BlogPost[]> {
  const rows = await db.setting.findMany({ where: { key: { startsWith: 'blog:' } } });
  return rows.flatMap((row) => {
    const parsed = blogPostSchema.safeParse(row.value);
    return parsed.success ? [parsed.data] : [];
  }).sort((a, b) => (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt));
}

export const getPublishedPosts = unstable_cache(async () => (await readPosts()).filter((post) => post.published), ['blog', process.env.VERCEL_DEPLOYMENT_ID ?? 'local'], { tags: [CMS_TAG] });
/** Fresh data for the protected CMS. */
export const getAdminPosts = readPosts;
