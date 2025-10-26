# Database Schema Documentation

## Overview

This document describes the database schema for the Email Campaign Builder platform. The database uses PostgreSQL and is managed through Prisma ORM.

## Connection

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

## Entity Relationship Diagram

```
User ──┬─── Campaign ──┬─── CampaignEvent
       │               └─── CampaignLink
       ├─── Audience ──┬─── Subscriber
       │               └─── Segment
       ├─── Automation ──── AutomationRun
       ├─── Template
       ├─── ApiKey
       ├─── Account
       └─── Session

Plan ────── User

VerificationToken (standalone)
AnalyticsSnapshot (standalone)
```

## Tables

### User
Stores user account information, authentication, and subscription details.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| email | String | Unique email address |
| emailVerified | DateTime? | Email verification timestamp |
| name | String? | User's full name |
| password | String? | Hashed password (bcrypt) |
| image | String? | Profile image URL |
| role | UserRole | USER, ADMIN, or STAFF |
| planId | String? | Foreign key to Plan |
| stripeCustomerId | String? | Stripe customer ID |
| subscriptionStatus | SubscriptionStatus | Subscription state |
| subscriptionId | String? | Stripe subscription ID |
| currentPeriodEnd | DateTime? | Subscription period end |
| emailsSentThisMonth | Int | Usage tracking |
| subscribersCount | Int | Total subscribers |
| campaignsCount | Int | Total campaigns |
| createdAt | DateTime | Account creation |
| updatedAt | DateTime | Last update |
| lastLoginAt | DateTime? | Last login timestamp |

**Indexes:**
- Unique: email, stripeCustomerId
- Index: role, subscriptionStatus

**Relations:**
- accounts (Account[])
- sessions (Session[])
- campaigns (Campaign[])
- audiences (Audience[])
- segments (Segment[])
- automations (Automation[])
- templates (Template[])
- apiKeys (ApiKey[])
- plan (Plan)

### Account
OAuth provider accounts linked to users (NextAuth.js).

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| type | String | Account type |
| provider | String | OAuth provider (google, etc.) |
| providerAccountId | String | Provider's user ID |
| refresh_token | String? | OAuth refresh token |
| access_token | String? | OAuth access token |
| expires_at | Int? | Token expiration |
| token_type | String? | Token type |
| scope | String? | OAuth scope |
| id_token | String? | ID token |
| session_state | String? | Session state |

**Indexes:**
- Unique: [provider, providerAccountId]
- Foreign key: userId -> User.id (cascade delete)

### Session
User session management (NextAuth.js).

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| sessionToken | String | Unique session token |
| userId | String | Foreign key to User |
| expires | DateTime | Session expiration |

**Indexes:**
- Unique: sessionToken
- Foreign key: userId -> User.id (cascade delete)

### VerificationToken
Email verification tokens (NextAuth.js).

| Column | Type | Description |
|--------|------|-------------|
| identifier | String | Email or user identifier |
| token | String | Verification token |
| expires | DateTime | Token expiration |

**Indexes:**
- Unique: token
- Unique: [identifier, token]

### ApiKey
API keys for programmatic access.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| key | String | Unique API key |
| name | String | Key description |
| lastUsed | DateTime? | Last usage timestamp |
| createdAt | DateTime | Creation timestamp |
| expiresAt | DateTime? | Expiration date |

**Indexes:**
- Unique: key
- Foreign key: userId -> User.id (cascade delete)

### Plan
Subscription plan definitions.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| name | String | Plan name (Free, Pro, Business) |
| description | String? | Plan description |
| price | Float | Monthly/yearly price |
| interval | String | 'month' or 'year' |
| stripePriceId | String? | Stripe price ID |
| emailsPerMonth | Int | Email sending limit |
| maxSubscribers | Int | Subscriber limit |
| maxCampaigns | Int | Campaign limit |
| hasAutomation | Boolean | Automation feature flag |
| hasAIFeatures | Boolean | AI features flag |
| hasAdvancedAnalytics | Boolean | Analytics flag |
| hasTeamAccess | Boolean | Team collaboration flag |
| maxTeamMembers | Int | Team size limit |
| isActive | Boolean | Active status |
| sortOrder | Int | Display order |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

**Indexes:**
- Unique: stripePriceId
- Index: isActive, sortOrder

