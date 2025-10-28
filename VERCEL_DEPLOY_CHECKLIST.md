# Vercel Deployment Checklist

## ✅ Pre-Deployment Fixes Completed

### Dependency Issues Fixed
- ✅ **nodemailer updated**: Upgraded from `6.10.1` to `7.0.7` to resolve peer dependency conflict with `next-auth@4.24.12`
- ✅ **Package manager configured**: Updated `vercel.json` to use `pnpm install` (matching the project's package manager)
- ✅ **npm fallback added**: Created `.npmrc` with `legacy-peer-deps=true` for npm compatibility
- ✅ **Build verified**: Both `pnpm run build` and `npm run build` succeed

### Build Test Results
```
✓ pnpm install - Success
✓ pnpm run build - Success (35/35 pages generated)
✓ npm install - Success (with .npmrc fallback)
✓ npm run build - Success (35/35 pages generated)
✓ ESLint - No warnings or errors
```

## 🚀 Ready to Deploy to Vercel

### Required Environment Variables
Before deploying, ensure these environment variables are set in Vercel:

#### Database (Vercel Postgres)
1. Add Vercel Postgres from the Storage tab (automatically provides these):
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
2. Manually set:
   - `DATABASE_URL` = value of `POSTGRES_PRISMA_URL`

#### Authentication (Required)
- `NEXTAUTH_URL` = Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` = Generate with: `openssl rand -base64 32`

#### Security (Required)
- `ENCRYPTION_SECRET` = Generate with: `openssl rand -base64 32`
- `NEXT_PUBLIC_BASE_URL` = Your Vercel deployment URL

#### Optional Features
- **Google OAuth**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- **OpenAI**: `OPENAI_API_KEY`
- **Email Service**: `SENDGRID_API_KEY` or SMTP settings
- **Zoho CRM**: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, etc.

### Deployment Steps
1. **Push to GitHub**: Your changes are ready to deploy
2. **Import to Vercel**: Connect your GitHub repository
3. **Add Vercel Postgres**: Go to Storage tab → Create Database → Postgres
4. **Configure Environment Variables**: Add the required variables listed above
5. **Deploy**: Vercel will automatically build and deploy
6. **Run Migrations**: After first deployment, run database migrations:
   ```bash
   vercel link
   vercel env pull
   npx prisma migrate deploy
   ```

### Post-Deployment Configuration
After your first successful deployment:
1. Configure Zoho CRM (if needed) via Settings → Zoho CRM
2. Test all API endpoints
3. Verify database connectivity
4. Set up Stripe webhooks (if using Stripe)

### Troubleshooting

#### Build Failures
- **Problem**: Build fails with dependency errors
- **Solution**: Ensure Vercel is using the correct install command (check vercel.json)

#### Database Connection Errors
- **Problem**: Cannot connect to database
- **Solution**: Verify `DATABASE_URL` is set to `POSTGRES_PRISMA_URL` value

#### MJML Errors
- **Problem**: MJML rendering fails
- **Solution**: This is expected and handled - MJML is marked as external in webpack config

## 📋 Verification Checklist
- [x] Dependencies install without errors (pnpm & npm)
- [x] Build completes successfully
- [x] Linter passes with no errors
- [x] vercel.json configured correctly
- [x] Environment variables documented
- [x] Database migrations ready
- [ ] Deployment tested on Vercel

## 📚 Additional Resources
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Detailed deployment guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment information
- [.env.example](./.env.example) - All available environment variables
