# AulaFinder V50 · Orizzonti nuovi

**Data di realizzazione:** 18 novembre 2026  
**Base:** ZIP AulaFinderV49(1).zip fornito per questa revisione.  
**Principio:** modifiche additive alla V49, dati scolastici e geometria degli SVG preservati.

## Nuova esperienza visiva e audio

- Tema mobile al primo avvio basato sulla preferenza chiaro/scuro del dispositivo. La scelta manuale mobile è distinta dalla preferenza desktop.
- Intro con transizione più dolce e fondo omogeneo. Rimane il filmato originale; il nuovo suono originale si tenta solo all'inizio del filmato, nei limiti imposti dall'autoplay.
- Marchio AulaFinder con testo a gradiente animato. Header, logo nel menu laterale e footer animano il marchio senza cambiare pagina.
- Ingrandimento del logo centrale tramite dialog: apertura dal logo e ritorno verso il logo, senza lasciare nascosta l'immagine.
- Il footer conserva la selezione degli autori, senza applicare il lampeggio da pressione sui loro avatar.
- Il sottomenu Orari mantiene l'indicatore visibile nel tema scuro mobile.
- Navigazione tra sezioni corretta per evitare scroll automatici invasivi che nascondevano l'header.

## Finder

- Lanciatore con il solo simbolo luminoso e animazione permanente, anche quando la finestra è chiusa.
- Eliminato il comando «Riduci a icona» ridondante. Resta il pulsante per espandere la finestra.
- Apertura che cresce dal lanciatore; chiusura che torna verso il lanciatore. Posizione e trascinamento restano disponibili.
- Effetto audio originale per la domanda e risposta, attivato dal gesto di invio (il browser potrebbe bloccarlo se non lo riconosce come gesto utente).
- Nuovo tipo di risposta sulla somma delle ore di lezione previste a settimana per un docente indicato per sigla.

## Orari, Home, Tutorial

- Nella scheda docente e nei risultati di ricerca è visibile il totale delle ore di lezione previste dal lunedì al venerdì.
- Le scorciatoie Home «Aule libere» e «Professori liberi» mostrano il conteggio contestuale per giorno e ora selezionati.
- I sette passi del Tutorial originale sono integrati da spiegazioni precise direttamente dentro ciascuno step, senza portare il visitatore a un'altra sezione.
- Link FAQ migliorato in chiaro e scuro.

## Mappe e Navigatore

- Mappe fullscreen: l'ingrandimento modifica le dimensioni reali del contenitore SVG e permette lo scorrimento dei due assi quando necessario, invece di usare soltanto una trasformazione grafica.
- Trascinamento con mouse o touch, controlli +/− e Ctrl+rotella.
- Percorso continuo che parte dal centro della stanza iniziale e termina nel centro della stanza finale, collegato al tracciato dei corridoi; marcatori della partenza e dell'arrivo centrati sulle stanze.
- Trattamento dei corridoi migliorato per ridurre scorciatoie che attraversano altre stanze. Su mappe schematiche resta necessaria una verifica umana in caso di incongruenze geometriche.
- Simboli della legenda allineati.

## Versioni

- V50 «Orizzonti nuovi» aggiunta all'archivio, portato a 50 voci, con nome e dettagli dell'aggiornamento.
- Timeline e versione attuale con grafica aggiornata.
- Anteprime apribili a schermo intero, ingrandibili con pulsanti e Ctrl+rotella.
- Creata la vera schermata V50 e rigenerata la schermata V49 usando il **codice V49 originale**, che contiene il simbolo dell'orologio nella voce Orari.

## File aggiunti/modificati

`v50.css`, `v50-ui.js`, `script.js`, `finder.js`, `navigator.js`, `loading.js`, `v48-ui.js`, `v49-ui.js`, `versioni.js`, `versioni-data.json`, `index.html`, `sw.js`, nuovi `.wav` in `assets/`, `assets/versioni-home/V49.webp`, `assets/versioni-home/V50.webp`, documentazione.

I quattro orari originali ricopiati nel file `data.js` non sono stati modificati.
