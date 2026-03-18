import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    rules: {
      '**/*.{tsx,jsx}': {
        loaders: [
          {
            loader: '@locator/webpack-loader',
            options: { env: 'development' },
          },
        ],
      },
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules.push({
        test: /\.(tsx|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre' as const,
        use: [
          {
            loader: '@locator/webpack-loader',
            options: { env: 'development' },
          },
        ],
      })
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/otc-uat/:path*',
        destination: '/otc-uat/:path*',
      },
    ]
  },
}

export default withNextIntl(nextConfig)
