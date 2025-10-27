# ✅ Vercel Deployment Checklist

Your app is **ready to deploy** to Vercel! Here's what's been verified:

## ✅ Pre-flight Checks (Completed)

- [x] `next.config.js` configured for Vercel (standalone output, MJML excluded)
- [x] `tsconfig.json` excludes `sagestone-email` subfolder (prevents build errors)
- [x] Build succeeds locally: `npm run build` ✓
- [x] Prisma schema ready for Postgres
- [x] Environment variables documented in `.env.example`
- [x] `NEXT_PUBLIC_API_URL` added for frontend API calls

## 🚀 Deploy to Vercel (5 minutes)

### 1. Connect Repository
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- **New Project** → Import your GitHub repo
- Framework: **Next.js** (auto-detected)
- Root directory: **/** (repository root)
- Build command: `next build` (default)
- Install command: `pnpm install` (default)

### 2. Add Vercel Postgres
- In your Vercel project → **Storage** tab
- **Create Database** → **Postgres**
- Choose region (e.g., US East)
- Vercel auto-injects: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`

### 3. Set Environment Variables
Go to **Settings** → **Environment Variables** and add:

#### Required
```bash
# Database (use the value from Vercel Postgres)
DATABASE_URL=<copy value of POSTGRES_PRISMA_URL>

# NextAuth
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Security
ENCRYPTION_SECRET=<run: openssl rand -base64 32>

# Public URLs
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### Optional (add when ready)
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- OpenAI: `OPENAI_API_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, etc.
- SendGrid: `SENDGRID_API_KEY`

### 4. Run Database Migrations
After first deploy, run migrations using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables locally
vercel env pull

# Run migrations against Vercel Postgres
npx prisma migrate deploy

# Optional: Seed the database
npm run prisma:seed
```

### 5. Deploy!
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

Vercel will automatically build and deploy. Visit your project URL!

---

## 📱 What Works Now

### ✅ Pages That Work Without API
- `/` - Home page
- `/auth/signin` - Sign in
- `/auth/signup` - Sign up
- `/builder` - Email builder (with localStorage)
- `/templates` - Template gallery
- `/pricing` - Pricing page
- `/dashboard` - Dashboard shell

### 🔌 Pages That Need API
These pages will show a friendly error until you deploy the NestJS API and set `NEXT_PUBLIC_API_URL`:

- `/campaigns` - Campaign list
- `/audiences` - Contact management
- `/analytics` - Performance metrics

---

## 🔧 Optional: Deploy the NestJS API

The API in `sagestone-email/apps/api/` needs separate hosting (Render, Fly.io, Railway, etc.).

### Quick Option: Render
1. Create new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Root directory: `sagestone-email/apps/api`
4. Build command: `pnpm install && pnpm build`
5. Start command: `node dist/main.js`
6. Add env vars: `DATABASE_URL`, etc.
7. Copy the deployed API URL and set it as `NEXT_PUBLIC_API_URL` in Vercel

---

## 🎉 Success Criteria

After deployment, you should be able to:
- ✅ Visit your Vercel URL and see the homepage
- ✅ Sign up / sign in with credentials
- ✅ Use the email builder and save campaigns locally
- ✅ View templates and pricing
- ⏳ Campaigns/Audiences/Analytics pages will work once API is deployed

---

## 🔍 Troubleshooting

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all required env vars are set
- Verify `tsconfig.json` excludes `sagestone-email`

### Database connection errors
- Confirm `DATABASE_URL` is set to `POSTGRES_PRISMA_URL`
- For migrations, use `POSTGRES_URL_NON_POOLING`
- Check Vercel Postgres is in the same region

### Pages show errors
- Frontend pages without API dependencies work immediately
- API-dependent pages need `NEXT_PUBLIC_API_URL` set to your deployed API

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

**You're all set!** Push to GitHub and watch Vercel automatically deploy your app. 🚀
