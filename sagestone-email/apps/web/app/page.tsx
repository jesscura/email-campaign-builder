export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">AI-first email marketing</h1>
        <p className="mt-4 text-lg text-slate-600">Plan journeys, craft on-brand emails, and optimize sends with predictive insights.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="/auth/signin" className="px-5 py-3 rounded-md bg-brand-600 text-white font-semibold">Get started</a>
          <a href="/features" className="px-5 py-3 rounded-md border border-slate-300">Explore features</a>
        </div>
      </section>
    </main>
  )
}
