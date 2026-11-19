import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Motorbike Insurance Quotes',
  description: "Compare motorbike insurance quotes through GearUp's insurance partner and get covered before you collect your bike.",
};

export default function InsurancePage() {
  return <LegacyPage file="insurance" />;
}
