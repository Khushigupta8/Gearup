import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Track my bike · My account',
  description: 'Follow your bike through its pre-delivery inspection, pay the balance and track the delivery van live.',
};

export default function AccountPage() {
  return <LegacyPage file="account" />;
}
