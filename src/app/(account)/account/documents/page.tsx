import type { Metadata } from 'next';
import { AccountShell } from '@/components/account/AccountShell';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Documents · My account',
  description: 'Your receipts, HPI report, MOT certificate, inspection report, invoice and warranty.',
};

export default function DocumentsPage() {
  return (
    <>
      <PagePlaceholder title="Documents" legacyFile="account-documents.html" />
      <AccountShell>{null}</AccountShell>
    </>
  );
}
