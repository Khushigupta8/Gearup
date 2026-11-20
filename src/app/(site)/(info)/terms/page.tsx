import type { Metadata } from 'next';
import { LegalPage } from '@/components/cms/LegalPage';
import { getLegalPage, pageMetadata } from '@/server/services/cms';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('terms');
  // Kept out of Google until the text is published in the CMS.
  return pageMetadata('/terms', { title: 'Terms and conditions', description: 'The terms for buying a bike, reserving online and shopping with GearUp Motorcycles.', robots: page.published ? undefined : { index: false } });
}

export default async function TermsPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  return <LegalPage slug="terms" preview={(await searchParams).preview === '1'} />;
}
