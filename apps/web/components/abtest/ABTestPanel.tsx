'use client'
import { useCampaignStore } from '@/store/campaign'

export function ABTestPanel() {
  const variantA = useCampaignStore(s => s.campaign.abTest.variantA)
  const variantB = useCampaignStore(s => s.campaign.abTest.variantB)
  const setAB = useCampaignStore(s => s.setAB)

  return (
    <div>
      <h3 className="mb-2 font-semibold">A/B Testing</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded border p-2">
          <h4 className="mb-2 font-medium">Variant A</h4>
          <label className="block text-sm">Subject</label>
          <input className="mb-2 w-full rounded border p-2" value={variantA.subject} onChange={e => setAB('A', { subject: e.target.value })} />
          <label className="block text-sm">Body note (optional)</label>
          <input className="w-full rounded border p-2" value={variantA.note || ''} onChange={e => setAB('A', { note: e.target.value })} />
        </div>
        <div className="rounded border p-2">
          <h4 className="mb-2 font-medium">Variant B</h4>
          <label className="block text-sm">Subject</label>
          <input className="mb-2 w-full rounded border p-2" value={variantB.subject} onChange={e => setAB('B', { subject: e.target.value })} />
          <label className="block text-sm">Body note (optional)</label>
          <input className="w-full rounded border p-2" value={variantB.note || ''} onChange={e => setAB('B', { note: e.target.value })} />
        </div>
      </div>
      <p className="mt-2 text-xs text-neutral-600">Export will include both variants.</p>
    </div>
  )
}