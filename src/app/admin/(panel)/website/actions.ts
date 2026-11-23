'use server';

import { del } from '@vercel/blob';
import { updateTag } from 'next/cache';
import { z } from 'zod';
import type { Prisma } from '@/generated/prisma/client';
import { faqSections, legalPages, placeholders, seoPages, type Business, type LegalSlug } from '@/lib/cms';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';
import { CMS_TAG, getBusiness, getSeo } from '@/server/services/cms';

/** Website CMS (Admin → Website). Every save refreshes the site straight away via the 'cms' tag. */

export type CmsResult = { ok: true; message: string } | { ok: false; error: string } | null;

const s = (form: FormData, k: string) => String(form.get(k) ?? '').trim();

async function done(userId: string, action: string, entityId: string, changes?: Prisma.InputJsonValue): Promise<CmsResult> {
  await db.auditLog.create({ data: { userId, action, entity: 'cms', entityId, changes } });
  updateTag(CMS_TAG);
  return { ok: true, message: 'Saved. The website is updated.' };
}

async function saveSetting(key: string, value: Prisma.InputJsonValue) {
  await db.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
}

// ───────────── business details ─────────────

const url = z.union([z.literal(''), z.url()]);

export async function saveBusiness(_prev: CmsResult, form: FormData): Promise<CmsResult> {
  const user = await requireStaff(['manager', 'admin']);
  const hours = s(form, 'hours')
    .split('\n')
    .map((l) => l.split('|').map((x) => x.trim()))
    .filter(([d, t]) => d && t)
    .map(([d, t]) => [d, t] as [string, string]);
  const parsed = z
    .object({
      phone: z.string().min(6, 'Add a phone number.').max(30),
      whatsapp: z.string().regex(/^\+?[\d\s]{8,16}$/, 'WhatsApp: the full number with country code, e.g. 447440721478.'),
      email: z.email('Add a valid email.'),
      address: z.string().max(300),
      legalLine: z.string().max(300),
      promos: z.array(z.string().max(60)).max(6),
      socials: z.object({ facebook: url, instagram: url, tiktok: url, youtube: url, x: url }),
      trustpilot: z.object({ rating: z.number().min(0).max(5), count: z.number().int().min(0), url }),
    })
    .safeParse({
      phone: s(form, 'phone'),
      whatsapp: s(form, 'whatsapp'),
      email: s(form, 'email'),
      address: s(form, 'address'),
      legalLine: s(form, 'legalLine'),
      promos: s(form, 'promos').split('\n').map((p) => p.trim()).filter(Boolean),
      socials: { facebook: s(form, 'facebook'), instagram: s(form, 'instagram'), tiktok: s(form, 'tiktok'), youtube: s(form, 'youtube'), x: s(form, 'x') },
      trustpilot: { rating: Number(s(form, 'tpRating') || 0), count: Number(s(form, 'tpCount') || 0), url: s(form, 'tpUrl') },
    });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the fields.' };
  if (!hours.length) return { ok: false, error: 'Add at least one line of opening hours, e.g. "Mon to Fri | 9:00 to 17:30".' };
  const value: Business = { ...(await getBusiness(true)), ...parsed.data, whatsapp: parsed.data.whatsapp.replace(/\D/g, ''), hours };
  await saveSetting('business', value as unknown as Prisma.InputJsonValue);
  return done(user.id, 'cms.business', 'business');
}

// ───────────── SEO ─────────────

export async function saveSeo(_prev: CmsResult, form: FormData): Promise<CmsResult> {
  const user = await requireStaff(['manager', 'admin']);
  const seo = await getSeo(true);
  for (const p of seoPages) {
    const title = s(form, `t:${p.path}`).slice(0, 70);
    const description = s(form, `d:${p.path}`).slice(0, 170);
    if (title || description) seo[p.path] = { ...(title ? { title } : {}), ...(description ? { description } : {}) };
    else delete seo[p.path];
  }
  await saveSetting('seo', seo);
  return done(user.id, 'cms.seo', 'seo');
}

