export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-slate-600">Sent</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-slate-600">Opens</h3>
          <p className="mt-2 text-3xl font-bold">0%</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-slate-600">Clicks</h3>
          <p className="mt-2 text-3xl font-bold">0%</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-slate-600">Bounces</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>
      <section className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="text-xl font-semibold">Campaign Performance</h2>
        <p className="mt-4 text-slate-600">Send campaigns to see real-time and predictive analytics here.</p>
      </section>
    </div>
  )
}
