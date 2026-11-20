import type { Metadata } from 'next';
import { LegalForm } from '@/components/admin/CmsForms';
import { legalPages } from '@/lib/cms';
import { requireStaff } from '@/server/auth';
import { getLegalPage } from '@/server/services/cms';

export const metadata: Metadata = { title: 'Website · Terms & privacy' };

export default async function WebsiteLegalPage() {
  await requireStaff(['manager', 'admin']);
  const [terms, privacy] = await Promise.all([getLegalPage('terms'), getLegalPage('privacy')]);
  return (
    <div className="adm-stack">
      <LegalForm slug="terms" page={terms} path={legalPages.terms.path} />
      <LegalForm slug="privacy" page={privacy} path={legalPages.privacy.path} />
    </div>
  );
}
