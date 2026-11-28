import 'server-only';
import { redirect } from 'next/navigation';
import { db } from '../db';

/**
 * The CRM customer for a signed-in user. Links an existing customer with the same email
 * (someone who enquired before registering) or creates one.
 */
export async function customerForUser(user: { id: string; name: string; email: string }) {
  // Read verification from the database, not the five-minute session cookie cache.
  const identity = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  // Protect both existing records and future enquiries submitted with this address.
  if (!identity.emailVerified) redirect('/verify-email');
  const linked = await db.customer.findUnique({ where: { userId: user.id } });
  if (linked) return linked;

  const email = identity.email.toLowerCase();
  const [firstName, ...rest] = (identity.name || email.split('@')[0]).trim().split(/\s+/);
  // Upsert by email so a simultaneous enquiry cannot race account creation.
  const customer = await db.customer.upsert({
    where: { email },
    update: {},
    create: { email, firstName, lastName: rest.join(' ') || null, source: 'website account' },
  });
  await db.customer.updateMany({ where: { id: customer.id, userId: null }, data: { userId: user.id } });
  const linkedCustomer = await db.customer.findUniqueOrThrow({ where: { id: customer.id } });
  if (linkedCustomer.userId === user.id) return linkedCustomer;
  redirect('/verify-email?conflict=1');
}
