import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Motorbike for sale',
};

export default async function BikePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  void slug; // load the bike by slug once the stock API is in
  return <PagePlaceholder title="Motorbike for sale" legacyFile="bike.html" />;
}
