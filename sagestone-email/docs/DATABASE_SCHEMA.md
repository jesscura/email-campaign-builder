# Database Schema (Prisma)

See `prisma/schema.prisma` for the full model list. Key entities:

- Core: User, TwoFactorSecret, Workspace, WorkspaceMember, Plan, Subscription, Invoice
- Contacts & Segments: Contact, ContactAttribute, Segment, Suppression
- Campaigns & Events: Campaign, CampaignVariant, CampaignSend, Event
- Automation: Flow, FlowNode, FlowRun, FlowQueue
- Predictive/Feature Store: EngagementScore, SendTimeProfile, ForecastMetric
- Deliverability/Compliance: Domain, AbuseReport, AuditLog
- DevX: ApiKey, WebhookEndpoint

Run migrations and seed:

```bash
pnpm prisma:generate
pnpm db:migrate
pnpm db:seed
```
