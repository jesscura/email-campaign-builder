import './globals.css'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata = {
  title: 'SageStone - Email Marketing Platform',
  description: 'Create beautiful email campaigns with AI-powered tools and analytics',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <div className="min-h-screen">
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <a href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-slate-900">
                      SageStone
                    </span>
                  </a>
                  <nav className="hidden md:flex items-center space-x-8">
                    <a className="text-slate-600 hover:text-slate-900 font-medium transition-colors" href="/">Home</a>
                    <a className="text-slate-600 hover:text-slate-900 font-medium transition-colors" href="/dashboard">Dashboard</a>
                    <a className="text-slate-600 hover:text-slate-900 font-medium transition-colors" href="/builder">Builder</a>
                    <a className="text-slate-600 hover:text-slate-900 font-medium transition-colors" href="/templates">Templates</a>
                    <a className="text-slate-600 hover:text-slate-900 font-medium transition-colors" href="/pricing">Pricing</a>
                    <a className="text-slate-600 hover:text-slate-900 font-medium transition-colors" href="/settings">Settings</a>
                  </nav>
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">{children}</main>
            <footer className="border-t border-slate-200 bg-white mt-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-slate-600 text-sm">
                  <p>&copy; 2024 SageStone. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}