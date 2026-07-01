const CACHE_NAME = 'streamb4-v2'
// Only cache guaranteed static routes - NOT dynamic pages like /blog
const STATIC_ASSETS = [
  '/',
  '/offline',
]

// Install - use individual try/catch so one 404 doesn't break everything
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(() => {
            // Silently ignore individual asset failures
          })
        )
      )
    ).then(() => self.skipWaiting())
  )
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch — cache first for static, network first for API
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and API routes
  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/admin')) return

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached

      return fetch(request)
        .then(response => {
          // Cache successful GET requests
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, clone))
          }
          return response
        })
        .catch(() => {
          // Return offline page
          return caches.match('/offline')
        })
    })
  )
})
