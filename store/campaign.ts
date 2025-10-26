import { create } from 'zustand'
import { nanoid } from '@/utils/nanoid'

export type Block =
  | { id: string; type: 'text'; data: { html: string } }
  | { id: string; type: 'image'; data: { src: string; alt: string } }
  | { id: string; type: 'button'; data: { label: string; href: string } }
  | { id: string; type: 'divider'; data: {} }
  | { id: string; type: 'spacer'; data: { height: number } }
  | { id: string; type: 'two_column'; data: { leftHtml: string; rightHtml: string } }
  | { id: string; type: 'social'; data: { links: { platform: string; url: string }[] } }

export type Campaign = {
  subject: string
  preheader: string
  fromName: string
  fromEmail: string
  theme: { primaryColor: string; backgroundColor: string; textColor: string }
  blocks: Block[]
  abTest: {
    variantA: { subject: string; note?: string }
    variantB: { subject: string; note?: string }
  }
}

export const defaultCampaign = (): Campaign => ({
  subject: 'Hello {{Leads.First_Name}}, big news inside!',
  preheader: 'Get 20% off your next purchase. Ends soon.',
  fromName: 'Your Brand',
  fromEmail: 'newsletter@example.com',
  theme: { primaryColor: '#111827', backgroundColor: '#ffffff', textColor: '#111827' },
  blocks: [
    { id: nanoid(), type: 'image', data: { src: 'https://via.placeholder.com/1200x400', alt: 'Hero' } },
    { id: nanoid(), type: 'text', data: { html: '<h2>Welcome {{Leads.First_Name}}</h2><p>Thanks for being with us.</p>' } },
    { id: nanoid(), type: 'button', data: { label: 'Shop now', href: 'https://example.com?utm_source=newsletter' } },
    { id: nanoid(), type: 'divider', data: {} },
    { id: nanoid(), type: 'two_column', data: { leftHtml: '<p>Left content</p>', rightHtml: '<p>Right content</p>' } },
    { id: nanoid(), type: 'social', data: { links: [{ platform: 'Twitter', url: 'https://twitter.com/your' }, { platform: 'LinkedIn', url: 'https://linkedin.com/company/your' }] } },
  ],
  abTest: { variantA: { subject: 'Hello {{Leads.First_Name}} — big news!' }, variantB: { subject: 'Big news for you, {{Leads.First_Name}}' } }
})

type Store = {
  campaign: Campaign
  selectedBlockId: string | null
  setCampaign: (patch: Partial<Campaign>) => void
  setTheme: (patch: Partial<Campaign['theme']>) => void
  addBlock: (type: Block['type']) => void
  removeBlock: (id: string) => void
  moveBlock: (from: number, to: number) => void
  selectBlock: (id: string | null) => void
  updateBlock: (id: string, patch: Partial<Block>) => void
  insertToken: (token: string) => void
  setAB: (which: 'A' | 'B', patch: any) => void
}

export const useCampaignStore = create<Store>((set, get) => ({
  campaign: defaultCampaign(),
  selectedBlockId: null,
  setCampaign: (patch) => set(s => ({ campaign: { ...s.campaign, ...patch } })),
  setTheme: (patch) => set(s => ({ campaign: { ...s.campaign, theme: { ...s.campaign.theme, ...patch } } })),
  addBlock: (type) => set(s => {
    const newBlock = (() => {
      switch (type) {
        case 'text': return { id: nanoid(), type, data: { html: '<p>Edit me...</p>' } } as Block
        case 'image': return { id: nanoid(), type, data: { src: '', alt: '' } } as Block
        case 'button': return { id: nanoid(), type, data: { label: 'Call to Action', href: '#' } } as Block
        case 'divider': return { id: nanoid(), type, data: {} } as Block
        case 'spacer': return { id: nanoid(), type, data: { height: 16 } } as Block
        case 'two_column': return { id: nanoid(), type, data: { leftHtml: '<p>Left</p>', rightHtml: '<p>Right</p>' } } as Block
        case 'social': return { id: nanoid(), type, data: { links: [] } } as Block
      }
    })()
    return { campaign: { ...s.campaign, blocks: [...s.campaign.blocks, newBlock!] } }
  }),
  removeBlock: (id) => set(s => ({ campaign: { ...s.campaign, blocks: s.campaign.blocks.filter(b => b.id !== id) } })),
  moveBlock: (from, to) => set(s => {
    const arr = [...s.campaign.blocks]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    return { campaign: { ...s.campaign, blocks: arr } }
  }),
  selectBlock: (id) => set({ selectedBlockId: id }),
  updateBlock: (id, patch) => set(s => ({
    campaign: {
      ...s.campaign,
      blocks: s.campaign.blocks.map(b => b.id === id ? { ...b, ...patch, data: { ...b.data, ...(patch as any).data } } : b)
    }
  })),
  insertToken: (token) => {
    const id = get().selectedBlockId
    if (!id) return
    const block = get().campaign.blocks.find(b => b.id === id)
    if (!block || block.type !== 'text') return
    const html = (block as any).data.html || ''
    const newHtml = html + token
    get().updateBlock(id, { data: { html: newHtml } } as any)
  },
  setAB: (which, patch) => set(s => {
    const ab = { ...s.campaign.abTest }
    if (which === 'A') ab.variantA = { ...ab.variantA, ...patch }
    else ab.variantB = { ...ab.variantB, ...patch }
    return { campaign: { ...s.campaign, abTest: ab } }
  }),
}))
