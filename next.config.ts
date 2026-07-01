import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow local network devices (phone, tablet) to access dev server
  allowedDevOrigins: [
    '192.168.22.130',
    '192.168.22.*',
    '192.168.*.*',
    '10.*.*.*',
    '172.16.*.*',
  ],

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'image.pollinations.ai' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'streamb4.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,
  poweredByHeader: false,

  // Headers for security + performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            // Strict-Transport-Security: force HTTPS for 1 year in production
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
        ],
      },
      {
        // Cache static assets
        source: '/(.*)\\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Cache API responses
        source: '/api/rss',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate'
          }
        ]
      }
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin/dashboard',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/feed',
        destination: '/api/rss',
        permanent: true,
      }
    ]
  },

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'framer-motion',
      'recharts',
      'lucide-react',
      '@uiw/react-md-editor',
    ],
  },
}

export default nextConfig
