/* AulaFinder PWA: caching statico per la consultazione offline.
   Gli orari vengono inclusi perché sono già nei file JS; non sono dati in tempo reale.
   A ogni pubblicazione di una nuova versione, aggiornare il nome cache. */
const CACHE_PREFIX = 'aulafinder-pwa-';
const CACHE_NAME = 'aulafinder-pwa-v49';
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
  "./finder.js",
  "./tutorial.js",
  "./versioni.js",
  "./v48-ui.js",
  "./v48.css",
  "./v49-ui.js",
  "./v49.css",
  "./versioni-data.json",
  "./assets/finder-orb-loop.mp4",
  "./assets/finder-orb-loop.webp",
  "./assets/aulafinder-open.wav",
  "./assets/finder-icon.png",
  "./assets/versioni-home/V1.webp",
  "./assets/versioni-home/V2.webp",
  "./assets/versioni-home/V3.webp",
  "./assets/versioni-home/V4.webp",
  "./assets/versioni-home/V5.webp",
  "./assets/versioni-home/V6.webp",
  "./assets/versioni-home/V7.webp",
  "./assets/versioni-home/V8.webp",
  "./assets/versioni-home/V9.webp",
  "./assets/versioni-home/V10.webp",
  "./assets/versioni-home/V11.webp",
  "./assets/versioni-home/V12.webp",
  "./assets/versioni-home/V13.webp",
  "./assets/versioni-home/V14.webp",
  "./assets/versioni-home/V15.webp",
  "./assets/versioni-home/V16.webp",
  "./assets/versioni-home/V17.webp",
  "./assets/versioni-home/V18.webp",
  "./assets/versioni-home/V19.webp",
  "./assets/versioni-home/V20.webp",
  "./assets/versioni-home/V21.webp",
  "./assets/versioni-home/V22.webp",
  "./assets/versioni-home/V23.webp",
  "./assets/versioni-home/V24.webp",
  "./assets/versioni-home/V25.webp",
  "./assets/versioni-home/V26.webp",
  "./assets/versioni-home/V27.webp",
  "./assets/versioni-home/V28.webp",
  "./assets/versioni-home/V29.webp",
  "./assets/versioni-home/V30.webp",
  "./assets/versioni-home/V31.webp",
  "./assets/versioni-home/V32.webp",
  "./assets/versioni-home/V33.webp",
  "./assets/versioni-home/V34.webp",
  "./assets/versioni-home/V35.webp",
  "./assets/versioni-home/V36.webp",
  "./assets/versioni-home/V37.webp",
  "./assets/versioni-home/V38.webp",
  "./assets/versioni-home/V39.webp",
  "./assets/versioni-home/V40.webp",
  "./assets/versioni-home/V41.webp",
  "./assets/versioni-home/V42.webp",
  "./assets/versioni-home/V43.webp",
  "./assets/versioni-home/V44.webp",
  "./assets/versioni-home/V45.webp",
  "./assets/versioni-home/V46.webp",
  "./assets/versioni-home/V47.webp",
  "./assets/versioni-home/V48.webp",
  "./assets/versioni-home/V49.webp",
  "./assets/versioni-home/V8a.webp",
  "./assets/versioni-home/V8b.webp",
  "./assets/finder-orb.webm",
  "./sitemap.xml",
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
