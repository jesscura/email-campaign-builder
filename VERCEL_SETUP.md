# Vercel Deployment with Postgres

This guide explains how to deploy the Email Campaign Builder to Vercel with Postgres database.

## Prerequisites

- Vercel account
- GitHub repository connected to Vercel

## Step 1: Set Up Vercel Postgres

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose your region and create the database
7. Vercel will automatically add the required environment variables to your project

## Step 2: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

### Database (Automatically added by Vercel Postgres)
Vercel automatically provides:
- `POSTGRES_URL` - Connection string for Postgres
- `POSTGRES_PRISMA_URL` - Connection string for Prisma (with pooling)
- `POSTGRES_URL_NON_POOLING` - Direct connection for migrations

**Required**: Add this manually in Vercel:
- `DATABASE_URL` - Set this to the value of `POSTGRES_PRISMA_URL` from Vercel's automatic variables

### Authentication
- `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

### Optional - Google OAuth
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### Optional - Stripe Payment Processing
- `STRIPE_SECRET_KEY` - From Stripe Dashboard
- `STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe Webhook settings
- `STRIPE_PRO_PRICE_ID` - Pro plan price ID
- `STRIPE_BUSINESS_PRICE_ID` - Business plan price ID

### Optional - AI Features
- `OPENAI_API_KEY` - From OpenAI platform

### Optional - Email Service
- `SENDGRID_API_KEY` - From SendGrid
- OR configure SMTP:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`
  - `SMTP_FROM_EMAIL`
  - `SMTP_FROM_NAME`

### Optional - Zoho CRM Integration
- `ZOHO_CLIENT_ID`
- `ZOHO_CLIENT_SECRET`
- `ZOHO_REDIRECT_URI` - Your Vercel URL + /api/zoho/callback
- `ZOHO_BASE_URL` - https://accounts.zoho.com

### Required
- `ENCRYPTION_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL

## Step 3: Verify Environment Configuration

The `.env.example` file is already configured correctly for both local and Vercel deployment:

```env
# For local development, use your own PostgreSQL instance
DATABASE_URL="postgresql://user:password@localhost:5432/email_campaign_db"

# For Vercel deployment, set DATABASE_URL to POSTGRES_PRISMA_URL in Vercel settings
```

## Step 4: Verify Prisma Schema

The `prisma/schema.prisma` is already configured correctly:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This configuration works for both local development and Vercel deployment. In Vercel, set `DATABASE_URL` to the value of `POSTGRES_PRISMA_URL`.

## Step 5: Run Database Migrations

After connecting Vercel Postgres, you need to run migrations:

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull

# Run migrations
npx prisma migrate deploy
```

### Option B: Using GitHub Actions
Create a GitHub Action to run migrations on deploy (recommended for production).

### Option C: Manual via Vercel Dashboard
1. Ensure `DATABASE_URL` is set to `POSTGRES_PRISMA_URL` in your Vercel environment variables
2. For migrations, you may need to temporarily switch to direct connection:
   - Update `DATABASE_URL` to point to `POSTGRES_URL_NON_POOLING` 
   - Trigger a deployment that runs migrations
   - Switch back to `POSTGRES_PRISMA_URL` after migrations complete

## Step 6: Seed the Database (Optional)

To seed your database with initial data:

```bash
# Using Vercel CLI
vercel link
vercel env pull
npm run prisma:seed
```

Or create a seed API endpoint in your application that you can call once.

## Step 7: Deploy

Push your code to GitHub. Vercel will automatically deploy:

```bash
git add .
git commit -m "Configure for Vercel Postgres"
git push origin main
```

## Troubleshooting

### Migration Issues
If migrations fail:
1. Check that `POSTGRES_URL_NON_POOLING` is set
2. Ensure your database schema is up to date
3. Try running migrations locally first: `npx prisma migrate dev`

### Connection Pooling Errors
- Use `POSTGRES_PRISMA_URL` for queries (with pooling)
- Use `POSTGRES_URL_NON_POOLING` for migrations and schema operations

### Build Failures
- Ensure all environment variables are set in Vercel
- Check build logs in Vercel dashboard
- Verify Prisma client is generated: `npx prisma generate`

## Production Best Practices

1. **Enable connection pooling** - Already configured with Vercel Postgres
2. **Set up monitoring** - Use Vercel Analytics and Postgres Insights
3. **Configure backups** - Enable automatic backups in Vercel Postgres settings
4. **Use environment-specific configs** - Different settings for preview/production
5. **Secure your API routes** - Implement proper authentication
6. **Rate limiting** - Add rate limiting to prevent abuse

## Scaling

Vercel Postgres automatically handles:
- Connection pooling
- Automatic backups
- High availability
- Scaling based on usage

For larger deployments:
- Consider upgrading to Vercel Postgres Pro
- Implement caching with Vercel KV or Redis
- Use Vercel Edge Functions for global distribution

## Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
