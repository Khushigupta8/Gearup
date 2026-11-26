'use server';

import { updateTag } from 'next/cache';
import { blogPostSchema, blogSlug } from '@/lib/blog';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';
import { CMS_TAG } from '@/server/services/cms';
import type { CmsResult } from '../actions';

export async function saveBlogPost(_previous: CmsResult, form: FormData): Promise<CmsResult> {
  const user = await requireStaff(['manager', 'admin']);
  const text = (key: string) => String(form.get(key) ?? '').trim();
  const slug = text('slug') || blogSlug(text('title'));
  const key = `blog:${slug}`;
  const existing = await db.setting.findUnique({ where: { key } });
  if (text('mode') === 'new' && existing) return { ok: false, error: 'A post already uses that address. Choose a different one.' };
  if (text('mode') !== 'new' && !existing) return { ok: false, error: 'That post no longer exists. Refresh the page.' };
  const old = blogPostSchema.safeParse(existing?.value);
  const published = form.get('published') === 'on';
  const now = new Date().toISOString();
  const parsed = blogPostSchema.safeParse({ slug, title: text('title'), excerpt: text('excerpt'), body: text('body'), coverUrl: text('coverUrl'), published, publishedAt: old.success && old.data.publishedAt ? old.data.publishedAt : published ? now : null, updatedAt: now });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the article details.' };
  try {
    await db.$transaction(async (tx) => {
      if (text('mode') === 'new') await tx.setting.create({ data: { key, value: parsed.data } });
      else await tx.setting.update({ where: { key }, data: { value: parsed.data } });
      await tx.auditLog.create({ data: { userId: user.id, action: published ? 'cms.blog_publish' : 'cms.blog_draft', entity: 'cms', entityId: key } });
    });
  } catch {
    return { ok: false, error: 'The post could not be saved. Refresh the page and try again.' };
  }
  updateTag(CMS_TAG);
  return { ok: true, message: published ? 'Published. The post is now on the blog.' : 'Draft saved. It is not visible on the website.' };
}
