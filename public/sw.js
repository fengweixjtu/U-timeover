// Minimal Service Worker for offline demo
var CACHE_NAME = 'u-timeover-cache-v1';
var urlsToCache = [
  '/', '/index.html', '/logo-192.png', '/logo-512.png', '/src/main.tsx'
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
