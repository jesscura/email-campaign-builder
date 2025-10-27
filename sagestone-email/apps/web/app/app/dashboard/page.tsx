export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-8 space-y-6">
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="mt-4 text-slate-600">No recent activity</p>
        </section>
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold">Campaign Performance</h2>
          <p className="mt-4 text-slate-600">Send your first campaign to see metrics here.</p>
        </section>
      </div>
    </div>
  )
}
