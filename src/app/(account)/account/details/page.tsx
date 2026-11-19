import type { Metadata } from 'next';
import { AccountShell } from '@/components/account/AccountShell';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'My details · My account',
  description: 'Your contact details and delivery address.',
};

export default function DetailsPage() {
  return (
    <>
      <PagePlaceholder title="My details" legacyFile="account-details.html" />
      <AccountShell>{null}</AccountShell>
    </>
  );
}
