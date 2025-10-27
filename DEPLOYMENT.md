# Deployment Guide

This is a Next.js 14 application with App Router and TypeScript. The application uses Vercel Postgres for database hosting.

For detailed Vercel deployment instructions, see [VERCEL_SETUP.md](VERCEL_SETUP.md).

## Prerequisites

- Node.js 18-20
- npm or compatible package manager
- Vercel account (recommended)
- Docker (optional, for container deployment)

## Environment variables

Required:
- **ENCRYPTION_SECRET** (32+ chars; encrypts Zoho settings & tokens)
- **NEXT_PUBLIC_BASE_URL** (e.g., http://localhost:3000 or https://your-domain)
- **NEXTAUTH_SECRET** (32+ chars; for NextAuth.js)
- **NEXTAUTH_URL** (your deployment URL)

Database:
- **DATABASE_URL** - For local: PostgreSQL connection string. For Vercel: Set to POSTGRES_PRISMA_URL

Vercel Postgres (automatically provided when you add Vercel Postgres storage):
- POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING

Optional (can configure via UI instead):
- ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REDIRECT_URI, ZOHO_BASE_URL

## Quick Start with Vercel

**See [VERCEL_SETUP.md](VERCEL_SETUP.md) for complete Vercel deployment instructions.**

1. Push your repository to GitHub
2. Import to Vercel
3. Add Vercel Postgres from Storage tab
4. Configure remaining environment variables
5. Deploy

The Vercel Postgres integration automatically provides database environment variables.

## Vercel (recommended)

1. Import repo to Vercel
2. Set environment variables:
   - ENCRYPTION_SECRET (generate a strong 32+ character secret)
   - NEXT_PUBLIC_BASE_URL=https://<your-vercel>.vercel.app
3. Deploy
4. After deployment, configure Zoho in app Settings → Zoho CRM — Easy Setup:
   - Choose Region (accounts base URL)
   - Redirect URI: <BASE_URL>/api/zoho/callback
   - Paste Client ID/Secret → Save → Connect

## Docker

Build and run:
```bash
docker build -t email-campaign-builder:latest .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
  -e ENCRYPTION_SECRET="change-this-32-characters-min" \
  email-campaign-builder:latest
```

For production with Docker Compose, see `docker-compose.yml`.

## Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set required environment variables
npm run dev
# Open http://localhost:3000
```

## Build Verification

Before deploying, verify the build succeeds:
```bash
npm run build
npm start
```

## Deployment Checklist

- [ ] Strong ENCRYPTION_SECRET (32+ characters)
- [ ] Custom domain + HTTPS configured
- [ ] NEXT_PUBLIC_BASE_URL matches your domain
- [ ] Zoho redirect URI matches live domain (if using Zoho)
- [ ] Build completes successfully (`npm run build`)
- [ ] All required environment variables set

## Troubleshooting

**Build fails with TypeScript errors**: Ensure all dependencies are installed with `npm install`

**MJML rendering fails**: The mjml library is marked as external in webpack config - this is expected and required

**Docker build fails**: Ensure package-lock.json is present and committed to the repository