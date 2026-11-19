import type { Metadata } from 'next';
import { AccountShell } from '@/components/account/AccountShell';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Part-exchange · My account',
  description: 'Add your current bike to your order and take its value off your balance.',
};

export default function AccountPartExchangePage() {
  return (
    <>
      <PagePlaceholder title="Part-exchange" legacyFile="account-part-exchange.html" />
      <AccountShell>{null}</AccountShell>
    </>
  );
}
