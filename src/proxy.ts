import { getSessionCookie } from 'better-auth/cookies';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Fast first gate: no session cookie → send to the right login page.
 * Real role checks happen on the server in requireStaff() / requireUser().
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  if (!getSessionCookie(request)) {
    const login = pathname.startsWith('/admin') ? '/admin/login' : '/login';
    const url = new URL(login, request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // /account stays open until the account pages read real data (M3); only the admin is locked now.
  matcher: ['/admin/:path*'],
};
