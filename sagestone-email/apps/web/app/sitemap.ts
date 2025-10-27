import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const routes = ['', '/features', '/pricing', '/blog', '/contact', '/legal/terms', '/legal/privacy']
  return routes.map((r) => ({ url: `${base}${r || '/'}`, changeFrequency: 'weekly', priority: r ? 0.7 : 1 }))
}
