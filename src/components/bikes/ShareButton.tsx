'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** Opens the phone's share sheet, or copies the page link on desktop. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user closed the share sheet
      }
      return;
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className="shr" onClick={share} aria-live="polite">
      <Icon name="share" />
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
