import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { LEAD_PHOTO_MAX_BYTES, LEAD_PHOTO_MAX_COUNT, LEAD_REQUEST_MAX_BYTES } from '@/lib/lead-photos';
import { db } from '@/server/db';
import { createLead } from '@/server/services/leads';
import { removeLeadPhotos, storeLeadPhotos, type StoredLeadPhoto } from '@/server/services/lead-photos';

export const maxDuration = 60;

const schema = z.object({
  type: z.enum(['enquiry', 'viewing', 'finance', 'part_exchange', 'sell_bike', 'insurance', 'stock_alert', 'newsletter', 'workshop']),
  name: z.string().trim().max(120).optional(),
  email: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.email().max(200).optional()),
  phone: z.string().trim().max(40).optional(),
  message: z.string().max(5000).optional(),
  fields: z.record(z.string().max(100), z.string().max(2000)).default({}),
  sourcePage: z.string().max(200).optional(),
  bikeSlug: z.string().max(120).optional(),
  marketingConsent: z.boolean().optional(),
  /** Honeypot: real people never fill this hidden field. */
  website: z.string().optional(),
});

/** Every website form posts here. Creates/updates the customer, adds a CRM lead and sends the emails. */
export async function POST(request: Request) {
  let body: unknown;
  let photos: File[] = [];
  try {
    // Bound the actual stream as well as Content-Length (which may be absent).
    if (Number(request.headers.get('content-length')) > LEAD_REQUEST_MAX_BYTES) return NextResponse.json({ error: 'Please send fewer or smaller photos.' }, { status: 413 });
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > LEAD_REQUEST_MAX_BYTES) {
        await reader.cancel();
        return NextResponse.json({ error: 'Please send fewer or smaller photos.' }, { status: 413 });
      }
      chunks.push(value);
    }
    const contentType = request.headers.get('content-type') ?? '';
    const content = new Response(Buffer.concat(chunks), { headers: { 'Content-Type': contentType } });
    if (contentType.startsWith('multipart/form-data')) {
      const form = await content.formData();
      const payload = form.get('payload');
      if (typeof payload !== 'string') throw new Error('Missing enquiry');
      body = JSON.parse(payload);
      const uploads = form.getAll('photos');
      if (uploads.some((file) => !(file instanceof File))) throw new Error('Invalid photo');
      photos = uploads as File[];
    } else {
      body = await content.json();
    }
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
  const input = parsed.data;

  // Bots fill every field; pretend it worked.
  if (input.website) return NextResponse.json({ ok: true });

  const phoneDigits = input.phone?.replace(/\D/g, '') ?? '';
  if (!input.email && phoneDigits.length < 7) {
    return NextResponse.json({ error: 'Please give us an email address or phone number so we can reply.' }, { status: 400 });
  }
  if (Object.keys(input.fields).length > 60) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  if (photos.length > LEAD_PHOTO_MAX_COUNT || (photos.length && !['part_exchange', 'sell_bike'].includes(input.type))) {
    return NextResponse.json({ error: 'Please attach up to 12 bike photos to your valuation.' }, { status: 400 });
  }
  for (const photo of photos) {
    const header = Buffer.from(await photo.slice(0, 12).arrayBuffer());
    if (!photo.size || photo.size > LEAD_PHOTO_MAX_BYTES || photo.type !== 'image/webp' || header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP') {
      return NextResponse.json({ error: 'A photo could not be read. Please choose the photos again.' }, { status: 400 });
    }
  }

  if (input.bikeSlug && !await db.bike.findFirst({ where: { slug: input.bikeSlug, visible: true, status: 'available' }, select: { id: true } })) {
    return NextResponse.json({ error: 'That bike is no longer available. Refresh the page to choose another bike, or send an enquiry without selecting one.' }, { status: 409 });
  }

  // Simple flood protection: max 5 submissions per email/phone in 10 minutes.
  const since = new Date(Date.now() - 10 * 60_000);
  const recent = await db.lead.count({
    where: {
      createdAt: { gte: since },
      customer: { OR: [...(input.email ? [{ email: input.email.toLowerCase() }] : []), ...(phoneDigits ? [{ phone: { contains: phoneDigits.slice(-9) } }] : [])] },
    },
  });
  if (recent >= 5) return NextResponse.json({ error: 'Thanks, we already have your details. We will be in touch soon.' }, { status: 429 });

  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip');
  const submissionIpHash = ip ? createHash('sha256').update(`${process.env.BETTER_AUTH_SECRET}:${ip}`).digest('hex') : undefined;
  if (submissionIpHash && await db.lead.count({ where: { submissionIpHash, createdAt: { gte: since } } }) >= 10) {
    return NextResponse.json({ error: 'Too many enquiries. Please try again in a few minutes.' }, { status: 429 });
  }

  let stored: StoredLeadPhoto[] = [];
  try {
    stored = await storeLeadPhotos(photos);
    await createLead({ ...input, photos: stored, submissionIpHash });
    return NextResponse.json({ ok: true });
  } catch (e) {
    await removeLeadPhotos(stored).catch(() => console.error('[lead photos] cleanup failed'));
    console.error('[lead failed]', e);
    return NextResponse.json({ error: photos.length ? 'We could not save your enquiry and photos. Please try again; your selected photos are still here.' : 'Something went wrong. Please call us on 0744 072 1478.' }, { status: 500 });
  }
}
