import Link from 'next/link';
import { Fragment } from 'react';
import { Icon } from '@/components/ui/Icon';
import { footerNav, mobileNav } from '@/lib/navigation';
import { site } from '@/lib/site';

export function Footer() {
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
              <a href={site.phone.href} className="btn btn-red">
                <Icon name="phone" />
                {site.phone.display}
              </a>
              <a href={site.whatsapp} className="btn btn-wa" target="_blank" rel="noopener">
                <Icon name="wa" />
                WhatsApp us
              </a>
            </div>
            <p className="blurb">
              {site.email}
              <br />
              Showroom address here
            </p>
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
              {site.hours.map(([day, time]) => (
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
            <span>© 2026 GearUp Motorcycles. Company no. and FCA details here.</span>
            <span>Terms · Privacy · Cookies · Complaints</span>
          </div>
        </div>
      </footer>
      <nav className="mbar" aria-label="Quick actions">
        <Link href="/contact">
          <Icon name="phone" />
          Call
        </Link>
        <a href={site.whatsapp} className="mwa">
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
