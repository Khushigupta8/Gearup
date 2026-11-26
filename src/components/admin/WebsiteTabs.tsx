'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/admin/website', label: 'Business details' },
  { href: '/admin/website/hero', label: 'Home hero' },
  { href: '/admin/website/reviews', label: 'Reviews' },
  { href: '/admin/website/faqs', label: 'FAQs' },
  { href: '/admin/website/seo', label: 'SEO' },
  { href: '/admin/website/pages', label: 'Legal pages' },
  { href: '/admin/website/blog', label: 'Blog' },
];

export function WebsiteTabs() {
  const path = usePathname();
  return (
    <nav className="adm-tabs" aria-label="Website sections">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={path === t.href ? 'on' : undefined} aria-current={path === t.href ? 'page' : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
