export default function AppHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-4 text-slate-600">Your workspace dashboard will appear here.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border p-6 bg-white">
          <h3 className="text-lg font-semibold">Campaigns</h3>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6 bg-white">
          <h3 className="text-lg font-semibold">Contacts</h3>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6 bg-white">
          <h3 className="text-lg font-semibold">Opens</h3>
          <p className="mt-2 text-2xl font-bold">0%</p>
        </div>
      </div>
    </div>
  )
}
