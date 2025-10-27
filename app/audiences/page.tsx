'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { contactsApi } from '@/lib/api-client'

interface ContactStats {
  total: number
  subscribed: number
  unsubscribed: number
  bounced: number
}

export default function AudiencesPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<ContactStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock workspace ID - in production, fetch from user's workspace
  const workspaceId = 'demo-workspace-id'

  useEffect(() => {
    if (!session) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await contactsApi.getStats(workspaceId)
        setStats(response.data)
      } catch (err: any) {
        console.error('Failed to fetch contact stats:', err)
        setError(err.response?.data?.message || 'Failed to load audience data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [session, workspaceId])

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <p className="text-center text-gray-600">Please sign in to view audiences.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audiences</h1>
          <p className="text-gray-600 mt-1">Manage your contacts and segments</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Import Contacts
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure the API server is running on port 4000
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Total Contacts</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.total.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Subscribed</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats?.subscribed.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Unsubscribed</h3>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                {stats?.unsubscribed.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Bounced</h3>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {stats?.bounced.toLocaleString() || 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contact Lists</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Contact list management coming soon. You can import contacts using the API.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Segments</h2>
              <button className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                Create Segment
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                No segments created yet. Segments help you target specific groups of contacts.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
