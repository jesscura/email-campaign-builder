export type CheckoutInput = {
  workspaceId: string
  planId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export type PortalInput = { workspaceId: string; returnUrl: string }

export interface BillingDriver {
  createCheckout(input: CheckoutInput): Promise<{ url: string }>
  portal(input: PortalInput): Promise<{ url: string }>
  verifyWebhook(headers: Record<string, string>, body: Buffer): Promise<{ event: string; data: any }>
}

export function createBillingDriver(): BillingDriver {
  const driver = (process.env.BILLING_DRIVER || 'stripe').toLowerCase()
  if (driver === 'stripe') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { StripeDriver } = require('./stripe')
    return new StripeDriver(process.env.STRIPE_SECRET_KEY || '', process.env.STRIPE_WEBHOOK_SECRET || '')
  }
  throw new Error(`Unsupported billing driver: ${driver}`)
}
