/* AulaFinder V52 originali · cache offline resistente agli upload parziali.
   La vecchia precache obbligatoria di >100 file poteva fallire se GitHub
   riceveva un upload parziale. Risorse sempre aggiornate dalla rete; cache fallback offline. */
const CACHE_PREFIX = 'aulafinder-pwa-';
const CACHE_NAME = 'aulafinder-pwa-v52-originali-2';
const CORE = [
  './index.html', './style.css', './piantina.css',
  './v48.css', './v49.css', './v50.css', './v51.css', './v52.css',
  './data.js', './admin-data.js', './admin-ui.js',
  './config-docenti.js', './script.js', './map-orientation.js',
  './piantina.js', './navigator.js', './footer.js', './pwa.js',
  './loading.js', './finder.js', './tutorial-v52.js',
  './versioni.js', './v48-ui.js', './v49-ui.js',
  './v50-ui.js', './v51-ui.js', './v52-ui.js'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Un solo 404 non deve impedire l'attivazione di una nuova versione.
    await Promise.allSettled(CORE.map(async path => {
      const response = await fetch(path, {cache: 'reload'});
      if (!response.ok) throw new Error(`Impossibile precaricare ${path}: ${response.status}`);
      await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  // Il browser gestisce direttamente i Range dei video; non interferiamo.
  if (request.headers.has('range') || /\.(?:mp4|webm)$/i.test(url.pathname)) return;
  event.respondWith((async () => {
    try {
      // Network-first: non serviamo vecchi CSS/JS dopo un nuovo deploy.
      const network = await fetch(request);
      if (network.ok && network.type !== 'opaque') {
        const cache = await caches.open(CACHE_NAME);
        // Il caching non deve rallentare o compromettere la risposta della pagina.
        event.waitUntil(cache.put(request, network.clone()).catch(() => {}));
      }
      return network;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const home = await caches.match('./index.html');
        if (home) return home;
      }
      return Response.error();
    }
  })());
});
