'use server';

import { del } from '@vercel/blob';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { Prisma } from '@/generated/prisma/client';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';
import { BIKES_TAG } from '@/server/services/bikes';
import { acquisitionSchema, bikeFormSchema, costSchema, parseHistory, parseSpec, soldSchema } from '@/server/validation/bike';

export type FormResult = { ok: true; message?: string } | { ok: false; error: string; fields?: Record<string, string> } | null;

const fromForm = (form: FormData) => Object.fromEntries(form.entries());

function zodError(error: z.ZodError): FormResult {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) fields[String(issue.path[0])] ??= issue.message;
  return { ok: false, error: 'Please check the highlighted fields.', fields };
}

async function audit(userId: string, action: string, entityId: string, changes?: Prisma.InputJsonValue) {
  await db.auditLog.create({ data: { userId, action, entity: 'bike', entityId, changes } });
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(base: string, ignoreId?: string) {
  let slug = base;
  for (let n = 2; ; n++) {
    const hit = await db.bike.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === ignoreId) return slug;
    slug = `${base}-${n}`;
  }
}

/** Create or update a bike's details, price and website settings. */
export async function saveBike(_prev: FormResult, form: FormData): Promise<FormResult> {
  const user = await requireStaff();
  const id = String(form.get('id') || '') || null;
  const parsed = bikeFormSchema.safeParse(fromForm(form));
  if (!parsed.success) return zodError(parsed.error);
  const d = parsed.data;

  const data = {
    registration: d.registration ?? null,
    vin: d.vin ?? null,
    make: d.make,
    model: d.model,
    variant: d.variant ?? null,
    year: d.year,
    plate: d.plate ?? null,
    condition: d.condition,
    mileage: d.mileage,
    engineCc: d.engineCc,
    style: d.style,
    colour: d.colour ?? null,
    licence: d.licence,
    fuel: d.fuel ?? null,
    gearbox: d.gearbox ?? null,
    owners: d.owners,
    keys: d.keys,
    motExpiry: d.motExpiry,
    price: d.pricePounds * 100,
    wasPrice: d.wasPricePounds ? d.wasPricePounds * 100 : null,
    visible: d.visible,
    featured: d.featured,
    freeWarrantyMonths: d.freeWarrantyMonths,
    freeWarrantyValue: d.freeWarrantyValuePounds ? d.freeWarrantyValuePounds * 100 : null,
    showWarrantyBadge: d.showWarrantyBadge,
    showA2Badge: d.showA2Badge,
    flagText: d.flagText ?? null,
    headline: d.headline ?? null,
    description: d.description ?? null,
    features: d.features,
    highlights: d.highlights,
    specRows: parseSpec(d.specText),
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,
  };
  const history = parseHistory(d.historyText);
  const now = new Date();

  if (!id) {
    const slug = await uniqueSlug(slugify(`${d.year} ${d.make} ${d.model}`));
    const bike = await db.bike.create({
      data: {
        ...data,
        slug,
        status: d.status,
        publishedAt: d.status === 'available' ? now : null,
        history: { create: history.map((h, i) => ({ ...h, sortOrder: i })) },
      },
    });
    await audit(user.id, 'bike.create', bike.id);
    updateTag(BIKES_TAG);
    redirect(`/admin/stock/${bike.id}?created=1`);
  }

  const before = await db.bike.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
  if (!before) return { ok: false, error: 'Bike not found.' };

  await db.$transaction([
    db.bike.update({
      where: { id },
      data: {
        ...data,
        status: d.status,
        ...(d.status === 'available' && !before.publishedAt ? { publishedAt: now } : {}),
        ...(d.status === 'reserved' && before.status !== 'reserved' ? { reservedAt: now } : {}),
        ...(d.status === 'sold' && before.status !== 'sold' ? { soldAt: now } : {}),
      },
    }),
    db.bikeHistoryEntry.deleteMany({ where: { bikeId: id } }),
    db.bikeHistoryEntry.createMany({ data: history.map((h, i) => ({ ...h, bikeId: id, sortOrder: i })) }),
  ]);
  await audit(user.id, 'bike.update', id, { status: d.status, price: data.price });
  updateTag(BIKES_TAG);
  return { ok: true, message: d.status === 'available' && d.visible ? 'Saved. Live on the website.' : 'Saved.' };
}

