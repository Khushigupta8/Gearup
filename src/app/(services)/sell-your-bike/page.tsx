import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Sell Your Motorbike',
  description: 'Sell your motorbike to GearUp. Free valuation, we inspect it, pay you by bank transfer and can collect from your door. Outstanding finance settled.',
};

export default function SellYourBikePage() {
  return <PagePlaceholder title="Sell Your Motorbike" legacyFile="sell-your-bike.html" />;
}
