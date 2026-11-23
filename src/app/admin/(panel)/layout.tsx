import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { IconSprite } from '@/components/ui/IconSprite';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { requireStaff } from '@/server/auth';

/** Every /admin page except the login: staff only. */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const user = await requireStaff();

  return (
    <div className="adm-shell">
      <IconSprite />
      <aside className="adm-side">
        <a href="/admin" className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo/gearup-logo.webp" alt="GearUp" />
          <span>Admin</span>
        </a>
        <AdminNav role={user.role} />
        <div className="adm-me">
          <span className="adm-avatar" aria-hidden="true">
            {user.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div>
            <b>{user.name}</b>
            <small>{user.role}</small>
          </div>
          <SignOutButton />
        </div>
      </aside>
      <div className="adm-main">{children}</div>
    </div>
  );
}
