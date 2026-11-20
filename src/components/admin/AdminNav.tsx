'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string; soon?: string; adminOnly?: boolean };

const sections: { title: string; items: Item[] }[] = [
  { title: '', items: [{ href: '/admin', label: 'Dashboard' }] },
  {
    title: 'DMS',
    items: [
      { href: '/admin/stock', label: 'Stock' },
      { href: '/admin/promos', label: 'Promo library' },
      { href: '/admin/sales', label: 'Sales & reservations' },
      { href: '/admin/valuations', label: 'Part-ex & valuations' },
    ],
  },
  {
    title: 'CRM',
    items: [
      { href: '/admin/customers', label: 'Customers' },
      { href: '/admin/leads', label: 'Leads & enquiries' },
    ],
  },
  {
    title: 'Shop & website',
    items: [
      { href: '/admin/accessories', label: 'Accessories' },
      { href: '/admin/website', label: 'Website (CMS)' },
    ],
  },
  { title: '', items: [{ href: '/admin/settings', label: 'Settings', soon: 'M4', adminOnly: true }] },
];

export function AdminNav({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <nav className="adm-nav" aria-label="Admin">
      {sections.map((s, i) => (
        <div key={i} className="adm-nav-group">
          {s.title && <span className="adm-nav-title">{s.title}</span>}
          {s.items
            .filter((it) => !it.adminOnly || role === 'admin')
            .map((it) => {
              const active = it.href === '/admin' ? pathname === '/admin' : pathname.startsWith(it.href);
              return it.soon ? (
                <span key={it.href} className="adm-nav-link soon" title={`Coming in ${it.soon}`}>
                  {it.label}
                  <i>{it.soon}</i>
                </span>
              ) : (
                <Link key={it.href} href={it.href} className={active ? 'adm-nav-link on' : 'adm-nav-link'}>
                  {it.label}
                </Link>
              );
            })}
        </div>
      ))}
    </nav>
  );
}
