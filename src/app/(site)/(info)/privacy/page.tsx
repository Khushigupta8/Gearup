import type { Metadata } from 'next';
import { LegalPage } from '@/components/cms/LegalPage';
import { getLegalPage, pageMetadata } from '@/server/services/cms';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacy');
  // Kept out of Google until the text is published in the CMS.
  return pageMetadata('/privacy', { title: 'Privacy policy', description: 'How GearUp Motorcycles collects, uses and protects your personal data.', robots: page.published ? undefined : { index: false } });
}

export default async function PrivacyPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  return <LegalPage slug="privacy" preview={(await searchParams).preview === '1'} />;
}
