import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode, setTokenCookie } from '@/lib/zoho'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/settings?error=missing_code', req.url))
  const data = await exchangeCode(code, req)
  if (!(data as any).access_token) return NextResponse.redirect(new URL('/settings?error=auth_failed', req.url))
  const res = NextResponse.redirect(new URL('/settings', req.url))
  res.headers.set('Set-Cookie', setTokenCookie(data))
  return res
}
