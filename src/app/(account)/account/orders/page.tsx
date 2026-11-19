import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'My orders · My account',
  description: 'Your GearUp orders: bike reservations and accessories, with their status.',
};

export default function OrdersPage() {
  return <LegacyPage file="account-orders" />;
}
