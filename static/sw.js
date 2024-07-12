// THIS FILE SHOULD NOT BE VERSION CONTROLLED

// https://github.com/NekR/self-destroying-sw

const CACHE_NAME = `api-cache-${version}`;

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== CACHE_NAME) {
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
        return response || fetch(event.request);
      })
  );
});

// 업데이트 감지
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
