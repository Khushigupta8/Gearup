import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Documents · My account',
  description: 'Your receipts, HPI report, MOT certificate, inspection report, invoice and warranty.',
};

export default function DocumentsPage() {
  return <LegacyPage file="account-documents" />;
}
