import type { Metadata } from 'next';
import { AccountShell } from '@/components/account/AccountShell';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Track my bike · My account',
  description: 'Follow your bike through its pre-delivery inspection, pay the balance and track the delivery van live.',
};

export default function AccountPage() {
  return (
    <>
      <PagePlaceholder title="Track my bike" legacyFile="account.html" />
      <AccountShell>{null}</AccountShell>
    </>
  );
}
