# VERIFICHE V48 · AulaFinder

## Origine e perimetro

La V48 è stata ricostruita partendo **esclusivamente dal contenuto originale di `AulaFinderV47.zip`**. L'archivio della precedente V48 non è stato utilizzato come base né per recuperare codice.

**Interventi sul codice esistente:** `index.html` (menu, sezione Versioni, markup del tutorial, icone titoli, icona/video Finder, collegamenti ai nuovi file), `piantina.js` (azioni mobili e Archivio/Caldaie), `navigator.js` (soltanto testo legenda), `finder.js` (drag del pulsante), `tutorial.js` (sette tappe con anteprime reali), `sw.js` (cache nuova). **Nuovi:** `v48.css`, `v48-ui.js`, `versioni.js`, `assets/finder-icon.png`, `assets/finder-orb.webm` e i documenti GitHub.

### Integrità della V47 conservata

- **Identici byte per byte:** `data.js`, `config-docenti.js`, `script.js`, `style.css`, `piantina.css`, `map-orientation.js`, `footer.js`, `loading.js`, `pwa.js` e manifest.
- **SVG mappe:** le cinque planimetrie sono equivalenti nei nodi e negli attributi. Nessuna geometria, nome di aula o percorso SVG originale modificato.
- **Navigatore:** l'algoritmo non è stato modificato, soltanto la dicitura della legenda.

## Test effettivamente svolti

Eseguiti test con **Chromium headless**, caricando il DOM, i fogli CSS e gli script originali in pagina. L'ambiente blocca le navigazioni `http://localhost` e `file://`: **questi test non equivalgono a una prova di pubblicazione reale, HTTP, service worker o installazione PWA**. Il DOM e gli script testati sono quelli inclusi nello ZIP.

### Interazioni in Chromium: 15 controlli superati, zero fallimenti

1. **Versioni desktop**: visualizzazione di tutte le 48 versioni, apertura di una scheda, presenza dei dettagli e ricerca V22.
2. **Tutorial desktop**: tutte e sette le tappe attive, anteprime ricavate da elementi DOM reali, ritorno corretto da Piantine, Footer e Finder, FAQ sulla privacy presente.
3. **Finder desktop**: apertura, selezione classe, domanda e risposta, orb presente, trascinamento del pulsante senza aprire erroneamente la finestra, salvataggio posizione in `localStorage`.
4. **Navigatore**: S.01 → S.03 con percorso SVG disegnato e legenda «Percorso».
5. **Archivio / Caldaie**: dalla piantina, selezione dell'ambiente e tasto «Portami qui» nel navigatore.
6. **Ricerca Home**: suggerimenti, apertura risultato, icona del titolo dinamico mantenuta.
7. **Orari**: passaggio a disponibilità aule, contenuto visualizzato.
8. **Layout responsive**: 390, 320 e 768 px in tema chiaro e scuro; nessun overflow orizzontale rilevato nelle schermate Versioni testate.
9. **Popup mobile**: selezione dell'aula 3.09 al terzo piano, pannello azioni sopra la mappa, aula evidenziata visibile e non sovrapposta.
10. **Tutorial mobile**: navigazione tra le sette tappe senza pannelli invisibili.

I controlli combinati nelle categorie precedenti sono riportati nel registro automatico come **15 esiti OK su 15**. Nessun errore JavaScript di esecuzione rilevato nei casi provati.

### Altre verifiche

- Percorsi con destinazione da S.01 a **Archivio, Caldaie, Palestra, T.01 e S.03**: tutti trovati in Chromium; il percorso su due piani per T.01 è presente.
- Trascinamento Finder anche tramite eventi **touch effettivi simulati con il protocollo Chromium CDP** su viewport 390 × 844: spostamento avvenuto, finestra non aperta per errore, posizione memorizzata.
- Tutti i file JavaScript controllati con `node --check`: nessun errore di sintassi.
- `style.css`, `piantina.css` e `v48.css` analizzati con parser CSS: nessun errore di parsing a livello foglio.
- Nessun ID duplicato nel DOM avviato, comprese le anteprime del tutorial.
- Riferimenti a file in `index.html` e nell'elenco precache del service worker: tutti presenti.
- Icona Finder: file PNG 512 × 512. Orb: WebM con video VP9 a 1280 × 720; fotogramma decodificato con successo.
- Archivio ZIP: integrità e presenza dei file obbligatori verificate dopo la creazione.

## Limiti dei test

Non sono stati eseguiti collaudi su **smartphone fisici**, Safari/iOS reale, GitHub Pages online, caricamento offline reale, installazione PWA né audit completo WCAG. L'impostazione di focus/scroll automatico è stata testata per i principali elementi selezionabili, non per ogni combinazione possibile di input e stato. Queste limitazioni non vanno confuse con difetti rilevati.

**Nota sicurezza**: gli itinerari sono schematici e non sostituiscono planimetrie ufficiali, segnaletica o procedure d'emergenza.
