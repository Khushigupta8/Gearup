import type { Metadata } from 'next';
import { AccountShell } from '@/components/account/AccountShell';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'My orders · My account',
  description: 'Your GearUp orders: bike reservations and accessories, with their status.',
};

export default function OrdersPage() {
  return (
    <>
      <PagePlaceholder title="My orders" legacyFile="account-orders.html" />
      <AccountShell>{null}</AccountShell>
    </>
  );
}
