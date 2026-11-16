# AulaFinder V48 – Verifiche e modifiche

## Base e modifiche
Partenza da V47. Tutti gli orari (`data.js`), geometrie delle mappe (`map-orientation.js`) e logo originale restano identici.

- Home: eliminato il riquadro esterno azzurro al focus della ricerca, mantenendo un bordo discreto.
- Navigatore: legenda «Percorso»; Archivio e Caldaie raggiungibili dalla piantina; colonnina verticale con avanzamento e gradiente giallo animato.
- Piantina mobile: pannello azioni inserito sopra la mappa ma sotto l'intestazione del piano, senza coprire l'aula selezionata.
- Finder: icona originale allegata, video orb originale in loop con MP4 alternativo; trascinamento touch/mouse e memorizzazione della posizione; colori contrastanti per i messaggi.
- Sezioni: icona SVG coerente accanto al titolo della pagina.
- Tutorial: intestazione semplice «Tutorial», sette capitoli, sette screenshot reali acquisiti dall'app funzionante, nuova tappa footer, domande frequenti con spiegazione sulla riservatezza delle sigle dei docenti. Tasto contestuale «Torna al tutorial» che conserva la tappa.
- Selezioni: scorrimento verso i contenuti scelti nei casi di orari, piantina, preferiti e navigazione passo-passo; evitare spostamenti mentre si digita.

## Controlli eseguiti
- Test di ricerca, menu, guida, ritorno dalle piantine e dal footer, Archivio/Caldaie, legenda, Finder trascinabile e messaggi su larghezze 1366, 768 e 390 pixel in Chromium, inclusa modalità scura su 390.
- Verifica mirata aggiuntiva su 320, 375 e 430 pixel, inclusi i nomi dei locali speciali, le immagini reali del tutorial, la larghezza del documento e gli errori JavaScript.
- Schermate reali WebP inserite in `assets` e caricate nel browser di prova.
- Nessuna eccezione JavaScript durante i controlli completati.
- Sintassi verificata su tutti i file JS; confronto byte per byte degli orari, logo e geometrie con V47; verifica di ogni risorsa elencata nella cache PWA.
- Originale WebM preservato; MP4 di fallback codificato e verificato con FFprobe/FFmpeg.

## Limiti
- Test mobile in Chromium emulato, non su dispositivi fisici Android/iOS o Safari.
- Le mappe sono schematiche e non sono percorsi certificati.
- La trascrizione vocale dipende dai permessi e dal browser. Il WebM e il MP4 sono disponibili, ma l'autoplay reale dipende dal browser.
