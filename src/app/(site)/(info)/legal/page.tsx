import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';
import { legalPages, type LegalSlug } from '@/lib/cms';
import { getLegalPage, pageMetadata } from '@/server/services/cms';
import { CookieSettingsLink } from '@/components/layout/CookieConsent';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/legal', {
    title: 'Legal & policies',
    description: 'GearUp Motorcycles terms of sale, privacy, cookies, returns, warranty, delivery, insurance and complaints policies.',
  });
}

const icons: Record<LegalSlug, IconName> = {
  terms: 'doc',
  privacy: 'lock',
  cookies: 'info',
  returns: 'undo',
  'vehicle-condition': 'shieldcheck',
  delivery: 'truck',
  insurance: 'umbrella',
  complaints: 'chat',
};

/** One page that links to every policy, so the footer only needs a single link. */
export default async function LegalHubPage() {
  const slugs = Object.keys(legalPages) as LegalSlug[];
  const pages = await Promise.all(slugs.map((s) => getLegalPage(s)));
  return (
    <>
      <section className="phero">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <span>Legal &amp; policies</span>
            </div>
            <h1 className="disp">
              Legal &amp; <em>policies</em>
            </h1>
            <p className="lede">Everything you need to know about buying from GearUp Motorcycles, in plain English.</p>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="legal-hub">
            {slugs.map((s, i) => (
              <Link key={s} href={legalPages[s].path} className="legal-card">
                <span className="lc-ic">
                  <Icon name={icons[s]} />
                </span>
                <span>
                  <b>{pages[i].title || legalPages[s].title}</b>
                  <small>{legalPages[s].about}</small>
                </span>
                <Icon name="right" className="i lc-go" />
              </Link>
            ))}
          </div>
          <p className="muted mt2" style={{ fontSize: 14 }}>
            Want to change your cookie choice? <CookieSettingsLink />
          </p>
        </div>
      </section>
    </>
  );
}
