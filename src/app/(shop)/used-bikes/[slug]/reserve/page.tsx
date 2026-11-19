import type { Metadata } from 'next';
import { bikes } from '@/data/bikes';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Reserve your bike',
  description: 'Reserve your bike online for £99. Choose collection or UK delivery and pay securely.',
};

export function generateStaticParams() {
  return bikes.map((b) => ({ slug: b.slug }));
}

export default function ReservePage() {
  return <LegacyPage file="reserve" />;
}
