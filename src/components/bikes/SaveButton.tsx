'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { mySavedSlugs, toggleSavedBike } from '@/app/(site)/(account)/account/actions';
import { Icon } from '@/components/ui/Icon';

// One request per page load for all the hearts on the page.
let savedPromise: Promise<string[]> | null = null;
const loadSaved = () => (savedPromise ??= mySavedSlugs().catch(() => []));

/** Heart on a bike card: saves the bike to the customer's account (asks them to sign in first). */
export function SaveButton({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    let live = true;
    loadSaved().then((slugs) => live && setSaved(slugs.includes(slug)));
    return () => {
      live = false;
    };
  }, [slug]);

  return (
    <button
      type="button"
      className={saved ? 'heart on' : 'heart'}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved bikes' : 'Save this bike'}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleSavedBike(slug);
          if (!res) {
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
            return;
          }
          setSaved(res.saved);
          savedPromise = null;
        })
      }
    >
      <Icon name="heart" />
    </button>
  );
}
