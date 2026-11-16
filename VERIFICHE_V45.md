# AulaFinderV45 - rapporto verifiche

## Base e integrità
- Base **V44** (ZIP originale), con dati degli orari, immagini, icone, piantine e grafica generale conservati.
- Nessuna modifica a `data.js`, `config-docenti.js`, agli asset grafici o alle coordinate SVG della planimetria.
- Verifica sintattica con `node --check` di `script.js`, `navigator.js`, `piantina.js`, `map-orientation.js`, `finder.js` e `sw.js`.
- `sitemap.xml` validato con parser XML.

## Risultati automatici in Chromium
- Layout e interazioni verificate a larghezze **320, 375, 390 (chiaro e scuro), 768 e 1366 px**.
- Nessun errore JavaScript e nessun overflow orizzontale nelle configurazioni sopra.
- Il sottotitolo è visibile anche a 320 px; centraggio interno dei pulsanti Home e Menu verificato con differenza minore di 1 px.
- Finder: apertura, selezione classe, richiesta «prossima ora», risposta da orario reale della classe, chiusura.
- Admin: tasto del footer ripristinato e apertura della pagina «in fase di elaborazione».
- Professori liberi: per lunedì/4ª ora il test ha restituito **9 docenti con ora buca**, **30 senza lezione** dopo lo switch. Ripassando all'impostazione iniziale tornano solo le ore buche.
- Piantina: aula speciale Palestra selezionata con nome visibile; copia evidenziata con contro-rotazione esplicita.
- Navigatore: T.01 → T.02, pin di destinazione presente e legenda coerente; percorso tra piani S.01 → T.01 con **2 tappe**, puntino di partenza sul piano iniziale, cerchio di trasferimento e pin corallo a destinazione.

## SEO
- Titolo e descrizioni aggiornati; WebSite JSON-LD; `robots` index/follow; `sitemap.xml`; `robots.txt`.
- Per l'indicizzazione occorre pubblicare e, preferibilmente, inviare la sitemap a Google Search Console. **Non è possibile garantire il primo posto su Google.** Il tag `meta keywords` non influenza il ranking Google.

## Limiti espliciti
- Test automatici in **Chromium simulato**, non su iPhone/Safari o Android fisici.
- Funzione microfono: codice predisposto con Web Speech API, fallback su testo e avviso sui permessi. La **dettatura vocale reale non è stata collaudata con un microfono fisico**; la disponibilità varia per browser, HTTPS e autorizzazione.
- Finder risponde a comandi riconosciuti dai dati statici e non è un modello linguistico con dati scolastici in tempo reale.
- Percorsi basati su piantine schematiche, non verifica dell'accessibilità fisica, adatti all'orientamento ordinario e non alle emergenze.
