import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IconSprite } from '@/components/ui/IconSprite';
import { site } from '@/lib/site';
import '@/styles/globals.css';
import '@/styles/account.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.png', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <IconSprite />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
