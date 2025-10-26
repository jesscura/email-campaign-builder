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
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-black"></div>
          <p className="mt-2 text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {session.user.name}!</h1>
          <p className="text-neutral-600">Manage your email campaigns</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="rounded border px-4 py-2 hover:bg-neutral-50"
        >
          Sign out
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Campaigns" value="12" change="+3 this month" />
        <StatCard title="Active Subscribers" value="1,234" change="+89 this week" />
        <StatCard title="Open Rate" value="24.5%" change="+2.3% vs last month" />
        <StatCard title="Click Rate" value="3.2%" change="+0.5% vs last month" />
      </div>

      {/* Recent Campaigns */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Campaigns</h2>
        <div className="space-y-3">
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
          className="mt-4 inline-block text-sm text-black hover:underline"
        >
          View all campaigns →
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard
          title="Create Campaign"
          description="Design a new email campaign"
          href="/builder"
          icon="📧"
        />
        <QuickActionCard
          title="Manage Audience"
          description="Add and segment subscribers"
          href="/audience"
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
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-neutral-600">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-green-600">{change}</p>
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
    <div className="flex items-center justify-between border-b pb-3 last:border-0">
      <div>
        <p className="font-medium">{name}</p>
        <span
          className={`text-xs ${
            status === 'Active'
              ? 'text-green-600'
              : status === 'Scheduled'
              ? 'text-blue-600'
              : 'text-neutral-600'
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex gap-6 text-sm text-neutral-600">
        <div>
          <span className="font-medium">{sent}</span> sent
        </div>
        <div>
          <span className="font-medium">{opens}</span> opens
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
      className="rounded-lg border bg-white p-6 hover:shadow transition-shadow"
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
    </Link>
  );
}
