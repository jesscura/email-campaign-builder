export default function AudiencesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Audiences & Segments</h1>
        <button className="px-5 py-3 rounded-md bg-brand-600 text-white font-semibold">Import contacts</button>
      </div>
      <div className="mt-8 space-y-6">
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold">All Contacts</h2>
          <p className="mt-2 text-slate-600">0 contacts</p>
        </section>
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold">Segments</h2>
          <p className="mt-2 text-slate-600">No segments created yet</p>
        </section>
      </div>
    </div>
  )
}
