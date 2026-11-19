'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** A link that gets class "on" and aria-current when its route (or a child route) is open. */
export function NavLink({
  href,
  exact = false,
  className,
  children,
}: {
  href: string;
  exact?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const classes = [className, active && 'on'].filter(Boolean).join(' ') || undefined;

  return (
    <Link href={href} className={classes} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  );
}
