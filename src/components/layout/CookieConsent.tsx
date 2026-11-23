'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Cookie consent (UK GDPR / PECR). The site only uses essential cookies today; the choice is stored so any
 * future analytics (GA4, Phase 2) can check `window.guConsent === 'all'` before loading.
 * Footer "Cookie settings" reopens the banner via the 'gu:cookie-settings' event.
 */
const KEY = 'gu-cookie-consent';
type Choice = 'all' | 'essential';

declare global {
  interface Window {
    guConsent?: Choice;
  }
}

function read(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'all' || v === 'essential' ? v : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = read();
    if (saved) window.guConsent = saved;
    // Shown after hydration so the static page HTML never includes the banner.
    const t = window.setTimeout(() => setOpen(!saved), 400);
    const reopen = () => setOpen(true);
    window.addEventListener('gu:cookie-settings', reopen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('gu:cookie-settings', reopen);
    };
  }, []);

  function choose(c: Choice) {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    window.guConsent = c;
    window.dispatchEvent(new CustomEvent('gu:consent', { detail: c }));
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="cookiebar" role="dialog" aria-live="polite" aria-label="Cookie choice">
      <p>
        <b>Cookies.</b> We use essential cookies to make the site work. We&apos;d only use analytics cookies if you allow them.{' '}
        <Link href="/legal/cookies">Cookie policy</Link>
      </p>
      <div className="cb-acts">
        <button type="button" className="btn btn-line" onClick={() => choose('essential')}>
          Essential only
        </button>
        <button type="button" className="btn btn-red" onClick={() => choose('all')}>
          Accept all
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={`linkbtn ${className ?? ''}`} onClick={() => window.dispatchEvent(new Event('gu:cookie-settings'))}>
      Cookie settings
    </button>
  );
}
