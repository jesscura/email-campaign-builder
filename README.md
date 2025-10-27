# Sagestone Email vNext

**AI-Powered Email Marketing & Automation Platform**

A next-generation, production-ready email marketing platform with AI campaign builders, advanced analytics, multi-channel automation, and enterprise features. Built as a monorepo with Next.js 14, NestJS, BullMQ, and PostgreSQL.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jesscura/email-builder)

## ✨ Features

### 🤖 AI-Powered Campaign Builder
- **GPT-4 Content Generation** - Subject lines, body copy, and personalization suggestions
- **Smart A/B/n Testing** - AI-recommended test variants
- **Engagement Scoring** - Predictive deliverability and open rate analysis
- **Image Recommendations** - AI-suggested visuals for campaigns
- **Send-Time Optimization** - ML-powered optimal sending times

### 📧 Email Campaign Management
- **Drag-and-Drop Builder** with MJML rendering
- **Template Library** with pre-built responsive designs
- **Campaign Scheduling** and automation
- **Personalization Engine** with dynamic content
- **Preflight Checks** for deliverability optimization
- **Multi-Provider Support** (SendGrid primary, AWS SES fallback)

### 👥 Advanced Audience Management
- **Unlimited Dynamic Segments** with nested conditions
- **AI-Recommended Segments** based on behavior
- **Import/Export** from CSV, Zapier, CRMs
- **Real-time Engagement Tracking**
- **Churn Prediction** and prevention
- **GDPR-Compliant** unsubscribe management

### 🔄 Multi-Channel Automation
- **Visual Workflow Builder** (email, SMS, social)
- **Behavioral Triggers** (opens, clicks, purchases)
- **Predictive Triggers** (churn risk, engagement drop)
- **Pre-built Templates** (welcome series, abandoned cart, post-purchase)
- **Advanced Timing** controls and delays

### 📊 Analytics & Forecasting
- **Real-Time Dashboards** - Opens, clicks, conversions
- **Predictive Analytics** - Forecast open/click/ROI
- **Cohort Analysis** - Subscriber lifecycle insights
- **Revenue Attribution** - Track campaign ROI
- **Auto-Updating Segments** - Dynamic audience evolution
- **Export Capabilities** - CSV, PDF reports

### 💳 Flexible Billing
- **Multi-Provider Support**: Stripe (default), Xendit, PayPal, Paddle
- **Tiered Pricing** - Free, Pro, Business plans
- **Usage Tracking** - Automatic limit enforcement
- **Agency Mode** - Multi-brand support
- **In-App Invoicing** - Billing portal integration

### 🔐 Security & Compliance
- **NextAuth.js** - Email/password + Google OAuth
- **2FA (TOTP)** - Time-based one-time passwords
- **Enterprise RBAC** - Role-based access control
- **PII Encryption** - At-rest encryption for sensitive data
- **Audit Logs** - Complete activity tracking
- **GDPR Default** - Privacy panel, data export, right to be forgotten

### 🔌 Integrations
- **Zapier** - 5,000+ app connections
- **E-commerce**: Shopify, WooCommerce
- **CRMs**: HubSpot, Salesforce, Zoho
- **Productivity**: Google Sheets, Slack
- **Public API** - RESTful with OpenAPI/Swagger docs
- **Webhooks** - Real-time event notifications

## 🏗️ Architecture

### Monorepo Structure

```
sagestone-email/
├── apps/
│   ├── web/              # Next.js 14 frontend (Vercel)
│   ├── api/              # NestJS backend (Render/Fly)
│   └── workers/          # BullMQ background jobs (Render/Fly)
├── packages/
│   ├── ui/               # Shared React components
│   ├── email/            # Email provider abstraction (SendGrid, SES)
│   ├── billing/          # Multi-provider SDK (Stripe, Xendit, PayPal, Paddle)
│   └── integrations/     # Third-party integrations (Zapier, Shopify, etc.)
├── prisma/               # Database schema & migrations
└── docs/                 # Comprehensive documentation
```

### Tech Stack

**Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion, TanStack Query, Zustand  
**Backend**: NestJS, TypeScript, Prisma ORM  
**Database**: PostgreSQL (Neon/Vercel Postgres)  
**Queue**: BullMQ + Redis (Upstash)  
**AI**: OpenAI GPT-4, custom ML models  
**Email**: SendGrid (primary), AWS SES (fallback)  
**Storage**: Cloudflare R2 / AWS S3  
**Monitoring**: Sentry, OpenTelemetry

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18-22
- **pnpm** 9+ (install: `npm install -g pnpm`)
- **PostgreSQL** 14+ (or use Docker Compose)
- **Redis** 7+ (or use Docker Compose)
- **Git**

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/jesscura/email-builder.git
cd email-builder

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start Docker services (Postgres + Redis)
docker-compose up -d postgres redis

