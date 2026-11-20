import type { Metadata } from 'next';
import { LegalForm } from '@/components/admin/CmsForms';
import { legalPages, type LegalSlug } from '@/lib/cms';
import { requireStaff } from '@/server/auth';
import { getLegalPage } from '@/server/services/cms';

export const metadata: Metadata = { title: 'Website · Terms & privacy' };

export default async function WebsiteLegalPage() {
  await requireStaff(['manager', 'admin']);
  const slugs = Object.keys(legalPages) as LegalSlug[];
  const pages = await Promise.all(slugs.map((s) => getLegalPage(s, true)));
  return (
    <div className="adm-stack">
      <p className="adm-muted">
        Drafts written from the policies already on the site and UK consumer law. Please have them checked by a solicitor, fill in every [bracketed] detail, then
        tick Published. Until then each page shows a short &ldquo;being updated&rdquo; note and is hidden from Google.
      </p>
      {slugs.map((s, i) => (
        <LegalForm key={s} slug={s} page={pages[i]} path={legalPages[s].path} />
      ))}
    </div>
  );
}
