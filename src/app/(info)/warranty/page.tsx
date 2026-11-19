import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Warranty and 120-Point Inspection',
  description: 'Every GearUp bike comes with 30 days warranty and a 120-point inspection. Selected bikes include 3, 6, 12 or 24 months cover free.',
};

export default function WarrantyPage() {
  return <LegacyPage file="warranty" />;
}
