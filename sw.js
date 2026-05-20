const CACHE_NAME = 'anexo-v-app-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar o Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(URLS_TO_CACHE).catch(() => {
          // Se falla, simplemente continúa
          return Promise.resolve();
        });
      })
      .catch(() => {
        // Se falla, simplemente continúa
        return Promise.resolve();
      })
  );
  self.skipWaiting();
});

// Usar o cache
self.addEventListener('fetch', (event) => {
  // Non cachear request POST
  if (event.request.method === 'POST') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
          .catch(() => {
            // Se falla a rede, devolver páxina offline
            return new Response('Offline - Conectate a internet para máis opcións', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Limpiar cache antiga
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
});
