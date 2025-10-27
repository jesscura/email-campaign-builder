# Sagestone Email vNext - Architecture Documentation

## Overview

Sagestone Email vNext is a full-featured, AI-powered email marketing and automation platform built as a monorepo. It provides enterprise-grade features including multi-channel campaigns, advanced analytics, predictive AI, and seamless integrations.

## Technology Stack

### Frontend
- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Zod** - Schema validation

### Backend
- **NestJS** - Enterprise Node.js framework
- **TypeScript** - Type-safe backend development
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Primary database (Neon/Vercel Postgres)
- **BullMQ** - Background job processing
- **Redis** - Job queue and caching (Upstash)

### AI & ML
- **OpenAI API** - GPT-4 for content generation, subject line optimization
- **Custom Models** - Predictive analytics for engagement forecasting

### Infrastructure
- **Vercel** - Frontend hosting and serverless functions
- **Render/Fly.io** - API and workers hosting
- **Neon/Vercel Postgres** - Managed PostgreSQL
- **Upstash Redis** - Managed Redis
- **Cloudflare R2** - Object storage
- **Sentry** - Error tracking
- **OpenTelemetry** - Distributed tracing

## Monorepo Structure

```
sagestone-email/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── app/          # Next.js App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and helpers
│   │   └── public/       # Static assets
│   ├── api/              # NestJS backend API
│   │   ├── src/
│   │   │   ├── campaigns/      # Campaign management
│   │   │   ├── audience/       # Audience & segmentation
│   │   │   ├── analytics/      # Analytics & reporting
│   │   │   ├── automation/     # Workflow automation
│   │   │   └── integrations/   # Third-party integrations
│   │   └── nest-cli.json
│   └── workers/          # BullMQ background workers
│       └── src/
│           ├── processors/     # Job processors
│           │   ├── campaign.processor.ts
│           │   ├── analytics.processor.ts
│           │   └── prediction.processor.ts
│           └── index.ts
├── packages/
│   ├── ui/               # Shared UI components
│   │   └── src/
│   │       └── components/     # Button, Card, Input, etc.
│   ├── email/            # Email provider abstraction
│   │   └── src/
│   │       ├── providers/      # SendGrid, AWS SES
│   │       ├── mjml.ts         # MJML compiler
│   │       └── types.ts
│   ├── billing/          # Multi-provider billing SDK
│   │   └── src/
│   │       ├── drivers/        # Stripe, Xendit, PayPal, Paddle
│   │       └── types/
│   └── integrations/     # Third-party integrations
│       └── src/
│           ├── zapier/
│           ├── shopify/
│           ├── hubspot/
│           └── ...
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed data
│   └── migrations/       # Database migrations
├── docs/                 # Documentation
├── docker-compose.yml    # Local development setup
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json
```

## Architecture Patterns

### 1. Monorepo with pnpm Workspaces

We use pnpm workspaces to manage multiple applications and shared packages:

- **Apps**: Independently deployable applications (web, api, workers)
- **Packages**: Shared libraries consumed by apps (`@sagestone/ui`, `@sagestone/email`, etc.)

Benefits:
- Code reuse across applications
- Unified dependency management
- Type-safe cross-package imports
- Simplified development workflow

### 2. API Layer (NestJS)

The API follows a modular architecture:

```
api/src/
├── campaigns/          # Campaign CRUD, scheduling, sending
├── audience/           # Subscriber management, segmentation
├── analytics/          # Real-time analytics, forecasting
├── automation/         # Workflow engine, triggers
└── integrations/       # External service connectors
```

Each module is self-contained with:
- Controller (routes)
- Service (business logic)
- DTOs (data transfer objects)
- Module definition

### 3. Background Workers (BullMQ)

Workers handle asynchronous, long-running tasks:

**Campaign Queue**:
- Email sending (bulk, scheduled)
- A/B test distribution
- Personalization rendering

**Analytics Queue**:
- Event tracking (opens, clicks, conversions)
- Metric aggregation
- Report generation

**Prediction Queue**:
- Engagement forecasting
- Send-time optimization
- Churn prediction
- Segment recommendations

### 4. Email Provider Abstraction

The `@sagestone/email` package provides a unified interface for multiple email providers:

```typescript
interface EmailProvider {
  send(options: EmailOptions): Promise<Result>;
}
```

Implementations:
- **SendGridProvider** (primary)
- **SESProvider** (fallback)

Benefits:
- Easy provider switching
- Automatic failover
- Consistent error handling

### 5. Billing Provider Abstraction

The `@sagestone/billing` package supports multiple payment processors:

```typescript
interface BillingProvider {
  createCustomer(...): Promise<Customer>;
  createCheckoutSession(...): Promise<Session>;
  getSubscription(...): Promise<Subscription>;
  cancelSubscription(...): Promise<Result>;
  verifyWebhook(...): Promise<Event>;
}
```

Implementations:
- **StripeProvider** (default, global)
- **XenditProvider** (Southeast Asia)
- **PayPalProvider** (alternative)
- **PaddleProvider** (SaaS-focused)

