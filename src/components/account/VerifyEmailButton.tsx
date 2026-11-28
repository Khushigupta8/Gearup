'use client';

import { useState } from 'react';

export function VerifyEmailButton({ email }: { email: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  async function send() {
    setPending(true);
    try {
      const response = await fetch('/api/auth/send-verification-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, callbackURL: '/account' }) });
      const result = await response.json();
      setMessage(response.ok ? 'Check your inbox for the verification link.' : result.message || 'We could not send the email. Please try again.');
    } catch { setMessage('We could not send the email. Please try again.'); }
    finally { setPending(false); }
  }
  return <><button className="btn btn-red" disabled={pending} onClick={send}>{pending ? 'Sending…' : 'Send verification email'}</button>{message && <p role="status" className="mt2">{message}</p>}</>;
}
