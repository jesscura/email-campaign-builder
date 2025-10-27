import { NextRequest, NextResponse } from 'next/server'
import { zohoApi } from '@/lib/zoho'

export async function GET(req: NextRequest) {
  const module = req.nextUrl.searchParams.get('module') || 'Leads'
  try {
    const data = await zohoApi(req, `/crm/v3/settings/fields?module=${encodeURIComponent(module)}`)
    return NextResponse.json({ fields: data.fields || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}