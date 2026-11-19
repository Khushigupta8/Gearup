# Server code

Runs only on the server (route handlers in `src/app/api`, server actions, server components). Never import it from a `'use client'` file.

```
server/
├── db/           database client and queries
├── services/     business logic: pricing, deposits, delivery quote, discount codes, DMS stock sync
└── validation/   input schemas for forms and API requests
```

## Planned API (Phase 1)

Each endpoint is a route handler at `src/app/api/<name>/route.ts`.

| Endpoint | Used by |
|---|---|
| `GET /api/health` | uptime check (done) |
| `GET /api/bikes`, `GET /api/bikes/[slug]` | listing and bike pages (stock from the DMS) |
| `POST /api/reservations` | £99 deposit checkout (Stripe) |
| `POST /api/webhooks/stripe` | payment confirmation |
| `POST /api/valuations` | part-exchange and sell your bike forms |
| `POST /api/enquiries` | contact, viewing and test ride forms |
| `POST /api/orders` | accessories basket, discount codes |
| `POST /api/insurance-leads` | insurance quote form, passed to the partner |
| `POST /api/finance-applications` | finance form, passed to the lender's portal |
