import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  await prisma.user.update({
    where: { id: userId },
    data: {
      planId,
      subscriptionId: subscription.id,
      subscriptionStatus: 'ACTIVE',
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { subscriptionId: subscription.id },
  });

  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  const status = mapStripeStatus(subscription.status);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: status,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { subscriptionId: subscription.id },
  });

  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  // Move user back to free plan
  const freePlan = await prisma.plan.findFirst({
    where: { name: 'Free' },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      planId: freePlan?.id,
      subscriptionId: null,
      subscriptionStatus: 'CANCELED',
      currentPeriodEnd: null,
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId || typeof subscriptionId !== 'string') return;
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdate(subscription);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId || typeof subscriptionId !== 'string') return;
  
  const user = await prisma.user.findFirst({
    where: { subscriptionId },
  });

  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionStatus: 'PAST_DUE' },
  });
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): 'ACTIVE' | 'INACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING' {
  switch (status) {
    case 'active':
      return 'ACTIVE';
    case 'trialing':
      return 'TRIALING';
    case 'past_due':
      return 'PAST_DUE';
    case 'canceled':
    case 'unpaid':
      return 'CANCELED';
    default:
      return 'INACTIVE';
  }
}
