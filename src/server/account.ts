import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { requireUser, STAFF_ROLES } from './auth';
import { db } from './db';
import { customerForUser } from './services/customers';

/** Signed-in user + their CRM customer, once per request. Redirects to /login if signed out. */
export const getAccount = cache(async () => {
  const user = await requireUser();
  // Staff sign in through the same login: send them to the admin, not the customer account.
  if (STAFF_ROLES.includes(user.role)) redirect('/admin');
  const customer = await customerForUser(user);
  const savedCount = await db.savedBike.count({ where: { customerId: customer.id } });
  return { user, customer, savedCount };
});

/** Customer number shown in the account menu, e.g. GU-7F3A2C. */
export const customerNumber = (id: string) => `GU-${id.slice(-6).toUpperCase()}`;
