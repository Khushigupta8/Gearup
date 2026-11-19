import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'My details · My account',
  description: 'Your contact details and delivery address.',
};

export default function DetailsPage() {
  return <LegacyPage file="account-details" />;
}
