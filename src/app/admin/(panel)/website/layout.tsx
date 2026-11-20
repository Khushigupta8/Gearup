import type { ReactNode } from 'react';
import { WebsiteTabs } from '@/components/admin/WebsiteTabs';

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Website</h1>
          <p className="adm-muted">
            Edit what the website shows. Changes go live as soon as you save.{' '}
            <a href="/" target="_blank" rel="noopener" className="adm-link">
              Open the website ↗
            </a>
          </p>
        </div>
      </header>
      <WebsiteTabs />
      {children}
    </>
  );
}
