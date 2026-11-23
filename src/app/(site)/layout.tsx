import type { ReactNode } from 'react';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IconSprite } from '@/components/ui/IconSprite';

/** Public website: icon sprite, header, footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <IconSprite />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
