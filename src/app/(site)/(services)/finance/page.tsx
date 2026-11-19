import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Motorbike Finance',
  description: 'Spread the cost of your next used motorbike. Check your eligibility, work out your monthly payments and apply online. 19.9% APR representative, subject to status.',
};

export default function FinancePage() {
  return <LegacyPage file="finance" />;
}
