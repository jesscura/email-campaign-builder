'use client'
import { useCampaignStore } from '@/store/campaign'
import { useMemo } from 'react'

export function SubjectLineAssistant() {
  const subj = useCampaignStore(s => s.campaign.subject)
  const preheader = useCampaignStore(s => s.campaign.preheader)
  const setCampaign = useCampaignStore(s => s.setCampaign)

  const score = useMemo(() => {
    let s = 100
    if (subj.length < 4) s -= 20
    if (subj.length > 60) s -= 20
    if (!/[A-Z]/.test(subj)) s -= 5
    if (!/\{\{.+\}\}/.test(subj)) s -= 5
    if (/(free|winner|guarantee|urgent|act now)/i.test(subj)) s -= 10
    if (/!{2,}/.test(subj)) s -= 5
    if (/(re:|fwd:)/i.test(subj)) s -= 10
    return Math.max(0, s)
  }, [subj])

  const tips = useMemo(() => {
    const t: string[] = []
    if (!/\{\{.+\}\}/.test(subj)) t.push('Add personalization, e.g., {{Leads.First_Name}}')
    if (subj.length > 42) t.push('Aim for 32–42 characters for mobile')
    if (!/[0-9]/.test(subj)) t.push('Numbers can increase CTR (e.g., 3 tips...)')
    if (!/[?!]/.test(subj)) t.push('Use a question or curiosity gap (avoid clickbait)')
    if (!preheader) t.push('Add a compelling preheader (35–50 chars)')
    return t
  }, [subj, preheader])

  return (
    <div>
      <h3 className="mb-2 font-semibold">Subject & Preheader</h3>
      <div className="space-y-2">
        <input className="w-full rounded border p-2" placeholder="Subject" value={subj} onChange={e => setCampaign({ subject: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Preheader" value={preheader} onChange={e => setCampaign({ preheader: e.target.value })} />
        <div className="text-sm">Score: <span className={score > 70 ? 'text-green-700' : 'text-amber-700'}>{score}/100</span></div>
        <ul className="list-inside list-disc text-sm text-neutral-700">
          {tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  )
}
