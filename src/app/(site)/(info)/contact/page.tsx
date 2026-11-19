import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Contact GearUp Motorcycles · Call, WhatsApp or visit',
  description: 'Call 0744 072 1478, WhatsApp or email us. Book a viewing, test ride or video walkaround, and find our showroom and opening hours.',
};

export default function ContactPage() {
  return <LegacyPage file="contact" />;
}
