import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const form = await request.formData()
  const csrf = String(form.get('csrf') || '')
  const cookieCsrf = cookies().get('csrf')?.value
  if (!csrf || !cookieCsrf || csrf !== cookieCsrf) {
    return NextResponse.json({ ok: false, error: 'Invalid CSRF token' }, { status: 403 })
  }
  const email = String(form.get('email') || '')
  const message = String(form.get('message') || '')
  // In a real app, enqueue to support inbox or send email
  return NextResponse.json({ ok: true })
}