// ───────────── photos ─────────────

const photoKinds = z.enum(['main', 'detail', 'receipt']);

/** Called by the uploader after files are in Blob storage. */
export async function addPhotos(bikeId: string, kind: 'main' | 'detail' | 'receipt', photos: { url: string; caption: string }[]) {
  const user = await requireStaff();
  photoKinds.parse(kind);
  const urls = z.array(z.object({ url: z.url(), caption: z.string().max(200) })).max(40).parse(photos);
  const last = await db.bikePhoto.aggregate({ where: { bikeId, kind }, _max: { sortOrder: true } });
  let order = (last._max.sortOrder ?? -1) + 1;
  await db.bikePhoto.createMany({
    data: urls.map((p) => ({ bikeId, kind, url: p.url, caption: p.caption || null, sortOrder: order++ })),
  });
  await audit(user.id, 'bike.photos_add', bikeId, { kind, count: urls.length });
  updateTag(BIKES_TAG);
}

export async function updatePhotoCaption(photoId: string, caption: string) {
  await requireStaff();
  await db.bikePhoto.update({ where: { id: photoId }, data: { caption: caption.trim().slice(0, 200) || null } });
  updateTag(BIKES_TAG);
}

export async function movePhoto(photoId: string, direction: -1 | 1) {
  await requireStaff();
  const photo = await db.bikePhoto.findUnique({ where: { id: photoId } });
  if (!photo) return;
  const siblings = await db.bikePhoto.findMany({ where: { bikeId: photo.bikeId, kind: photo.kind }, orderBy: { sortOrder: 'asc' } });
  const i = siblings.findIndex((p) => p.id === photoId);
  const j = i + direction;
  if (j < 0 || j >= siblings.length) return;
  [siblings[i], siblings[j]] = [siblings[j], siblings[i]];
  await db.$transaction(siblings.map((p, n) => db.bikePhoto.update({ where: { id: p.id }, data: { sortOrder: n } })));
  updateTag(BIKES_TAG);
}

export async function deletePhoto(photoId: string) {
  const user = await requireStaff();
  const photo = await db.bikePhoto.delete({ where: { id: photoId } });
  // Promo banners are shared with the library and other bikes: only delete files nothing else uses.
  const shared =
    (await db.promoAsset.count({ where: { url: photo.url } })) + (await db.bikePhoto.count({ where: { url: photo.url } }));
  if (!shared && photo.url.includes('.blob.vercel-storage.com')) await del(photo.url).catch(() => undefined);
  await audit(user.id, 'bike.photo_delete', photo.bikeId, { url: photo.url });
  updateTag(BIKES_TAG);
}

/** Copy promo banners from the library into a bike's main photos (added at the end of the gallery). */
export async function addPromosToBike(bikeId: string, promoIds: string[]) {
  const user = await requireStaff();
  const ids = z.array(z.string().min(1)).min(1).max(20).parse(promoIds);
  // Keep the order staff ticked them in.
  const promos = (await db.promoAsset.findMany({ where: { id: { in: ids } } })).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  if (!promos.length) return;
  const last = await db.bikePhoto.aggregate({ where: { bikeId, kind: 'main' }, _max: { sortOrder: true } });
  let order = (last._max.sortOrder ?? -1) + 1;
  await db.bikePhoto.createMany({
    data: promos.map((p) => ({ bikeId, kind: 'main' as const, url: p.url, caption: p.title, sortOrder: order++ })),
  });
  await audit(user.id, 'bike.promos_add', bikeId, { promoIds: promos.map((p) => p.id) });
  updateTag(BIKES_TAG);
}

