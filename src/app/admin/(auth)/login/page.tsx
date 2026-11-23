import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { getUser, STAFF_ROLES } from '@/server/auth';

export const metadata: Metadata = { title: 'Staff sign in' };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; denied?: string }> }) {
  const { next, denied } = await searchParams;
  const user = await getUser();
  if (user && STAFF_ROLES.includes(user.role) && !denied) redirect(next?.startsWith('/admin') ? next : '/admin');
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/logo/gearup-logo.webp" alt="GearUp Motorcycles" className="adm-login-logo" />
        <h1>Staff sign in</h1>
        <p className="adm-muted">DMS, CRM and website control.</p>
        {denied && <p className="adm-alert">That account doesn&apos;t have staff access. Sign in with a staff account.</p>}
        <AdminLoginForm next={next?.startsWith('/admin') ? next : '/admin'} />
      </div>
    </div>
  );
}
