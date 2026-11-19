# Verifiche AulaFinder V52 ricostruita

**Base effettiva:** `AulaFinderV51.zip`. Le funzioni V52 richieste sono state riportate sulla struttura V51, preservando risorse multimediali e dati scolastici esistenti.

## Verifiche superate in questo ambiente

- 153 file del sito prima della creazione di questo report, inclusi `index.html`, `.nojekyll`, `manifest.webmanifest`, CSS e JS della V52.
- 46 riferimenti di risorse dell'HTML trovati nel pacchetto.
- 3 riferimenti `url()` nei CSS trovati nel pacchetto.
- 21 file JavaScript: controllo sintattico Node superato.
- 86 immagini (PNG/JPEG/WebP, comprese miniature storiche): controllo integrità superato.
- 3 video (MP4/WebM): metadati verificati con ffprobe.
- 13 file principali in `assets/` della V51: corrispondenza SHA-256 esatta. Nessuna ricompressione dei file originali.
- DOM in memoria con Chromium: navigazione Home, Orari, Navigatore, Versioni, Tutorial, Piantine, Admin; Finder aperto e controllo posizione presente; tutorial progredisce; ricerca storico funzionante; nessuna eccezione JavaScript osservata nei test dopo il caricamento.
- Percorsi sintetici del Navigatore da T.01 a T.02 e da 1.01 a 2.01: messaggio di successo e disegno SVG generato su layout 1366px e 390px, senza eccezioni.
- Layout DOM senza overflow orizzontale nei viewport 1366px e 390px nel test in memoria.

## Limiti del collaudo

Il browser di questo ambiente vieta la navigazione HTTP/file (errore `ERR_BLOCKED_BY_ADMINISTRATOR`), quindi gli script sono stati eseguiti su DOM in memoria. **Non è un test completo di rete, caricamento reale delle immagini, iframe tutorial su HTTPS, permessi microfono o PWA installata.** Non si può garantire il comportamento sul repository GitHub già pubblicato senza una successiva verifica online.

## Misure contro le immagini mancanti

- Ripristino integrale dei file PNG, JPG e WebM originali dalla V51, non convertiti.
- URL versionati nelle risorse referenziate direttamente dall'HTML per evitare vecchie copie CSS, JS e immagini nel browser.
- Service worker rinnovato: rete prioritaria, aggiornamento non bloccato da un singolo 404, cache offline solo come fallback e gestione normale della cache HTTP per le immagini.
- Un solo tentativo di ricaricamento con URL aggiornato se un'immagine locale segnala errore di caricamento.

## Pubblicazione

Caricare **il contenuto** della cartella `AulaFinderV52` nella radice del repository `AulaFinder/V52` con GitHub Desktop (conservare `.git`). Impostare GitHub Pages su `main` → `/(root)`. Non usare l'obsoleto workflow `pubblica.yml` dei pacchetti precedenti.
