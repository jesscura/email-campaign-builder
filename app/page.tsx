'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">Welcome</h2>
        <p className="text-neutral-700">
          Build beautiful, responsive, high-converting emails. Connect your Zoho CRM to personalize at scale.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/builder" className="rounded bg-black px-4 py-2 text-white">Open Builder</Link>
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
