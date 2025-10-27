# Sagestone Email (Monorepo)

AI-first email marketing platform. This monorepo contains:

- apps/web — Next.js 14 (public site + app shell + auth)
- apps/api — NestJS REST API (to be added)
- apps/workers — BullMQ processors (to be added)
- packages/ui — shared UI (to be added)
- packages/email — MJML + provider abstraction (to be added)
- packages/billing — unified billing SDK (to be added)
- packages/integrations — connectors + Zapier (to be added)

## Quick start

```bash
# From sagestone-email/
pnpm i
docker-compose up -d
pnpm prisma:generate
pnpm db:migrate
pnpm db:seed
pnpm -w dev
```

Open http://localhost:3000 for the web app.

Default seeded user: demo@sagestone.dev (password is random; sign up from the UI).

## Environment

Copy `.env.example` to `.env` at the monorepo root and fill values.

## Acceptance Test

Run this one-liner to spin up infra and start the dev workspace:

```
pnpm i && docker-compose up -d && npx prisma migrate dev && pnpm -w dev
```

Then:
- Visit http://localhost:3000 → public site renders (hero, features, pricing).
- Sign up → create workspace → open app shell.
- Later slices will enable: AI Builder, A/B/n, schedule/send (sandbox), events in Analytics, billing checkout/portal, 2FA, journeys, and integrations.
