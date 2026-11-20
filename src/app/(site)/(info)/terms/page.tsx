import type { Metadata } from 'next';
import { LegalPage } from '@/components/cms/LegalPage';
import { getLegalPage, pageMetadata } from '@/server/services/cms';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('terms');
  // Not indexed until the real text is added in the CMS.
  return pageMetadata('/terms', { title: 'Terms and conditions', description: 'The terms for buying a bike, reserving online and shopping with GearUp Motorcycles.', robots: page.body ? undefined : { index: false } });
}

export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
