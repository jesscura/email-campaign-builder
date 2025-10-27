# API Docs (Initial)

Base URL (local): http://localhost:4000

## Core Endpoints

- GET /health → { ok: true }

## Workspaces

- GET /workspaces?userId=... → list workspaces for a user (temporary dev endpoint)

## Contacts

- POST /contacts → create a contact (body: workspaceId, email, firstName, lastName, etc.)
- GET /contacts?workspaceId=...&page=1&limit=50 → list contacts with pagination
- GET /contacts/stats?workspaceId=... → get contact stats (total, subscribed, unsubscribed, bounced)
- GET /contacts/:id?workspaceId=... → get single contact
- PUT /contacts/:id?workspaceId=... → update contact
- DELETE /contacts/:id?workspaceId=... → delete contact
- POST /contacts/import → bulk import (body: workspaceId, contacts: [{ email, ... }])

## Campaigns

- POST /campaigns → create campaign (body: workspaceId, name, subject, fromName, fromEmail)
- GET /campaigns?workspaceId=...&page=1&limit=50 → list campaigns with pagination
- GET /campaigns/:id?workspaceId=... → get single campaign with variants and sends
- GET /campaigns/:id/stats?workspaceId=... → get campaign statistics (sent, delivered, opens, clicks, bounces, unsubscribes)
- PUT /campaigns/:id?workspaceId=... → update campaign
- DELETE /campaigns/:id?workspaceId=... → delete campaign
- POST /campaigns/:id/schedule?workspaceId=... → schedule campaign (body: sendAt ISO date)

## Billing

- POST /billing/checkout → { url } (body: workspaceId, planId, successUrl, cancelUrl)
- POST /billing/portal → { url } (body: workspaceId, returnUrl)

Auth, RBAC, rate limits, and production-grade validation will be added as modules are implemented.
