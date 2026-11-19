import { readFileSync } from 'node:fs';
import path from 'node:path';
import { LegacyScripts } from './LegacyScripts';

/**
 * TEMPORARY bridge: shows a page from legacy/pages inside the Next layout until it is ported to JSX.
 * Read at build time (pages are static). Delete this file once legacy/ is empty.
 */

const routeFor: Record<string, string> = {
  index: '/',
  bike: '/used-bikes/2019-bmw-r1250gs',
  reserve: '/used-bikes/2019-bmw-r1250gs/reserve',
  account: '/account',
};

function toRoute(page: string) {
  if (routeFor[page]) return routeFor[page];
  if (page.startsWith('account-')) return `/account/${page.slice('account-'.length)}`;
  return `/${page}`;
}

function legacyHtml(file: string): string {
  const dir = path.join(process.cwd(), 'legacy');
  const html = readFileSync(path.join(dir, 'pages', `${file}.html`), 'utf8');
  const main = html.slice(html.indexOf('<main>') + '<main>'.length, html.lastIndexOf('</main>'));

  return (
    main
      // shared partials used inside a page (account side menu)
      .replace(/<!--\s*@include\s+([\w.-]+)(?:\s+active=([\w-]+))?\s*-->/g, (_, part: string, active?: string) => {
        let src = readFileSync(path.join(dir, 'partials', part), 'utf8');
        if (active) src = src.replace(`data-k="${active}">`, `data-k="${active}" class="on" aria-current="page">`);
        return src;
      })
      // old file links -> new routes
      .replace(/href="([\w-]+)\.html([?#][^"]*)?"/g, (_, page: string, rest = '') => `href="${toRoute(page)}${rest}"`)
  );
}

export function LegacyPage({ file }: { file: string }) {
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: legacyHtml(file) }} />
      <LegacyScripts />
    </>
  );
}
