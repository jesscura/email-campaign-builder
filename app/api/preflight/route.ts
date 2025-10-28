import { NextRequest, NextResponse } from 'next/server'
import tinycolor from 'tinycolor2'
import { Campaign } from '@/store/campaign'
import prisma from '@/lib/prisma'
import { stripe as stripeClient } from '@/lib/stripe'
import { readSession, zohoApi } from '@/lib/zoho'

const spamWords = ['free', 'winner', 'guarantee', 'act now', 'urgent', 'prize', 'risk-free', 'best price']
const ctaRegex = /(call to action|shop now|buy now|learn more|get started|signup|sign up|subscribe)/i

export async function POST(req: NextRequest) {
  const { campaign } = await req.json() as { campaign: Campaign }
  const checks = []

  // Subject length
  const subj = campaign.subject || ''
  checks.push({
    id: 'subject_len',
    title: 'Subject Length',
    ok: subj.length >= 20 && subj.length <= 60,
    message: `${subj.length} chars (aim 32–42 for mobile)`
  })

  // Personalization
  checks.push({
    id: 'subject_pers',
    title: 'Subject Personalization',
    ok: /\{\{.+\}\}/.test(subj),
    message: /\{\{.+\}\}/.test(subj) ? 'Personalization detected' : 'Consider adding merge tags (e.g., {{Leads.First_Name}})'
  })

  // Spammy words
  const subjLower = subj.toLowerCase()
  const spamFound = spamWords.filter(w => subjLower.includes(w))
  checks.push({
    id: 'spam_words',
    title: 'Spam Terms',
    ok: spamFound.length === 0,
    message: spamFound.length ? `Avoid: ${spamFound.join(', ')}` : 'No common spam terms detected'
  })

  // CTA presence
  const hasCTA = campaign.blocks.some((b: any) => (b.type === 'button' && b.data.label) || (b.type === 'text' && ctaRegex.test(b.data.html)))
  checks.push({
    id: 'cta',
    title: 'Clear CTA',
    ok: hasCTA,
    message: hasCTA ? 'CTA detected' : 'Add a clear CTA (e.g., button)'
  })

  // Alt text for images
  const images = (campaign.blocks as any[]).filter(b => b.type === 'image')
  const missingAlt = images.filter((i: any) => !i.data.alt).length
  checks.push({
    id: 'alt_text',
    title: 'Image Alt Text',
    ok: missingAlt === 0,
    message: missingAlt === 0 ? 'All images have alt text' : `${missingAlt} image(s) missing alt text`
  })

  // Link presence & UTM
  const links = (campaign.blocks as any[]).flatMap((b: any) => {
    if (b.type === 'button' && b.data.href) return [b.data.href]
    if (b.type === 'text') {
      const m = [...(b.data.html.matchAll(/href="([^"]+)"/g) || [])].map(m => m[1])
      return m
    }
    return []
  })
  const missingUTM = links.filter((l: string) => l.startsWith('http') && !/utm_/.test(l)).length
  checks.push({
    id: 'utm',
    title: 'UTM Parameters',
    ok: links.length > 0 && missingUTM === 0,
    message: links.length === 0 ? 'No links found' : missingUTM ? `${missingUTM}/${links.length} link(s) missing UTM` : 'All links have UTMs'
  })

  // Contrast
  const tc = tinycolor(campaign.theme.textColor)
  const bg = tinycolor(campaign.theme.backgroundColor)
  const contrast = tinycolor.readability(bg, tc)
  checks.push({
    id: 'contrast',
    title: 'Color Contrast',
    ok: contrast >= 4.5,
    message: `Contrast ratio ${contrast.toFixed(2)} (>= 4.5 recommended)`
  })

  return NextResponse.json({ checks })
}

// Lightweight runtime readiness check for post-deploy validation
export async function GET(request: NextRequest) {
  const requiredEnv = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'ENCRYPTION_SECRET',
    'NEXT_PUBLIC_BASE_URL',
  ] as const

  const missing = requiredEnv.filter((k) => !process.env[k])

  let dbOk = false
  let dbError: string | undefined
  try {
    // Simple connectivity probe; will throw if DATABASE_URL is misconfigured
    await prisma.$queryRaw`SELECT 1` as any
    dbOk = true
  } catch (err: any) {
    dbOk = false
    dbError = err?.message?.slice(0, 300) || 'Unknown database error'
  }

  const externalApiConfigured = !!process.env.NEXT_PUBLIC_API_URL

  // Stripe readiness (lightweight, non-mutating)
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder'
  let stripeOk = false as boolean
  let stripeError: string | undefined
  let stripeLatencyMs: number | undefined
  try {
    if (stripeConfigured) {
      const t0 = Date.now()
      // Read-only list call to validate credentials/connectivity
      await stripeClient.products.list({ limit: 1 })
      stripeLatencyMs = Date.now() - t0
      stripeOk = true
    }
  } catch (err: any) {
    stripeOk = false
    stripeError = err?.message?.slice(0, 300) || 'Unknown Stripe error'
  }

  // Zoho readiness
  const zohoEnvConfigured = !!process.env.ZOHO_CLIENT_ID && !!process.env.ZOHO_CLIENT_SECRET && !!process.env.ZOHO_REDIRECT_URI
  const zohoSession = readSession(request)
  const zohoConnected = !!zohoSession?.access_token || !!zohoSession?.refresh_token
  let zohoOk = false as boolean
  let zohoError: string | undefined
  let zohoUser: { email?: string } | null = null
  try {
    if (zohoEnvConfigured && zohoConnected) {
      const info = await zohoApi(request, '/userinfo') as any
      zohoUser = { email: info?.email }
      zohoOk = true
    } else if (zohoEnvConfigured) {
      // Environment configured but not connected for this requester
      zohoOk = false
    }
  } catch (err: any) {
    zohoOk = false
    zohoError = err?.message?.slice(0, 300) || 'Unknown Zoho error'
  }

  return NextResponse.json({
    ok: missing.length === 0 && dbOk,
    env: {
      missing,
      present: requiredEnv.filter((k) => !missing.includes(k as any)),
    },
    db: {
      ok: dbOk,
      error: dbError,
    },
    api: {
      externalConfigured: externalApiConfigured,
      baseUrl: externalApiConfigured ? process.env.NEXT_PUBLIC_API_URL : null,
    },
    stripe: {
      configured: stripeConfigured,
      ok: stripeConfigured ? stripeOk : false,
      latencyMs: stripeLatencyMs ?? null,
      error: stripeError,
    },
    zoho: {
      envConfigured: zohoEnvConfigured,
      connected: zohoConnected,
      ok: zohoEnvConfigured ? zohoOk : false,
      user: zohoUser,
      error: zohoError,
    },
    runtime: {
      node: process.version,
      environment: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      region: process.env.VERCEL_REGION || null,
    },
  })
}