import { NextRequest, NextResponse } from 'next/server'
import { readZohoConfig, setZohoConfigCookie, clearZohoConfigCookie } from '@/lib/zoho'

export async function GET(req: NextRequest) {
  const cfg = readZohoConfig(req) || {}
  return NextResponse.json({ config: { ...cfg, client_secret: cfg.client_secret ? '••••••••' : '' } })
}

export async function POST(req: NextRequest) {
  const { client_id, client_secret, base_url, redirect_uri } = await req.json()
  if (!client_id) return NextResponse.json({ ok: false, error: 'client_id required' }, { status: 400 })
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', setZohoConfigCookie({ client_id, client_secret, base_url, redirect_uri }))
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', clearZohoConfigCookie())
  return res
}