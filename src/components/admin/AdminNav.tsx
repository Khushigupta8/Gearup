'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

type Item = {
  href: string;
  label: string;
  icon: IconName;
  soon?: string;
  adminOnly?: boolean;
};

const sections: { title: string; items: Item[] }[] = [
  { title: '', items: [{ href: '/admin', label: 'Dashboard', icon: 'grid' }] },
  {
    title: 'DMS',
    items: [
      { href: '/admin/stock', label: 'Stock', icon: 'moto' },
      { href: '/admin/promos', label: 'Promo library', icon: 'tag' },
      { href: '/admin/sales', label: 'Sales & reservations', icon: 'cart' },
      {
        href: '/admin/valuations',
        label: 'Part-ex & valuations',
        icon: 'swap',
      },
    ],
  },
  {
    title: 'CRM',
    items: [
      { href: '/admin/customers', label: 'Customers', icon: 'users' },
      { href: '/admin/leads', label: 'Leads & enquiries', icon: 'mail' },
    ],
  },
  {
    title: 'Shop & website',
    items: [
      { href: '/admin/accessories', label: 'Accessories', icon: 'helmet' },
      { href: '/admin/website', label: 'Website (CMS)', icon: 'home' },
    ],
  },
  {
    title: '',
    items: [
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: 'gear',
        soon: 'M4',
        adminOnly: true,
      },
    ],
  },
];

export function AdminNav({ role }: { role: string }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  // The phone menu closes by itself after navigating (it is only open for the page it was opened on).
  const open = openOn === pathname;
  const current = sections
    .flatMap((s) => s.items)
    .filter((it) => !it.soon)
    .sort((a, b) => b.href.length - a.href.length)
    .find((it) => (it.href === '/admin' ? pathname === '/admin' : pathname.startsWith(it.href)));

  return (
    <>
      <button type="button" className="adm-menubtn" aria-expanded={open} aria-controls="adm-nav" onClick={() => setOpenOn(open ? null : pathname)}>
        <span>{current?.label ?? 'Menu'}</span>
        <Icon name={open ? 'x' : 'menu'} />
      </button>
      <nav id="adm-nav" className={open ? 'adm-nav open' : 'adm-nav'} aria-label="Admin">
        {sections.map((s, i) => (
          <div key={i} className="adm-nav-group">
            {s.title && <span className="adm-nav-title">{s.title}</span>}
            {s.items
              .filter((it) => !it.adminOnly || role === 'admin')
              .map((it) => {
                const active = it.href === '/admin' ? pathname === '/admin' : pathname.startsWith(it.href);
                return it.soon ? (
                  <span key={it.href} className="adm-nav-link soon" title={`Coming in ${it.soon}`}>
                    <Icon name={it.icon} className="i adm-ni" />
                    <span>{it.label}</span>
                    <i>{it.soon}</i>
                  </span>
                ) : (
                  <Link key={it.href} href={it.href} className={active ? 'adm-nav-link on' : 'adm-nav-link'} aria-current={active ? 'page' : undefined}>
                    <Icon name={it.icon} className="i adm-ni" />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>
    </>
  );
}
