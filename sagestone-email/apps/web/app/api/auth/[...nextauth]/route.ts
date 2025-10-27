import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        if (!creds?.email || !creds?.password) return null
        const user = await prisma.user.findUnique({ where: { email: creds.email } })
        if (!user || !user.password) return null
        const ok = await compare(creds.password, user.password).catch(() => false)
        return ok ? { id: user.id, email: user.email, name: user.name } : null
      }
    }),
    Google({ clientId: process.env.GOOGLE_CLIENT_ID || '', clientSecret: process.env.GOOGLE_CLIENT_SECRET || '' })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin' }
}

const handler = NextAuth(authOptions as any)
export { handler as GET, handler as POST }
