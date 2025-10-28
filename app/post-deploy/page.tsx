import React from 'react'

export const dynamic = 'force-dynamic'

type Preflight = {
  ok: boolean
  env: { missing: string[]; present: string[] }
  db: { ok: boolean; error?: string }
  api: { externalConfigured: boolean; baseUrl: string | null }
  runtime: { node: string; environment?: string; vercel: boolean; region: string | null }
}

async function getStatus(): Promise<Preflight | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/preflight`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    return (await res.json()) as Preflight
  } catch {
    return null
  }
}

export default async function PostDeployPage() {
  const status = await getStatus()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Post-Deploy Check</h1>
      <p className="mt-2 text-slate-600">Validate environment config and database connectivity.</p>

      {!status ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          Unable to load preflight status. Ensure the site is reachable and try again.
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <section className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">Overall</h2>
              <span className={`px-2 py-1 rounded text-sm ${status.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {status.ok ? 'OK' : 'Attention needed'}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-3">
                <dt className="text-sm text-slate-600">Database</dt>
                <dd className={`mt-1 font-medium ${status.db.ok ? 'text-emerald-700' : 'text-red-700'}`}>
                  {status.db.ok ? 'Connected' : 'Not connected'}
                </dd>
                {!status.db.ok && status.db.error && (
                  <p className="mt-1 text-xs text-slate-500">{status.db.error}</p>
                )}
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <dt className="text-sm text-slate-600">External API</dt>
                <dd className="mt-1 font-medium text-slate-800">
                  {status.api.externalConfigured ? (
                    <span className="text-emerald-700">Configured</span>
                  ) : (
                    <span className="text-amber-700">Not configured</span>
                  )}
                </dd>
                {status.api.baseUrl && (
                  <p className="mt-1 text-xs text-slate-500">{status.api.baseUrl}</p>
                )}
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 p-5">
            <h2 className="text-lg font-medium text-slate-900">Environment</h2>
            {status.env.missing.length === 0 ? (
              <p className="mt-2 text-sm text-emerald-700">All required environment variables are set.</p>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-amber-700">Missing variables:</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-800">
                  {status.env.missing.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 p-5">
            <h2 className="text-lg font-medium text-slate-900">Runtime</h2>
            <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-600">Node</dt>
                <dd className="text-sm text-slate-800">{status.runtime.node}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Environment</dt>
                <dd className="text-sm text-slate-800">{status.runtime.environment}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Vercel</dt>
                <dd className="text-sm text-slate-800">{status.runtime.vercel ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Region</dt>
                <dd className="text-sm text-slate-800">{status.runtime.region || '-'}</dd>
              </div>
            </dl>
          </section>

          <div className="flex gap-3">
            <a href="/post-deploy" className="text-sm text-slate-700 underline">Refresh</a>
            <a href="/" className="text-sm text-slate-500 hover:text-slate-700">Back home</a>
          </div>
        </div>
      )}
    </div>
  )
}
