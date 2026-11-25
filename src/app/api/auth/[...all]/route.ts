import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/server/auth';
import { emailConfigured } from '@/server/services/email';

const handlers = toNextJsHandler(auth);
export const GET = handlers.GET;

export async function POST(request: Request) {
  // Give every email address the same response while mail is unavailable.
  // Do this before account lookup so the response cannot reveal whether an account exists.
  if (new URL(request.url).pathname.replace(/\/$/, '').endsWith('/request-password-reset') && !emailConfigured()) {
    return Response.json({ code: 'EMAIL_UNAVAILABLE', message: 'Password reset emails are temporarily unavailable. Please contact us for help.' }, { status: 503 });
  }
  return handlers.POST(request);
}