/** Set or clear the walkaround video (an uploaded file URL or a YouTube / Vimeo link). */
export async function setBikeVideo(bikeId: string, url: string | null): Promise<FormResult> {
  const user = await requireStaff();
  const clean = url?.trim() || null;
  if (clean && !z.url().safeParse(clean).success) return { ok: false, error: 'That does not look like a link. Paste the full address, starting https://' };
  const before = await db.bike.findUnique({ where: { id: bikeId }, select: { videoUrl: true } });
  await db.bike.update({ where: { id: bikeId }, data: { videoUrl: clean } });
  // Remove the old file from storage, but never a promo/library asset or an external link.
  const old = before?.videoUrl;
  if (old && old !== clean && old.includes('.blob.vercel-storage.com') && old.includes(`/bikes/${bikeId}/video/`)) {
    await del(old).catch(() => undefined);
  }
  await audit(user.id, clean ? 'bike.video_set' : 'bike.video_remove', bikeId, { url: clean });
  updateTag(BIKES_TAG);
  return { ok: true };
}

// ───────────── purchase & costs ─────────────

export async function saveAcquisition(_prev: FormResult, form: FormData): Promise<FormResult> {
  const user = await requireStaff();
  const bikeId = String(form.get('bikeId'));
  const parsed = acquisitionSchema.safeParse(fromForm(form));
  if (!parsed.success) return zodError(parsed.error);
  const { purchasePricePounds, sellerName, notes, ...rest } = parsed.data;
  const data = { ...rest, purchasePrice: purchasePricePounds * 100, sellerName: sellerName ?? null, notes: notes ?? null };
  await db.acquisition.upsert({ where: { bikeId }, create: { bikeId, ...data }, update: data });
  await audit(user.id, 'bike.acquisition', bikeId, { purchasePrice: data.purchasePrice });
  return { ok: true, message: 'Purchase saved.' };
}

export async function addCost(_prev: FormResult, form: FormData): Promise<FormResult> {
  const user = await requireStaff();
  const bikeId = String(form.get('bikeId'));
  const parsed = costSchema.safeParse(fromForm(form));
  if (!parsed.success) return zodError(parsed.error);
  const amount = Math.round(parsed.data.amountPounds * 100);
  await db.bikeCost.create({ data: { bikeId, category: parsed.data.category, amount, note: parsed.data.note ?? null } });
  await audit(user.id, 'bike.cost_add', bikeId, { amount, category: parsed.data.category });
  return { ok: true, message: 'Cost added.' };
}

export async function deleteCost(costId: string) {
  const user = await requireStaff();
  const cost = await db.bikeCost.delete({ where: { id: costId } });
  await audit(user.id, 'bike.cost_delete', cost.bikeId, { amount: cost.amount });
}

// ───────────── sale & archive ─────────────

export async function markSold(_prev: FormResult, form: FormData): Promise<FormResult> {
  const user = await requireStaff();
  const bikeId = String(form.get('bikeId'));
  const parsed = soldSchema.safeParse(fromForm(form));
  if (!parsed.success) return zodError(parsed.error);
  const { soldPricePounds, soldAt, buyerName, buyerEmail, buyerPhone } = parsed.data;

  let buyerId: string | null = null;
  if (buyerName || buyerEmail) {
    const [firstName, ...last] = (buyerName ?? buyerEmail ?? 'Customer').split(' ');
    const buyer = buyerEmail
      ? await db.customer.upsert({
          where: { email: buyerEmail },
          create: { firstName, lastName: last.join(' ') || null, email: buyerEmail, phone: buyerPhone ?? null, source: 'bike sale' },
          update: { phone: buyerPhone ?? undefined },
        })
      : await db.customer.create({ data: { firstName, lastName: last.join(' ') || null, phone: buyerPhone ?? null, source: 'bike sale' } });
    buyerId = buyer.id;
  }

  await db.bike.update({ where: { id: bikeId }, data: { status: 'sold', soldAt, soldPrice: soldPricePounds * 100, buyerId } });
  await audit(user.id, 'bike.sold', bikeId, { soldPrice: soldPricePounds * 100 });
  updateTag(BIKES_TAG);
  return { ok: true, message: 'Marked as sold. Removed from the website.' };
}

export async function setArchived(bikeId: string, archived: boolean) {
  const user = await requireStaff();
  await db.bike.update({ where: { id: bikeId }, data: { status: archived ? 'archived' : 'draft' } });
  await audit(user.id, archived ? 'bike.archive' : 'bike.unarchive', bikeId);
  updateTag(BIKES_TAG);
}
