import { NextRequest, NextResponse } from 'next/server'
import { zohoApi, readSession } from '@/lib/zoho'

export async function GET(req: NextRequest) {
  try {
    const session = readSession(req)
    if (!session) return NextResponse.json({ ok: false })
    const data = await zohoApi(req, '/userinfo')
    return NextResponse.json({ ok: true, user: data })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
