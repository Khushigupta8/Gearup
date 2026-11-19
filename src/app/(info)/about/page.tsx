import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'About GearUp Motorcycles · Independent used bike dealer',
  description: 'A small independent dealer. Every bike hand-picked, prepped in our own workshop and sold UK-wide with delivery and warranty.',
};

export default function AboutPage() {
  return <LegacyPage file="about" />;
}
