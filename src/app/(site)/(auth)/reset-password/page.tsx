import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Reset password', robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token, error } = await searchParams;
  return (
    <>
      <section className="phero slim short">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <Link href="/login">Sign in</Link>
              <span className="s">/</span>
              <span>Reset password</span>
            </div>
            <h1 className="disp">
              Reset <em>password</em>
            </h1>
          </div>
        </div>
      </section>
      <section className="sec paper" style={{ paddingTop: 34 }}>
        <div className="wrap">
          <div className="signin" style={{ maxWidth: 520 }}>
            <h3>{token ? 'Choose a new password' : 'Forgotten your password?'}</h3>
            <p className="muted" style={{ marginTop: 6 }}>
              {error
                ? 'That link has expired. Enter your email for a new one.'
                : token
                  ? 'Enter a new password for your account.'
                  : 'Enter the email you signed up with and we will send you a link to choose a new password.'}
            </p>
            <ResetPasswordForm token={error ? undefined : token} />
          </div>
        </div>
      </section>
    </>
  );
}
