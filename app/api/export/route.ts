import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { campaign } = await req.json()
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', `export_campaign=${encodeURIComponent(JSON.stringify(campaign))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 10}`)
  return res
}
