# Copilot instructions for this repository

These notes give AI coding agents the minimum context to be productive in this codebase. Keep responses concrete and follow the project’s patterns and workflows below.

## Big picture

- Framework: Next.js 14 App Router (TypeScript) deployed to Vercel.
- Database: PostgreSQL via Prisma. Runtime uses pooled URL; migrations/seed must use the non-pooled URL.
- Auth: NextAuth.js with Prisma adapter; session helpers live in `lib/auth.ts` and types are augmented in `types/next-auth.d.ts`.
- Payments: Stripe endpoints in `app/api/stripe/**`.
- CRM: Zoho integration in `app/api/zoho/**` with OAuth callback under `.../callback`.
- Email rendering: MJML utilities in `lib/mjml.ts` and builder components under `components/blocks/**` with renderers in `components/blocks/renderers/`.
- UI/State: TailwindCSS styling; lightweight client state in `store/` (Zustand).

Project layout (selected):

- `app/` — App Router pages and API routes (each folder has a `route.ts` or `page.tsx`).
- `lib/` — Cross-cutting services: `prisma.ts`, `auth.ts`, `stripe.ts`, `zoho.ts`, `mjml.ts`.
- `prisma/` — `schema.prisma` and `seed.ts`.
- `components/` — React components used by pages and the email builder.
- `public/templates/` — Template JSON files surfaced in the UI.

## Critical workflows (commands)

- Dev server: `npm run dev` → http://localhost:3000
- Build locally: `npm run build` (ESLint is not blocking builds; CI still lints)
- Typecheck: `npx tsc -p tsconfig.json --noEmit`
- Lint: `npm run lint`
- Prisma client: `npm run prisma:generate`
- DB migrate (Neon/Vercel Postgres):
  - First-time init + apply (direct URL): `npm run db:migrate:init`
  - Deploy migrations (direct URL): `npm run db:migrate:vercel`
  - Seed (direct URL): `npm run db:seed:vercel`

Notes:
- Direct/non-pooled URL is required for migrate/seed (env var: `POSTGRES_URL_NON_POOLING`). Pooled URL (`DATABASE_URL` or `POSTGRES_PRISMA_URL`) is for runtime.
- The helper scripts load `.env.vercel` first, then `.env.local`.

## Environment variables (minimum)

- Required: `DATABASE_URL` (pooled), `POSTGRES_URL_NON_POOLING` (direct), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ENCRYPTION_SECRET`, `NEXT_PUBLIC_BASE_URL`.
- Optional: Stripe (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs), OpenAI, SMTP/SendGrid, Zoho (`ZOHO_*`).

## API route pattern (App Router)

- Location: `app/api/<name>/route.ts`
- Export HTTP verbs as async functions: `export async function GET(request: Request) { ... }` and return `NextResponse.json(...)`.
- Access DB via the singleton client in `lib/prisma.ts`.
- AuthN/AuthZ: import helpers from `lib/auth.ts` (e.g., `getServerSession`) and check session before DB actions.
- Validation: use `zod` where present; return 400 with details on failure.

Example (new route):

1) Create `app/api/widgets/route.ts`.
2) In handler, `const session = await getServerSession(authOptions)`; if no session, return 401.
3) Query with `prisma.widget.findMany({ where: { userId: session.user.id } })` and return `NextResponse.json(data)`.

## Frontend patterns

- Pages are server components by default in `app/**/page.tsx`. Use `"use client"` for client components.
- Email builder blocks live under `components/blocks/**`; the renderer mapping is in `components/blocks/renderers/BlockRenderer.tsx`.
- Global styles: `app/globals.css`. Layout shell: `app/layout.tsx`.

## Email/MJML

- Convert builder JSON or template content using helpers in `lib/mjml.ts`. The server build excludes bundling of the `mjml` package (see `next.config.js`). Prefer these helpers over ad hoc MJML parsing.

## Data/exports

- Export endpoints under `app/api/export/{html,json,mjml}/route.ts` transform the builder/campaign content to the requested format. When adding formats, follow these folderized route patterns.

## Stripe & webhooks

- Webhook handler: `app/api/stripe/webhook/route.ts`. Uses signature verification with `STRIPE_WEBHOOK_SECRET`.
- For local dev, forward events via the Stripe CLI to `/api/stripe/webhook`.

## Prisma & schema changes

- Edit `prisma/schema.prisma` and create a migration with `npm run db:migrate:init` (direct URL) if starting fresh, or `npm run db:migrate:vercel` to apply existing migrations.
- Seed data lives in `prisma/seed.ts` (script forces CommonJS in package.json to avoid ESM loader friction).

## Testing & CI

- CI workflow: `.github/workflows/ci.yml` runs install → lint → typecheck → build. Production builds skip ESLint blocking (see `next.config.js`), but CI lint still reports issues.

## Gotchas & tips

- Migrations against Accelerate/Data Proxy (e.g., `db.prisma.io` or `prisma+postgres://`) will fail; always use a direct Postgres URL for migrate/seed.
- If build fails for ESLint, check `.eslintrc.json` (rules are relaxed) and `next.config.js` (`ignoreDuringBuilds: true`).
- To add new templates, drop JSON under `public/templates/` and reference it from UI as needed.

## Useful references in-repo

- API routes: `app/api/**/route.ts`
- Auth types/config: `types/next-auth.d.ts`, `lib/auth.ts`
- Prisma: `lib/prisma.ts`, `prisma/schema.prisma`, `prisma/seed.ts`
- Payments: `app/api/stripe/**`, `lib/stripe.ts`
- Zoho: `app/api/zoho/**`, `lib/zoho.ts`
- Email builder: `components/blocks/**`, `components/blocks/renderers/BlockRenderer.tsx`
- Docs: `docs/SETUP_GUIDE.md`, `VERCEL_SETUP.md`, `docs/API_DOCS.md`, `docs/DATABASE_SCHEMA.md`

---

If any section is unclear (e.g., auth guard expectations in specific routes or builder block extension steps), ask for the exact file you’re extending and I’ll refine these instructions with concrete examples from that area.
