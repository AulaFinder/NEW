# Rapporto verifiche AulaFinder V51

Data: 18 novembre 2026.

## Controlli browser

Test automatizzati in Chromium con documenti e script iniettati per aggirare il blocco di navigazione locale imposto dall'ambiente:

1. Home, pulsante Versioni e pagina archivio.
2. Finder senza autofocus, suggerimenti, domanda/risposta, espansione, ridimensionamento con tastiera.
3. Orari e disponibilità delle ore totali dei docenti.
4. Navigatore e visualizzazione del percorso.
5. Ricerca Versioni con evidenziazione e visualizzazione delle V48/V51.
6. Apertura Admin, rifiuto password errata, tastiera virtuale e accesso con `kiwi`, uscita.
7. Tutorial sette tappe, attivazione e cambio di tappa.
8. Vista mobile senza scorrimento orizzontale a 390 px, Finder e logo senza riquadro indesiderato, tutorial mobile, tema scuro.
9. Assenza di eccezioni `pageerror` nel collaudo principale.

Esito: **27 verifiche di interazione superate su 27** nell'esecuzione principale dopo le modifiche.

## Controlli aggiuntivi (5 prove browser superate)

- Apertura docente da **Professori liberi**: scheda con totale ore settimanali visibile e contrastato.
- Responsività senza overflow orizzontale verificata anche a **320 px** e **430 px**.
- Tastiera Admin verificata: 26 tasti lettera, oltre ai comandi dedicati.

- Navigatore: richiesta effettiva **1.01 → 1.02**, tracciato SVG con segmenti dal centro aula attraverso il corridoio fino al centro della seconda aula. Verificato che il metodo esponga e renderizzi il percorso.
- HTML: controllo automatico di 33 riferimenti locali a CSS, JS, icone, immagini e video: **0 mancanti**.
- Service worker: elenco completo degli asset `APP_SHELL` controllato: **0 mancanti**.
- Sintassi JavaScript: `node --check` sugli script modificati: superata.
- Videoclip di caricamento e Finder: entrambi in modalità silenziosa, nessuna nuova sintesi vocale.

## Limiti da tenere presenti

- Il browser sandbox impedisce la navigazione HTTP/file e quindi non conferma l'esecuzione dell'iframe annidato in un ambiente web pubblicato, né il caching PWA nella sua forma completa.
- Non sono state effettuate prove con il microfono reale o su Safari/iOS. La waveform usa l'analisi audio WebAudio solo quando i permessi/browser lo consentono; altrimenti viene mostrata un'animazione fallback.
- La fedeltà dei percorsi fisici non può essere certificata soltanto da una piantina SVG.
- Non è disponibile la base V50: valutare eventuali differenze fra V48 e V50 prima di sovrascrivere il sito esistente.

**Risultato**: build di lavoro testata nelle interazioni principali, ma non dichiarata infallibile né completamente collaudata su dispositivi reali.
