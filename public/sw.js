const CACHE_NAME = 'streamb4-v3'

// Static file extensions that are safe to cache
const STATIC_EXTENSIONS = /\.(js|css|woff|woff2|ttf|otf|eot|ico|png|jpg|jpeg|gif|webp|avif|svg|json)$/i

// Install — nothing to pre-cache, just activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

// Activate — delete ALL old caches, then claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

// Fetch — cache ONLY static assets; let everything else pass through untouched
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // --- Pass through without touching ---

  // Non-GET
  if (request.method !== 'GET') return

  // App Router RSC navigation requests (any of these headers or params)
  if (url.searchParams.has('_rsc')) return
  if (request.headers.get('RSC') === '1') return
  if (request.headers.get('Next-Router-Prefetch') === '1') return
  if (request.headers.get('Next-Router-State-Tree')) return
  if (request.headers.get('Next-Router-Segment-Prefetch')) return

  // Next.js internal routes (_next/data, _next/static HMR, etc.)
  if (url.pathname.startsWith('/_next/')) return

  // API and admin
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/admin')) return

  // HTML documents — let Next.js serve fresh every time
  const acceptHeader = request.headers.get('Accept') || ''
  if (acceptHeader.includes('text/html')) return

  // --- Cache static assets only ---
  if (!STATIC_EXTENSIONS.test(url.pathname)) return

  // Cache-first for matched static assets
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached

      return fetch(request).then(response => {
        if (response.ok && response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
