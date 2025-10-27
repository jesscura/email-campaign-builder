import { StripeProvider } from './stripe';
import { XenditProvider } from './xendit';
import { PayPalProvider } from './paypal';
import { PaddleProvider } from './paddle';
import type { BillingProvider } from '../types';

export function getBillingProvider(driver: string = 'stripe'): BillingProvider {
  switch (driver) {
    case 'stripe':
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Stripe credentials are required');
      }
      return new StripeProvider(
        process.env.STRIPE_SECRET_KEY,
        process.env.STRIPE_WEBHOOK_SECRET
      );

    case 'xendit':
      if (!process.env.XENDIT_API_KEY) {
        throw new Error('Xendit API key is required');
      }
      return new XenditProvider(process.env.XENDIT_API_KEY);

    case 'paypal':
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        throw new Error('PayPal credentials are required');
      }
      return new PayPalProvider(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );

    case 'paddle':
      if (!process.env.PADDLE_API_KEY) {
        throw new Error('Paddle API key is required');
      }
      return new PaddleProvider(process.env.PADDLE_API_KEY);

    default:
      throw new Error(`Unknown billing provider: ${driver}`);
  }
}
