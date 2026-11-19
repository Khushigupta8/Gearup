import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Motorcycle Servicing, MOT and Repairs',
  description: 'Motorcycle MOTs, servicing, tyres and repairs on all makes, by the team that preps every GearUp bike. Book online.',
};

export default function WorkshopPage() {
  return <LegacyPage file="workshop" />;
}
