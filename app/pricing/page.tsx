'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  emailsPerMonth: number;
  maxSubscribers: number;
  maxCampaigns: number;
  hasAutomation: boolean;
  hasAIFeatures: boolean;
  hasAdvancedAnalytics: boolean;
  hasTeamAccess: boolean;
  maxTeamMembers: number;
}

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      const data = await response.json();
      setPlans(data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      router.push('/auth/signin?redirect=/pricing');
      return;
    }

    setCheckoutLoading(planId);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-black"></div>
          <p className="mt-2 text-sm text-neutral-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="mt-2 text-lg text-neutral-600">
          Start free and scale as you grow
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isLoading={checkoutLoading === plan.id}
            onSubscribe={() => handleSubscribe(plan.id)}
            isPopular={plan.name === 'Pro'}
          />
        ))}
      </div>

      <div className="mx-auto max-w-3xl rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FAQ
            question="Can I change plans later?"
            answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
          />
          <FAQ
            question="What happens if I exceed my limits?"
            answer="We'll notify you when you're approaching your limits. You can upgrade anytime to continue sending."
          />
          <FAQ
            question="Is there a free trial?"
            answer="Our Free plan is completely free forever. No credit card required to get started."
          />
          <FAQ
            question="Can I cancel anytime?"
            answer="Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
          />
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  isLoading,
  onSubscribe,
  isPopular,
}: {
  plan: Plan;
  isLoading: boolean;
  onSubscribe: () => void;
  isPopular?: boolean;
}) {
  const isFree = plan.price === 0;

  return (
    <div
      className={`relative rounded-lg border bg-white p-6 ${
        isPopular ? 'border-black shadow-lg' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="mt-1 text-sm text-neutral-600">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="text-neutral-600">/{plan.interval}</span>
      </div>

      <button
        onClick={onSubscribe}
        disabled={isLoading}
        className={`mb-6 w-full rounded-md px-4 py-2 font-medium ${
          isPopular
            ? 'bg-black text-white hover:bg-neutral-800'
            : 'border border-black hover:bg-neutral-50'
        } disabled:opacity-50`}
      >
        {isLoading ? 'Processing...' : isFree ? 'Get Started' : 'Subscribe'}
      </button>

      <div className="space-y-3 text-sm">
        <Feature text={`${plan.emailsPerMonth.toLocaleString()} emails/month`} />
        <Feature text={`${plan.maxSubscribers.toLocaleString()} subscribers`} />
        <Feature text={`${plan.maxCampaigns} campaigns`} />
        <Feature
          text="Email automation"
          included={plan.hasAutomation}
        />
        <Feature
          text="AI-powered features"
          included={plan.hasAIFeatures}
        />
        <Feature
          text="Advanced analytics"
          included={plan.hasAdvancedAnalytics}
        />
        <Feature
          text={`Team access (${plan.maxTeamMembers} members)`}
          included={plan.hasTeamAccess}
        />
      </div>
    </div>
  );
}

function Feature({ text, included = true }: { text: string; included?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {included ? (
        <svg
          className="h-5 w-5 text-green-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-neutral-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      )}
      <span className={included ? '' : 'text-neutral-400'}>{text}</span>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-4 last:border-0">
      <h3 className="font-medium">{question}</h3>
      <p className="mt-1 text-sm text-neutral-600">{answer}</p>
    </div>
  );
}
