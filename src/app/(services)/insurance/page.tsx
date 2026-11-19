import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Motorbike Insurance Quotes',
  description: "Compare motorbike insurance quotes through GearUp's insurance partner and get covered before you collect your bike.",
};

export default function InsurancePage() {
  return <PagePlaceholder title="Motorbike Insurance Quotes" legacyFile="insurance.html" />;
}
