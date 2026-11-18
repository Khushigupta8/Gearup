import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const partialsDir = resolve(root, 'partials');

// Every .html file in the frontend root is a page.
const pages = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace(/\.html$/, ''), resolve(root, f)]),
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

export default defineConfig({
  plugins: [partials()],
  build: {
    rollupOptions: { input: pages },
  },
});
