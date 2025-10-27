export interface BillingCustomer {
  id: string;
  email: string;
  name?: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
}

export interface CheckoutSession {
  id: string;
  url: string;
  customerId?: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: Date;
}

export interface WebhookEvent {
  type: string;
  data: any;
}

export interface BillingProvider {
  createCustomer(params: { email: string; name?: string }): Promise<BillingCustomer>;
  createCheckoutSession(params: {
    customerId: string;
    planId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession>;
  getSubscription(subscriptionId: string): Promise<Subscription | null>;
  cancelSubscription(subscriptionId: string): Promise<{ success: boolean }>;
  verifyWebhook(payload: string | Buffer, signature: string): Promise<WebhookEvent>;
}
