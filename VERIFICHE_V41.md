# Verifiche AulaFinder V41

## Modifica richiesta
Il fondo dei pulsanti **Modalità chiara/scura**, **Menu mobile** e **Home mobile** deve essere perfettamente bianco in modalità chiara, come i selettori Giorno/Ora.

## Intervento
- Tema chiaro: `background: #FFFFFF` (uguale ai selettori Giorno/Ora), bordo `#C2F5E7`, icona `#08171C`.
- Tema scuro: colori invariati rispetto alla V40.
- File applicativi modificati rispetto alla V40: solo `style.css` e `sw.js` (nuovo identificatore cache per aggiornare la PWA).

## Controlli
- Confronto calcolato CSS `getComputedStyle` in Chromium alle larghezze: 320, 375, 390, 430, 768, 1024, 1366, 1440 px.
- Test su ciascuna larghezza in sequenza: **chiaro → scuro → chiaro**.
- Verifica di sfondo bianco puro esattamente uguale ai selettori Giorno/Ora.
- Verifica dei colori originali scuri e della leggibilità delle icone.
- Anteprime visuali realizzate a 390 px e 1366 px, tema chiaro/scuro.
- Errori JavaScript rilevati nell'ambiente di rendering di test: nessuno.
- Le verifiche riguardano i pulsanti e il CSS dell'header; non sono test su dispositivi fisici.

## Conferma conservazione del resto
Rispetto a V40, file del sito cambiati: soltanto `style.css` e `sw.js`.
