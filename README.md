# Email Campaign Builder - Enterprise SaaS Platform

A next-generation Email Campaign Marketing Tool with AI-powered features, automation workflows, and advanced analytics. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### 📧 Email Campaign Management
- **Drag-and-drop email builder** with MJML rendering
- **Template library** with pre-built responsive templates
- **A/B testing** for subject lines and content
- **Campaign scheduling** and automation
- **Personalization** with Zoho CRM integration
- **Preflight checks** for deliverability optimization

### 👥 Audience Management
- **Subscriber lists** with custom fields and tags
- **Audience segmentation** with dynamic conditions
- **Import/export** capabilities
- **Real-time engagement tracking**
- **Unsubscribe management**

### 🤖 AI-Powered Features
- **Subject line optimization** with AI suggestions
- **Content generation** assistance
- **Predictive send times** for maximum engagement
- **Engagement analytics** with AI insights

### 📊 Analytics & Reporting
- **Real-time tracking** for opens, clicks, and conversions
- **Campaign performance** dashboards
- **Engagement metrics** per subscriber
- **Revenue tracking** and attribution
- **Export capabilities** for custom reporting

### 💳 Subscription Management
- **Tiered pricing plans** (Free, Pro, Business)
- **Stripe integration** for payments
- **Usage tracking** and limits enforcement
- **Billing portal** for subscription management
- **Automated invoicing**

### 🔐 Authentication & Security
- **Email/password authentication**
- **Google OAuth** integration
- **Role-based access control** (User, Admin, Staff)
- **API key management**
- **Session management** with NextAuth.js

### 🛠️ Admin Panel
- **User management** dashboard
- **Subscription monitoring**
- **Campaign oversight**
- **Analytics KPIs**
- **System health monitoring**

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **ShadCN UI** components
- **Framer Motion** for animations
- **React Hook Form** for form management
- **Zustand** for state management

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** with PostgreSQL
- **NextAuth.js** for authentication
- **Stripe API** for payments
- **OpenAI API** for AI features
- **MJML** for responsive email rendering

### Infrastructure
- **Vercel** for frontend hosting and serverless functions
- **Vercel Postgres** for database (or PostgreSQL via Supabase/Neon)
- **Stripe** for payment processing
- **AWS S3** or Cloudinary for file storage
- **SendGrid** or Nodemailer for email delivery

## 📦 Project Structure

```
email-campaign-builder/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── campaigns/            # Campaign management
│   │   ├── audiences/            # Audience management
│   │   ├── subscribers/          # Subscriber management
│   │   ├── plans/                # Subscription plans
│   │   ├── stripe/               # Stripe integration
│   │   ├── export/               # Export functionality
│   │   ├── render/               # MJML rendering
│   │   ├── preflight/            # Email validation
│   │   └── zoho/                 # Zoho CRM integration
│   ├── auth/                     # Auth pages
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/                # User dashboard
│   ├── builder/                  # Email builder
│   ├── campaigns/                # Campaign management UI
│   ├── audience/                 # Audience management UI
│   ├── analytics/                # Analytics dashboard
│   ├── pricing/                  # Pricing page
│   ├── settings/                 # User settings
│   └── templates/                # Template library
├── components/                   # React components
│   ├── blocks/                   # Email builder blocks
│   ├── abtest/                   # A/B testing
│   └── AuthProvider.tsx          # Auth context
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Auth configuration
│   ├── stripe.ts                 # Stripe client
│   ├── mjml.ts                   # MJML utilities
│   └── zoho.ts                   # Zoho integration
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed data
│   └── migrations/               # Database migrations
├── docs/                         # Documentation
│   ├── API_DOCS.md               # API documentation
│   ├── DATABASE_SCHEMA.md        # Database schema
│   └── DEPLOYMENT_GUIDE.md       # Deployment instructions
├── types/                        # TypeScript types
├── public/                       # Static assets
└── store/                        # State management

```

## 🚀 Quick Start

### Prerequisites
- Node.js 18-20
- PostgreSQL database
- Stripe account (for payments)
- Google OAuth credentials (optional)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jesscura/email-campaign-builder.git
cd email-campaign-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/email_campaign_db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRO_PRICE_ID=price_your_pro_id
STRIPE_BUSINESS_PRICE_ID=price_your_business_id

# OpenAI (optional)
OPENAI_API_KEY=sk-your-openai-key

# Email Service
SENDGRID_API_KEY=your-sendgrid-key
# OR
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password

# App
ENCRYPTION_SECRET=your-encryption-secret-32-chars
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Set up database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npm run prisma:seed
```

5. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3000

### Demo Credentials

After seeding, you can log in with:
- **Admin**: admin@example.com / Admin123!
- **Demo User**: demo@example.com / Demo123!

## 📖 Documentation

- [API Documentation](docs/API_DOCS.md) - Complete API reference
- [Database Schema](docs/DATABASE_SCHEMA.md) - Database structure and relationships
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security

### Known Vulnerabilities

The project currently has dependencies with known vulnerabilities:

- **html-minifier ReDoS vulnerability** (High severity)
  - Transitive dependency through mjml
  - Impact: Low in our context (email templates are not user-provided HTML)
  - Status: Waiting for mjml maintainers to update html-minifier dependency
  - Mitigation: Email templates are created by authenticated users, not arbitrary external input

Run `npm audit` for a complete list of vulnerabilities.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add a Vercel Postgres database from the Storage tab
4. Configure environment variables (Vercel Postgres variables are added automatically)
5. Deploy!

See [VERCEL_SETUP.md](VERCEL_SETUP.md) for detailed instructions.

### Manual Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard
3. Create products and prices
4. Set up webhook endpoint at `/api/stripe/webhook`
5. Configure webhook events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `{YOUR_DOMAIN}/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### Zoho CRM Setup (Optional)

1. Go to Zoho Developer Console
2. Create a new server-based application
3. Copy Client ID and Secret
4. Set redirect URI to `{YOUR_DOMAIN}/api/zoho/callback`
5. Configure in app Settings or via environment variables

## 📊 Features by Plan

| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| Emails/month | 500 | 10,000 | 100,000 |
| Subscribers | 100 | 2,500 | 25,000 |
| Campaigns | 5 | 50 | 500 |
| Email Automation | ❌ | ✅ | ✅ |
| AI Features | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |
| Team Access | ❌ | ❌ | ✅ (10 members) |
| API Access | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Stripe](https://stripe.com)
- [MJML](https://mjml.io)
- [TailwindCSS](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org)

## 📞 Support

- Email: support@example.com
- Documentation: https://docs.example.com
- Community: https://community.example.com
- Issues: https://github.com/jesscura/email-campaign-builder/issues

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] WhatsApp/SMS campaigns
- [ ] Advanced segmentation with ML
- [ ] Real-time collaboration
- [ ] Template marketplace
- [ ] Webhook integrations
- [ ] Multi-language support
- [ ] Dark mode
- [ ] White-label option

---

Built with ❤️ by the Email Campaign Builder team