'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">Welcome to Email Campaign Builder</h2>
        <p className="text-neutral-700">
          Build beautiful, responsive, high-converting emails. Connect your Zoho CRM to personalize at scale.
          {session && ` Welcome back, ${session.user.name}!`}
        </p>
        <div className="mt-4 flex gap-3">
          {session ? (
            <>
              <Link href="/dashboard" className="rounded bg-black px-4 py-2 text-white">Go to Dashboard</Link>
              <Link href="/builder" className="rounded border px-4 py-2">Open Builder</Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="rounded bg-black px-4 py-2 text-white">Sign In</Link>
              <Link href="/auth/signup" className="rounded border px-4 py-2">Get Started Free</Link>
            </>
          )}
          <Link href="/templates" className="rounded border px-4 py-2">Browse Templates</Link>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Connect Zoho CRM" desc="Enable personalization from CRM data." href="/settings" />
        <Card title="Templates" desc="Start from proven, tested layouts." href="/templates" />
        <Card title="A/B Testing" desc="Test subject lines and content variants." href="/builder#ab" />
      </section>
    </div>
  )
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <a href={href} className="rounded-lg border bg-white p-5 hover:shadow">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-neutral-600">{desc}</p>
    </a>
  )
}