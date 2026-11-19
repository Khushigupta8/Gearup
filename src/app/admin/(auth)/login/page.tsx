import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = { title: 'Staff sign in' };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; denied?: string }> }) {
  const { next, denied } = await searchParams;
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
