import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { campaignToMjml, mjmlToHtmlInlined } from '@/lib/mjml'

export async function GET() {
  const raw = cookies().get('export_campaign')?.value
  if (!raw) return NextResponse.json({ error: 'No campaign in export context' }, { status: 400 })
  const campaign = JSON.parse(decodeURIComponent(raw))
  const mjml = campaignToMjml(campaign)
  const { html } = mjmlToHtmlInlined(mjml)
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
