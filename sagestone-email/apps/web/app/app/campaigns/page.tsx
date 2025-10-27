export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <a href="/app/builder" className="px-5 py-3 rounded-md bg-brand-600 text-white font-semibold">Create campaign</a>
      </div>
      <div className="mt-8 rounded-lg border bg-white p-8 text-center">
        <p className="text-slate-600">No campaigns yet. Create your first one to get started!</p>
      </div>
    </div>
  )
}
