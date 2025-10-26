'use client'
import { useCampaignStore } from '@/store/campaign'

export function BlockRenderer({ block }: { block: any }) {
  const theme = useCampaignStore(s => s.campaign.theme)
  switch (block.type) {
    case 'text':
      return <div style={{ color: theme.textColor }} dangerouslySetInnerHTML={{ __html: block.data.html || '<p>Edit text...</p>' }} />
    case 'image':
      return <img src={block.data.src || 'https://via.placeholder.com/600x200'} alt={block.data.alt || ''} className="h-auto w-full rounded" />
    case 'button':
      return <a href={block.data.href || '#'} className="inline-block rounded px-4 py-2 text-white" style={{ background: theme.primaryColor }}>{block.data.label || 'Call to Action'}</a>
    case 'divider':
      return <hr className="my-2 border-neutral-200" />
    case 'spacer':
      return <div style={{ height: `${block.data.height || 16}px` }} />
    case 'two_column':
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div dangerouslySetInnerHTML={{ __html: block.data.leftHtml || '<p>Left...</p>' }} />
          <div dangerouslySetInnerHTML={{ __html: block.data.rightHtml || '<p>Right...</p>' }} />
        </div>
      )
    case 'social':
      return (
        <div className="flex gap-3">
          {(block.data.links || []).map((l: any) => <a key={l.platform} href={l.url} className="text-sm underline">{l.platform}</a>)}
        </div>
      )
    default:
      return <div>Unsupported block</div>
  }
}
