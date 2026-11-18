# AulaFinder V51 · Rapporto di verifica

Data: 18 novembre 2026. Base: AulaFinderV50(4).zip; file orb: orb(3).webm.

## Verifiche eseguite

**48 test automatici superati su 48**, senza eccezioni JavaScript, usando Chromium e due viewport: **1366×900** desktop e **390×844** mobile. La simulazione caricava in sequenza *l'HTML, i fogli CSS e gli script effettivamente presenti nel pacchetto*, con gli elementi grafici necessari incorporati nel documento di test.

Per entrambe le dimensioni, verificati:
- Caricamento della pagina senza eccezioni JavaScript.
- 4AS, mercoledì quarta ora: classe, stanza, docente e disponibilità coerenti.
- Apertura Finder, assenza di autofocus, ridimensionamento da tastiera, risposta ad una domanda reale sugli orari, suggerimenti contestuali e chiusura.
- Sezione Versioni, 51 schede, evidenziazione dei risultati e individuazione V51.
- Navigatore: caricamento delle stanze, calcolo di un percorso tra due ambienti e di un percorso sullo stesso piano.
- Tutorial: presenza del riquadro per il sito reale e cambiamento tappa.
- Admin: accesso `kiwi`, console visibile, esportazione valida, blocco di un conflitto, salvataggio/rilettura di override e ricostruzione contemporanea dei calendari di classe, stanza e docente.

**Controlli statici aggiuntivi**
- Identificatori HTML duplicati: 0.
- Risorse locali HTML con percorso mancante: 0.
- `sw.js`: 97 risorse in lista per la cache, tutte presenti sul disco, senza voci duplicate; archivio `versioni-data.json` con 51 versioni.
- La demo della guida usa `data-live-src` assegnato solo all'istanza principale, per evitare iframe ricorsivi.
- Rimosso l'avvio dei file WAV della V50; filmati mantenuti in modalità mute; nessuna chiamata a `speechSynthesis` e nessun tag `<audio>`.

## Limiti e test manuali consigliati

La configurazione del browser nell'ambiente di lavoro bloccava la navigazione diretta ad URL `localhost` e `file://` (errore `ERR_BLOCKED_BY_ADMINISTRATOR`). I test interattivi sono stati eseguiti su documento di test con codice reale caricato inline, **non** su un sito distribuito via HTTPS. In questo contesto non sono stati verificati: funzionamento effettivo dell'iframe remoto una volta pubblicato, decodifica video/orb su Android e iOS, riconoscimento vocale con microfono reale, service worker e cache offline installata, persistenza fra veri riavvii della pagina sul dispositivo e qualità dei percorsi in una visita fisica dell'edificio.

Per il collaudo finale, pubblicare su GitHub Pages, controllare Chrome/Edge desktop, Safari iPhone e Chrome Android, provare l'iframe Tutorial, il drag/resize Finder, il microfono e il ripristino dopo la modifica Admin. Le modifiche Admin sono locali: per renderle pubbliche occorre un backend o aggiornare i dati del sito distribuito.

**Conclusione:** la V51 soddisfa le verifiche automatiche disponibili e ha tutte le risorse referenziate, ma il collaudo finale nel browser di distribuzione rimane necessario.
