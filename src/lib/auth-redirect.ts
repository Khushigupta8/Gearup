/** Keep sign-in return URLs on this site, including on the server's already-signed-in path. */
export function safeAccountPath(next?: string): string {
  if (!next?.startsWith('/') || next.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(next)) return '/account';
  const base = 'https://gearup.invalid';
  try {
    const url = new URL(next, base);
    if (url.origin !== base || /^\/(?:%2f|%5c)/i.test(url.pathname) || ['/login', '/admin/login'].includes(url.pathname.replace(/\/$/, ''))) return '/account';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/account';
  }
}