Configuration via `BILLING_DRIVER` environment variable.

### 6. AI Features

AI capabilities are integrated throughout:

**Campaign Builder**:
- Subject line generation and optimization
- Body content suggestions
- Image recommendations
- A/B/n test ideas
- Deliverability scoring

**Analytics**:
- Open/click rate forecasting
- ROI prediction
- Send-time optimization
- Engagement prediction
- Churn risk scoring

**Audience**:
- AI-recommended segments
- Behavioral clustering
- Lookalike audience generation

Implementation:
- OpenAI API for text generation
- Custom models for predictions (trained on historical data)
- Real-time scoring endpoints in API

### 7. Database Design

Key entities in Prisma schema:

```prisma
model User
model Workspace
model Campaign
model Subscriber
model Audience
model Segment
model Automation
model Integration
model Subscription (billing)
model AnalyticsEvent
```

Features:
- Multi-tenancy via `workspaceId`
- Soft deletes
- Audit trails
- Encrypted PII fields

## Data Flow

### Campaign Creation & Sending

```
User (Web) 
  → API (campaigns.controller)
    → campaigns.service.create()
      → Prisma (save campaign)
  → Queue (campaignQueue.add)
    → Worker (campaignProcessor)
      → Email Provider (send)
        → SendGrid/SES
      → Analytics (track)
```

### Real-time Analytics

```
Email Opened
  → Tracking Pixel
    → API (analytics/track-open)
      → Queue (analyticsQueue.add)
        → Worker (analyticsProcessor)
          → Prisma (update metrics)
  → Web (dashboard updates via polling/SSE)
```

### AI-Powered Forecasting

```
User (requests forecast)
  → API (analytics/forecast/:id)
    → Queue (predictionQueue.add)
      → Worker (predictionProcessor)
        → OpenAI API / Custom Model
          → Calculate predictions
        → Prisma (store forecast)
  → API (return forecast)
    → Web (display charts)
```

## Security

### Authentication & Authorization
- **NextAuth.js** for user authentication
- **JWT tokens** for API authentication
- **2FA (TOTP)** for enhanced security
- **RBAC** (Role-Based Access Control)

### Data Protection
- **Encryption at rest** for PII (using `ENCRYPTION_SECRET`)
- **Encryption in transit** (HTTPS/TLS)
- **Secure webhook verification** for all providers
- **GDPR compliance** by default

### API Security
- **Rate limiting** on all endpoints
- **Input validation** with Zod
- **SQL injection protection** via Prisma
- **XSS protection** with Content Security Policy

## Scalability

### Horizontal Scaling
- **Web**: Serverless on Vercel (auto-scales)
- **API**: Containerized on Render/Fly (manual/auto-scale)
- **Workers**: Multiple instances processing jobs in parallel

### Database
- **Connection pooling** via Prisma
- **Read replicas** for analytics queries
- **Indexes** on frequently queried fields

### Caching
- **Redis** for session storage
- **TanStack Query** for client-side caching
- **CDN** for static assets (Vercel Edge Network)

### Queue Management
- **BullMQ** with Redis for reliable job processing
- **Retry policies** for failed jobs
- **Dead letter queues** for permanent failures

## Observability

### Monitoring
- **Sentry** for error tracking and alerting
- **OpenTelemetry** for distributed tracing
- **Custom metrics** for business KPIs

### Logging
- **Structured logging** (JSON format)
- **Log levels** (debug, info, warn, error)
- **Request/response logging** in API

### Health Checks
- `/api/health` endpoint for API
- Database connectivity check
- Redis connectivity check
- Worker status monitoring

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start Postgres & Redis
docker-compose up -d postgres redis

# Run database migrations
pnpm prisma:migrate

# Seed database
pnpm prisma:seed

# Start all apps in development mode
pnpm dev

# Or start individually
pnpm dev:web      # http://localhost:3000
pnpm dev:api      # http://localhost:4000
pnpm dev:workers  # Background process
```

### Building for Production

```bash
# Build all apps
pnpm build

# Or build individually
pnpm build:web
pnpm build:api
pnpm build:workers
```

### Testing

```bash
# Run tests
pnpm test

# Run linting
pnpm lint
```

## Deployment

### Vercel (Web)
- Automatic deployments from `main` branch
- Environment variables configured in Vercel dashboard
- Edge Network for global performance

### Render/Fly.io (API & Workers)
- Docker-based deployments
- Health checks and auto-restart
- Horizontal scaling available

### Database Migrations
- Run `pnpm prisma:migrate deploy` on deployment
- Use direct connection (non-pooled) for migrations

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Future Enhancements

- **Mobile App** (React Native)
- **WhatsApp/SMS Campaigns**
- **Advanced ML Segmentation**
- **Real-time Collaboration**
- **Template Marketplace**
- **Multi-language Support**
- **White-label Option**

---

**Last Updated**: January 2025  
**Version**: 2.0.0
