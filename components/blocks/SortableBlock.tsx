'use client'
import { useCampaignStore } from '@/store/campaign'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BlockRenderer } from './renderers/BlockRenderer'
import { BlockEditor } from './BlockEditor'

export function SortableBlock({ block }: { block: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const removeBlock = useCampaignStore(s => s.removeBlock)
  const selectBlock = useCampaignStore(s => s.selectBlock)
  const selectedId = useCampaignStore(s => s.selectedBlockId)
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const selected = selectedId === block.id

  return (
    <div ref={setNodeRef} style={style} className={`rounded border bg-white p-2 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="mb-2 flex items-center justify-between text-xs text-neutral-500">
        <div {...attributes} {...listeners} className="cursor-grab select-none">Drag</div>
        <div className="flex gap-2">
          <button onClick={() => selectBlock(block.id)} className="rounded border px-2 py-0.5">Edit</button>
          <button onClick={() => removeBlock(block.id)} className="rounded border px-2 py-0.5">Delete</button>
        </div>
      </div>
      <BlockRenderer block={block} />
      {selected && (
        <div className="mt-2">
          <BlockEditor />
        </div>
      )}
    </div>
  )
}
