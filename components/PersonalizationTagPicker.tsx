'use client'
import { useEffect, useState } from 'react'
import { useCampaignStore } from '@/store/campaign'

export function PersonalizationTagPicker() {
  const [modules, setModules] = useState<any[]>([])
  const [fields, setFields] = useState<any[]>([])
  const [selectedModule, setSelectedModule] = useState<string>('Leads')
  const insertToken = useCampaignStore(s => s.insertToken)

  useEffect(() => {
    fetch('/api/zoho/modules').then(r => r.json()).then(d => setModules(d.modules || []))
  }, [])

  useEffect(() => {
    if (!selectedModule) return
    fetch(`/api/zoho/fields?module=${encodeURIComponent(selectedModule)}`).then(r => r.json()).then(d => setFields(d.fields || []))
  }, [selectedModule])

  function addToken(field: any) {
    const token = `{{${selectedModule}.${field.api_name}}}`
    insertToken(token)
  }

  return (
    <div className="space-y-2">
      <select className="w-full rounded border p-2" value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
        {modules.map(m => <option key={m.api_name} value={m.api_name}>{m.module_name || m.api_name}</option>)}
      </select>
      <div className="max-h-48 overflow-auto rounded border">
        {fields.map((f: any) => (
          <button key={f.api_name} onClick={() => addToken(f)} className="flex w-full items-center justify-between border-b px-3 py-1 text-left text-sm hover:bg-neutral-50">
            <span>{f.field_label}</span>
            <span className="text-xs text-neutral-500">{f.api_name}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-500">Click a field to insert a merge tag into the selected text block.</p>
    </div>
  )
}
