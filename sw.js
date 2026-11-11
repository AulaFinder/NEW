/* AulaFinder PWA: caching statico per la consultazione offline.
   Gli orari vengono inclusi perché sono già nei file JS; non sono dati in tempo reale.
   A ogni pubblicazione di una nuova versione, aggiornare il nome cache. */
const CACHE_PREFIX = 'aulafinder-pwa-';
const CACHE_NAME = 'aulafinder-pwa-v36-maps-navigation';
const APP_SHELL = [
  "./index.html",
  "./style.css",
  "./piantina.css",
  "./data.js",
  "./config-docenti.js",
  "./script.js",
  "./map-orientation.js",
  "./piantina.js",
  "./navigator.js",
  "./footer.js",
  "./pwa.js",
  "./loading.js",
  "./assets/aulafinder-caricamento.jpg",
  "./manifest.webmanifest",
  "./assets/logo-aulafinder.png",
  "./assets/liceo-grassi-carboncino.png",
  "./assets/avatar_edo.png",
  "./assets/avatar_fiadi.png",
  "./assets/avatar_fuso.png",
  "./assets/avatar_lona.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon-180.png"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  // File MP4: lascia al browser le richieste Range (206) necessarie alla riproduzione.
  if (request.headers.has('range') || new URL(request.url).pathname.endsWith('.mp4')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Keep requests outside the app's actual folder untouched.
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy)));
        }
        return response;
      }).catch(async () => {
        const cached = await caches.match('./index.html');
        return cached || Response.error();
      })
    );
    return;
  }

  // All bundled code and images are cached to make the whole app usable offline.
  event.respondWith(
    caches.match(request, {ignoreSearch:true}).then(cached => cached || fetch(request).then(response => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy)));
      }
      return response;
    }))
  );
});
