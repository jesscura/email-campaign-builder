import './globals.css'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Email Campaign Builder',
  description: 'Drag-and-drop MJML builder with Zoho CRM integration',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <Toaster richColors />
        <div className="mx-auto max-w-7xl p-4">
          <header className="flex items-center justify-between border-b pb-3">
            <h1 className="text-xl font-semibold">Email Campaign Builder</h1>
            <nav className="flex gap-4">
              <a className="hover:underline" href="/">Dashboard</a>
              <a className="hover:underline" href="/builder">Builder</a>
              <a className="hover:underline" href="/templates">Templates</a>
              <a className="hover:underline" href="/settings">Settings</a>
            </nav>
          </header>
          <main className="py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
