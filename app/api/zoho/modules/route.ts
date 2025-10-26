import { NextRequest, NextResponse } from 'next/server'
import { zohoApi } from '@/lib/zoho'

export async function GET(req: NextRequest) {
  try {
    const data = await zohoApi(req, '/crm/v3/settings/modules')
    return NextResponse.json({ modules: data.modules || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
