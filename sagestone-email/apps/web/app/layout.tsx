import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    default: 'Sagestone Email — AI-first Email Marketing',
    template: '%s — Sagestone Email'
  },
  description: 'Create, automate, and optimize campaigns with AI-powered tools and privacy-first analytics.',
  openGraph: {
    title: 'Sagestone Email',
    description: 'AI-first email marketing platform',
    url: 'https://localhost:3000',
    siteName: 'Sagestone Email',
    type: 'website'
  },
  metadataBase: new URL('http://localhost:3000')
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
