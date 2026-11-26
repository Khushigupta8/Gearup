# GearUp Motorcycles

Website and backend for GearUp Motorcycles, a used motorbike dealer in the UK. One Next.js app (App Router, TypeScript) holds both the pages and the API.

- **Live site:** https://gearup-umber.vercel.app

## Run it

```
npm install
test -f .env.local || cp .env.example .env.local   # fill in what you need
npm run dev                  # http://localhost:3000
```

### Current local development environment

The ignored `.env.local` uses the isolated PostgreSQL database `gearup_local` on
`127.0.0.1:5432`. Its stock and CMS content were copied from GearUp through the
Supabase management API; customer accounts, enquiries and orders were not copied.
Do not replace this file with `.env.example` or run the sample seed over this copy.

```sh
npm ci
npm run db:deploy
npx tsx scripts/setup-local-admin.ts
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Open `http://localhost:3001` or `/admin/login`. The local admin credentials are
`SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env.local`. The auth and site URL
variables must use the same hostname and port as the browser. Payments, outbound
email and DVLA lookup require their own credentials; a Supabase access token does
not provide these services.

Valuation photos use a **private** Supabase Storage bucket, `gearup-dev-enquiries`
for local testing. Configure the server-only `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY` and `LEAD_PHOTO_BUCKET`, then run:

```sh
npx tsx scripts/setup-enquiry-storage.ts
```

The upload accepts up to 12 photos, compresses them in the browser, and attaches
them to the CRM lead. Full-size images are served through a staff-only route.
Before deploying this change, apply the new Prisma migrations to the intended
database and configure a separate private production bucket, such as
`gearup-enquiries`. Keep production database/auth/payment/email settings intact;
do not upload this local `.env.local` to Vercel. The management access token is
only needed for setup and must never become a public environment variable.

### Vercel database configuration

The public site and sitemap read the DMS at request time; `next build` does not
enumerate bikes or query the production database. A successful build alone does
not verify database connectivity. Check `/used-bikes` after deployment.

In the Vercel project's Production environment, use the Supabase **transaction
pooler** URL (port 6543) for `DATABASE_URL`, and its **session pooler** URL (port
5432) for `DIRECT_URL` when running migrations. Copy the host from Supabase's
Connect panel. A `db.<project>.supabase.co` direct endpoint may be IPv6-only;
Vercel should use the IPv4-compatible pooler. The local `127.0.0.1` database
cannot be reached from a Vercel deployment.

Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS URL and
keep the production `BETTER_AUTH_SECRET` stable. Environment changes require a
new deployment. See [Supabase's Prisma connection guide](https://supabase.com/docs/guides/database/prisma).

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

## Phase 1 service setup

The catalogue, enquiry forms, DMS and CRM use the database above. The homepage
make/model choices come from public stock. `/used-bikes` supports a `q` search
and `model` filter alongside the existing make, price and specification filters.
The catalogue uses two cards per row on larger screens; the standalone keyword
search bar is removed per client feedback. Photo selectors retain name/registration search.
Valuation links carry `registration` and `mileage` into the chosen form; both
part-exchange and Sell Your Bike support private customer photo attachments.

Public stock photos, receipt images, cut-outs, promo banners, CMS images and
walkaround videos need a connected **Vercel Blob** store and its server-only
`BLOB_READ_WRITE_TOKEN`. This is separate from the private enquiry photo bucket.
Configure it locally and in Vercel's relevant environments. The DMS checks staff
access, destination, file type and size before issuing a direct-upload token.

Reservation deposits need `STRIPE_SECRET_KEY` and a verified webhook at
`/api/webhooks/stripe` with `STRIPE_WEBHOOK_SECRET`. Outbound email needs
`RESEND_API_KEY` and `MAIL_FROM` on a verified sending domain. Set
`STAFF_NOTIFY_EMAIL` to the agreed enquiries inbox. Password-reset requests
return the same unavailable response for every address until email is configured.
Do not treat a successful build as confirmation that payment or email delivery works.

Legal pages remain drafts until the business and partner information is supplied
and reviewed. An insurance partner link requires the client's approved partner
details. Neither a database token nor a Vercel deployment token provides these.

Old `.html` URLs redirect to the current routes (see `next.config.ts`).

## Images

Lowercase, hyphenated WebP files (`yamaha-mt07.webp`), each in the folder that matches what it shows. A bike's gallery goes in `public/assets/images/gallery/<make-model>/`, numbered `01-…`, `02-…`.

## Working on it

- Work on a branch and open a pull request into `main`. Vercel posts a preview link on the PR.
- Merging to `main` deploys to production.
- Never commit `.env` files.

## Delivery, blog and registration data

Delivery information is available at `/delivery` and linked from the footer.
Delivery pricing and dates are confirmed by the team; instant quotes and GPS
tracking are not presented as available.

Managers and admins can write, edit, publish and unpublish articles at
`/admin/website/blog`. Drafts are excluded from public pages and the sitemap.
The public blog starts empty until the team publishes its first article.

DMS registration lookup needs `DVLA_API_KEY`. It fills the registered make,
colour, manufacture year, engine size, fuel and MOT expiry where supplied.
Model, mileage, gearbox and extras are entered and verified by staff. Stock
cards show Manual/Automatic while full gearbox details remain in specifications.
