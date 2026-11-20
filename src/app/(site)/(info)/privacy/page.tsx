import type { Metadata } from 'next';
import { LegalPage } from '@/components/cms/LegalPage';
import { getLegalPage, pageMetadata } from '@/server/services/cms';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacy');
  // Not indexed until the real text is added in the CMS.
  return pageMetadata('/privacy', { title: 'Privacy policy', description: 'How GearUp Motorcycles collects, uses and protects your personal data.', robots: page.body ? undefined : { index: false } });
}

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
