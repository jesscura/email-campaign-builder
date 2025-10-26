# Setup Instructions

This guide will help you get the Email Campaign Builder platform running on your local machine for development or set up a production deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Third-Party Integrations](#third-party-integrations)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or 20.x ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

Optional but recommended:
- **Docker** and **Docker Compose** for containerized setup
- **Stripe CLI** for webhook testing ([Install](https://stripe.com/docs/stripe-cli))

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jesscura/email-campaign-builder.git
cd email-campaign-builder
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js framework
- Prisma ORM
- NextAuth.js for authentication
- Stripe SDK
- And all other dependencies

### 3. Environment Configuration

Create a local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/email_campaign_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-min-32-characters-long

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRO_PRICE_ID=price_your_pro_plan_price_id
STRIPE_BUSINESS_PRICE_ID=price_your_business_plan_price_id

# OpenAI API (Optional - for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Email Service (Choose one)
# Option 1: SendGrid
SENDGRID_API_KEY=SG.your_sendgrid_api_key

# Option 2: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME="Your Company Name"

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Zoho CRM Integration (Optional)
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho/callback
ZOHO_BASE_URL=https://accounts.zoho.com

# Required: Encryption for Zoho tokens
ENCRYPTION_SECRET=your-32-character-encryption-secret

# Public URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_NAME="Email Campaign Builder"
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.com
```

### Important Notes on Environment Variables:

1. **NEXTAUTH_SECRET**: Generate a secure random string:
   ```bash
   openssl rand -base64 32
   ```

2. **ENCRYPTION_SECRET**: Must be at least 32 characters:
   ```bash
   openssl rand -base64 32
   ```

3. **DATABASE_URL**: Update with your actual PostgreSQL credentials

## Database Setup

### Option 1: Local PostgreSQL

1. **Create a Database**:
```bash
createdb email_campaign_db
```

Or using psql:
```sql
CREATE DATABASE email_campaign_db;
```

2. **Update DATABASE_URL** in `.env.local` with your credentials

3. **Run Migrations**:
```bash
npx prisma migrate dev
```

This will:
- Create all database tables
- Generate Prisma Client
- Apply the schema

4. **Seed the Database** (optional but recommended):
```bash
npm run prisma:seed
```

This creates:
- 3 subscription plans (Free, Pro, Business)
- Admin user: admin@example.com / Admin123!
- Demo user: demo@example.com / Demo123!
- Sample audience and subscribers
- Sample templates

### Option 2: Docker PostgreSQL

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: email_campaign_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start the database:
```bash
docker-compose up -d
```

Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/email_campaign_db?schema=public"
```

Then run migrations and seed as above.

### Option 3: Cloud Database (Production)

For production, use managed PostgreSQL services:

- **Supabase** ([https://supabase.com](https://supabase.com))
  1. Create a new project
  2. Copy the connection string from Settings → Database
  3. Update DATABASE_URL in your environment

- **Neon** ([https://neon.tech](https://neon.tech))
  1. Create a new project
  2. Copy the connection string
  3. Update DATABASE_URL in your environment

- **Railway** ([https://railway.app](https://railway.app))
  1. Create a PostgreSQL service
  2. Copy the DATABASE_URL
  3. Update your environment

## Third-Party Integrations

### Stripe Setup

1. **Create a Stripe Account**: [https://stripe.com](https://stripe.com)

2. **Get API Keys**:
   - Go to Developers → API keys
   - Copy "Publishable key" → `STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" → `STRIPE_SECRET_KEY`

3. **Create Products and Prices**:
   ```bash
   # In Stripe Dashboard:
   Products → Add Product
   
   # Pro Plan
   Name: Pro
   Price: $49.99/month
   Copy the Price ID → STRIPE_PRO_PRICE_ID
   
   # Business Plan
   Name: Business
   Price: $199.99/month
   Copy the Price ID → STRIPE_BUSINESS_PRICE_ID
   ```

4. **Setup Webhooks** (for local development):
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe  # macOS
   # or download from https://stripe.com/docs/stripe-cli
   
   # Login
   stripe login
   
   # Forward webhooks to local
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # Copy the webhook signing secret → STRIPE_WEBHOOK_SECRET
   ```

5. **Setup Webhooks** (for production):
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### Google OAuth Setup

1. **Go to Google Cloud Console**: [https://console.cloud.google.com](https://console.cloud.google.com)

2. **Create a Project** (or select existing)

3. **Enable Google+ API**:
   - APIs & Services → Library
   - Search "Google+ API"
   - Enable

4. **Create OAuth Credentials**:
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Copy Client ID → `GOOGLE_CLIENT_ID`
   - Copy Client Secret → `GOOGLE_CLIENT_SECRET`

### OpenAI Setup (Optional)

For AI-powered features:

1. Create account at [https://platform.openai.com](https://platform.openai.com)
2. Go to API Keys
3. Create new secret key
4. Copy key → `OPENAI_API_KEY`

### SendGrid Setup (Optional)

For sending emails:

1. Create account at [https://sendgrid.com](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create API Key
4. Copy key → `SENDGRID_API_KEY`

## Running the Application

### Development Mode

1. **Generate Prisma Client** (if not done):
```bash
npx prisma generate
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**: [http://localhost:3000](http://localhost:3000)

4. **Login with demo credentials**:
   - Admin: admin@example.com / Admin123!
   - User: demo@example.com / Demo123!

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio (DB GUI)

# Prisma Studio
npm run prisma:studio    # Open at http://localhost:5555
```

### Development Tools

**Prisma Studio** - Visual database editor:
```bash
npm run prisma:studio
```
Open [http://localhost:5555](http://localhost:5555)

**Stripe CLI** - Test webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Production Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**:
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure environment variables (copy from `.env.local`)
   - Deploy!

3. **Set up Database**:
   - Use Supabase, Neon, or Railway
   - Copy connection string to Vercel environment variables

4. **Configure Stripe Webhooks**:
   - Update webhook URL to your Vercel domain
   - Add webhook signing secret to environment variables

### Manual Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Set up environment variables** on your server

3. **Run migrations**:
```bash
npx prisma migrate deploy
```

4. **Start the server**:
```bash
npm start
```

## Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: Can't reach database server
```
Solution:
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL is correct
- Check firewall settings
- Ensure database exists: `psql -l`

**2. Prisma Client Not Generated**
```
Error: @prisma/client did not initialize yet
```
Solution:
```bash
npx prisma generate
```

**3. Build Fails**
```
Type error: Cannot find module
```
Solution:
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

**4. Stripe Webhook Verification Failed**
```
Error: Invalid signature
```
Solution:
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Use Stripe CLI for local testing
- Verify webhook endpoint is accessible

**5. Google OAuth Error**
```
Error: redirect_uri_mismatch
```
Solution:
- Add correct redirect URI in Google Console
- Format: `https://yourdomain.com/api/auth/callback/google`
- Check NEXTAUTH_URL matches your domain

**6. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
Solution:
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Getting Help

- **Documentation**: Check `/docs` folder
- **GitHub Issues**: [Report bugs](https://github.com/jesscura/email-campaign-builder/issues)
- **Email Support**: support@example.com

### Debug Mode

Enable debug logging:

```bash
# Prisma queries
DEBUG="prisma:*" npm run dev

# All debug logs
DEBUG="*" npm run dev
```

## Next Steps

After setup:

1. ✅ Explore the dashboard at `/dashboard`
2. ✅ Create your first campaign at `/builder`
3. ✅ Set up your audience at `/audience`
4. ✅ Configure pricing at `/pricing`
5. ✅ Check analytics at `/analytics`
6. ✅ Review admin panel (admin users only)

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Generate strong `ENCRYPTION_SECRET`
- [ ] Use production Stripe keys
- [ ] Set up proper CORS policies
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Enable database backups
- [ ] Review and update environment variables
- [ ] Set up error tracking (Sentry, etc.)

---

**Congratulations!** 🎉 Your Email Campaign Builder is now set up and ready to use.

For more information, see:
- [API Documentation](API_DOCS.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Deployment Guide](../DEPLOYMENT.md)
