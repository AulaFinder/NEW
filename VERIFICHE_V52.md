# AulaFinder V52 · Verifiche tecniche

**Data:** 19 novembre 2026. **Base:** V51 fornita dall’utente.

## Verifiche eseguite

- Smoke test Chromium con sorgenti effettivi iniettati in un documento locale (viewport **1366 × 900** e **390 × 844**). In entrambi: Home caricata, Finder aperto e posizione bloccata, tutorial di sette tappe con iframe reale e navigazione al Navigator, Versioni con 52 elementi e risultati evidenziati, Admin aperto con la password dimostrativa, visualizzazione percorso S.01 → T.08. **Nessun errore JavaScript osservato** nel contesto verificato.
- Il tutorial è stato provato in un iframe `srcdoc` equivalente generato a partire dal medesimo HTML/CSS/JS, perché i collegamenti HTTP al server di sviluppo sono limitati nell’ambiente. Questa prova non valida tutte le restrizioni di navigazione su una vera origine HTTPS.
- Test mirato delle piantine su Chromium: selezione di tutti i piani, apertura overlay Piano terra, verifica del valore CSS del colore dell’etichetta Ingresso **uguale alla piantina originale**, zoom al 125% e chiusura. La API nativa del fullscreen è stata disattivata in questo specifico test per verificare l’overlay offline senza entrare nella modalità schermo intero del browser.
- Test di sintassi JS con `node --check` sui file `.js` del progetto.
- Analisi statica degli asset: tag e risorse locali nell’HTML e voci `APP_SHELL` del Service Worker, verifica che i file corrispondenti esistano; HTML privo di `id` duplicati.
- File multimediali transcodificati: VP9 WebM con **canale alpha verificato** tramite decodifica; MP4 come fallback e intro MP4 alleggerita. Immagini WebP controllate.

## Limitazioni del collaudo

- Non è stato possibile eseguire un collaudo end-to-end su origine GitHub Pages HTTPS, né su iOS/Android fisici; sono necessari i controlli manuali dopo il deploy.
- Un test più lungo con quattro combinazioni di tema/viewport e fullscreen nativo si è interrotto per timeout nell’ambiente di automazione; **non** va considerato superato. Il test separato dell’overlay è invece passato.
- La precisione geometrica del navigatore è migliorata introducendo la rete degli assi del corridoio, ma tutti i possibili tragitti fra ogni coppia di aule non sono stati collaudati singolarmente. I percorsi rimangono schematici.
- La console Admin della V52 estende l’Admin locale di V51; non è stata provata in un flusso multiutente o con backend (che non esiste).

## Checklist dopo GitHub Pages

- [ ] Aprire il nuovo sito in finestra anonima, poi aggiornare una PWA V51 già installata.
- [ ] Testare la demo interattiva e tutte le 7 tappe sul dominio GitHub Pages.
- [ ] Verificare centratura e scrollbar del fullscreen mappe su telefono, orientamento verticale e orizzontale.
- [ ] Controllare video WebM e fallback MP4 su Safari iOS e browser Android.
- [ ] Verificare Finder trascinabile, ridimensionabile e bloccabile dopo il riavvio.
- [ ] Verificare la ricerca e i sottomenù Orari in modalità chiara e scura.
- [ ] Testare l’uso con tastiera e l’impostazione `prefers-reduced-motion`.
- [ ] Aprire il sito offline dopo il primo caricamento completo e confermare il corretto aggiornamento Service Worker.
