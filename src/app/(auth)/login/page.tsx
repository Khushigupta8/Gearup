import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Sign in · My account',
  description: 'Sign in to your GearUp account to track your bike, pay the balance and see your documents.',
};

export default function LoginPage() {
  return <PagePlaceholder title="Sign in" legacyFile="login.html" />;
}
