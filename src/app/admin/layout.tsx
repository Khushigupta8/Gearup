import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './admin.css';
import './admin-refresh.css';

export const metadata: Metadata = {
  title: { default: 'GearUp Admin', template: '%s · GearUp Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="adm">{children}</div>;
}
