# Deployment Guide

Next.js 14 (App Router) + TypeScript. Node runtime route handlers render MJML and inline CSS.

## Prerequisites

- Node.js 18-20
- npm or compatible package manager
- Docker (optional, for container deployment)

## Environment variables

Required:
- **ENCRYPTION_SECRET** (32+ chars; encrypts Zoho settings & tokens)
- **NEXT_PUBLIC_BASE_URL** (e.g., http://localhost:3000 or https://your-domain)

Optional (can configure via UI instead):
- ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REDIRECT_URI, ZOHO_BASE_URL

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