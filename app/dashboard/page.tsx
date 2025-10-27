'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-slate-600 mt-2">Manage your email campaigns</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="rounded-lg border-2 border-slate-900 text-slate-900 px-6 py-2 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300"
        >
          Sign out
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Total Campaigns" value="12" change="+3 this month" />
        <StatCard title="Active Subscribers" value="1,234" change="+89 this week" />
        <StatCard title="Open Rate" value="24.5%" change="+2.3% vs last month" />
        <StatCard title="Click Rate" value="3.2%" change="+0.5% vs last month" />
      </div>

      {/* Recent Campaigns */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Recent Campaigns</h2>
        <div className="space-y-4">
          <CampaignRow
            name="Welcome Email Series"
            status="Active"
            sent="1,234"
            opens="24.5%"
          />
          <CampaignRow
            name="Product Launch Announcement"
            status="Scheduled"
            sent="-"
            opens="-"
          />
          <CampaignRow
            name="Weekly Newsletter #42"
            status="Sent"
            sent="1,156"
            opens="22.1%"
          />
        </div>
        <Link
          href="/campaigns"
          className="mt-6 inline-block text-sm text-blue-600 hover:underline font-semibold"
        >
          View all campaigns →
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <QuickActionCard
          title="Create Campaign"
          description="Design a new email campaign"
          href="/builder"
          icon="📧"
        />
        <QuickActionCard
          title="Manage Audience"
          description="Add and segment subscribers"
            href="/audiences"
          icon="👥"
        />
        <QuickActionCard
          title="View Analytics"
          description="Track campaign performance"
          href="/analytics"
          icon="📊"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <p className="text-sm text-slate-600 font-medium">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-green-600 font-semibold">{change}</p>
    </div>
  );
}

function CampaignRow({
  name,
  status,
  sent,
  opens,
}: {
  name: string;
  status: string;
  sent: string;
  opens: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-0">
      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <span
          className={`text-xs font-medium ${
            status === 'Active'
              ? 'text-green-600'
              : status === 'Scheduled'
              ? 'text-blue-600'
              : 'text-slate-600'
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex gap-8 text-sm text-slate-600">
        <div>
          <span className="font-semibold text-slate-900">{sent}</span> sent
        </div>
        <div>
          <span className="font-semibold text-slate-900">{opens}</span> opens
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
    >
      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Link>
  );
}
