import './globals.css'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata = {
  title: 'Email Campaign Builder - Enterprise SaaS Platform',
  description: 'Next-generation Email Campaign Marketing Tool with AI-powered features, automation, and advanced analytics',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <div className="min-h-screen">
            <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-sm">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <a href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Email Builder
                    </span>
                  </a>
                  <nav className="hidden md:flex items-center space-x-8">
                    <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors" href="/">Home</a>
                    <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors" href="/dashboard">Dashboard</a>
                    <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors" href="/builder">Builder</a>
                    <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors" href="/templates">Templates</a>
                    <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors" href="/pricing">Pricing</a>
                    <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors" href="/settings">Settings</a>
                  </nav>
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">{children}</main>
            <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-slate-600 text-sm">
                  <p>&copy; 2024 Email Campaign Builder. Built with Next.js and Vercel.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}