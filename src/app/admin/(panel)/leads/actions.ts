'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';

const stages = ['new', 'contacted', 'viewing_booked', 'negotiating', 'won', 'lost'] as const;
export type CrmResult = { ok: true; message?: string } | { ok: false; error: string } | null;

const stageLabel: Record<(typeof stages)[number], string> = {
  new: 'New',
  contacted: 'Contacted',
  viewing_booked: 'Viewing booked',
  negotiating: 'Negotiating',
  won: 'Won',
  lost: 'Lost',
};

/** Stage, owner and follow-up date on a lead. Logs each change on the lead's timeline. */
export async function updateLead(_prev: CrmResult, form: FormData): Promise<CrmResult> {
  const user = await requireStaff();
  const parsed = z
    .object({
      id: z.string().min(1),
      stage: z.enum(stages),
      assignedToId: z.preprocess((v) => (v === '' ? null : v), z.string().nullable()),
      followUpAt: z.preprocess((v) => (v ? new Date(String(v)) : null), z.date().nullable()),
    })
    .safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, error: 'Check the fields.' };
  const { id, stage, assignedToId, followUpAt } = parsed.data;

  const before = await db.lead.findUnique({ where: { id }, include: { assignedTo: true } });
  if (!before) return { ok: false, error: 'Lead not found.' };
  await db.lead.update({ where: { id }, data: { stage, assignedToId, followUpAt } });

  const notes: string[] = [];
  if (before.stage !== stage) notes.push(`Stage: ${stageLabel[before.stage]} → ${stageLabel[stage]}`);
  if (before.assignedToId !== assignedToId) {
    const who = assignedToId ? (await db.user.findUnique({ where: { id: assignedToId } }))?.name : 'nobody';
    notes.push(`Assigned to ${who}`);
  }
  if ((before.followUpAt?.toISOString().slice(0, 10) ?? null) !== (followUpAt?.toISOString().slice(0, 10) ?? null)) {
    notes.push(followUpAt ? `Follow-up set for ${followUpAt.toLocaleDateString('en-GB')}` : 'Follow-up cleared');
  }
  if (notes.length) {
    await db.leadActivity.create({ data: { leadId: id, kind: 'update', body: notes.join(' · '), byUserId: user.id } });
  }
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath('/admin/leads');
  return { ok: true, message: 'Saved.' };
}

export async function addLeadNote(_prev: CrmResult, form: FormData): Promise<CrmResult> {
  const user = await requireStaff();
  const leadId = String(form.get('leadId') ?? '');
  const kind = z.enum(['note', 'call', 'email', 'whatsapp']).catch('note').parse(form.get('kind'));
  const body = String(form.get('body') ?? '').trim().slice(0, 4000);
  if (!leadId || !body) return { ok: false, error: 'Write a note first.' };
  await db.leadActivity.create({ data: { leadId, kind, body, byUserId: user.id } });
  // Contacting a new lead moves it on automatically.
  await db.lead.updateMany({ where: { id: leadId, stage: 'new' }, data: { stage: 'contacted' } });
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, message: 'Added.' };
}

export async function updateCustomer(_prev: CrmResult, form: FormData): Promise<CrmResult> {
  await requireStaff();
  const parsed = z
    .object({
      id: z.string().min(1),
      firstName: z.string().trim().min(1).max(80),
      lastName: z.string().trim().max(80).optional(),
      email: z.preprocess((v) => (v === '' ? null : v), z.email().nullable()),
      phone: z.string().trim().max(40).optional(),
      addressLine1: z.string().trim().max(120).optional(),
      town: z.string().trim().max(80).optional(),
      postcode: z.string().trim().max(10).optional(),
      notes: z.string().max(5000).optional(),
      marketingConsent: z.preprocess((v) => v === 'on', z.boolean()),
    })
    .safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, error: 'Check the name and email.' };
  const { id, email, ...rest } = parsed.data;
  const blank = (v?: string) => v || null;
  try {
    await db.customer.update({
      where: { id },
      data: {
        firstName: rest.firstName,
        lastName: blank(rest.lastName),
        email: email?.toLowerCase() ?? null,
        phone: blank(rest.phone),
        addressLine1: blank(rest.addressLine1),
        town: blank(rest.town),
        postcode: blank(rest.postcode?.toUpperCase()),
        notes: blank(rest.notes),
        marketingConsent: rest.marketingConsent,
      },
    });
  } catch {
    return { ok: false, error: 'Another customer already has that email.' };
  }
  revalidatePath(`/admin/customers/${id}`);
  return { ok: true, message: 'Saved.' };
}
