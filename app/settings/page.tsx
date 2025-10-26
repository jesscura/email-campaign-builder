'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

type ZohoConfig = { client_id?: string; client_secret?: string; base_url?: string; redirect_uri?: string }

export default function Settings() {
  const [connected, setConnected] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [cfg, setCfg] = useState<ZohoConfig>({})

  useEffect(() => {
    fetch('/api/zoho/user').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.ok) { setConnected(true); setUser(d.user) }
    }).catch(() => {})

    fetch('/api/zoho/settings').then(r => r.json()).then(d => {
      const current = d.config || {}
      setCfg({
        client_id: current.client_id || '',
        client_secret: '',
        base_url: current.base_url || 'https://accounts.zoho.com',
        redirect_uri: current.redirect_uri || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/zoho/callback`
      })
    })
  }, [])

  async function saveCfg() {
    const r = await fetch('/api/zoho/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) })
    if (r.ok) toast.success('Zoho settings saved')
    else toast.error('Failed to save Zoho settings')
  }

  async function clearCfg() {
    await fetch('/api/zoho/settings', { method: 'DELETE' })
    toast.success('Cleared Zoho settings')
  }

  async function connect() {
    const r = await fetch('/api/zoho/auth-url')
    const d = await r.json()
    if (d.url) window.location.href = d.url
    else toast.error('Zoho config missing. Enter Client ID (and Secret) or set env vars.')
  }

  async function disconnect() {
    await fetch('/api/zoho/logout', { method: 'POST' })
    setConnected(false)
    setUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="rounded border bg-white p-6">
        <h2 className="text-lg font-semibold">Zoho CRM — Easy Setup</h2>
        <p className="text-sm text-neutral-600">Enter your Zoho details here. No need to edit environment variables.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block text-sm">
            Region (Accounts Base URL)
            <select className="mt-1 w-full rounded border p-2" value={cfg.base_url || ''} onChange={e => setCfg({ ...cfg, base_url: e.target.value })}>
              {['https://accounts.zoho.com', 'https://accounts.zoho.eu', 'https://accounts.zoho.in', 'https://accounts.zoho.com.au', 'https://accounts.zohocloud.ca'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Redirect URI
            <input className="mt-1 w-full rounded border p-2" value={cfg.redirect_uri || ''} onChange={e => setCfg({ ...cfg, redirect_uri: e.target.value })} />
          </label>
          <label className="block text-sm">
            Client ID
            <input className="mt-1 w-full rounded border p-2" value={cfg.client_id || ''} onChange={e => setCfg({ ...cfg, client_id: e.target.value })} placeholder="1000.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
          </label>
          <label className="block text-sm">
            Client Secret (optional but recommended)
            <input className="mt-1 w-full rounded border p-2" type="password" value={cfg.client_secret || ''} onChange={e => setCfg({ ...cfg, client_secret: e.target.value })} />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={saveCfg} className="rounded bg-black px-4 py-2 text-white">Save Zoho Settings</button>
          <button onClick={connect} className="rounded border px-4 py-2">Connect Zoho</button>
          <button onClick={clearCfg} className="rounded border px-4 py-2">Clear Settings</button>
        </div>

        <div className="mt-4 rounded border p-3">
          {!connected ? (
            <div className="text-sm text-neutral-700">
              Not connected. After saving Client ID (and Secret), click Connect Zoho to authorize.
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-green-700">Connected as {user?.email || 'Zoho User'}</span>
              <button onClick={disconnect} className="rounded border px-3 py-2">Disconnect</button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded border bg-white p-6">
        <h2 className="text-lg font-semibold">Export</h2>
        <p className="text-sm text-neutral-600">Export rendered HTML to your ESP or marketing automation platform.</p>
      </div>
    </div>
  )
}
