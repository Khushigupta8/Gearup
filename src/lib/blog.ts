import { z } from 'zod';

export const blogSlug = (title: string) => title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100).replace(/-$/, '');
export const blogPostSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens for the address.'),
  title: z.string().trim().min(1, 'Add a title.').max(150),
  excerpt: z.string().trim().max(300),
  body: z.string().trim().max(60000),
  coverUrl: z.string().trim().refine((value) => !value || /^\/assets\/[a-zA-Z0-9/._-]+$/.test(value) || /^https:\/\/[^\s\\]+$/i.test(value), 'Use an HTTPS image link or an image from the website.'),
  published: z.boolean(),
  publishedAt: z.string().nullable(),
  updatedAt: z.string(),
}).refine((post) => !post.published || (post.body.length >= 20 && post.excerpt.length > 0), { message: 'Add a short introduction and article text before publishing.', path: ['body'] });

export type BlogPost = z.infer<typeof blogPostSchema>;

/** Only ordinary web/contact links are clickable in CMS text. */
export function safeContentLink(href: string): boolean {
  if (/[\\\u0000-\u0020\u007f]/.test(href)) return false;
  if (/^\/(?!\/|%2f|%5c)/i.test(href) || /^#[a-zA-Z0-9_-]+$/.test(href)) return true;
  try { return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(href).protocol); } catch { return false; }
}
