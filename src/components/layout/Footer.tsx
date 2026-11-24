import Link from 'next/link';
import { Fragment } from 'react';
import { Icon } from '@/components/ui/Icon';
import { footerNav, mobileNav } from '@/lib/navigation';
import { site } from '@/lib/site';
import { telHref, waHref, type Business } from '@/lib/cms';
import { getBusiness } from '@/server/services/cms';
import { CookieSettingsLink } from './CookieConsent';
import { SocialLinks } from './SocialLinks';

export async function Footer({ business }: { business?: Business } = {}) {
  const biz = business ?? await getBusiness();
  const wa = waHref(biz.whatsapp);
  return (
    <>
      <footer className="ftr">
        <div className="wrap">
          <div>
            <span className="ftr-logo" style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/logo/gearup-logo.webp" alt={site.name} style={{ height: 56, width: 'auto' }} />
              <sup className="tm" aria-label="Registered trademark">
                ®
              </sup>
            </span>
            <p className="blurb">{site.description}</p>
            <div className="ftr-acts">
              <a href={telHref(biz.phone)} className="btn btn-red">
                <Icon name="phone" />
                {biz.phone}
              </a>
              <a href={wa} className="btn btn-wa" target="_blank" rel="noopener">
                <Icon name="wa" />
                WhatsApp us
              </a>
            </div>
            <p className="blurb">
              <a href={`mailto:${biz.email}`}>{biz.email}</a>
              {biz.address &&
                biz.address.split(/\r?\n/).map((line) => (
                  <Fragment key={line}>
                    <br />
                    {line}
                  </Fragment>
                ))}
            </p>
            <SocialLinks socials={biz.socials} />
          </div>
          {footerNav.map((col) => (
            <div key={col.title}>
              <h5>{col.title}</h5>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h5>Opening hours</h5>
            <div className="hours">
              {biz.hours.map(([day, time]) => (
                <Fragment key={day}>
                  <span>{day}</span>
                  <span>{time}</span>
                </Fragment>
              ))}
            </div>
            <p className="blurb">
              <Link href="/about">About GearUp</Link>
            </p>
          </div>
        </div>
        <div className="legal">
          <div className="wrap">
            <span>
              © {new Date().getFullYear()} {site.name}.{biz.legalLine ? ` ${biz.legalLine}` : ''}
            </span>
            <span>
              <Link href="/legal">Legal &amp; policies</Link> · <CookieSettingsLink />
            </span>
          </div>
        </div>
      </footer>
      <nav className="mbar" aria-label="Quick actions">
        <Link href="/contact">
          <Icon name="phone" />
          Call
        </Link>
        <a href={wa} className="mwa">
          <Icon name="wa" />
          WhatsApp
        </a>
        <Link href="/used-bikes" className="r">
          Find a bike <Icon name="right" />
        </Link>
      </nav>
      <div className="mnav" aria-label="Mobile menu">
        {mobileNav.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
