import type { Metadata } from 'next';
import { getPublicBikes } from '@/server/services/bikes';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Reserve your bike',
  description: 'Reserve your bike online for £99. Choose collection or UK delivery and pay securely.',
};

export async function generateStaticParams() {
  return (await getPublicBikes()).map((b) => ({ slug: b.slug }));
}

export default function ReservePage() {
  return <LegacyPage file="reserve" />;
}
