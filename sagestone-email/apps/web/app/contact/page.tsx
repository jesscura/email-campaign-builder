"use client"
import { useEffect, useState } from 'react'

export default function ContactPage() {
  const [token, setToken] = useState('')
  useEffect(() => {
    // simplistic CSRF token, server also verifies cookie
    const t = Math.random().toString(36).slice(2)
    document.cookie = `csrf=${t}; path=/; samesite=lax`
    setToken(t)
  }, [])

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-4xl font-bold">Contact</h1>
      <form method="post" action="/api/contact" className="mt-8 space-y-4">
        <input type="hidden" name="csrf" value={token} />
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input required name="email" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea required name="message" className="mt-1 w-full rounded border px-3 py-2 h-32" />
        </div>
        <button className="px-5 py-3 rounded-md bg-brand-600 text-white font-semibold">Send</button>
      </form>
    </main>
  )
}
