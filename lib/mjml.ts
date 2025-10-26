import mjml2html from 'mjml'
import juice from 'juice'
import { Campaign, Block } from '@/store/campaign'

const baseCss = `
  a { text-decoration: none; }
`

function blockToMjml(block: Block, theme: Campaign['theme']): string {
  switch (block.type) {
    case 'text':
      return `<mj-section background-color="${theme.backgroundColor}"><mj-column>
        <mj-text color="${theme.textColor}" font-size="16px" line-height="1.5">${(block as any).data.html}</mj-text>
      </mj-column></mj-section>`
    case 'image':
      return `<mj-section background-color="${theme.backgroundColor}"><mj-column>
        <mj-image src="${(block as any).data.src}" alt="${(block as any).data.alt || ''}" padding="0px"></mj-image>
      </mj-column></mj-section>`
    case 'button':
      return `<mj-section background-color="${theme.backgroundColor}"><mj-column>
        <mj-button href="${(block as any).data.href}" background-color="${theme.primaryColor}" color="#ffffff" font-size="16px" border-radius="6px" padding="16px">${(block as any).data.label}</mj-button>
      </mj-column></mj-section>`
    case 'divider':
      return `<mj-section background-color="${theme.backgroundColor}"><mj-column><mj-divider border-color="#e5e7eb"></mj-divider></mj-column></mj-section>`
    case 'spacer':
      return `<mj-section background-color="${theme.backgroundColor}"><mj-column><mj-spacer height="${(block as any).data.height}px" /></mj-column></mj-section>`
    case 'two_column':
      return `<mj-section background-color="${theme.backgroundColor}">
        <mj-column><mj-text color="${theme.textColor}" font-size="16px" line-height="1.5">${(block as any).data.leftHtml}</mj-text></mj-column>
        <mj-column><mj-text color="${theme.textColor}" font-size="16px" line-height="1.5">${(block as any).data.rightHtml}</mj-text></mj-column>
      </mj-section>`
    case 'social':
      return `<mj-section background-color="${theme.backgroundColor}"><mj-column>
        ${((block as any).data.links || []).map((l: any) => `<mj-text><a href="${l.url}">${l.platform}</a></mj-text>`).join('')}
      </mj-column></mj-section>`
  }
}

export function campaignToMjml(campaign: Campaign): string {
  const head = `
    <mj-head>
      <mj-attributes>
        <mj-all font-family="Inter, Arial" />
      </mj-attributes>
      <mj-title>${campaign.subject}</mj-title>
      <mj-preview>${campaign.preheader}</mj-preview>
    </mj-head>`
  const body = campaign.blocks.map(b => blockToMjml(b, campaign.theme)).join('\n')
  return `<mjml>
    ${head}
    <mj-body background-color="${campaign.theme.backgroundColor}">
      <mj-section padding="0"><mj-column><mj-spacer height="16px"/></mj-column></mj-section>
      ${body}
      <mj-section padding="0"><mj-column><mj-spacer height="16px"/></mj-column></mj-section>
    </mj-body>
  </mjml>`
}

export function mjmlToHtmlInlined(mjml: string): { html: string; errors: any[] } {
  const { html, errors } = mjml2html(mjml, { minify: true, keepComments: false })
  const inlined = juice.inlineContent(html, baseCss, { removeStyleTags: false })
  return { html: inlined, errors }
}
