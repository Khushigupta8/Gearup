import type { Metadata } from 'next';
import { SeoForm } from '@/components/admin/CmsForms';
import { seoPages } from '@/lib/cms';
import { requireStaff } from '@/server/auth';
import { getSeo } from '@/server/services/cms';

export const metadata: Metadata = { title: 'Website · SEO' };

export default async function WebsiteSeoPage() {
  await requireStaff(['manager', 'admin']);
  return (
    <>
      <p className="adm-muted" style={{ margin: '0 0 12px' }}>
        Each bike&apos;s Google title and description are set on the bike itself (Stock → bike → Search engines).
      </p>
      <SeoForm pages={seoPages} seo={await getSeo()} />
    </>
  );
}
