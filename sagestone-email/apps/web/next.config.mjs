/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  eslint: { ignoreDuringBuilds: true },
  output: 'standalone'
}

export default nextConfig
