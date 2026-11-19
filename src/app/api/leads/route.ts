import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { createLead } from '@/server/services/leads';

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
  try {
    body = await request.json();
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

  // Simple flood protection: max 5 submissions per email/phone in 10 minutes.
  const since = new Date(Date.now() - 10 * 60_000);
  const recent = await db.lead.count({
    where: {
      createdAt: { gte: since },
      customer: { OR: [...(input.email ? [{ email: input.email.toLowerCase() }] : []), ...(phoneDigits ? [{ phone: { contains: phoneDigits.slice(-9) } }] : [])] },
    },
  });
  if (recent >= 5) return NextResponse.json({ error: 'Thanks, we already have your details. We will be in touch soon.' }, { status: 429 });

  try {
    await createLead(input);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[lead failed]', e);
    return NextResponse.json({ error: 'Something went wrong. Please call us on 0744 072 1478.' }, { status: 500 });
  }
}
