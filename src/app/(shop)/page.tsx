import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: { absolute: 'GearUp Motorcycles · Quality Used Motorbikes, Delivered UK-Wide' },
  description: 'Quality used motorbikes, inspected and warranted. Reserve online for £99, finance and part-exchange welcome, delivered anywhere in mainland UK.',
};

export default function HomePage() {
  return <PagePlaceholder title="GearUp Motorcycles" legacyFile="index.html" />;
}
