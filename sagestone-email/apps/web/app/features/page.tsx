export default function FeaturesPage() {
  const features = [
    { title: 'AI Campaign Builder', desc: 'Generate subject lines, body copy, layouts, and images with a click.' },
    { title: 'Customer Journeys', desc: 'Visual flows with triggers, actions, conditions, and delays.' },
    { title: 'Audience & Segments', desc: 'Unlimited nested & dynamic segments with AI recommendations.' },
    { title: 'Analytics & Predictive', desc: 'Real-time dashboards with send-time optimization and forecasts.' },
    { title: 'Templates & Brand Kit', desc: 'Drag-drop blocks with brand fonts, colors, and logos.' },
    { title: 'Compliance by Design', desc: 'Consent tracking, DSR exports, and privacy controls.' },
  ]
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">Features</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