### Campaign
Email campaign data.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| name | String | Campaign name |
| subject | String | Email subject line |
| preheader | String? | Preview text |
| fromName | String | Sender name |
| fromEmail | String | Sender email |
| replyTo | String? | Reply-to email |
| htmlContent | String? | Rendered HTML |
| mjmlContent | String? | MJML template |
| jsonContent | String? | Builder JSON |
| status | CampaignStatus | Campaign state |
| scheduledAt | DateTime? | Send schedule |
| sentAt | DateTime? | Actual send time |
| isABTest | Boolean | A/B test flag |
| abTestVariants | Json? | A/B test data |
| audienceId | String? | Target audience |
| segmentIds | String[] | Target segments |
| totalSent | Int | Emails sent |
| totalOpens | Int | Unique opens |
| totalClicks | Int | Unique clicks |
| totalBounces | Int | Bounce count |
| totalUnsubscribes | Int | Unsubscribe count |
| totalComplaints | Int | Spam complaints |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

**Indexes:**
- Foreign key: userId -> User.id (cascade delete)
- Foreign key: audienceId -> Audience.id
- Index: status, createdAt

**Relations:**
- user (User)
- audience (Audience?)
- events (CampaignEvent[])
- links (CampaignLink[])

### CampaignEvent
Email tracking events (opens, clicks, bounces, etc.).

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| campaignId | String | Foreign key to Campaign |
| subscriberId | String? | Subscriber ID |
| eventType | EventType | Event type enum |
| email | String? | Recipient email |
| ipAddress | String? | Client IP |
| userAgent | String? | Client user agent |
| linkId | String? | Clicked link ID |
| metadata | Json? | Additional data |
| createdAt | DateTime | Event timestamp |

**Indexes:**
- Foreign key: campaignId -> Campaign.id (cascade delete)
- Foreign key: linkId -> CampaignLink.id
- Index: [campaignId, eventType]
- Index: subscriberId

**Event Types:**
- SENT: Email sent
- DELIVERED: Email delivered
- OPENED: Email opened
- CLICKED: Link clicked
- BOUNCED: Email bounced
- UNSUBSCRIBED: User unsubscribed
- COMPLAINED: Spam complaint

### CampaignLink
Tracked links in campaigns.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| campaignId | String | Foreign key to Campaign |
| url | String | Original URL |
| shortCode | String | Tracking code |
| clicks | Int | Click count |
| createdAt | DateTime | Creation timestamp |

**Indexes:**
- Unique: shortCode
- Foreign key: campaignId -> Campaign.id (cascade delete)

### Audience
Subscriber lists.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| name | String | Audience name |
| description | String? | Description |
| subscribersCount | Int | Total subscribers |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

**Indexes:**
- Foreign key: userId -> User.id (cascade delete)

**Relations:**
- user (User)
- subscribers (Subscriber[])
- segments (Segment[])
- campaigns (Campaign[])

### Subscriber
Individual subscriber records.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| audienceId | String | Foreign key to Audience |
| email | String | Email address |
| firstName | String? | First name |
| lastName | String? | Last name |
| phone | String? | Phone number |
| status | SubscriberStatus | Subscription status |
| unsubscribedAt | DateTime? | Unsubscribe timestamp |
| customFields | Json? | Custom attributes |
| tags | String[] | Tags array |
| totalSent | Int | Emails received |
| totalOpens | Int | Emails opened |
| totalClicks | Int | Links clicked |
| lastOpenedAt | DateTime? | Last open time |
| lastClickedAt | DateTime? | Last click time |
| source | String? | Signup source |
| ipAddress | String? | Signup IP |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

**Indexes:**
- Unique: [audienceId, email]
- Index: email
- Foreign key: audienceId -> Audience.id (cascade delete)

**Subscriber Status:**
- ACTIVE: Can receive emails
- UNSUBSCRIBED: Opted out
- BOUNCED: Email bounced
- COMPLAINED: Marked as spam

### Segment
Audience segments based on conditions.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| audienceId | String | Foreign key to Audience |
| name | String | Segment name |
| description | String? | Description |
| conditions | Json | Filter conditions |
| subscribersCount | Int | Matching subscribers |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

**Indexes:**
- Foreign key: userId -> User.id (cascade delete)
- Foreign key: audienceId -> Audience.id (cascade delete)

### Automation
Workflow automation definitions.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| name | String | Automation name |
| description | String? | Description |
| trigger | Json | Trigger configuration |
| actions | Json | Action sequence |
| isActive | Boolean | Active status |
| totalTriggered | Int | Total runs |
| totalCompleted | Int | Completed runs |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |
| lastRunAt | DateTime? | Last execution |

**Indexes:**
- Foreign key: userId -> User.id (cascade delete)
- Index: isActive

**Relations:**
- user (User)
- runs (AutomationRun[])

### AutomationRun
Automation execution logs.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| automationId | String | Foreign key to Automation |
| subscriberId | String? | Target subscriber |
| status | String | Run status |
| startedAt | DateTime | Start time |
| completedAt | DateTime? | Completion time |
| error | String? | Error message |

