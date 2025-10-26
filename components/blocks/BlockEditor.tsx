'use client'
import { useCampaignStore } from '@/store/campaign'
import { useMemo } from 'react'

export function BlockEditor() {
  const selectedId = useCampaignStore(s => s.selectedBlockId)
  const block = useCampaignStore(s => s.campaign.blocks.find(b => b.id === selectedId))
  const updateBlock = useCampaignStore(s => s.updateBlock)

  const Editor = useMemo(() => {
    if (!block) return () => <div className="text-sm text-neutral-600">Select a block to edit</div>
    switch (block.type) {
      case 'text':
        return () => (
          <div className="space-y-2">
            <label className="block text-sm">HTML</label>
            <textarea className="h-80 w-full rounded border p-2 font-mono" value={block.data.html || ''} onChange={e => updateBlock(block.id, { data: { ...block.data, html: e.target.value } })} />
          </div>
        )
      case 'image':
        return () => (
          <div className="space-y-2">
            <label className="block text-sm">Image URL</label>
            <input className="w-full rounded border p-2" value={block.data.src || ''} onChange={e => updateBlock(block.id, { data: { ...block.data, src: e.target.value } })} />
            <label className="block text-sm">Alt Text</label>
            <input className="w-full rounded border p-2" value={block.data.alt || ''} onChange={e => updateBlock(block.id, { data: { ...block.data, alt: e.target.value } })} />
          </div>
        )
      case 'button':
        return () => (
          <div className="space-y-2">
            <label className="block text-sm">Label</label>
            <input className="w-full rounded border p-2" value={block.data.label || ''} onChange={e => updateBlock(block.id, { data: { ...block.data, label: e.target.value } })} />
            <label className="block text-sm">URL</label>
            <input className="w-full rounded border p-2" value={block.data.href || ''} onChange={e => updateBlock(block.id, { data: { ...block.data, href: e.target.value } })} />
          </div>
        )
      case 'two_column':
        return () => (
          <div className="space-y-2">
            <label className="block text-sm">Left HTML</label>
            <textarea className="h-40 w-full rounded border p-2 font-mono" value={block.data.leftHtml || ''} onChange={e => updateBlock(block.id, { data: { ...block.data, leftHtml: e.target.value } })} />
            <label className="block text-sm">Right HTML</label>
            <textarea className="h-40 w-full rounded border p-2 font-mono" value={block.data.rightHtml || ''} onChange={e => updateBlock(block.id, { data: { ...block.data, rightHtml: e.target.value } })} />
          </div>
        )
      case 'social':
        return () => (
          <div className="space-y-2">
            <button className="rounded border px-2 py-1 text-sm" onClick={() => updateBlock(block.id, { data: { ...block.data, links: [...(block.data.links || []), { platform: 'Twitter', url: 'https://twitter.com/your' }] } })}>Add Link</button>
            <div className="space-y-2">
              {(block.data.links || []).map((l: any, i: number) => (
                <div key={i} className="rounded border p-2">
                  <input className="mr-2 rounded border p-1" value={l.platform} onChange={e => {
                    const links = [...block.data.links]; links[i] = { ...l, platform: e.target.value }; updateBlock(block.id, { data: { ...block.data, links } })
                  }} />
                  <input className="ml-2 w-48 rounded border p-1" value={l.url} onChange={e => {
                    const links = [...block.data.links]; links[i] = { ...l, url: e.target.value }; updateBlock(block.id, { data: { ...block.data, links } })
                  }} />
                </div>
              ))}
            </div>
          </div>
        )
      case 'spacer':
        return () => (
          <div className="space-y-2">
            <label className="block text-sm">Height (px)</label>
            <input type="number" className="w-full rounded border p-2" value={block.data.height || 16} onChange={e => updateBlock(block.id, { data: { ...block.data, height: Number(e.target.value) } })} />
          </div>
        )
      default:
        return () => <div>Editor not implemented</div>
    }
  }, [block, updateBlock])

  return (
    <div className="rounded border bg-white p-3">
      <h3 className="mb-2 font-semibold">Block Editor</h3>
      <Editor />
    </div>
  )
}
