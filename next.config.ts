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
      },
      {
        source: '/uk',
        destination: '/united-kingdom',
        permanent: true,
      },
      // Fixed legacy draft redirect
      {
        source: '/blog/draft-1784162544682',
        destination: '/sports',
        permanent: true,
      },
      // Apple TV
      {
        source: '/blog/best-iptv-apps-for-apple-tv-2026',
        destination: '/iptv/apple-tv',
        permanent: true,
      },
      {
        source: '/blog/how-to-watch-iptv-on-apple-tv',
        destination: '/iptv/apple-tv',
        permanent: true,
      },
      {
        source: '/blog/apple-tv-4k-live-sports-guide-2026',
        destination: '/iptv/apple-tv',
        permanent: true,
      },
      // Samsung Smart TV (Tizen OS)
      {
        source: '/blog/best-iptv-apps-samsung-smart-tv-2026',
        destination: '/iptv/samsung-tv',
        permanent: true,
      },
      {
        source: '/blog/how-to-set-up-iptv-on-samsung-smart-tv-2026',
        destination: '/iptv/samsung-tv',
        permanent: true,
      },
      {
        source: '/blog/iptv-auf-samsung-smart-tv-2026',
        destination: '/iptv/samsung-tv',
        permanent: true,
      },
      // LG Smart TV (webOS)
      {
        source: '/blog/best-iptv-apps-lg-smart-tv-2026',
        destination: '/iptv/lg-tv',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-apps-for-lg-smart-tv-2026',
        destination: '/iptv/lg-tv',
        permanent: true,
      },
      // Android TV / Google TV
      {
        source: '/blog/best-iptv-for-android-tv-2026',
        destination: '/iptv/android-tv',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-players-for-android-tv-in-2026-compared-ranked',
        destination: '/iptv/android-tv',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-apps-for-google-tv-in-2026-tested-ranked',
        destination: '/iptv/android-tv',
        permanent: true,
      },
      // Firestick / Fire TV
      {
        source: '/blog/best-iptv-service-firestick-2026',
        destination: '/iptv/firestick',
        permanent: true,
      },
      {
        source: '/blog/how-to-watch-premier-league-on-firestick',
        destination: '/iptv/firestick',
        permanent: true,
      },
      {
        source: '/blog/best-firestick-apps-for-live-tv-in-2026-compared-ranked',
        destination: '/iptv/firestick',
        permanent: true,
      },
      {
        source: '/blog/install-streamb4-firestick',
        destination: '/iptv/firestick',
        permanent: true,
      },
      {
        source: '/blog/firestick-jailbreak-safer-steps-2026',
        destination: '/iptv/firestick',
        permanent: true,
      },
      {
        source: '/blog/install-streamb4-smart-tv',
        destination: '/install',
        permanent: true,
      },
      // Devices
      {
        source: '/blog/best-devices-iptv-streaming-2026',
        destination: '/devices',
        permanent: true,
      },
      {
        source: '/blog/best-streaming-devices-canada-2026',
        destination: '/devices',
        permanent: true,
      },
      {
        source: '/blog/nvidia-shield-iptv',
        destination: '/iptv/nvidia-shield',
        permanent: true,
      },
      {
        source: '/blog/iptv-windows-pc',
        destination: '/iptv/windows-pc',
        permanent: true,
      },
      // Troubleshooting & Features
      {
        source: '/blog/fix-iptv-buffering-issues-2026',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/vpn-streamb4-privacy-guide',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/4k-streaming-guide-2026',
        destination: '/features',
        permanent: true,
      },
      // Canada
      {
        source: '/blog/is-iptv-safe-to-use-in-canada',
        destination: '/canada',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-for-canada-2026-complete-guide-for-canadian',
        destination: '/canada',
        permanent: true,
      },
      {
        source: '/blog/iptv-canada',
        destination: '/canada',
        permanent: true,
      },
      {
        source: '/blog/affordable-streaming-canada-2026',
        destination: '/canada',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-alternatives-canada-2026',
        destination: '/canada',
        permanent: true,
      },
      // USA
      {
        source: '/blog/is-iptv-legal-in-the-usa-the-complete-2026-guide',
        destination: '/usa',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-for-usa-2026',
        destination: '/usa',
        permanent: true,
      },
      {
        source: '/blog/iptv-usa',
        destination: '/usa',
        permanent: true,
      },
      // United Kingdom
      {
        source: '/blog/iptv-uk',
        destination: '/united-kingdom',
        permanent: true,
      },
      {
        source: '/blog/iptv-london',
        destination: '/united-kingdom',
        permanent: true,
      },
      {
        source: '/blog/iptv-manchester',
        destination: '/united-kingdom',
        permanent: true,
      },
      // Sports
      {
        source: '/blog/best-sports-iptv-providers-2026',
        destination: '/sports',
        permanent: true,
      },
      {
        source: '/blog/the-complete-guide-to-live-tv-streaming-in-2026',
        destination: '/sports',
        permanent: true,
      },
      {
        source: '/blog/best-streaming-services-world-cup-2026',
        destination: '/sports',
        permanent: true,
      },
      {
        source: '/blog/the-complete-world-cup-2026-streaming-guide-how-to-watch-every-match-live-in-4k',
        destination: '/sports',
        permanent: true,
      },
      {
        source: '/blog/fifa-world-cup-2026-live-stream',
        destination: '/sports',
        permanent: true,
      },
      {
        source: '/blog/watch-live-sports-streamb4',
        destination: '/sports',
        permanent: true,
      },
      // Commercial Comparisons & FAQ
      {
        source: '/blog/streamb4-vs-cable-tv-2026',
        destination: '/best-iptv-service',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-in-2026-top-iptv-services-compared-for-streaming-sports-4k',
        destination: '/best-iptv-service',
        permanent: true,
      },
      {
        source: '/blog/best-iptv-service-providers-2026',
        destination: '/best-iptv-service',
        permanent: true,
      },
      {
        source: '/blog/best-premium-iptv-2026',
        destination: '/best-iptv-service',
        permanent: true,
      },
      {
        source: '/blog/iptv-alternatives',
        destination: '/best-iptv-service',
        permanent: true,
      },
      {
        source: '/blog/what-is-iptv-guide-2026',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/blog/meilleur-iptv-france-2026',
        destination: '/blog/guide-iptv-france-debuter-2026',
        permanent: true,
      },
      {
        source: '/blog/streamb4-reseller-program-guide',
        destination: '/reseller',
        permanent: true,
      },
    ]
  },

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'framer-motion',
      'recharts',
      'lucide-react',
      'react-icons',
      '@uiw/react-md-editor',
      '@uiw/react-markdown-preview',
      'date-fns',
    ],
  },
}

export default nextConfig
