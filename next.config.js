/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  env: {
    CUSTOM_KEY: 'shelf-intelligence-agent',
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig