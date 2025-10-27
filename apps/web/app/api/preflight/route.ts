import { NextRequest, NextResponse } from 'next/server'
import tinycolor from 'tinycolor2'
import { Campaign } from '@/store/campaign'

const spamWords = ['free', 'winner', 'guarantee', 'act now', 'urgent', 'prize', 'risk-free', 'best price']
const ctaRegex = /(call to action|shop now|buy now|learn more|get started|signup|sign up|subscribe)/i

export async function POST(req: NextRequest) {
  const { campaign } = await req.json() as { campaign: Campaign }
  const checks = []

  // Subject length
  const subj = campaign.subject || ''
  checks.push({
    id: 'subject_len',
    title: 'Subject Length',
    ok: subj.length >= 20 && subj.length <= 60,
    message: `${subj.length} chars (aim 32–42 for mobile)`
  })

  // Personalization
  checks.push({
    id: 'subject_pers',
    title: 'Subject Personalization',
    ok: /\{\{.+\}\}/.test(subj),
    message: /\{\{.+\}\}/.test(subj) ? 'Personalization detected' : 'Consider adding merge tags (e.g., {{Leads.First_Name}})'
  })

  // Spammy words
  const subjLower = subj.toLowerCase()
  const spamFound = spamWords.filter(w => subjLower.includes(w))
  checks.push({
    id: 'spam_words',
    title: 'Spam Terms',
    ok: spamFound.length === 0,
    message: spamFound.length ? `Avoid: ${spamFound.join(', ')}` : 'No common spam terms detected'
  })

  // CTA presence
  const hasCTA = campaign.blocks.some((b: any) => (b.type === 'button' && b.data.label) || (b.type === 'text' && ctaRegex.test(b.data.html)))
  checks.push({
    id: 'cta',
    title: 'Clear CTA',
    ok: hasCTA,
    message: hasCTA ? 'CTA detected' : 'Add a clear CTA (e.g., button)'
  })

  // Alt text for images
  const images = (campaign.blocks as any[]).filter(b => b.type === 'image')
  const missingAlt = images.filter((i: any) => !i.data.alt).length
  checks.push({
    id: 'alt_text',
    title: 'Image Alt Text',
    ok: missingAlt === 0,
    message: missingAlt === 0 ? 'All images have alt text' : `${missingAlt} image(s) missing alt text`
  })

  // Link presence & UTM
  const links = (campaign.blocks as any[]).flatMap((b: any) => {
    if (b.type === 'button' && b.data.href) return [b.data.href]
    if (b.type === 'text') {
      const m = [...(b.data.html.matchAll(/href="([^"]+)"/g) || [])].map(m => m[1])
      return m
    }
    return []
  })
  const missingUTM = links.filter((l: string) => l.startsWith('http') && !/utm_/.test(l)).length
  checks.push({
    id: 'utm',
    title: 'UTM Parameters',
    ok: links.length > 0 && missingUTM === 0,
    message: links.length === 0 ? 'No links found' : missingUTM ? `${missingUTM}/${links.length} link(s) missing UTM` : 'All links have UTMs'
  })

  // Contrast
  const tc = tinycolor(campaign.theme.textColor)
  const bg = tinycolor(campaign.theme.backgroundColor)
  const contrast = tinycolor.readability(bg, tc)
  checks.push({
    id: 'contrast',
    title: 'Color Contrast',
    ok: contrast >= 4.5,
    message: `Contrast ratio ${contrast.toFixed(2)} (>= 4.5 recommended)`
  })

  return NextResponse.json({ checks })
}