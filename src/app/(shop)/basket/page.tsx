import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Your Basket',
  description: 'Your GearUp basket: bike reservation deposit and accessories in one checkout.',
};

export default function BasketPage() {
  return <PagePlaceholder title="Your Basket" legacyFile="basket.html" />;
}
