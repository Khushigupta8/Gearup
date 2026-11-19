import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Reserve your bike',
  description: 'Reserve your bike online for £99. Choose collection or UK delivery and pay securely.',
};

export default async function ReservePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  void slug; // load the bike by slug once the stock API is in
  return <PagePlaceholder title="Reserve your bike" legacyFile="reserve.html" />;
}
