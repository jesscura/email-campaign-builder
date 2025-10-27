export default function BlogPage() {
  const posts = [
    { title: 'Launching Sagestone Email', summary: 'An AI-first approach to email marketing.' },
    { title: 'Deliverability Basics', summary: 'SPF, DKIM, DMARC explained for humans.' }
  ]
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">Blog</h1>
      <div className="mt-8 space-y-6">
        {posts.map((p) => (
          <article key={p.title} className="rounded-lg border p-6">
            <h3 className="text-2xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-slate-600">{p.summary}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
