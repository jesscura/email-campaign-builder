'use client'
import { useCampaignStore } from '@/store/campaign'
import { PersonalizationTagPicker } from './PersonalizationTagPicker'

export function BuilderSidebar() {
  const theme = useCampaignStore(s => s.campaign.theme)
  const setTheme = useCampaignStore(s => s.setTheme)
  const addBlock = useCampaignStore(s => s.addBlock)

  return (
    <div className="space-y-4 p-3">
      <section>
        <h3 className="mb-2 font-semibold">Blocks</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: 'text', label: 'Text' },
            { type: 'image', label: 'Image' },
            { type: 'button', label: 'Button' },
            { type: 'divider', label: 'Divider' },
            { type: 'spacer', label: 'Spacer' },
            { type: 'two_column', label: 'Two Column' },
            { type: 'social', label: 'Social Links' },
          ].map(b => (
            <button key={b.type} onClick={() => addBlock(b.type as any)} className="rounded border px-2 py-1 text-sm hover:bg-neutral-50">{b.label}</button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Theme</h3>
        <div className="space-y-2">
          <label className="block text-sm">Primary Color
            <input type="color" className="ml-2 h-8 w-12" value={theme.primaryColor} onChange={e => setTheme({ primaryColor: e.target.value })} />
          </label>
          <label className="block text-sm">Background
            <input type="color" className="ml-2 h-8 w-12" value={theme.backgroundColor} onChange={e => setTheme({ backgroundColor: e.target.value })} />
          </label>
          <label className="block text-sm">Text Color
            <input type="color" className="ml-2 h-8 w-12" value={theme.textColor} onChange={e => setTheme({ textColor: e.target.value })} />
          </label>
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Personalization</h3>
        <PersonalizationTagPicker />
      </section>
    </div>
  )
}