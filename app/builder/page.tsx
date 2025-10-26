'use client'
import { useEffect } from 'react'
import { BuilderSidebar } from '@/components/BuilderSidebar'
import { EditorCanvas } from '@/components/EditorCanvas'
import { PreviewPane } from '@/components/PreviewPane'
import { PreflightChecklist } from '@/components/PreflightChecklist'
import { SubjectLineAssistant } from '@/components/SubjectLineAssistant'
import { ABTestPanel } from '@/components/abtest/ABTestPanel'
import { useCampaignStore, defaultCampaign } from '@/store/campaign'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'

export default function BuilderPage() {
  const campaign = useCampaignStore(s => s.campaign)
  const setCampaign = useCampaignStore(s => s.setCampaign)
  const [debouncedCampaign] = useDebounce(campaign, 500)

  useEffect(() => {
    const raw = localStorage.getItem('campaign')
    if (raw) {
      try { setCampaign(JSON.parse(raw)) } catch {}
    } else {
      setCampaign(defaultCampaign())
    }
  }, [setCampaign])

  useEffect(() => {
    localStorage.setItem('campaign', JSON.stringify(debouncedCampaign))
  }, [debouncedCampaign])

  async function renderNow() {
    const r = await fetch('/api/render', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign }) })
    if (!r.ok) return toast.error('Render failed')
    const { html } = await r.json()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  async function stageExport(kind: 'html' | 'mjml' | 'json') {
    const r = await fetch('/api/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign }) })
    if (!r.ok) return toast.error('Failed to stage export')
    window.open(`/api/export/${kind}`, '_blank')
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr_380px]">
      <div className="rounded border bg-white">
        <BuilderSidebar />
      </div>
      <div className="space-y-4">
        <div className="rounded border bg-white p-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Email Canvas</h2>
            <div className="flex items-center gap-2">
              <button className="rounded border px-3 py-1" onClick={renderNow}>Preview HTML</button>
              <button className="rounded border px-3 py-1" onClick={() => stageExport('html')}>Export HTML</button>
              <button className="rounded border px-3 py-1" onClick={() => stageExport('mjml')}>Export MJML</button>
              <button className="rounded border px-3 py-1" onClick={() => stageExport('json')}>Export JSON</button>
            </div>
          </div>
          <EditorCanvas />
        </div>
        <div id="ab" className="rounded border bg-white p-3">
          <ABTestPanel />
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded border bg-white p-3">
          <SubjectLineAssistant />
        </div>
        <div className="rounded border bg-white p-3">
          <PreviewPane />
        </div>
        <div className="rounded border bg-white p-3">
          <PreflightChecklist />
        </div>
      </div>
    </div>
  )
}
