import 'server-only';
import type { LeadType } from '@/generated/prisma/client';
import { db } from '../db';
import { renderEmail, sendEmail } from './email';
import type { StoredLeadPhoto } from './lead-photos';

export const leadTypeLabels: Record<LeadType, string> = {
  enquiry: 'General enquiry',
  viewing: 'Viewing request',
  finance: 'Finance application',
  part_exchange: 'Part-exchange valuation',
  sell_bike: 'Sell your bike',
  insurance: 'Insurance quote',
  stock_alert: 'Stock alert',
  newsletter: 'Newsletter',
  workshop: 'Workshop booking',
};

/** What the customer is told in the confirmation email. */
const confirmCopy: Record<LeadType, string> = {
  enquiry: 'Thanks for getting in touch. One of the team will reply within a few working hours.',
  viewing: 'Thanks, we have your viewing request. We will call or message you to confirm the time.',
  finance: 'Thanks, we have your finance details. We will pass them to our finance partner and come back to you with options.',
  part_exchange: 'Thanks, we have your bike details. We will come back with a valuation, usually within 24 hours.',
  sell_bike: 'Thanks, we have your bike details. We will come back with a cash offer, usually within 24 hours.',
  insurance: 'Thanks, we have your details. Our insurance partner will be in touch with quotes.',
  stock_alert: 'Your stock alert is set. We will message you as soon as a matching bike arrives, before it goes online.',
  newsletter: 'Thanks for signing up. We will send you new arrivals and offers. You can unsubscribe at any time.',
  workshop: 'Thanks, we have your workshop booking request. We will confirm the date and time with you shortly.',
};

export type LeadInput = {
  type: LeadType;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  fields: Record<string, string>;
  sourcePage?: string;
  bikeSlug?: string;
  marketingConsent?: boolean;
  photos?: StoredLeadPhoto[];
  submissionIpHash?: string;
};

function splitName(name?: string) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? 'Website visitor', lastName: parts.slice(1).join(' ') || null };
}

/** Find the customer by email (then phone), or create them. Fills in blanks on an existing record. */
async function upsertCustomer(input: LeadInput) {
  const email = input.email?.trim().toLowerCase() || null;
  const phone = input.phone?.replace(/[^\d+]/g, '') || null;
  const { firstName, lastName } = splitName(input.name);
  const postcode = Object.entries(input.fields).find(([k]) => /postcode/i.test(k))?.[1]?.toUpperCase() ?? null;

  const existing =
    (email ? await db.customer.findUnique({ where: { email } }) : null) ?? (phone ? await db.customer.findFirst({ where: { phone } }) : null);

  if (existing) {
    return db.customer.update({
      where: { id: existing.id },
      data: {
        phone: existing.phone ?? phone,
        email: existing.email ?? email,
        lastName: existing.lastName ?? lastName,
        firstName: existing.firstName === 'Website visitor' && input.name ? firstName : existing.firstName,
        postcode: existing.postcode ?? postcode,
        marketingConsent: existing.marketingConsent || Boolean(input.marketingConsent),
      },
    });
  }
  return db.customer.create({
    data: { firstName, lastName, email, phone, postcode, source: input.sourcePage ?? 'website', marketingConsent: Boolean(input.marketingConsent) },
  });
}

/** Website form → customer + lead + emails. */
export async function createLead(input: LeadInput) {
  const customer = await upsertCustomer(input);
  const bike = input.bikeSlug ? await db.bike.findUnique({ where: { slug: input.bikeSlug }, select: { id: true, year: true, make: true, model: true } }) : null;

  const lead = await db.lead.create({
    data: {
      type: input.type,
      customerId: customer.id,
      bikeId: bike?.id ?? null,
      message: input.message?.slice(0, 5000) || null,
      data: input.fields,
      sourcePage: input.sourcePage?.slice(0, 200) ?? null,
      submissionIpHash: input.submissionIpHash,
      photos: input.photos?.length ? { create: input.photos } : undefined,
    },
  });

  const label = leadTypeLabels[input.type];
  const who = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gearup-website-ten.vercel.app';
  const rows: [string, string][] = [
    ['Name', who],
    ...(customer.email ? ([['Email', customer.email]] as [string, string][]) : []),
    ...(customer.phone ? ([['Phone', customer.phone]] as [string, string][]) : []),
    ...(bike ? ([['Bike', `${bike.year} ${bike.make} ${bike.model}`]] as [string, string][]) : []),
    ...(input.photos?.length ? ([['Photos', `${input.photos.length} attached — open the CRM to view them`]] as [string, string][]) : []),
    ...Object.entries(input.fields).filter(([, v]) => v),
  ];

  const staffTo = process.env.STAFF_NOTIFY_EMAIL ?? 'sales@gearupmotorcycles.co.uk';
  const staff = renderEmail({
    heading: `New ${label.toLowerCase()}`,
    paragraphs: [`${who} sent a ${label.toLowerCase()} from ${input.sourcePage ?? 'the website'}.`],
    rows,
    cta: { label: 'Open in the CRM', href: `${site}/admin/leads/${lead.id}` },
  });
  const jobs: Promise<unknown>[] = [
    sendEmail({ to: staffTo, subject: `New ${label.toLowerCase()}: ${who}`, ...staff, replyTo: customer.email ?? undefined }),
  ];
  if (customer.email) {
    const mail = renderEmail({
      heading: `Thanks, ${customer.firstName}`,
      paragraphs: [confirmCopy[input.type], 'If anything is urgent, call us on 0744 072 1478 or WhatsApp us.'],
      rows: Object.entries(input.fields).filter(([, v]) => v).slice(0, 12),
    });
    jobs.push(sendEmail({ to: customer.email, subject: `GearUp Motorcycles: ${label} received`, ...mail }));
  }
  await Promise.allSettled(jobs);

  return lead;
}
