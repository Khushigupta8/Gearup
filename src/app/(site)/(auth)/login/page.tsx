import type { Metadata } from 'next';
import { LegacyPage } from '@/components/layout/LegacyPage';

export const metadata: Metadata = {
  title: 'Sign in · My account',
  description: 'Sign in to your GearUp account to track your bike, pay the balance and see your documents.',
};

export default function LoginPage() {
  return <LegacyPage file="login" />;
}
