/* Registra la PWA senza modificare l'interfaccia di AulaFinder. */
(() => {
  if (!('serviceWorker' in navigator)) return;
  // Il protocollo file:// non supporta i service worker; HTTP localhost e HTTPS sì.
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope:'./'})
      .then(registration => {
        // Verifica la disponibilità di nuove versioni alle visite successive.
        if (navigator.onLine) registration.update().catch(() => {});
      })
      .catch(error => console.warn('Installazione offline non disponibile:', error));
  });
})();
