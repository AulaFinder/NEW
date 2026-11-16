# AulaFinderV46 · Verifiche

## Modifiche implementate
- Sottotitolo del marchio in stile menta, con gradiente e illuminazione all’hover/focus.
- Titolo con illuminazione e animazione dell'elettrone lungo l'orbita esistente (disattivata per `prefers-reduced-motion: reduce`).
- Rimozione della dicitura «si pronuncia Fainder» dal pannello Finder.
- Navigatore: tracciato con gradiente giallo visibile anche quando il segmento è orizzontale (gradientUnits=userSpaceOnUse); partenza a doppio cerchio, scale/ascensore con lo stesso puntino pieno sia in entrata sia in uscita; arrivo indicato dal solo pin corallo contro-ruotato di 180°; legenda generata dagli stessi simboli SVG della mappa.
- Ritorno automatico in cima alla sezione Navigatore dopo la scelta Da/A, dalla lista suggerimenti o dalla piantina.

## Collaudi effettivamente eseguiti (Chromium)
- Sintassi JS dei file navigator.js, script.js, sw.js e finder.js: valida.
- 9 larghezze uniche: 320, 360, 375, 390, 430, 768, 1024, 1366, 1440 px.
- Ulteriori configurazioni in dark mode a 390 e 1366 px.
- Verifica visuale dei titoli e dell'effetto hover su desktop.
- Movimento effettivo dell'elettrone: distanza animazione CSS variata da 4,49% a 11,54% in circa 180 ms.
- Selezione suggerimenti Da e A con un singolo clic.
- Percorso sullo stesso piano: S.01 → S.03. Marker di partenza, arrivo, legenda e gradiente giallo verificati in DOM e screenshot; nessun cerchio aggiuntivo intorno al pin.
- Percorso su piani diversi: S.01 → T.01; stesso simbolo scale sul piano di partenza e quello di arrivo, pin solo nell'ultimo passo.
- Scelta dalla piantina di S.05; il selettore si chiude, il valore viene scritto nel campo e la pagina torna alla sezione Navigatore.
- Nessun errore JavaScript e nessun overflow orizzontale nei test responsive effettuati.

## Integrità dei dati
Confronto byte per byte con la V45: nel sito cambiano soltanto `index.html`, `style.css`, `navigator.js`, `sw.js` (aggiornamento della cache). Gli orari (`data.js`), la geometria delle piantine, le immagini e gli altri script restano invariati.

## Limiti
Test eseguiti con Chromium desktop e simulazione mobile, non su Safari/iPhone o altri dispositivi fisici. L'animazione dell'elettrone usa le CSS Motion Paths, soggette al supporto del browser. I tragitti seguono piantine schematiche e non sono indicazioni di sicurezza/evacuazione.
