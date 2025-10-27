# Deployment Guide (Free-tier friendly)

- Web (Next.js) → Vercel (project root: sagestone-email/apps/web)
- API (NestJS) → Render (Web Service) or Fly.io
- Workers → Render (Background Worker) or Fly.io second app
- DB → Neon
- Redis → Upstash
- Storage → R2 or Supabase Storage

Environment variables: copy `.env.example` to each service’s settings and fill secrets.

Initial rollout:

```bash
# Database
npx prisma migrate deploy
pnpm db:seed
```

Webhook endpoints to expose later: `/webhooks/*` for email providers and billing drivers.
