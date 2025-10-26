# Deployment Guide

Next.js 14 (App Router) + TypeScript. Node runtime route handlers render MJML and inline CSS.

## Environment variables

- ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REDIRECT_URI, ZOHO_BASE_URL (optional; Easy Setup UI can be used instead)
- ENCRYPTION_SECRET (32+ chars; encrypts Zoho settings & tokens)
- NEXT_PUBLIC_BASE_URL (e.g., http://localhost:3000 or https://your-domain)

## Vercel (recommended)

1. Import repo.
2. Set:
   - ENCRYPTION_SECRET
   - NEXT_PUBLIC_BASE_URL=https://<your-vercel>.vercel.app
3. Deploy.
4. In app Settings → Zoho CRM — Easy Setup:
   - Choose Region (accounts base URL)
   - Redirect URI: <BASE_URL>/api/zoho/callback
   - Paste Client ID/Secret → Save → Connect

## Docker

\`\`\`bash
docker build -t email-campaign-builder:latest .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
  -e ENCRYPTION_SECRET="change-this-32-characters-min" \
  email-campaign-builder:latest
\`\`\`

## Checklist

- Strong ENCRYPTION_SECRET
- Custom domain + HTTPS
- Zoho redirect matches live domain
