'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Email Campaigns
            </span>
            <br />
            <span className="text-slate-900">Made Simple</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
            Build beautiful, responsive, high-converting emails with our AI-powered platform. 
            {session && ` Welcome back, ${session.user.name}!`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
                <Link href="/builder" className="btn-secondary">
                  Open Builder
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup" className="btn-primary">
                  Get Started Free
                </Link>
                <Link href="/auth/signin" className="btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl border border-slate-200 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">10K+</div>
              <div className="text-slate-600 mt-2">Emails Sent Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">99.9%</div>
              <div className="text-slate-600 mt-2">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-slate-600 mt-2">Support Available</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-slate-600">
            Powerful features designed for modern email marketing
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="AI-Powered Content" 
            description="Generate engaging subject lines and content with AI assistance."
            href="/builder"
          />
          <FeatureCard 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            }
            title="Drag & Drop Builder" 
            description="Create professional emails without coding knowledge."
            href="/builder"
          />
          <FeatureCard 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Advanced Analytics" 
            description="Track opens, clicks, and conversions in real-time."
            href="/dashboard"
          />
          <FeatureCard 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="Audience Segmentation" 
            description="Target the right people with smart segmentation."
            href="/dashboard"
          />
          <FeatureCard 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            }
            title="Beautiful Templates" 
            description="Start from professionally designed templates."
            href="/templates"
          />
          <FeatureCard 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="A/B Testing" 
            description="Optimize campaigns with built-in testing tools."
            href="/builder#ab"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 px-6 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Ready to Transform Your Email Marketing?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of marketers using our platform
        </p>
        <Link href="/auth/signup" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-300 hover:scale-105 shadow-xl">
          Start Free Trial
        </Link>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </motion.a>
  )
}