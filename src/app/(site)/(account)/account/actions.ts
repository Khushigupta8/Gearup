'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getUser } from '@/server/auth';
import { db } from '@/server/db';
import { customerForUser } from '@/server/services/customers';

export type AccountResult = { ok: true; message?: string } | { ok: false; error: string } | null;

export async function updateMyDetails(_prev: AccountResult, form: FormData): Promise<AccountResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'Please sign in again.' };
  const parsed = z
    .object({
      firstName: z.string().trim().min(1).max(80),
      lastName: z.string().trim().max(80),
      phone: z.string().trim().max(40),
      addressLine1: z.string().trim().max(120),
      town: z.string().trim().max(80),
      postcode: z.string().trim().max(10),
      marketingConsent: z.preprocess((v) => v === 'on', z.boolean()),
    })
    .safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, error: 'Please add your first name.' };
  const d = parsed.data;
  const customer = await customerForUser(user);
  const blank = (v: string) => v || null;
  await db.customer.update({
    where: { id: customer.id },
    data: {
      firstName: d.firstName,
      lastName: blank(d.lastName),
      phone: blank(d.phone),
      addressLine1: blank(d.addressLine1),
      town: blank(d.town),
      postcode: blank(d.postcode.toUpperCase()),
      marketingConsent: d.marketingConsent,
    },
  });
  await db.user.update({ where: { id: user.id }, data: { name: [d.firstName, d.lastName].filter(Boolean).join(' ') } });
  revalidatePath('/account', 'layout');
  return { ok: true, message: 'Saved.' };
}

/** Heart on a bike card. Returns null when signed out (the button sends them to sign in). */
export async function toggleSavedBike(slug: string): Promise<{ saved: boolean } | null> {
  const user = await getUser();
  if (!user) return null;
  const customer = await customerForUser(user);
  const bike = await db.bike.findUnique({ where: { slug }, select: { id: true } });
  if (!bike) return { saved: false };
  const key = { customerId_bikeId: { customerId: customer.id, bikeId: bike.id } };
  const existing = await db.savedBike.findUnique({ where: key });
  if (existing) await db.savedBike.delete({ where: key });
  else await db.savedBike.create({ data: { customerId: customer.id, bikeId: bike.id } });
  revalidatePath('/account/saved');
  return { saved: !existing };
}

/** Slugs the signed-in customer has saved (for filling in the hearts). */
export async function mySavedSlugs(): Promise<string[]> {
  const user = await getUser();
  if (!user) return [];
  // Read-only: don't create a customer just because someone is browsing while signed in.
  const customer = await db.customer.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!customer) return [];
  const rows = await db.savedBike.findMany({ where: { customerId: customer.id }, select: { bike: { select: { slug: true } } } });
  return rows.map((r) => r.bike.slug);
}
