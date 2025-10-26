'use client'
import { useEffect, useMemo, useState } from 'react'
import { TemplateCard } from '@/components/TemplateCard'
import templates from '@/public/templates/index.json'

type TemplateMeta = {
  id: string
  name: string
  tags: string[]
  industry?: string
  thumbnail: string
  file: string
}

export default function TemplatesPage() {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 12

  const allTemplates = templates as TemplateMeta[]
  const tags = useMemo(() => {
    const t = new Set<string>()
    allTemplates.forEach(tt => tt.tags.forEach(x => t.add(x)))
    return ['all', ...Array.from(t).sort()]
  }, [allTemplates])

  const filtered = useMemo(() => {
    const norm = (s: string) => s.toLowerCase()
    return allTemplates.filter(t => {
      const matchesQ = !q || norm(t.name).includes(norm(q)) || t.tags.some(x => norm(x).includes(norm(q)))
      const matchesTag = tag === 'all' || t.tags.includes(tag)
      return matchesQ && matchesTag
    })
  }, [allTemplates, q, tag])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [q, tag])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input className="w-64 rounded border px-3 py-2" placeholder="Search templates..." value={q} onChange={e => setQ(e.target.value)} />
        <select className="rounded border px-3 py-2" value={tag} onChange={e => setTag(e.target.value)}>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="text-sm text-neutral-600">{filtered.length} templates</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {slice.map(t => <TemplateCard key={t.id} tmpl={t} />)}
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  )
}
