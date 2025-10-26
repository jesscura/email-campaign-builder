/** @type {import('next').NextConfig} */
const nextConfig = {
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