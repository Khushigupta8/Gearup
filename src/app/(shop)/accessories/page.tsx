import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Motorcycle Accessories',
  description: 'Helmets, gloves, boots, jackets, luggage and security for your bike. Posted UK-wide or collect from our showroom.',
};

export default function AccessoriesPage() {
  return <PagePlaceholder title="Motorcycle Accessories" legacyFile="accessories.html" />;
}