// ───────────── terms / privacy ─────────────

export async function saveLegalPage(_prev: CmsResult, form: FormData): Promise<CmsResult> {
  const user = await requireStaff(['manager', 'admin']);
  const slug = s(form, 'slug') as LegalSlug;
  if (!(slug in legalPages)) return { ok: false, error: 'Unknown page.' };
  const title = s(form, 'title').slice(0, 120) || legalPages[slug].title;
  const body = String(form.get('body') ?? '').slice(0, 60000);
  const published = form.get('published') === 'on';
  const todo = placeholders(body);
  if (published && !body.trim()) return { ok: false, error: 'Add the text before publishing.' };
  if (published && todo.length) {
    return { ok: false, error: `Fill in the [bracketed] details before publishing: ${todo.slice(0, 3).join('; ')}${todo.length > 3 ? ` and ${todo.length - 3} more` : ''}.` };
  }
  await saveSetting(`page:${slug}`, { title, body, published, updatedAt: new Date().toISOString() });
  return done(user.id, published ? 'cms.page_publish' : 'cms.page_draft', slug);
}

// ───────────── FAQs ─────────────

const sectionKeys = faqSections.map((f) => f.key) as [string, ...string[]];

export async function saveFaq(_prev: CmsResult, form: FormData): Promise<CmsResult> {
  const user = await requireStaff();
  const parsed = z
    .object({ id: z.string().optional(), section: z.enum(sectionKeys), question: z.string().min(3, 'Add the question.').max(300), answer: z.string().min(2, 'Add the answer.').max(3000) })
    .safeParse({ id: s(form, 'id') || undefined, section: s(form, 'section'), question: s(form, 'question'), answer: s(form, 'answer') });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the fields.' };
  const { id, ...data } = parsed.data;
  if (id) await db.faq.update({ where: { id }, data });
  else {
    const last = await db.faq.aggregate({ where: { section: data.section }, _max: { sortOrder: true } });
    await db.faq.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? -1) + 1 } });
  }
  return done(user.id, id ? 'cms.faq_edit' : 'cms.faq_add', id ?? data.section);
}

export async function setFaqActive(id: string, active: boolean) {
  const user = await requireStaff();
  await db.faq.update({ where: { id }, data: { active } });
  await done(user.id, 'cms.faq_active', id, { active });
}

export async function deleteFaq(id: string) {
  const user = await requireStaff();
  await db.faq.delete({ where: { id } });
  await done(user.id, 'cms.faq_delete', id);
}

export async function moveFaq(id: string, direction: -1 | 1) {
  await requireStaff();
  const faq = await db.faq.findUnique({ where: { id } });
  if (!faq) return;
  const list = await db.faq.findMany({ where: { section: faq.section }, orderBy: { sortOrder: 'asc' } });
  const i = list.findIndex((f) => f.id === id);
  const j = i + direction;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await db.$transaction(list.map((f, n) => db.faq.update({ where: { id: f.id }, data: { sortOrder: n } })));
  updateTag(CMS_TAG);
}

// ───────────── reviews ─────────────

export async function saveReview(_prev: CmsResult, form: FormData): Promise<CmsResult> {
  const user = await requireStaff();
  const parsed = z
    .object({
      id: z.string().optional(),
      author: z.string().min(1, 'Add the reviewer’s name.').max(80),
      rating: z.number().int().min(1).max(5),
      body: z.string().min(5, 'Add the review text.').max(2000),
      source: z.string().min(1).max(40),
      date: z.coerce.date({ message: 'Add the review date.' }),
      featured: z.boolean(),
    })
    .safeParse({
      id: s(form, 'id') || undefined,
      author: s(form, 'author'),
      rating: Number(s(form, 'rating') || 5),
      body: s(form, 'body'),
      source: s(form, 'source') || 'Trustpilot',
      date: s(form, 'date'),
      featured: form.get('featured') === 'on',
    });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the fields.' };
  const { id, ...data } = parsed.data;
  if (id) await db.review.update({ where: { id }, data });
  else await db.review.create({ data });
  return done(user.id, id ? 'cms.review_edit' : 'cms.review_add', id ?? data.author);
}

