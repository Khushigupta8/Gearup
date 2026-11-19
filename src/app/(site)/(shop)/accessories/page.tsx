import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Motorcycle Accessories',
  description: 'Helmets, gloves, boots, jackets, luggage and security for your bike. Posted UK-wide or collect from our showroom.',
};

export default function AccessoriesPage() {
  return <LegacyPage file="accessories" />;
}
