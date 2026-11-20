import type { Business } from '@/lib/cms';

const paths: Record<keyof Business['socials'], { label: string; d: string }> = {
  facebook: { label: 'Facebook', d: 'M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z' },
  instagram: {
    label: 'Instagram',
    d: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zm4.5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.3 5.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z',
  },
  tiktok: { label: 'TikTok', d: 'M16.6 2c.4 2.6 1.9 4.2 4.4 4.4v3.2c-1.6.1-3-.4-4.4-1.3v6.4c0 4-3.3 6.6-7 6-2.9-.5-5-3-5-6 0-3.9 3.6-6.6 7.3-5.8v3.4c-1.7-.6-3.8.4-3.9 2.3 0 1.5 1 2.6 2.5 2.6 1.6 0 2.7-1.1 2.7-2.8V2z' },
  youtube: { label: 'YouTube', d: 'M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.5 3.6 12 3.6 12 3.6s-4.5 0-7.8.3c-.5.1-1.5.1-2.3 1-.7.7-.9 2.3-.9 2.3S.7 9 .7 10.9v1.8c0 1.9.3 3.7.3 3.7s.2 1.6.9 2.3c.9.9 2 .9 2.6 1 1.8.2 7.5.3 7.5.3s4.5 0 7.8-.3c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.3-1.9.3-3.7v-1.8C23.3 9 23 7.2 23 7.2zM9.7 14.9V8.6l6 3.2z' },
  x: { label: 'X', d: 'M17.8 3h3.3l-7.2 8.2L22.4 21h-6.6l-5.2-6.8L4.6 21H1.3l7.7-8.8L1 3h6.8l4.7 6.2zm-1.2 16h1.8L6.5 4.9H4.6z' },
};

/** Social media icons; only the ones with a link set in Admin → Website → Business details show. */
export function SocialLinks({ socials }: { socials: Business['socials'] }) {
  const items = (Object.keys(paths) as (keyof typeof paths)[]).filter((k) => socials[k]);
  if (!items.length) return null;
  return (
    <div className="socials">
      {items.map((k) => (
        <a key={k} href={socials[k]} target="_blank" rel="noopener" aria-label={paths[k].label} title={paths[k].label}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={paths[k].d} fill="currentColor" />
          </svg>
        </a>
      ))}
    </div>
  );
}
