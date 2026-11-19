# AulaFinder V52 · Risorse originali (senza ricompressione)

Questa è la **V52 completa** con le funzionalità e gli stili della V52, ma con i file grafici/video originali e a piena qualità della V51.

## Cosa è stato ripristinato
- `assets/finder-orb.webm`: stesso identico file orb originale fornito dall'utente (`orb(3).webm`).
- `assets/finder-orb-loop.mp4`, `assets/aulafinder-caricamento.mp4`: video originali V51.
- `assets/logo-aulafinder.png`, `assets/liceo-grassi-carboncino.png`: immagini PNG originali V51.
- `assets/avatar_edo.png`, `assets/avatar_fiadi.png`, `assets/avatar_fuso.png`, `assets/avatar_lona.png`: ritratti PNG originali V51.
- Tutti i riferimenti nell'HTML e in Versioni puntano nuovamente ai PNG; le rispettive conversioni WebP aggiunte in V52 sono state rimosse.
- Restano le anteprime WebP delle versioni V1–V52 (già parte dell'archivio), e i poster e icone del Finder preesistenti: non sono sostituzioni dei PNG originali.
- `sw.js` aggiornato: non blocca l'installazione offline se una singola risorsa manca e dà precedenza ai file online, per evitare CSS e JS vecchi. Nessuna trasformazione dei media in fase di utilizzo.

## Pubblicazione su GitHub Pages (metodo normale)
1. Estrarre lo ZIP sul computer.
2. Aprire la cartella `AulaFinderV52` **dentro** lo ZIP.
3. Caricare nella radice del repository il **contenuto** di `AulaFinderV52`, incluso `index.html`, cartella `assets`, cartella `icons`, `.nojekyll`, CSS e JavaScript. Non caricare solo lo ZIP.
4. In GitHub, Settings > Pages: Source = Deploy from a branch, Branch = main, Folder = /(root). (Se si usa il vecchio workflow ZIP/GitHub Actions, disattivarlo prima: i due sistemi di pubblicazione non vanno mescolati.)
5. Verificare che in Actions/Pages la pubblicazione sia conclusa. Se risorse vecchie persistono, ricaricare con Ctrl+Shift+R o eliminare i dati del sito nel browser per rimuovere la vecchia service worker cache. L'Admin salva dati nel browser: cancellarli può azzerare modifiche locali!

**Importante:** uno ZIP da ~30 MB non prova che il caricamento online sia corretto. Se su Pages manca anche un file o resta attiva una pubblicazione diversa, il sito può comunque rompersi. Il collaudo sul dominio pubblico richiede la pubblicazione reale.
