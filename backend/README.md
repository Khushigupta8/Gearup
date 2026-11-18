# GearUp backend

This is a starter for the API behind the website's forms and the dealer system. No features yet; the structure is ready to build in.

```
backend/
├── src/
│   ├── server.js     entry point (GET /api/health)
│   ├── routes/       one file per area: bikes, reservations, valuations, enquiries, orders, insurance
│   ├── services/     business logic: pricing, deposits, delivery quote, discount codes
│   └── db/           database client, schema and migrations
├── .env.example      environment variables (copy to .env, never commit .env)
└── package.json
```

## Planned API (Phase 1)

| Endpoint | Used by |
|---|---|
| `GET /api/bikes`, `GET /api/bikes/:slug` | listing and bike pages (stock from the DMS) |
| `POST /api/reservations` | £99 deposit checkout (Stripe) |
| `POST /api/valuations` | part-exchange / sell your bike forms |
| `POST /api/enquiries` | contact, viewing and test ride forms |
| `POST /api/orders` | accessories basket, discount codes |
| `POST /api/insurance-leads` | insurance quote form, passed to the partner |
| `POST /api/finance-applications` | finance form, passed to the lender's portal |

## Run

```
cp .env.example .env
npm start
```

Then open http://localhost:4000/api/health.
