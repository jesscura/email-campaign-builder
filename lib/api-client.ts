import axios from 'axios'

const isProd = process.env.NODE_ENV === 'production'
const hasConfiguredApi = !!process.env.NEXT_PUBLIC_API_URL
const resolvedBaseUrl = hasConfiguredApi
  ? process.env.NEXT_PUBLIC_API_URL!
  : (isProd ? '' : 'http://localhost:4000')

export const apiConfigured = hasConfiguredApi || !isProd

export const api = axios.create({
  // In production without NEXT_PUBLIC_API_URL, avoid hitting localhost
  baseURL: resolvedBaseUrl || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Contacts API
export const contactsApi = {
  list: (workspaceId: string, page = 1, limit = 50) =>
    api.get(`/contacts`, { params: { workspaceId, page, limit } }),
  
  getStats: (workspaceId: string) =>
    api.get(`/contacts/stats`, { params: { workspaceId } }),
  
  create: (workspaceId: string, data: any) =>
    api.post(`/contacts`, { workspaceId, ...data }),
  
  import: (workspaceId: string, contacts: any[]) =>
    api.post(`/contacts/import`, { workspaceId, contacts }),
  
  update: (workspaceId: string, id: string, data: any) =>
    api.put(`/contacts/${id}`, data, { params: { workspaceId } }),
  
  delete: (workspaceId: string, id: string) =>
    api.delete(`/contacts/${id}`, { params: { workspaceId } }),
}

// Campaigns API
export const campaignsApi = {
  list: (workspaceId: string, page = 1, limit = 50) =>
    api.get(`/campaigns`, { params: { workspaceId, page, limit } }),
  
  getOne: (workspaceId: string, id: string) =>
    api.get(`/campaigns/${id}`, { params: { workspaceId } }),
  
  getStats: (workspaceId: string, id: string) =>
    api.get(`/campaigns/${id}/stats`, { params: { workspaceId } }),
  
  create: (workspaceId: string, data: any) =>
    api.post(`/campaigns`, { workspaceId, ...data }),
  
  update: (workspaceId: string, id: string, data: any) =>
    api.put(`/campaigns/${id}`, data, { params: { workspaceId } }),
  
  delete: (workspaceId: string, id: string) =>
    api.delete(`/campaigns/${id}`, { params: { workspaceId } }),
  
  schedule: (workspaceId: string, id: string, sendAt: string) =>
    api.post(`/campaigns/${id}/schedule`, { sendAt }, { params: { workspaceId } }),
}

// Workspaces API
export const workspacesApi = {
  list: (userId: string) =>
    api.get(`/workspaces`, { params: { userId } }),
}
