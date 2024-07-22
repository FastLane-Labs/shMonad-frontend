/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory',
      })
      config.cache.maxMemoryGenerations = 0
    }
    return config
  },
  images: {
    remotePatterns: [{ hostname: '*' }],
  },
}

module.exports = nextConfig
