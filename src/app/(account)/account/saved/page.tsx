import type { Metadata } from 'next';
import { AccountShell } from '@/components/account/AccountShell';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Saved bikes · My account',
  description: 'Bikes you have saved. Reserve one online for £99.',
};

export default function SavedPage() {
  return (
    <>
      <PagePlaceholder title="Saved bikes" legacyFile="account-saved.html" />
      <AccountShell>{null}</AccountShell>
    </>
  );
}
