'use client'
import { useCampaignStore } from '@/store/campaign'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { SortableBlock } from './blocks/SortableBlock'

export function EditorCanvas() {
  const blocks = useCampaignStore(s => s.campaign.blocks)
  const moveBlock = useCampaignStore(s => s.moveBlock)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function onDragEnd(event: any) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)
      moveBlock(oldIndex, newIndex)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_360px]">
      <div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
            <div className="space-y-2">
              {blocks.map(b => <SortableBlock key={b.id} block={b} />)}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div>
        {/* Block editor renders inline when a block is selected */}
      </div>
    </div>
  )
}
