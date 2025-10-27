# Architecture

Sagestone Email is a pnpm monorepo with three apps and multiple packages.

- apps/web: Next.js 14 App Router — public site + authenticated app shell.
- apps/api: NestJS REST API — core domain endpoints.
- apps/workers: BullMQ workers and schedulers.
- packages/*: shared UI, email engine, billing SDK, integrations.

Data: Postgres (Neon/Supabase) via Prisma. Redis (Upstash) for queues.
