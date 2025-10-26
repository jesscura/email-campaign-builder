import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { campaignToMjml } from '@/lib/mjml'

export async function GET() {
  const raw = cookies().get('export_campaign')?.value
  if (!raw) return NextResponse.json({ error: 'No campaign' }, { status: 400 })
  const campaign = JSON.parse(decodeURIComponent(raw))
  const mjml = campaignToMjml(campaign)
  return new NextResponse(mjml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
