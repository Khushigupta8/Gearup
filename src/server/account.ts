import 'server-only';
import { cache } from 'react';
import { requireUser } from './auth';
import { db } from './db';
import { customerForUser } from './services/customers';

/** Signed-in user + their CRM customer, once per request. Redirects to /login if signed out. */
export const getAccount = cache(async () => {
  const user = await requireUser();
  const customer = await customerForUser(user);
  const savedCount = await db.savedBike.count({ where: { customerId: customer.id } });
  return { user, customer, savedCount };
});

/** Customer number shown in the account menu, e.g. GU-7F3A2C. */
export const customerNumber = (id: string) => `GU-${id.slice(-6).toUpperCase()}`;