**Indexes:**
- Foreign key: automationId -> Automation.id (cascade delete)

### Template
Email templates.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String? | Foreign key to User |
| name | String | Template name |
| description | String? | Description |
| thumbnail | String? | Preview image URL |
| category | String? | Category |
| tags | String[] | Tags array |
| htmlContent | String? | HTML content |
| mjmlContent | String? | MJML content |
| jsonContent | String? | Builder JSON |
| isPublic | Boolean | Public template |
| isPremium | Boolean | Premium template |
| timesUsed | Int | Usage count |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

**Indexes:**
- Foreign key: userId -> User.id (set null on delete)
- Index: isPublic, category

### AnalyticsSnapshot
Daily analytics aggregation.

| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| date | DateTime | Snapshot date |
| totalUsers | Int | Total users |
| activeUsers | Int | Active users |
| newUsers | Int | New signups |
| totalCampaigns | Int | Total campaigns |
| sentCampaigns | Int | Sent campaigns |
| emailsSent | Int | Emails sent |
| totalOpens | Int | Email opens |
| totalClicks | Int | Link clicks |
| totalBounces | Int | Bounces |
| totalUnsubscribes | Int | Unsubscribes |
| totalRevenue | Float | Revenue |
| newSubscriptions | Int | New subscriptions |
| churnedSubscriptions | Int | Canceled subscriptions |
| createdAt | DateTime | Creation timestamp |

**Indexes:**
- Unique: date

## Enums

### UserRole
- `USER`: Regular user
- `ADMIN`: Administrator
- `STAFF`: Staff member

### SubscriptionStatus
- `ACTIVE`: Active subscription
- `INACTIVE`: Inactive
- `PAST_DUE`: Payment failed
- `CANCELED`: Canceled
- `TRIALING`: Trial period

### CampaignStatus
- `DRAFT`: Being edited
- `SCHEDULED`: Scheduled to send
- `SENDING`: Currently sending
- `SENT`: Completed
- `PAUSED`: Paused
- `CANCELED`: Canceled

### EventType
- `SENT`: Email sent
- `DELIVERED`: Email delivered
- `OPENED`: Email opened
- `CLICKED`: Link clicked
- `BOUNCED`: Email bounced
- `UNSUBSCRIBED`: Unsubscribed
- `COMPLAINED`: Spam complaint

### SubscriberStatus
- `ACTIVE`: Active subscriber
- `UNSUBSCRIBED`: Unsubscribed
- `BOUNCED`: Email bounced
- `COMPLAINED`: Spam complaint

## Migrations

### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Run seed data
npm run prisma:seed
```

### Production Deployment
```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Seed Data

The seed script creates:
- 3 subscription plans (Free, Pro, Business)
- 1 admin user (admin@example.com / Admin123!)
- 1 demo user (demo@example.com / Demo123!)
- 1 sample audience
- 3 sample subscribers
- 3 sample templates

Run with: `npm run prisma:seed`

## Backup & Restore

### Backup
```bash
pg_dump -h hostname -U username -d database_name -F c -b -v -f backup.dump
```

### Restore
```bash
pg_restore -h hostname -U username -d database_name -v backup.dump
```

## Performance Optimization

### Indexes
All foreign keys are automatically indexed by Prisma. Additional indexes are created for:
- User email lookups
- Campaign status queries
- Event filtering
- Subscriber email searches

### Query Optimization
```typescript
// Use select to fetch only needed fields
const campaigns = await prisma.campaign.findMany({
  select: {
    id: true,
    name: true,
    status: true,
  },
});

// Use include for relations
const campaign = await prisma.campaign.findUnique({
  where: { id },
  include: {
    audience: true,
    events: { take: 100 },
  },
});

// Use pagination
const campaigns = await prisma.campaign.findMany({
  skip: (page - 1) * limit,
  take: limit,
});
```

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt with 10 rounds
2. **SQL Injection**: Prisma uses parameterized queries to prevent SQL injection
3. **Data Validation**: Input validation on all API endpoints
4. **Access Control**: Row-level security via userId checks
5. **Sensitive Data**: No credit card or sensitive data stored directly (use Stripe)

## Maintenance

### Clean up old sessions
```sql
DELETE FROM sessions WHERE expires < NOW();
```

### Archive old campaigns
```sql
UPDATE campaigns 
SET status = 'ARCHIVED' 
WHERE status = 'SENT' 
  AND sent_at < NOW() - INTERVAL '90 days';
```

### Optimize database
```sql
VACUUM ANALYZE;
```

## Support

For database-related issues:
- Check Prisma logs: `DEBUG="prisma:*" npm run dev`
- View migrations: `npx prisma migrate status`
- Reset database (dev only): `npx prisma migrate reset`
