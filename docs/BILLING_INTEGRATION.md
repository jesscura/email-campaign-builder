# Billing Integration Guide

## Overview

Sagestone Email vNext supports four payment providers through a unified billing SDK (`@sagestone/billing`):

1. **Stripe** - Default, global coverage
2. **Xendit** - Southeast Asia focus (Indonesia, Philippines, etc.)
3. **PayPal** - Alternative global option
4. **Paddle** - SaaS-optimized, handles VAT/taxes

## Configuration

### Selecting a Provider

Set the `BILLING_DRIVER` environment variable:

```bash
BILLING_DRIVER=stripe   # Default
# or
BILLING_DRIVER=xendit
# or
BILLING_DRIVER=paypal
# or
BILLING_DRIVER=paddle
```

### Provider Credentials

#### Stripe

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
```

**Setup**:
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Create products and prices
4. Set up webhook endpoint: `https://your-domain.com/api/billing/webhook/stripe`
5. Add webhook events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

#### Xendit

```bash
XENDIT_API_KEY=xnd_development_...
XENDIT_WEBHOOK_SECRET=...
```

**Setup**:
1. Create account at [xendit.com](https://xendit.com)
2. Get API key from Settings
3. Configure webhook: `https://your-domain.com/api/billing/webhook/xendit`

#### PayPal

```bash
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox  # or live
```

**Setup**:
1. Create developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create REST API app
3. Get credentials from app settings
4. Configure webhook: `https://your-domain.com/api/billing/webhook/paypal`

#### Paddle

```bash
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...
PADDLE_ENVIRONMENT=sandbox  # or production
```

**Setup**:
1. Create account at [paddle.com](https://paddle.com)
2. Get API key from Developer Tools
3. Configure webhook: `https://your-domain.com/api/billing/webhook/paddle`

## Usage

### In Code

```typescript
import { getBillingProvider } from '@sagestone/billing';

const billing = getBillingProvider(); // Uses BILLING_DRIVER env var

// Create customer
const customer = await billing.createCustomer({
  email: 'user@example.com',
  name: 'John Doe',
});

// Create checkout session
const session = await billing.createCheckoutSession({
  customerId: customer.id,
  planId: process.env.STRIPE_PRO_PRICE_ID!,
  successUrl: 'https://your-domain.com/success',
  cancelUrl: 'https://your-domain.com/cancel',
});

// Redirect user to session.url

// Get subscription
const subscription = await billing.getSubscription('sub_xxx');

// Cancel subscription
await billing.cancelSubscription('sub_xxx');
```

### Webhook Handling

All providers use a unified webhook handler:

```typescript
// apps/api/src/billing/webhooks.controller.ts
@Post('webhook/:provider')
async handleWebhook(
  @Param('provider') provider: string,
  @Body() payload: any,
  @Headers('stripe-signature') signature: string,
) {
  const billing = getBillingProvider(provider);
  const event = await billing.verifyWebhook(payload, signature);
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Activate subscription
      break;
    case 'customer.subscription.updated':
      // Update subscription status
      break;
    case 'customer.subscription.deleted':
      // Cancel subscription
      break;
  }
}
```

## Pricing Plans

### Default Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 500 emails, 100 subscribers |
| **Pro** | $29/mo | 10,000 emails, 2,500 subscribers, AI features |
| **Business** | $99/mo | 100,000 emails, 25,000 subscribers, team access |

### Creating Plans

#### Stripe

```bash
# Create product
stripe products create \
  --name "Pro Plan" \
  --description "10,000 emails per month"

# Create price
stripe prices create \
  --product prod_xxx \
  --unit-amount 2900 \
  --currency usd \
  --recurring interval=month
```

#### Xendit/PayPal/Paddle

Consult respective documentation for plan creation.

## Multi-currency Support

Each provider handles currencies differently:

- **Stripe**: Supports 135+ currencies, automatic conversion
- **Xendit**: IDR, PHP, THB, VND, MYR
- **PayPal**: 25+ currencies
- **Paddle**: Automatic currency detection, handles VAT

Set pricing per currency in provider dashboard or use dynamic pricing based on user location.

## Testing

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### Xendit Test Mode

Use test API key and Xendit test payment methods.

### PayPal Sandbox

Use sandbox accounts and credentials.

### Paddle Sandbox

Enable sandbox mode in Paddle dashboard.

## Error Handling

```typescript
try {
  const session = await billing.createCheckoutSession({...});
} catch (error) {
  if (error.code === 'card_declined') {
    // Handle card decline
  } else if (error.code === 'subscription_exists') {
    // User already has subscription
  } else {
    // Generic error
  }
}
```

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Verify webhook signatures** before processing
3. **Use HTTPS** for all webhook endpoints
4. **Store customer IDs securely** in database
5. **Log all billing events** for audit trail
6. **Implement idempotency** for webhook handlers

## Switching Providers

To switch from one provider to another:

1. Export customer/subscription data from current provider
2. Create equivalent plans in new provider
3. Update `BILLING_DRIVER` environment variable
4. Migrate existing subscriptions (may require manual intervention)
5. Update webhook URLs

**Note**: Seamless provider switching without user interruption is complex. Plan migrations carefully.

## Troubleshooting

### Webhook Not Firing

1. Check webhook URL is publicly accessible
2. Verify webhook secret matches environment variable
3. Check provider dashboard for webhook delivery attempts
4. Enable webhook logging in provider settings

### Payment Failing

1. Check API keys are correct and not expired
2. Verify plan/price IDs exist in provider dashboard
3. Test with provider's test cards/accounts
4. Check for any account restrictions (e.g., country availability)

### Subscription Status Not Updating

1. Verify webhook handler is processing events correctly
2. Check database for subscription record
3. Ensure idempotency to prevent duplicate processing
4. Review logs for any errors during webhook processing

## Support

For provider-specific issues, consult official documentation:

- Stripe: [stripe.com/docs](https://stripe.com/docs)
- Xendit: [docs.xendit.co](https://docs.xendit.co)
- PayPal: [developer.paypal.com/docs](https://developer.paypal.com/docs)
- Paddle: [developer.paddle.com](https://developer.paddle.com)

---

**Last Updated**: January 2025
