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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Email Templates
          </span>
        </h1>
        <p className="text-lg text-slate-600">Choose from professionally designed templates</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
        <input 
          className="flex-1 min-w-[250px] rounded-lg border-2 border-slate-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all" 
          placeholder="Search templates..." 
          value={q} 
          onChange={e => setQ(e.target.value)} 
        />
        <select 
          className="rounded-lg border-2 border-slate-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium" 
          value={tag} 
          onChange={e => setTag(e.target.value)}
        >
          {tags.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <span className="text-sm text-slate-600 font-semibold bg-slate-100 px-4 py-2 rounded-lg">
          {filtered.length} templates
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {slice.map(t => <TemplateCard key={t.id} tmpl={t} />)}
      </div>

      <div className="flex items-center justify-center gap-3 p-4">
        <button 
          className="rounded-lg border-2 border-slate-900 text-slate-900 px-6 py-2 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={page <= 1} 
          onClick={() => setPage(p => p - 1)}
        >
          ← Prev
        </button>
        <span className="text-sm font-semibold text-slate-700 px-4">
          Page {page} of {totalPages}
        </span>
        <button 
          className="rounded-lg border-2 border-slate-900 text-slate-900 px-6 py-2 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={page >= totalPages} 
          onClick={() => setPage(p => p + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  )
}