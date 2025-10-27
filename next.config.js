/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Do not fail production builds on ESLint errors.
    // We still run lint in CI, but builds won't be blocked.
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark mjml as external to avoid bundling it
      config.externals = [...(config.externals || []), 'mjml']
    }
    return config
  }
}
module.exports = nextConfig