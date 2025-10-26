import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/zoho'

export async function GET(req: NextRequest) {
  const url = getAuthUrl(req)
  return NextResponse.json({ url })
}
