import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Your Basket',
  description: 'Your GearUp basket: bike reservation deposit and accessories in one checkout.',
};

export default function BasketPage() {
  return <LegacyPage file="basket" />;
}
