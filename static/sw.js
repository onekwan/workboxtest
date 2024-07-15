// THIS FILE SHOULD NOT BE VERSION CONTROLLED

// https://github.com/NekR/self-destroying-sw

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== 'api-cache') {
                return caches.delete(cacheName);
              }
            })
        );
      })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open('api-cache').then((cache) => {
            cache.put(event.request, responseToCache).catch((error) => {
              console.error('Failed to cache:', error);
            });
          });
          return networkResponse;
        });
      }).catch((error) => {
        console.error('Fetch failed:', error);
        throw error;
      })
  );
});