export async function setReviewActive(id: string, active: boolean) {
  const user = await requireStaff();
  await db.review.update({ where: { id }, data: { active } });
  await done(user.id, 'cms.review_active', id, { active });
}

export async function deleteReview(id: string) {
  const user = await requireStaff();
  await db.review.delete({ where: { id } });
  await done(user.id, 'cms.review_delete', id);
}

// ───────────── home hero slides ─────────────

export async function saveHeroSlide(_prev: CmsResult, form: FormData): Promise<CmsResult> {
  const user = await requireStaff(['manager', 'admin']);
  const parsed = z
    .object({
      id: z.string().optional(),
      title: z.string().min(2, 'Add the bike name.').max(80),
      subtitle: z.string().max(40),
      imageUrl: z.string().min(1, 'Upload the bike picture.').max(500),
      linkUrl: z.string().regex(/^\/[\w\-/?=&.]*$/, 'The link must be a page on this site, e.g. /used-bikes/2021-lexmoto-lxr-125').max(200),
      startsAt: z.string(),
      endsAt: z.string(),
    })
    .safeParse({
      id: s(form, 'id') || undefined,
      title: s(form, 'title'),
      subtitle: s(form, 'subtitle'),
      imageUrl: s(form, 'imageUrl'),
      linkUrl: s(form, 'linkUrl') || '/used-bikes',
      startsAt: s(form, 'startsAt'),
      endsAt: s(form, 'endsAt'),
    });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the fields.' };
  const { id, startsAt, endsAt, ...rest } = parsed.data;
  const data = { ...rest, subtitle: rest.subtitle || null, startsAt: startsAt ? new Date(startsAt) : null, endsAt: endsAt ? new Date(`${endsAt}T23:59:59`) : null };
  if (id) {
    const before = await db.banner.findUnique({ where: { id } });
    await db.banner.update({ where: { id }, data });
    if (before?.imageUrl && before.imageUrl !== data.imageUrl && before.imageUrl.includes('/cms/')) await del(before.imageUrl).catch(() => undefined);
  } else {
    const last = await db.banner.aggregate({ where: { placement: 'home_hero' }, _max: { sortOrder: true } });
    await db.banner.create({ data: { ...data, placement: 'home_hero', sortOrder: (last._max.sortOrder ?? -1) + 1 } });
  }
  return done(user.id, id ? 'cms.hero_edit' : 'cms.hero_add', id ?? data.title);
}

export async function setBannerActive(id: string, active: boolean) {
  const user = await requireStaff(['manager', 'admin']);
  await db.banner.update({ where: { id }, data: { active } });
  await done(user.id, 'cms.hero_active', id, { active });
}

export async function deleteBanner(id: string) {
  const user = await requireStaff(['manager', 'admin']);
  const b = await db.banner.delete({ where: { id } });
  if (b.imageUrl?.includes('/cms/')) await del(b.imageUrl).catch(() => undefined);
  await done(user.id, 'cms.hero_delete', id);
}

export async function moveBanner(id: string, direction: -1 | 1) {
  await requireStaff(['manager', 'admin']);
  const b = await db.banner.findUnique({ where: { id } });
  if (!b) return;
  const list = await db.banner.findMany({ where: { placement: b.placement }, orderBy: { sortOrder: 'asc' } });
  const i = list.findIndex((x) => x.id === id);
  const j = i + direction;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await db.$transaction(list.map((x, n) => db.banner.update({ where: { id: x.id }, data: { sortOrder: n } })));
  updateTag(CMS_TAG);
}
