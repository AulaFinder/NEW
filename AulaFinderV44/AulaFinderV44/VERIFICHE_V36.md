# Verifiche AulaFinder V36

## Risultati
- `node --check` senza errori su tutti i file JavaScript.
- Chromium: HTML, CSS, JavaScript caricati; nessun errore JavaScript nei test.
- Layout senza overflow orizzontale a **320, 360, 375, 390, 430, 680, 768, 1024, 1366, 1440 px**.
- Interazione touch simulata a **320, 375, 390, 430 px**: apertura/chiusura menu, freccia Orari, selezione suggerimenti con un solo tocco, ricerca percorso.
- Ordinamento docenti per materia: selezione aggiornabile; risultato ricerca con materia visualizzata una sola volta.
- Rotazione 180°: cinque SVG base ruotati, etichette e pittogrammi contro-ruotati; clone navigatore e scelta da piantina verificati.
- Piantina: scelta di aula e pulsante "Portami qui" operativi dopo rotazione.
- Percorsi di prova positivi: S.01→Palestra, T.01→Palestra, S.01→T.01, S.01→1.01, 1.01→3.10, S.01→3.01, T.01→S.07, 2.01→3.01, P.01→Palestra, T.01→T.08. Tracciati ortogonali, navigazione multilivello presente.
- Evidenziazione dell'ora selezionata su scheda professore in tema scuro verificata visivamente.
- Intro MP4: video originale riprodotto su Chromium a 1366 e 390 px e nascosto correttamente al termine; fallback poster presente.
- Cache PWA rinominata e nuovo `map-orientation.js` incluso nelle risorse da memorizzare.

## Limiti
- Verifiche con Chromium e touch simulato, non con dispositivi iOS/Safari fisici o Android reali.
- Le piantine sono disegni schematici. Percorsi, accessi e sicurezza degli spazi non verificati in presenza; NON usare per emergenze.
- Il percorso ottimizza lunghezza e numero di svolte all'interno dei corridoi SVG: non è una garanzia della distanza fisica minima percorribile nell'edificio.
- La resa online della PWA dipende dalla pubblicazione corretta di tutti i file nella root GitHub Pages e dall'aggiornamento della cache.
