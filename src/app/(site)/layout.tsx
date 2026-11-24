import type { ReactNode } from 'react';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IconSprite } from '@/components/ui/IconSprite';

// Stock and CMS content are loaded at request time. Builds must not need a live
// database; the explicit data caches still refresh when staff update the DMS.
export const dynamic = 'force-dynamic';

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
