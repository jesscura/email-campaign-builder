import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const raw = cookies().get('export_campaign')?.value
  if (!raw) return NextResponse.json({ error: 'No campaign' }, { status: 400 })
  return new NextResponse(decodeURIComponent(raw), { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}
