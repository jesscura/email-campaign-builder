'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
      setPlans(data.plans || []);
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
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          Start free and scale as you grow. All plans include core features.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PlanCard
              plan={plan}
              isLoading={checkoutLoading === plan.id}
              onSubscribe={() => handleSubscribe(plan.id)}
              isPopular={plan.name === 'Pro'}
            />
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-4xl rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xl p-8">
        <h2 className="mb-8 text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <FAQ
            question="Can I change plans later?"
            answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any charges."
          />
          <FAQ
            question="What happens if I exceed my limits?"
            answer="We'll notify you when you're approaching your limits. You can upgrade anytime to continue sending without interruption."
          />
          <FAQ
            question="Is there a free trial?"
            answer="Our Free plan is completely free forever with no credit card required. You can also try Pro or Business plans with a 14-day money-back guarantee."
          />
          <FAQ
            question="Can I cancel anytime?"
            answer="Yes, you can cancel your subscription at any time with no penalties. You'll continue to have access until the end of your billing period."
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
      className={`relative rounded-2xl bg-white/80 backdrop-blur-sm border-2 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        isPopular ? 'border-blue-600 shadow-xl scale-105' : 'border-slate-200'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
        <p className="mt-2 text-slate-600">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-slate-900">${plan.price}</span>
          <span className="ml-2 text-slate-600">/{plan.interval}</span>
        </div>
      </div>

      <button
        onClick={onSubscribe}
        disabled={isLoading}
        className={`mb-8 w-full py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
          isPopular
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105'
            : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Processing...' : isFree ? 'Get Started Free' : 'Subscribe Now'}
      </button>

      <div className="space-y-4">
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
    <div className="flex items-center gap-3">
      {included ? (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="h-4 w-4 text-green-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      ) : (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      )}
      <span className={included ? 'text-slate-700' : 'text-slate-400'}>{text}</span>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-slate-200 pb-6 last:border-0">
      <h3 className="font-semibold text-lg text-slate-900 mb-2">{question}</h3>
      <p className="text-slate-600">{answer}</p>
    </div>
  );
}
