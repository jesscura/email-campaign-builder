import type { BillingProvider as IBillingProvider } from '../types';

export abstract class BillingProvider implements IBillingProvider {
  abstract createCustomer(params: { email: string; name?: string }): Promise<any>;
  abstract createCheckoutSession(params: any): Promise<any>;
  abstract getSubscription(subscriptionId: string): Promise<any>;
  abstract cancelSubscription(subscriptionId: string): Promise<{ success: boolean }>;
  abstract verifyWebhook(payload: string | Buffer, signature: string): Promise<any>;
}
