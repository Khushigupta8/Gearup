# GearUp Motorcycles

Website and backend for GearUp Motorcycles, a used motorbike dealer in the UK. One Next.js app (App Router, TypeScript) holds both the pages and the API.

- **Live site:** https://gearup-website-ten.vercel.app

## Run it

```
npm install
cp .env.example .env.local   # fill in what you need
npm run dev                  # http://localhost:3000
```

| Script | |
|---|---|
| `npm run dev` | local server with live reload |
| `npm run build` | production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Folders

```
src/
├── app/                      routes (each folder is a URL)
│   ├── (shop)/               /, /used-bikes, /used-bikes/[slug], /used-bikes/[slug]/reserve, /accessories, /basket
│   ├── (services)/           /finance, /part-exchange, /sell-your-bike, /insurance, /workshop
│   ├── (info)/               /delivery, /warranty, /faq, /about, /contact
│   ├── (auth)/               /login
│   ├── (account)/account/    /account, /orders, /saved, /documents, /part-exchange, /details
│   ├── api/                  route handlers (/api/health for now)
│   ├── layout.tsx            html shell: icon sprite, header, footer
│   ├── not-found.tsx
│   ├── robots.ts, sitemap.ts
├── components/
│   ├── layout/               Header, Footer, AccountNav, NavLink
│   ├── account/              AccountShell (side menu + content)
│   ├── bikes/                bike cards, gallery, filters
│   ├── forms/                enquiry, valuation, finance forms
│   └── ui/                   Icon, IconSprite and other small pieces
├── hooks/                    client hooks
├── lib/                      site details, navigation, formatting helpers
├── server/                   server-only code: db, services, validation (see server/README.md)
├── styles/                   globals.css, account.css
└── types/                    shared types (Bike, Reservation)

public/assets/                fonts and images, served at /assets/...
legacy/                       the approved HTML pages, kept only as the source for porting
```

Folders in brackets like `(shop)` group routes without adding to the URL.

## Porting a page

Each route currently shows a placeholder pointing at its file in `legacy/pages/`. To port one:

1. Move the page's markup into its `page.tsx` as JSX (`class` → `className`, `href="finance.html"` → `<Link href="/finance">`).
2. Move the page's `<style>` block into a CSS file next to the page or into `src/styles`.
3. Rebuild any behaviour from `legacy/js/` as a `'use client'` component in `src/components`.
4. Delete the legacy file.

Old `.html` URLs redirect to the new routes (see `next.config.ts`).

## Images

Lowercase, hyphenated WebP files (`yamaha-mt07.webp`), each in the folder that matches what it shows. A bike's gallery goes in `public/assets/images/gallery/<make-model>/`, numbered `01-…`, `02-…`.

## Working on it

- Work on a branch and open a pull request into `main`. Vercel posts a preview link on the PR.
- Merging to `main` deploys to production.
- Never commit `.env` files.
