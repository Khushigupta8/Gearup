import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Part-exchange · My account',
  description: 'Add your current bike to your order and take its value off your balance.',
};

export default function AccountPartExchangePage() {
  return <LegacyPage file="account-part-exchange" />;
}
