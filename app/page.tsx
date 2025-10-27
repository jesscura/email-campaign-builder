'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-slate-900">
            Email Marketing,
            <br />
            <span className="text-slate-600">Simplified</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10">
            Create, send, and track beautiful email campaigns with powerful automation and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <>
                <Link href="/dashboard" className="bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300">
                  Go to Dashboard
                </Link>
                <Link href="/builder" className="border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300">
                  Open Builder
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup" className="bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300">
                  Get Started Free
                </Link>
                <Link href="/auth/signin" className="border-2 border-slate-300 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:border-slate-900 transition-all duration-300">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
        >
          <div>
            <div className="text-4xl font-bold text-slate-900">99.9%</div>
            <div className="text-slate-600 mt-2">Delivery Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900">50K+</div>
            <div className="text-slate-600 mt-2">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900">24/7</div>
            <div className="text-slate-600 mt-2">Support</div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything you need
          </h2>
          <p className="text-xl text-slate-600">
            Powerful tools to grow your business
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard 
            title="Drag & Drop Editor" 
            description="Create professional emails without any coding. Simple and intuitive."
            href="/builder"
          />
          <FeatureCard 
            title="Smart Analytics" 
            description="Track opens, clicks, and conversions in real-time with detailed reports."
            href="/dashboard"
          />
          <FeatureCard 
            title="AI-Powered Content" 
            description="Generate compelling subject lines and content with AI assistance."
            href="/builder"
          />
          <FeatureCard 
            title="Audience Targeting" 
            description="Segment your audience and send personalized campaigns that convert."
            href="/dashboard"
          />
          <FeatureCard 
            title="Beautiful Templates" 
            description="Start from professionally designed templates that look great everywhere."
            href="/templates"
          />
          <FeatureCard 
            title="A/B Testing" 
            description="Optimize your campaigns with built-in A/B testing and insights."
            href="/builder#ab"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of businesses using SageStone for their email marketing
          </p>
          <Link href="/auth/signup" className="inline-block bg-slate-900 text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-all duration-300">
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group p-8 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 bg-white"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.a>
  )
}