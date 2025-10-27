export interface EmailProvider {
  send(input: {
    to: string
    from: string
    subject: string
    html: string
    headers?: Record<string, string>
  }): Promise<{ id: string }>
}

export class DevLogProvider implements EmailProvider {
  async send(input: { to: string; from: string; subject: string; html: string; headers?: Record<string, string> }) {
    // eslint-disable-next-line no-console
    console.log('Dev email:', { to: input.to, subject: input.subject })
    return { id: `dev_${Date.now()}` }
  }
}
