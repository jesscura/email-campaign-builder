# API Documentation

## Overview

This document describes the REST API endpoints available in the Email Campaign Builder platform.

## Authentication

Most endpoints require authentication via NextAuth.js session. Include the session cookie in your requests.

### Sign Up
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Sign In
Use NextAuth.js credentials provider:
```javascript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'john@example.com',
  password: 'securepassword123'
});
```

## Campaigns

### List Campaigns
```http
GET /api/campaigns?page=1&limit=10&status=DRAFT
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)
- `status` (optional): Filter by status (DRAFT, SCHEDULED, SENDING, SENT, PAUSED, CANCELED)

**Response (200 OK):**
```json
{
  "campaigns": [
    {
      "id": "clx...",
      "name": "Welcome Email",
      "subject": "Welcome to our platform!",
      "status": "DRAFT",
      "createdAt": "2025-10-26T...",
      "totalSent": 0,
      "totalOpens": 0,
      "totalClicks": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Create Campaign
```http
POST /api/campaigns
Content-Type: application/json

{
  "name": "Product Launch",
  "subject": "Introducing Our New Product",
  "preheader": "Be the first to try it",
  "fromName": "Company Name",
  "fromEmail": "noreply@company.com",
  "replyTo": "support@company.com",
  "htmlContent": "<html>...</html>",
  "mjmlContent": "<mjml>...</mjml>",
  "jsonContent": "{...}",
  "audienceId": "clx...",
  "segmentIds": ["clx..."],
  "isABTest": false
}
```

**Response (201 Created):**
```json
{
  "id": "clx...",
  "name": "Product Launch",
  "status": "DRAFT",
  "createdAt": "2025-10-26T..."
}
```

### Get Campaign
```http
GET /api/campaigns/{id}
```

**Response (200 OK):**
```json
{
  "id": "clx...",
  "name": "Product Launch",
  "subject": "Introducing Our New Product",
  "status": "DRAFT",
  "htmlContent": "<html>...</html>",
  "audience": {
    "id": "clx...",
    "name": "Newsletter Subscribers"
  },
  "events": []
}
```

### Update Campaign
```http
PATCH /api/campaigns/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "subject": "New Subject Line"
}
```

**Response (200 OK):**
```json
{
  "id": "clx...",
  "name": "Updated Name",
  "subject": "New Subject Line",
  "updatedAt": "2025-10-26T..."
}
```

### Delete Campaign
```http
DELETE /api/campaigns/{id}
```

**Response (200 OK):**
```json
{
  "message": "Campaign deleted successfully"
}
```

## Audiences

### List Audiences
```http
GET /api/audiences
```

**Response (200 OK):**
```json
{
  "audiences": [
    {
      "id": "clx...",
      "name": "Newsletter Subscribers",
      "description": "Main email list",
      "subscribersCount": 1234,
      "createdAt": "2025-10-26T...",
      "_count": {
        "subscribers": 1234,
        "segments": 3
      }
    }
  ]
}
```

### Create Audience
```http
POST /api/audiences
Content-Type: application/json

{
  "name": "Product Updates List",
  "description": "Subscribers interested in product updates"
}
```

**Response (201 Created):**
```json
{
  "id": "clx...",
  "name": "Product Updates List",
  "subscribersCount": 0,
  "createdAt": "2025-10-26T..."
}
```

## Subscribers

### List Subscribers
```http
GET /api/subscribers?audienceId={id}&page=1&limit=50&status=ACTIVE
```

**Query Parameters:**
- `audienceId` (required): Audience ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50)
- `status` (optional): Filter by status (ACTIVE, UNSUBSCRIBED, BOUNCED, COMPLAINED)

**Response (200 OK):**
```json
{
  "subscribers": [
    {
      "id": "clx...",
      "email": "subscriber@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "status": "ACTIVE",
      "totalSent": 10,
      "totalOpens": 7,
      "totalClicks": 3,
      "createdAt": "2025-10-26T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "totalPages": 25
  }
}
```

### Add Subscriber
```http
POST /api/subscribers
Content-Type: application/json

{
  "audienceId": "clx...",
  "email": "newsubscriber@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "customFields": {
    "company": "Acme Inc",
    "jobTitle": "Marketing Manager"
  },
  "tags": ["vip", "early-adopter"]
}
```

**Response (201 Created):**
```json
{
  "id": "clx...",
  "email": "newsubscriber@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "status": "ACTIVE",
  "createdAt": "2025-10-26T..."
}
```

## Plans

### List Plans
```http
GET /api/plans
```

**Response (200 OK):**
```json
{
  "plans": [
    {
      "id": "plan_free",
      "name": "Free",
      "description": "Perfect for getting started",
      "price": 0,
      "interval": "month",
      "emailsPerMonth": 500,
      "maxSubscribers": 100,
      "maxCampaigns": 5,
      "hasAutomation": false,
      "hasAIFeatures": false,
      "hasAdvancedAnalytics": false,
      "hasTeamAccess": false,
      "maxTeamMembers": 1
    },
    {
      "id": "plan_pro",
      "name": "Pro",
      "description": "For growing businesses",
      "price": 49.99,
      "interval": "month",
      "stripePriceId": "price_...",
      "emailsPerMonth": 10000,
      "maxSubscribers": 2500,
      "maxCampaigns": 50,
      "hasAutomation": true,
      "hasAIFeatures": true,
      "hasAdvancedAnalytics": true,
      "hasTeamAccess": false,
      "maxTeamMembers": 1
    }
  ]
}
```

## Stripe Integration

### Create Checkout Session
```http
POST /api/stripe/checkout
Content-Type: application/json

{
  "planId": "plan_pro"
}
```

**Response (200 OK):**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

The URL redirects to Stripe's hosted checkout page. After successful payment, the user is redirected back to the application.

### Webhook Endpoint
```http
POST /api/stripe/webhook
```

This endpoint receives webhooks from Stripe for the following events:
- `checkout.session.completed` - Subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed

**Note:** This endpoint requires the `stripe-signature` header for verification.

## Error Responses

All endpoints follow standard HTTP status codes:

**400 Bad Request:**
```json
{
  "error": "Missing required fields"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "error": "Campaign limit reached. Please upgrade your plan."
}
```

**404 Not Found:**
```json
{
  "error": "Campaign not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API rate limits are based on the user's subscription plan:
- **Free:** 100 requests/hour
- **Pro:** 1,000 requests/hour
- **Business:** 10,000 requests/hour

## Best Practices

1. **Always check response status codes** before processing data
2. **Handle pagination** when fetching lists
3. **Implement retry logic** with exponential backoff for failed requests
4. **Cache responses** when appropriate to reduce API calls
5. **Use webhooks** instead of polling for real-time updates
6. **Validate data** before sending to the API

## SDK Examples

### JavaScript/TypeScript
```typescript
// Create a campaign
const createCampaign = async () => {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'My Campaign',
      subject: 'Hello World',
      fromName: 'Company',
      fromEmail: 'noreply@company.com',
    }),
  });
  
  const data = await response.json();
  return data;
};

// List campaigns with pagination
const getCampaigns = async (page = 1) => {
  const response = await fetch(`/api/campaigns?page=${page}&limit=10`);
  const data = await response.json();
  return data;
};
```

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

function useCampaigns(page = 1) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`/api/campaigns?page=${page}`);
        const data = await response.json();
        setCampaigns(data.campaigns);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [page]);
  
  return { campaigns, loading, error };
}
```

## Support

For API support, contact support@example.com or visit our developer community at https://community.example.com.
