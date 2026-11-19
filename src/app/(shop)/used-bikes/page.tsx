import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Motorbikes for Sale',
  description: 'Browse quality used motorbikes. Every bike HPI checked, inspected and warranted, with finance, part-exchange and UK delivery.',
};

export default function UsedBikesPage() {
  return <PagePlaceholder title="Motorbikes for Sale" legacyFile="used-bikes.html" />;
}
