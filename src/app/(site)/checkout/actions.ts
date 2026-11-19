'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { basketClearUrl } from '@/lib/checkout-urls';
import { getUser } from '@/server/auth';
import { db } from '@/server/db';
import { markOrderPaid, startCheckout, testPaymentsAllowed } from '@/server/services/checkout';
import { customerForUser } from '@/server/services/customers';

const schema = z.object({
  bikeSlug: z.string().max(120).optional(),
  lines: z.array(z.object({ variantId: z.string().max(40), qty: z.number().int().min(1).max(10) })).max(30),
  code: z.string().max(40).optional(),
  fulfilment: z.enum(['collection', 'delivery']),
  firstName: z.string().trim().min(1, 'Add your first name').max(80),
  lastName: z.string().trim().max(80),
  phone: z.string().trim().min(7, 'Add a mobile number so we can text you updates').max(40),
  deliveryPostcode: z.string().trim().max(10).optional(),
  deliveryAddress: z.string().trim().max(200).optional(),
  balanceMethod: z.enum(['finance', 'bank_transfer', 'part_exchange']).optional(),
  partExReg: z.string().trim().max(10).optional(),
  terms: z.boolean().refine((v) => v, 'Please tick to agree to the terms.'),
  cancelPath: z.string().startsWith('/').max(200),
});

export type CheckoutPayload = z.input<typeof schema>;

/** Reserve page / kit checkout → Stripe (or the local test payment page). */
export async function beginCheckout(payload: CheckoutPayload): Promise<{ url: string } | { error: string }> {
  const user = await getUser();
  if (!user) return { error: 'Please sign in first.' };
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Please check your details.' };
  const d = parsed.data;
  if (d.fulfilment === 'delivery' && (!d.deliveryPostcode || !d.deliveryAddress)) return { error: 'Add the delivery address and postcode.' };

  const customer = await customerForUser(user);
  await db.customer.update({
    where: { id: customer.id },
    data: {
      firstName: d.firstName,
      lastName: d.lastName || customer.lastName,
      phone: d.phone,
      ...(d.fulfilment === 'delivery' ? { addressLine1: d.deliveryAddress, postcode: d.deliveryPostcode?.toUpperCase() } : {}),
    },
  });

  try {
    return await startCheckout({ ...d, customerId: customer.id, email: user.email });
  } catch (e) {
    console.error('[checkout]', e);
    return { error: 'Payment could not be started. Please try again or call us on 0744 072 1478.' };
  }
}

/** Local testing only (ALLOW_TEST_PAYMENTS=1): pretend the card payment succeeded. */
export async function payTestOrder(form: FormData) {
  if (!testPaymentsAllowed) throw new Error('Test payments are off');
  const user = await getUser();
  const ref = String(form.get('ref'));
  const order = await db.order.findUnique({ where: { reference: ref }, include: { customer: true } });
  if (!user || !order || order.customer.userId !== user.id) redirect('/login');
  const amount = order.depositAmount + order.itemsTotal - order.discountTotal + order.deliveryFee;
  await markOrderPaid(order.id, { amount, providerRef: `test_${order.id}`, provider: 'test' });
  redirect(basketClearUrl(order.bikeId ? `/account?paid=${ref}` : `/account/orders?paid=${ref}`));
}
