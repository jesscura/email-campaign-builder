#!/usr/bin/env bash
set -euo pipefail

# Load environment from .env.vercel first, then .env.local
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
  echo "Error: POSTGRES_URL_NON_POOLING is not set. Ensure Neon direct URL is configured." >&2
  exit 1
fi

echo "Creating and applying initial Prisma migration against Neon (non-pooled)..."
DATABASE_URL="$POSTGRES_URL_NON_POOLING" npx prisma migrate dev --name init
