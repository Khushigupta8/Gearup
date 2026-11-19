import 'server-only';
import { db } from '../db';

/**
 * The CRM customer for a signed-in user. Links an existing customer with the same email
 * (someone who enquired before registering) or creates one.
 */
export async function customerForUser(user: { id: string; name: string; email: string }) {
  const linked = await db.customer.findUnique({ where: { userId: user.id } });
  if (linked) return linked;

  const email = user.email.toLowerCase();
  const byEmail = await db.customer.findUnique({ where: { email } });
  if (byEmail) {
    if (!byEmail.userId) return db.customer.update({ where: { id: byEmail.id }, data: { userId: user.id } });
    return byEmail; // already linked to another login (shouldn't happen); don't steal it
  }

  const [firstName, ...rest] = (user.name || email.split('@')[0]).trim().split(/\s+/);
  return db.customer.create({ data: { userId: user.id, email, firstName, lastName: rest.join(' ') || null, source: 'website account' } });
}
