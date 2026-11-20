import type { Metadata } from 'next';
import { LegalPage } from '@/components/cms/LegalPage';
import { getLegalPage, pageMetadata } from '@/server/services/cms';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('cookies');
  // Kept out of Google until the text is published in the CMS.
  return pageMetadata('/cookies', { title: 'Cookie policy', description: 'The cookies the GearUp Motorcycles website uses and how to manage them.', robots: page.published ? undefined : { index: false } });
}

export default async function CookiesPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  return <LegalPage slug="cookies" preview={(await searchParams).preview === '1'} />;
}
