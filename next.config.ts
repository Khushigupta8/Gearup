import type { NextConfig } from 'next';

// Old static URLs (/finance.html etc.) keep working after the move to Next.js.
const legacyPages: Record<string, string> = {
  index: '/',
  bike: '/used-bikes',
  reserve: '/used-bikes',
  account: '/account',
  'account-orders': '/account/orders',
  'account-saved': '/account/saved',
  'account-documents': '/account/documents',
  'account-part-exchange': '/account/part-exchange',
  'account-details': '/account/details',
};

const nextConfig: NextConfig = {
  turbopack: { root: import.meta.dirname },
  async redirects() {
    return [
      ...Object.entries(legacyPages).map(([page, destination]) => ({
        source: `/${page}.html`,
        destination,
        permanent: true,
      })),
      { source: '/:page.html', destination: '/:page', permanent: true },
    ];
  },
};

export default nextConfig;
