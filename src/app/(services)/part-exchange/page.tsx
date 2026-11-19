import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Part-Exchange Your Motorbike',
  description: 'Get a free part-exchange valuation on your motorbike. Use it as the deposit on any bike in stock. Outstanding finance settled for you.',
};

export default function PartExchangePage() {
  return <LegacyPage file="part-exchange" />;
}
