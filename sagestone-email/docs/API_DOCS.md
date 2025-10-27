# API Docs (Initial)

Base URL (local): http://localhost:4000

- GET /health → { ok: true }
- GET /workspaces?userId=... → list workspaces for a user (temporary dev endpoint)
- POST /billing/checkout → { url } (body: workspaceId, planId, successUrl, cancelUrl)
- POST /billing/portal → { url } (body: workspaceId, returnUrl)

Auth, RBAC, rate limits, and production-grade validation will be added as modules are implemented.
