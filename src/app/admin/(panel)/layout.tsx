import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { requireStaff } from '@/server/auth';

/** Every /admin page except the login: staff only. */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const user = await requireStaff();

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <a href="/admin" className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo/gearup-logo.webp" alt="GearUp" />
          <span>Admin</span>
        </a>
        <AdminNav role={user.role} />
        <div className="adm-me">
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
