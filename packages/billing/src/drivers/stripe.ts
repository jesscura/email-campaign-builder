import Stripe from 'stripe';
import { BillingProvider } from './base';
import type { BillingCustomer, CheckoutSession, Subscription, WebhookEvent } from '../types';

export class StripeProvider extends BillingProvider {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(apiKey: string, webhookSecret: string) {
    super();
    this.stripe = new Stripe(apiKey, { apiVersion: '2024-12-18.acacia' });
    this.webhookSecret = webhookSecret;
  }

  async createCustomer(params: { email: string; name?: string }): Promise<BillingCustomer> {
    const customer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
    });

    return {
      id: customer.id,
      email: customer.email!,
      name: customer.name || undefined,
    };
  }

  async createCheckoutSession(params: {
    customerId: string;
    planId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      customer: params.customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: params.planId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    return {
      id: session.id,
      url: session.url!,
      customerId: params.customerId,
    };
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        planId: subscription.items.data[0].price.id,
        status: subscription.status as any,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };
    } catch (error) {
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean }> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async verifyWebhook(payload: string | Buffer, signature: string): Promise<WebhookEvent> {
    const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);

    return {
      type: event.type,
      data: event.data.object,
    };
  }
}
