export default function PricingPage() {
  const plans = [
    { name: 'Starter', price: '$29/mo', features: ['5k contacts', '10k emails/mo', 'AI builder'] },
    { name: 'Growth', price: '$99/mo', features: ['25k contacts', '100k emails/mo', 'Automations'] },
    { name: 'Scale', price: 'Custom', features: ['>100k contacts', 'SLA', 'Dedicated support'] },
  ]
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">Pricing</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="mt-2 text-3xl font-extrabold">{p.price}</p>
            <ul className="mt-4 space-y-1 text-slate-600">
              {p.features.map((f) => <li key={f}>• {f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}
