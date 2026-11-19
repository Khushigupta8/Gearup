import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Help and FAQs',
  description: 'Answers on reserving a bike, finance, part-exchange, delivery, tracking your bike, warranty, the workshop and accessories orders.',
};

export default function FaqPage() {
  return <LegacyPage file="faq" />;
}
