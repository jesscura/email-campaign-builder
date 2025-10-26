import { NextRequest, NextResponse } from 'next/server'
import { campaignToMjml, mjmlToHtmlInlined } from '@/lib/mjml'
import { Campaign } from '@/store/campaign'

export async function POST(req: NextRequest) {
  const { campaign } = await req.json() as { campaign: Campaign }
  const mjml = campaignToMjml(campaign)
  const { html, errors } = mjmlToHtmlInlined(mjml)
  return NextResponse.json({ html, errors })
}