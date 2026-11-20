'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { authClient } from '@/lib/auth-client';

const safeNext = (next?: string) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/account');

/** Sign in / create account card for /login. */
export function AuthCard({ next, initial = 'signin' }: { next?: string; initial?: 'signin' | 'register' }) {
  const router = useRouter();
  const [mode, setMode] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email')).trim();
    const password = String(f.get('password'));
    setBusy(true);
    setError('');
    const { error } =
      mode === 'signin'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: `${f.get('firstName')} ${f.get('lastName')}`.trim() });
    setBusy(false);
    if (error) {
      setError(
        error.code === 'USER_ALREADY_EXISTS' || /exist/i.test(error.message ?? '')
          ? 'There is already an account with that email. Sign in instead.'
          : mode === 'signin'
            ? 'That email and password don’t match. Try again or reset your password.'
            : (error.message ?? 'Could not create the account.'),
      );
      return;
    }
    router.replace(safeNext(next));
    router.refresh();
  }

  return (
    <div className="signin">
      <div className="authtabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'on' : undefined} onClick={() => setMode('signin')}>
          Sign in
        </button>
        <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'on' : undefined} onClick={() => setMode('register')}>
          Create account
        </button>
      </div>
      <h3>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h3>
      <p className="muted" style={{ marginTop: 6 }}>
        {mode === 'signin'
          ? 'Sign in to see your reservation, orders and saved bikes.'
          : 'Reserve bikes, save favourites and follow your bike’s prep.'}
      </p>
      <form className="form mt2" onSubmit={submit}>
        {mode === 'register' && (
          <div className="frow">
            <div className="fl">
              <label htmlFor="rfn">First name</label>
              <input id="rfn" name="firstName" required autoComplete="given-name" />
            </div>
            <div className="fl">
              <label htmlFor="rln">Last name</label>
              <input id="rln" name="lastName" autoComplete="family-name" />
            </div>
          </div>
        )}
        <div className="fl">
          <label htmlFor="se">Email</label>
          <input id="se" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div className="fl">
          <label htmlFor="sp">Password</label>
          <input
            id="sp"
            name="password"
            type="password"
            placeholder={mode === 'register' ? 'At least 8 characters' : 'Password'}
            minLength={8}
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>
        {error && (
          <p className="formerr" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-ink" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      {mode === 'signin' && (
        <div className="alt">
          <Link href="/reset-password">Forgotten password?</Link>
          <button type="button" className="linkbtn" onClick={() => setMode('register')}>
            New here? Create an account
          </button>
        </div>
      )}
    </div>
  );
}

/** Ask for a reset link, or (with a token) set the new password. */
export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'done'>('idle');
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('busy');
    setError('');
    if (token) {
      const { error } = await authClient.resetPassword({ newPassword: String(f.get('password')), token });
      if (error) {
        setError('That reset link has expired or was already used. Ask for a new one.');
        setState('idle');
        return;
      }
      setState('done');
      setTimeout(() => router.replace('/login'), 1500);
      return;
    }
    await authClient.requestPasswordReset({ email: String(f.get('email')).trim(), redirectTo: '/reset-password' });
    setState('sent'); // same message whether or not the email exists
  }

  if (state === 'sent')
    return <p className="success">If there is an account with that email, we have sent a link to reset the password. Check your inbox.</p>;
  if (state === 'done') return <p className="success">Password changed. Taking you to sign in…</p>;

  return (
    <form className="form mt2" onSubmit={submit}>
      {token ? (
        <div className="fl">
          <label htmlFor="np">New password</label>
          <input id="np" name="password" type="password" minLength={8} required autoComplete="new-password" placeholder="At least 8 characters" />
        </div>
      ) : (
        <div className="fl">
          <label htmlFor="re">Email</label>
          <input id="re" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </div>
      )}
      {error && (
        <p className="formerr" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-ink" disabled={state === 'busy'}>
        {token ? 'Save new password' : 'Send reset link'}
      </button>
    </form>
  );
}
