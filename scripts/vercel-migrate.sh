#!/usr/bin/env bash
set -euo pipefail

# Load environment (including POSTGRES_* pulled via `npm run env:pull`)
# Prefer values from .env.vercel, allow .env.local to override if desired
if [ -f .env.vercel ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.vercel
  set +a
fi

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if [ -z "${POSTGRES_URL_NON_POOLING:-}" ]; then
  echo "Error: POSTGRES_URL_NON_POOLING is not set. Run: npm run vercel:link && npm run env:pull" >&2
  exit 1
fi

echo "Running prisma migrate deploy against Vercel Postgres (non-pooling)..."
DATABASE_URL="$POSTGRES_URL_NON_POOLING" npx prisma migrate deploy
