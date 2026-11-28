import Link from 'next/link';
import { VerifyEmailButton } from '@/components/account/VerifyEmailButton';
import { requireUser } from '@/server/auth';

export const metadata = { title: 'Verify your email', robots: { index: false } };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ conflict?: string }> }) {
  const user = await requireUser('/verify-email');
  const { conflict } = await searchParams;
  return <section className="sec"><div className="wrap" style={{ maxWidth: 700 }}><div className="formcard">
    <h1>{conflict ? 'Contact us to link your account' : 'Verify your email'}</h1>
    <p className="mt2">{conflict ? 'We could not link these customer records to your login. Our team can help.' : 'Confirm your email before using your GearUp account. This protects your customer details and order history.'}</p>
    {!conflict && <div className="mt2"><VerifyEmailButton email={user.email} /></div>}
    <p className="mt2"><Link href="/contact">Contact our team</Link></p>
  </div></div></section>;
}
