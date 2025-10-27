export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="mt-8 space-y-6">
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold">Account</h2>
          <p className="mt-4 text-slate-600">Manage your profile and preferences</p>
        </section>
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold">Workspace</h2>
          <p className="mt-4 text-slate-600">Team members, domains, and API keys</p>
        </section>
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold">Billing</h2>
          <p className="mt-4 text-slate-600">Subscription and invoices</p>
        </section>
      </div>
    </div>
  )
}
