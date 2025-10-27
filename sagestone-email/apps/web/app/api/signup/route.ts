import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const form = await req.formData()
  const email = String(form.get('email') || '')
  const password = String(form.get('password') || '')
  if (!email || !password) return NextResponse.json({ ok: false }, { status: 400 })
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 400 })
  const pwd = await hash(password, 10)
  await prisma.user.create({ data: { email, password: pwd } })
  return NextResponse.json({ ok: true })
}