# 5. Run database migrations
pnpm prisma:generate
pnpm prisma:migrate

# 6. Seed database (optional)
pnpm prisma:seed

# 7. Start all applications
pnpm dev

# Or start individually:
# pnpm dev:web      # http://localhost:3000
# pnpm dev:api      # http://localhost:4000
# pnpm dev:workers  # Background process
```

Visit **http://localhost:3000** to see the application.

### Demo Credentials

After seeding:
- **Admin**: admin@example.com / Admin123!
- **Demo User**: demo@example.com / Demo123!

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design and patterns
- **[Billing Integration](docs/BILLING_INTEGRATION.md)** - Multi-provider setup (Stripe, Xendit, PayPal, Paddle)
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Vercel + Render/Fly + Neon + Upstash
- **[API Docs](docs/API_DOCS.md)** - Complete API reference
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Database structure and relationships
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Step-by-step setup instructions

## 🧪 Testing

```bash
# Run linting
pnpm lint

# Build all apps
pnpm build

# Run tests
pnpm test
```

## 📦 Building for Production

```bash
# Build all applications
pnpm build

# Build individually
pnpm build:web
pnpm build:api
pnpm build:workers
```

## 🌍 Deployment

### Vercel (Recommended for Web)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jesscura/email-builder)

1. Click button above or import project in Vercel dashboard
2. Add Vercel Postgres or connect to Neon
3. Configure environment variables
4. Deploy!

### Render / Fly.io (for API & Workers)

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 💰 Pricing Plans

| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| Emails/month | 500 | 10,000 | 100,000 |
| Subscribers | 100 | 2,500 | 25,000 |
| Campaigns | 5 | 50 | 500 |
| AI Features | ❌ | ✅ | ✅ |
| Automation | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |
| API Access | ❌ | ✅ | ✅ |
| Team Members | 1 | 1 | 10 |
| Support | Community | Email | Priority |
| **Price** | **$0** | **$29/mo** | **$99/mo** |

## 🛠️ Development

### Package Scripts

```bash
# Root commands
pnpm install       # Install all dependencies
pnpm dev           # Start all apps in dev mode
pnpm build         # Build all apps
pnpm lint          # Lint all packages
pnpm clean         # Clean build artifacts

# Web app
pnpm dev:web       # Start Next.js dev server
pnpm build:web     # Build Next.js app

# API
pnpm dev:api       # Start NestJS with hot reload
pnpm build:api     # Build NestJS app

# Workers
pnpm dev:workers   # Start BullMQ workers with hot reload
pnpm build:workers # Build workers

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:seed      # Seed database
pnpm prisma:studio    # Open Prisma Studio
```

### Adding Dependencies

```bash
# Add to web app
pnpm --filter @sagestone/web add <package>

# Add to API
pnpm --filter @sagestone/api add <package>

# Add to shared package
pnpm --filter @sagestone/ui add <package>

# Add to root (dev dependencies)
pnpm add -D <package>
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - React framework
- [NestJS](https://nestjs.com) - Node.js framework
- [Prisma](https://prisma.io) - Database ORM
- [BullMQ](https://bullmq.io) - Job queue
- [TailwindCSS](https://tailwindcss.com) - CSS framework
- [OpenAI](https://openai.com) - AI capabilities
- [Stripe](https://stripe.com), [Xendit](https://xendit.com), [PayPal](https://paypal.com), [Paddle](https://paddle.com) - Payment processing

## 📞 Support

- **Email**: support@sagestone.email
- **Documentation**: [docs.sagestone.email](https://docs.sagestone.email)
- **Community**: [community.sagestone.email](https://community.sagestone.email)
- **Issues**: [GitHub Issues](https://github.com/jesscura/email-builder/issues)

## 🗺️ Roadmap

- [x] AI Campaign Builder
- [x] Multi-Provider Billing
- [x] Advanced Analytics & Forecasting
- [x] Multi-Channel Automation
- [x] Enterprise Security (2FA, RBAC)
- [x] Comprehensive Integrations
- [ ] Mobile App (React Native)
- [ ] WhatsApp/SMS Campaigns
- [ ] Real-time Collaboration
- [ ] Template Marketplace
- [ ] Multi-language Support
- [ ] White-label Option

---

**Built with ❤️ for creators, marketers, and developers**

**Version**: 2.0.0 | **Status**: Production Ready ✅