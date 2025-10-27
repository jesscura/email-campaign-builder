import Stripe from 'stripe'
import type { BillingDriver, CheckoutInput, PortalInput } from './index'

export class StripeDriver implements BillingDriver {
  private stripe: Stripe
  private webhookSecret: string
  constructor(secret: string, webhookSecret: string) {
  this.stripe = new Stripe(secret, { apiVersion: '2025-09-30.clover' as any })
    this.webhookSecret = webhookSecret
  }

  async createCheckout(input: CheckoutInput) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      line_items: [{ price: input.planId, quantity: 1 }],
      metadata: { workspaceId: input.workspaceId, ...input.metadata }
    })
    return { url: session.url! }
  }

  async portal(input: PortalInput) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: input.workspaceId, // In a real setup lookup Stripe customer id by workspace
      return_url: input.returnUrl
    })
    return { url: session.url }
  }

  async verifyWebhook(headers: Record<string, string>, body: Buffer) {
    const sig = headers['stripe-signature']
    if (!sig) throw new Error('Missing stripe-signature header')
    const evt = this.stripe.webhooks.constructEvent(body, sig, this.webhookSecret)
    return { event: evt.type, data: evt.data.object as any }
  }
}
