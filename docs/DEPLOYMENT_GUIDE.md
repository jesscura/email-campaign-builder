# Deployment Guide - Sagestone Email vNext

## Overview

This guide covers deploying Sagestone Email vNext to free-tier infrastructure:
- **Vercel** - Web application
- **Render or Fly.io** - API and Workers
- **Neon** - PostgreSQL database
- **Upstash** - Redis
- **Cloudflare R2** - Object storage

## Prerequisites

- GitHub account
- Vercel account
- Render or Fly.io account
- Neon database account
- Upstash Redis account
- Domain name (optional)

## Part 1: Database Setup (Neon)

### 1. Create Neon Project

1. Visit [neon.tech](https://neon.tech) and sign up
2. Create a new project: "sagestone-email-prod"
3. Select region closest to your users
4. Copy the connection string

### 2. Configure Connection

Connection string format:
```
postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

Keep this secure - you'll need it for Vercel and Render/Fly.

### 3. Run Migrations

From your local machine:

```bash
# Set DATABASE_URL to Neon connection
export DATABASE_URL="postgresql://..."

# Run migrations
pnpm prisma:migrate deploy

# Seed initial data (optional)
pnpm prisma:seed
```

## Part 2: Redis Setup (Upstash)

### 1. Create Redis Database

1. Visit [upstash.com](https://upstash.com) and sign up
2. Create new Redis database: "sagestone-email-prod"
3. Select region (same as your API server)
4. Copy REST URL and token

### 2. Connection Details

You'll receive:
```
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

Or traditional Redis connection:
```
REDIS_HOST=xxx.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=xxx
```

## Part 3: Web Deployment (Vercel)

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select "sagestone-email" project

### 2. Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm install && pnpm build:web`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install`

### 3. Environment Variables

Add in Vercel dashboard:

```bash
# Database
DATABASE_URL=postgresql://... (from Neon)

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-secure-random-string-32-chars-min

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Billing (Stripe)
BILLING_DRIVER=stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...

# AI
OPENAI_API_KEY=sk-...

# Email
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG....

# Storage
STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=sagestone-email-assets

# Security
ENCRYPTION_SECRET=generate-another-secure-32-char-string
TOTP_ENCRYPTION_KEY=yet-another-secure-32-char-string

# App Config
NEXT_PUBLIC_APP_NAME=Sagestone Email
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production

# Redis (for API communication)
REDIS_HOST=xxx.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=xxx
```

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit deployment URL

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Part 4: API Deployment (Render)

### Option A: Render

#### 1. Create Web Service

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Name**: sagestone-api
   - **Root Directory**: `apps/api`
   - **Environment**: Node
   - **Build Command**: `cd ../.. && pnpm install && pnpm build:api`
   - **Start Command**: `cd apps/api && pnpm start`
   - **Plan**: Free (or Starter for better performance)

#### 2. Environment Variables

Add in Render dashboard (same as Vercel, plus):

```bash
API_PORT=4000
```

#### 3. Health Check

- Path: `/health`
- Expected status: 200

### Option B: Fly.io

#### 1. Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

#### 2. Create fly.toml

```toml
# apps/api/fly.toml
app = "sagestone-api"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [[services.http_checks]]
    interval = 10000
    timeout = 2000
    grace_period = "5s"
    method = "get"
    path = "/health"

[resources]
  memory = 256
  cpu = "shared"
```

#### 3. Create Dockerfile

```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages
COPY prisma ./prisma

# Build
RUN pnpm build:api

EXPOSE 8080

CMD ["node", "apps/api/dist/main.js"]
```

#### 4. Deploy

```bash
cd apps/api
fly secrets set DATABASE_URL="postgresql://..." # and other env vars
fly deploy
```

## Part 5: Workers Deployment (Render or Fly.io)

### Option A: Render Background Worker

1. New → Background Worker
2. Configure:
   - **Name**: sagestone-workers
   - **Root Directory**: `apps/workers`
   - **Build Command**: `cd ../.. && pnpm install && pnpm build:workers`
   - **Start Command**: `cd apps/workers && pnpm start`
3. Add same environment variables as API

### Option B: Fly.io Background Worker

Similar to API deployment, but without HTTP services:

```toml
# apps/workers/fly.toml
app = "sagestone-workers"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"

[resources]
  memory = 256
  cpu = "shared"
```

## Part 6: Webhooks Configuration

### Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/billing/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### SendGrid Webhooks (Optional)

1. Go to SendGrid → Settings → Mail Settings → Event Webhook
2. Add: `https://your-api-url/webhooks/sendgrid`
3. Select events: Delivered, Opened, Clicked, Bounced, Spam Report

## Part 7: Monitoring Setup

### Sentry

1. Create project at [sentry.io](https://sentry.io)
2. Get DSN
3. Add to environment variables:
   ```bash
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```

### Vercel Analytics

Automatically enabled for Vercel deployments. View in Vercel dashboard.

## Part 8: Post-Deployment Verification

### 1. Web Application

```bash
curl https://your-domain.vercel.app
# Should return HTML
```

### 2. API Health

```bash
curl https://your-api-url/health
# Should return {"status":"ok"}
```

### 3. Database Connection

Check logs in Vercel/Render/Fly dashboard for any database connection errors.

### 4. Workers Running

Check Render/Fly logs for "Workers started successfully" message.

### 5. Test Campaign

1. Sign up for account
2. Create test campaign
3. Send test email
4. Verify delivery

## Scaling

### Free Tier Limits

- **Vercel**: 100GB bandwidth, 100GB-hours compute
- **Render**: 750 hours/month (keeps 1 service running)
- **Fly.io**: 3 shared-cpu-1x VMs, 160GB outbound transfer
- **Neon**: 10 projects, 3GB storage per project
- **Upstash**: 10k commands/day

### When to Upgrade

- **Web**: Upgrade Vercel if >100GB bandwidth/month
- **API**: Upgrade to Render Starter ($7/mo) for always-on + better performance
- **Workers**: Add more instances when queue processing slows
- **Database**: Upgrade Neon for more connections, storage
- **Redis**: Upgrade Upstash for more commands

### Horizontal Scaling

- **API**: Deploy multiple instances behind load balancer
- **Workers**: Scale worker instances based on queue depth
- **Database**: Use read replicas for analytics queries

## Troubleshooting

### Build Failures

**Issue**: "Cannot find module '@sagestone/ui'"
**Solution**: Ensure workspace packages are installed with `pnpm install --shamefully-hoist`

**Issue**: Prisma client not generated
**Solution**: Add `pnpm prisma:generate` to build command

### Runtime Errors

**Issue**: Database connection timeout
**Solution**: Check DATABASE_URL, ensure IP is whitelisted in Neon

**Issue**: Redis connection failed
**Solution**: Verify REDIS_HOST/PORT/PASSWORD, check Upstash dashboard

**Issue**: Webhook signature verification failed
**Solution**: Ensure WEBHOOK_SECRET matches provider dashboard

### Performance Issues

**Issue**: Slow page loads
**Solution**: Enable Vercel Edge caching, optimize images

**Issue**: Worker queue backing up
**Solution**: Scale worker instances, optimize job processing

## Rollback Procedure

### Vercel

1. Go to Deployments
2. Click on previous deployment
3. Click "Promote to Production"

### Render/Fly.io

Render: Use deployment history to redeploy previous version
Fly.io:
```bash
fly releases
fly releases rollback <version>
```

## Backup & Recovery

### Database Backups

Neon automatically backs up daily. To restore:
1. Go to Neon dashboard
2. Select backup point
3. Restore to new branch or current

### Manual Backups

```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Redis Backups

Upstash provides point-in-time recovery. Alternatively, use RDB snapshots.

## Security Checklist

- [ ] All environment variables set securely
- [ ] HTTPS enabled (Vercel handles this)
- [ ] Webhook signatures verified
- [ ] API rate limiting configured
- [ ] Sentry monitoring enabled
- [ ] Regular security audits scheduled
- [ ] Secrets rotated quarterly

## Cost Optimization

1. **Use free tiers** where possible
2. **Enable caching** at all layers
3. **Optimize database queries** to reduce connections
4. **Use CDN** for static assets
5. **Monitor usage** to avoid surprise bills
6. **Clean up unused resources** regularly

---

**Last Updated**: January 2025
