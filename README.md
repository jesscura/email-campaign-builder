# Email Campaign Builder

A full-featured, extensible email campaign builder:
- Drag-and-drop blocks
- Thousands-of-templates scaffold
- Zoho CRM OAuth (Easy Setup: paste Client ID/Secret + Region in Settings)
- MJML rendering to responsive HTML with inlined CSS
- Preflight checks to improve conversion and deliverability
- A/B testing (subject and body variants)
- Export to HTML/MJML/JSON
- UTM builder hints, link validation, color contrast checker, mobile preview tips

## Quick Start

1) Install
```bash
npm i
cp .env.example .env.local
# set ENCRYPTION_SECRET and NEXT_PUBLIC_BASE_URL
```

2) Run
```bash
npm run dev
# open http://localhost:3000
```

3) Zoho (two options)
- Easy Setup (recommended): Settings → Zoho CRM — Easy Setup → paste Region, Client ID, Client Secret → Save → Connect Zoho
- Environment variables: set ZOHO_* in your hosting env; the app prefers Easy Setup if present, otherwise falls back to env; if neither present, it uses a mock provider for development.

## Features

- Builder
  - Blocks: Text, Image, Button, Divider, Spacer, Two-Column, Social Links
  - Personalization: Insert merge tags from Zoho modules/fields (e.g., `{{Leads.First_Name}}`)
  - Autosave to localStorage
- Templates
  - Search, tags, pagination
- Rendering
  - MJML -> Responsive HTML, CSS inlining
- Preflight
  - Spam terms, link/UTM validator, CTA presence, subject/preheader length, alt texts, color contrast
- A/B Testing
  - Subject variants; export both
- Export
  - HTML, MJML, JSON (builder schema)