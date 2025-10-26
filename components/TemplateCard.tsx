'use client'
import { useRouter } from 'next/navigation'

export function TemplateCard({ tmpl }: { tmpl: { id: string; name: string; tags: string[]; thumbnail: string; file: string } }) {
  const router = useRouter()
  const load = async () => {
    const r = await fetch(`/templates/${tmpl.file}`)
    const data = await r.json()
    localStorage.setItem('campaign', JSON.stringify(data))
    router.push('/builder')
  }
  return (
    <div className="rounded border bg-white p-3">
      <div className="relative mb-2 h-32 w-full overflow-hidden rounded bg-neutral-100">
        <img alt={tmpl.name} src={tmpl.thumbnail} className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{tmpl.name}</div>
          <div className="text-xs text-neutral-500">{tmpl.tags.join(', ')}</div>
        </div>
        <button onClick={load} className="rounded border px-3 py-1">Use</button>
      </div>
    </div>
  )
}