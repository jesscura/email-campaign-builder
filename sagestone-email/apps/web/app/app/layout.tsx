import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { ReactNode } from 'react'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href="/app" className="text-xl font-bold text-slate-900">Sagestone</a>
              <a href="/app/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</a>
              <a href="/app/campaigns" className="text-slate-600 hover:text-slate-900">Campaigns</a>
              <a href="/app/builder" className="text-slate-600 hover:text-slate-900">Builder</a>
              <a href="/app/audiences" className="text-slate-600 hover:text-slate-900">Audiences</a>
              <a href="/app/analytics" className="text-slate-600 hover:text-slate-900">Analytics</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{session.user.email}</span>
              <a href="/app/settings" className="text-slate-600 hover:text-slate-900">Settings</a>
              <a href="/api/auth/signout" className="text-sm px-3 py-2 rounded border border-slate-300 hover:bg-slate-50">Sign out</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
