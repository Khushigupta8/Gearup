import 'server-only';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Role } from '@/generated/prisma/client';
import { db } from './db';
import { customerForUser } from './services/customers';
import { renderEmail, sendEmail } from './services/email';

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      const mail = renderEmail({
        heading: 'Reset your password',
        paragraphs: [`Hi ${user.name.split(' ')[0]}, use the button below to choose a new password. The link works for one hour.`, "If you didn't ask for this, you can ignore this email."],
        cta: { label: 'Choose a new password', href: url },
      });
      await sendEmail({ to: user.email, subject: 'Reset your GearUp password', ...mail });
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Every website account gets a CRM customer (joined up with any earlier enquiries by email).
        after: async (user) => {
          await customerForUser(user);
        },
      },
    },
  },
  user: {
    additionalFields: {
      // Never settable from the sign-up form; staff roles are given in the admin.
      role: { type: 'string', defaultValue: 'customer', input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies()],
});

export type SessionUser = { id: string; name: string; email: string; role: Role };

export const STAFF_ROLES: Role[] = ['sales', 'manager', 'admin'];

/** Current signed-in user, or null. Use in server components, actions and route handlers. */
export async function getUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const { id, name, email, role } = session.user as typeof session.user & { role: Role };
  return { id, name, email, role };
}

/** For /admin pages and actions: must be staff, optionally with one of the given roles. */
export async function requireStaff(roles: Role[] = STAFF_ROLES): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect('/admin/login');
  if (!roles.includes(user.role)) redirect('/admin/login?denied=1');
  return user;
}

/** For /account pages: any signed-in user. */
export async function requireUser(next = '/account'): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
