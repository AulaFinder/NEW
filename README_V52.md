# V52 ricostruita dalla V51 senza conversioni delle immagini e dei video originali

Consulta `README_V52_RIFATTA.md` e `VERIFICHE_V52_RIFATTA.md` per il rilascio corrente, la pubblicazione semplice e i limiti delle verifiche.

---

# AulaFinder V52 · Note di rilascio

**Versione:** V52 · 19 novembre 2026.  **Sorgente:** AulaFinder V51 consegnata dall’utente.  **Cartella:** `AulaFinderV52/`.

## Novità implementate

1. **Aspetto e fluidità.** Effetto aurico sfumato in header, sidebar, Home e footer. Componenti Orari, pulsanti Aule libere e Professori liberi uniformati nel gradiente e nella forma. Contrasti differenziati per tema chiaro e scuro. Eliminati i contorni ciano e le doppie cornici da ricerca Versioni, campi Orari, Navigator e controlli di Home. I controlli da tastiera mantengono un’indicazione discreta color ambra.
2. **Logo e ingresso.** Ingrandimento del logo principale da 520 a 780 ms, bordo del dialog eliminato. Video di ingresso blend sul gradiente anche da mobile, senza effetti acqua né suoni.
3. **Piantine.** Fullscreen visualizzato in forma centrata, zoom fino al 320% e scorrimento multidirezionale; colori del cartello Ingresso copiati dall’originale, inclusi i temi.
4. **Tutorial.** Un’unica demo vera del sito in `iframe`, caricata on-demand, con sette passaggi, descrizioni e limitazione della navigazione fuori dal passaggio corrente. Eliminati i pannelli di demo duplicati. Centrati i sette pulsanti e il segno di espansione nelle FAQ.
5. **Navigatore.** Percorso primariamente ricavato da una rete di assi centrali dei corridoi con segmenti controllati sulla superficie SVG; mantenuto il percorso preesistente come fallback per casi irraggiungibili nel grafo. Simboli di partenza/arrivo centrati nella geometria delle aule. Ricorda: il tracciato è orientativo, non un percorso di sicurezza.
6. **Versioni.** Ricerche evidenziate nel titolo, nell’anteprima del contenuto e nella descrizione di ogni versione aperta. Logo aggiunto alle miniature e anteprima V52. Totale 52 versioni. Rimosso il disclaimer richiesto.
7. **Finder.** Finestra con animazioni GPU-friendly e posizione ridimensionabile della V51 mantenuta. Nuova puntina nell’intestazione per bloccare/sbloccare la posizione dell’orb (salvata nel dispositivo). Orb originale in loop, trasparenza conservata nella versione WebM. Finder non usa un modello AI remoto: interpreta localmente le domande sugli orari.
8. **Admin.** Il pulsante è collocato in basso a destra nel footer; la console mantiene modifica delle lezioni, verifica conflitti, import/export JSON e include ora la panoramica di classi, aule, docenti e ultime modifiche locali.
9. **Performance.** Orb originale VP9 trasparente ottimizzato da ~7,4 a ~0,95 MiB; fallback MP4, video intro da ~4,5 a ~0,35 MiB. Ritratti ed elementi grafici alleggeriti tramite WebP; cache PWA `aulafinder-pwa-v52`. CSS animazioni ridotte se attiva la preferenza di sistema per il movimento ridotto.

## Pubblicazione GitHub Pages

1. Estrai il file ZIP.
2. **Carica i file contenuti in `AulaFinderV52/` direttamente alla radice del repository `AulaFinder`**, non la cartella esterna, se vuoi che il sito rimanga accessibile all’URL preesistente.
3. Conserva nomi e maiuscole/minuscole, incluso `.nojekyll`, `index.html`, `sw.js`, `manifest.webmanifest`, tutte le cartelle `assets/` e `icons/` e tutti i CSS/JS/JSON.
4. In GitHub vai su **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. Attendi la pubblicazione da parte di GitHub e apri il tuo URL HTTPS.
5. Per aggiornare una precedente PWA, ricarica con connessione Internet; se necessario chiudi e riapri la PWA per attivare il nuovo Service Worker.
6. In locale preferisci un server HTTP: da dentro la cartella `AulaFinderV52`, avvia `python -m http.server 8000` e apri `http://localhost:8000/`. L’apertura via `file://` limita iframe, permessi e microfono.
7. **Dopo la pubblicazione, verifica su Android e iPhone reali** il tutorial embedded, il riconoscimento vocale, il fullscreen delle mappe, l’orb VP9 e la cache offline.

## Sicurezza e limiti

- La password dimostrativa Admin `kiwi` è presente nel frontend e **non autentica in modo sicuro** nessun utente: non usare l’Admin per dati sensibili. Le modifiche sono solo nel `localStorage` del dispositivo, trasferibili via file JSON. Nessuna modifica viene distribuita automaticamente a tutti i visitatori.
- Gli orari sono dati caricati, non aggiornamenti automatici in tempo reale. La disponibilità di aula/professore è solo dedotta dai calendari.
- Finder è un assistente locale a regole e ricerca sui dati, non un chatbot con API AI. Il microfono funziona soltanto nei browser compatibili e con autorizzazione.
- Il test automated in Chromium usa un documento locale generato dai sorgenti effettivi perché la navigazione diretta verso un sito HTTP è limitata nell’ambiente di prova; non equivale a un test integrato su GitHub Pages.

Per i riscontri puntuali consulta `VERIFICHE_V52.md`. I file storici V51 e anteriori sono mantenuti.
