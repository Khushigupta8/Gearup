import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { mainNav } from '@/lib/navigation';
import { site } from '@/lib/site';
import { BasketCount } from './BasketCount';
import { MenuButton } from './MenuButton';
import { NavLink } from './NavLink';

export function Header() {
  return (
    <>
      <div className="promo">
        <div className="wrap">
          <ul>
            {site.promos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <a href={site.whatsapp} className="wa-pill" target="_blank" rel="noopener">
            <Icon name="wa" />
            <span>
              WhatsApp<span className="wa-us"> us</span>
            </span>
          </a>
        </div>
      </div>
      <header className="hd">
        <div className="hd-top">
          <div className="wrap">
            <Link href="/" className="logo" aria-label="GearUp Motorcycles home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/logo/gearup-logo.webp" alt={site.name} />
              <sup className="tm" aria-label="Registered trademark">
                ®
              </sup>
            </Link>
            <div className="hd-act">
              <a href={site.phone.href} className="call">
                <Icon name="phone" />
                <span>
                  Call the showroom<b>{site.phone.display}</b>
                </span>
              </a>
              <Link href="/account">
                <Icon name="pin" />
                Track my bike
              </Link>
              <Link href="/account/saved">
                <Icon name="heart" />
                Saved
              </Link>
              <Link href="/account">
                <Icon name="user" />
                Account
              </Link>
              <Link href="/basket" className="bsk">
                <Icon name="bag" />
                Basket
                <BasketCount />
              </Link>
            </div>
            <MenuButton />
          </div>
        </div>
        <nav className="nav2" aria-label="Main">
          <div className="wrap">
            {mainNav.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.icon && <Icon name={item.icon} />}
                {item.label}
              </NavLink>
            ))}
            <Link href="/used-bikes" className="cta">
              Reserve online
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
