import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Delivery and Collection',
  description: 'Collect your bike from our showroom or have it delivered nationwide. Instant price per mile and live GPS tracking on delivery day.',
};

export default function DeliveryPage() {
  return <PagePlaceholder title="Delivery and Collection" legacyFile="delivery.html" />;
}
