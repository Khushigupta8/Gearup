import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Saved bikes · My account',
  description: 'Bikes you have saved. Reserve one online for £99.',
};

export default function SavedPage() {
  return <LegacyPage file="account-saved" />;
}
