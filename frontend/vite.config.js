import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const pagesDir = resolve(root, 'pages');
const partialsDir = resolve(root, 'partials');

// Every .html file in pages/ is a page. It is served and built at the site root (/bike.html).
const pages = Object.fromEntries(
  readdirSync(pagesDir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace(/\.html$/, ''), resolve(pagesDir, f)]),
);

/**
 * Shared header / footer / icons.
 *   <!-- @include header.html active=finance -->
 * pulls in partials/header.html and marks the matching nav link (data-k="finance") as current.
 */
function partials() {
  return {
    name: 'gearup-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--\s*@include\s+([\w.-]+)(?:\s+active=([\w-]+))?\s*-->/g, (_, file, active) => {
          let part = readFileSync(resolve(partialsDir, file), 'utf8');
          if (active) part = part.replace(`data-k="${active}">`, `data-k="${active}" class="on" aria-current="page">`);
          return part;
        });
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) server.ws.send({ type: 'full-reload' });
    },
  };
}

/** Pages live in pages/ but keep their URLs at the root: /bike.html, not /pages/bike.html. */
function pagesAtRoot() {
  return {
    name: 'gearup-pages-at-root',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [path, query = ''] = req.url.split('?');
        const page = path === '/' ? 'index.html' : path.slice(1);
        if (/^[\w-]+\.html$/.test(page) && pages[page.replace(/\.html$/, '')]) {
          req.url = `/pages/${page}${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.fileName.startsWith('pages/')) file.fileName = file.fileName.slice('pages/'.length);
        }
      },
    },
  };
}

export default defineConfig({
  plugins: [partials(), pagesAtRoot()],
  build: {
    rollupOptions: { input: pages },
  },
});
