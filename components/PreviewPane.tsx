'use client'
import { useEffect, useState } from 'react'
import { useCampaignStore } from '@/store/campaign'

export function PreviewPane() {
  const campaign = useCampaignStore(s => s.campaign)
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      const r = await fetch('/api/render', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign }) })
      if (r.ok) {
        const { html } = await r.json(); setHtml(html)
      }
    }
    run()
  }, [campaign])

  return (
    <div>
      <h3 className="mb-2 font-semibold">Preview</h3>
      <div className="flex gap-3">
        <div className="h-[480px] w-[320px] overflow-auto rounded border shadow-inner">
          <iframe title="mobile" className="h-full w-full" srcDoc={html} />
        </div>
        <div className="h-[480px] flex-1 overflow-auto rounded border shadow-inner">
          <iframe title="desktop" className="h-full w-full" srcDoc={html} />
        </div>
      </div>
    </div>
  )
}