import crypto from 'crypto'
import { NextRequest } from 'next/server'

export type ZohoConfig = {
  client_id?: string
  client_secret?: string
  redirect_uri?: string
  base_url?: string
}

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || ''
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || ''
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || ''
const ZOHO_BASE_URL = process.env.ZOHO_BASE_URL || 'https://accounts.zoho.com'
const ENC_SECRET = process.env.ENCRYPTION_SECRET || 'dev-secret-unsafe'

function enc(data: any) {
  const iv = crypto.randomBytes(16)
  const key = crypto.createHash('sha256').update(ENC_SECRET).digest()
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  const enc = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]).toString('base64')
  return `${iv.toString('base64')}.${enc}`
}
function dec(token: string) {
  const [ivb64, data] = token.split('.')
  const iv = Buffer.from(ivb64, 'base64')
  const key = crypto.createHash('sha256').update(ENC_SECRET).digest()
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  const str = Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8')
  return JSON.parse(str)
}

const ZOHO_CFG_COOKIE = 'zoho_cfg'
export function readZohoConfig(req: NextRequest): ZohoConfig | null {
  const c = req.cookies.get(ZOHO_CFG_COOKIE)?.value
  if (!c) return null
  try { return dec(c) } catch { return null }
}
export function setZohoConfigCookie(cfg: ZohoConfig) {
  return `${ZOHO_CFG_COOKIE}=${enc(cfg)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
}
export function clearZohoConfigCookie() {
  return `${ZOHO_CFG_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

const SESSION_COOKIE = 'zoho_session'
export function setTokenCookie(tokens: any) {
  const payload = { access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_in: Date.now() + (tokens.expires_in || 3600) * 1000 }
  return `${SESSION_COOKIE}=${enc(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
}
export function clearTokenCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}
export function readSession(req: NextRequest): { access_token?: string; refresh_token?: string; expires_in?: number } | null {
  const c = req.cookies.get(SESSION_COOKIE)?.value
  if (!c) return null
  try { return dec(c) } catch { return null }
}

function resolveConfig(req?: NextRequest): Required<ZohoConfig> | null {
  const ui = req ? readZohoConfig(req) : null
  const client_id = ui?.client_id || ZOHO_CLIENT_ID
  const client_secret = ui?.client_secret || ZOHO_CLIENT_SECRET
  const redirect_uri = ui?.redirect_uri || ZOHO_REDIRECT_URI
  const base_url = ui?.base_url || ZOHO_BASE_URL
  if (!client_id) return null
  return { client_id, client_secret, redirect_uri, base_url }
}

export function getAuthUrl(req: NextRequest) {
  const cfg = resolveConfig(req)
  if (!cfg?.client_id) return null
  const scope = encodeURIComponent(['ZohoCRM.modules.ALL', 'ZohoCRM.settings.ALL'].join(','))
  return `${cfg.base_url}/oauth/v2/auth?response_type=code&client_id=${cfg.client_id}&scope=${scope}&redirect_uri=${encodeURIComponent(cfg.redirect_uri)}&access_type=offline&prompt=consent`
}

export async function exchangeCode(code: string, req: NextRequest) {
  const cfg = resolveConfig(req)
  if (!cfg) return { error: 'Missing Zoho config' }
  const url = `${cfg.base_url}/oauth/v2/token?grant_type=authorization_code&client_id=${cfg.client_id}&client_secret=${cfg.client_secret}&redirect_uri=${encodeURIComponent(cfg.redirect_uri)}&code=${encodeURIComponent(code)}`
  const r = await fetch(url, { method: 'POST' })
  return await r.json()
}

export async function refreshToken(refresh_token: string, req: NextRequest) {
  const cfg = resolveConfig(req)
  if (!cfg) return { error: 'Missing Zoho config' }
  const url = `${cfg.base_url}/oauth/v2/token?grant_type=refresh_token&client_id=${cfg.client_id}&client_secret=${cfg.client_secret}&refresh_token=${encodeURIComponent(refresh_token)}`
  const r = await fetch(url, { method: 'POST' })
  return await r.json()
}

async function ensureAccessToken(session: any, req: NextRequest): Promise<string | null> {
  if (!session) return null
  if (session.expires_in && session.expires_in > Date.now() + 60_000) return session.access_token
  if (session.refresh_token) {
    const d = await refreshToken(session.refresh_token, req)
    if ((d as any).access_token) return (d as any).access_token
  }
  return session.access_token || null
}

export async function zohoApi(req: NextRequest, path: string) {
  const cfg = resolveConfig(req)
  if (!cfg?.client_id) {
    if (path === '/crm/v3/settings/modules') {
      return { modules: [{ api_name: 'Leads', module_name: 'Leads' }, { api_name: 'Contacts', module_name: 'Contacts' }] }
    }
    if (path.startsWith('/crm/v3/settings/fields')) {
      return { fields: [{ api_name: 'First_Name', field_label: 'First Name' }, { api_name: 'Last_Name', field_label: 'Last Name' }, { api_name: 'Company', field_label: 'Company' }] }
    }
    if (path === '/userinfo') {
      return { email: 'mock@zoho.local' }
    }
    return {}
  }

  const session = readSession(req)
  const access = await ensureAccessToken(session, req)
  if (!access) throw new Error('No access token; connect Zoho in Settings')

  const apiBase = 'https://www.zohoapis.com'
  const r = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Zoho-oauthtoken ${access}` } })
  if (!r.ok) throw new Error(`Zoho error: ${r.status}`)
  return await r.json()
}
