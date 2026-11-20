import type { Metadata } from 'next';
import { LegalPage } from '@/components/cms/LegalPage';
import { getLegalPage, pageMetadata } from '@/server/services/cms';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('complaints');
  // Kept out of Google until the text is published in the CMS.
  return pageMetadata('/complaints', { title: 'Complaints', description: 'How to raise a complaint with GearUp Motorcycles and what happens next.', robots: page.published ? undefined : { index: false } });
}

export default async function ComplaintsPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  return <LegalPage slug="complaints" preview={(await searchParams).preview === '1'} />;
}
