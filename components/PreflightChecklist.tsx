'use client'
import { useEffect, useState } from 'react'
import { useCampaignStore } from '@/store/campaign'

type CheckResult = { id: string; title: string; ok: boolean; message: string }

export function PreflightChecklist() {
  const campaign = useCampaignStore(s => s.campaign)
  const [checks, setChecks] = useState<CheckResult[]>([])

  useEffect(() => {
    const run = async () => {
      const r = await fetch('/api/preflight', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign }) })
      const d = await r.json()
      setChecks(d.checks || [])
    }
    run()
  }, [campaign])

  return (
    <div>
      <h3 className="mb-2 font-semibold">Preflight</h3>
      <ul className="space-y-1">
        {checks.map(c => (
          <li key={c.id} className={`rounded border px-2 py-1 text-sm ${c.ok ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
            <span className="font-medium">{c.title}: </span>{c.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
