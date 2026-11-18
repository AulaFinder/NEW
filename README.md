# AulaFinder · Il tuo navigatore scolastico

**Versione attuale: V52 · Esperienza rifinita (19 novembre 2026).**

AulaFinder è la web app/PWA per il Liceo Scientifico G.B. Grassi di Saronno. La V52 è costruita direttamente sulla V51 fornita, conservando gli orari, le piantine, la ricerca, il navigatore, i preferiti, le versioni e le altre funzionalità esistenti.

## Funzioni principali

- Cerca aule, classi e professori, con cronologia, preferiti e collegamenti alle piantine.
- Consulta orari, aule libere, professori liberi e ore buche. **La disponibilità è ricavata dagli orari**, non è una misura in tempo reale.
- Esplora le piantine e i percorsi schematici tra le aule, a partire e fino al centro degli ambienti rappresentati.
- Usa Finder con orb originale animato in loop, senza tastiera automatica all'apertura, con finestra spostabile, ridimensionabile e orb bloccabile nella posizione scelta. Il microfono è facoltativo e dipende dal browser.
- Prova il sito vero dentro un unico Tutorial di sette tappe; la navigazione nella demo è guidata e limitata alla tappa selezionata.
- Consulta **52 versioni** con ricerca evidenziata e anteprime storiche.
- Entra nella console Admin locale: modifica le lezioni, valida i conflitti di aula/docente e importa/esporta le modifiche in JSON.
- Nessun suono, sintesi vocale o effetto acqua: solo animazioni visive.

**Correzione didattica:** classe 4AS, mercoledì, quarta ora: Informatica nel laboratorio **1.07**. Anche gli indici delle aule, dei docenti e delle disponibilità sono stati aggiornati.

## Pubblicare su GitHub Pages

1. Estrai lo ZIP: contiene la cartella `AulaFinderV52/`.
2. Pubblica **il contenuto** della cartella `AulaFinderV52/` nella radice del repository se vuoi mantenere l'attuale URL del progetto.
3. Mantieni `assets/`, `icons/`, tutti i file HTML/JS/CSS e `manifest.webmanifest`, `sw.js`, `versioni-data.json`.
4. La cache PWA è `aulafinder-pwa-v52`; ricarica la pagina e, se necessario, riapri la PWA per ricevere tutti gli aggiornamenti.
5. Per provare il tutorial incorporato in locale, usa un server HTTP (ad esempio dalla cartella `AulaFinderV52`, `python -m http.server 8000`) e apri `http://localhost:8000/`. Aprire direttamente `index.html` con `file://` può limitare l'iframe e il microfono per le restrizioni del browser.

## Admin: limite importante

La password dimostrativa è `kiwi`. **Non è un sistema di sicurezza lato server.** La V52 è una web app statica: le modifiche agli orari vengono salvate **solo su quel browser/dispositivo**. Per trasferirle puoi esportare e importare il JSON. Per aggiornarle per **tutti gli utenti** occorre applicare i nuovi dati alla versione pubblicata, oppure costruire un backend con autenticazione e archivio centralizzato. Non pubblicare dati sensibili nel JSON.

## Verifiche e altre note

- Sono stati rieseguiti smoke test interattivi su Chromium con viewport desktop (1366 px) e mobile (390 px): nessun errore JavaScript emerso in questi percorsi di prova. Si tratta di un collaudo parziale, non di una certificazione di ogni funzione.
- Il browser di test dell'ambiente impediva l'apertura diretta della pagina via localhost; i controlli sono stati eseguiti in Chromium con l'HTML, CSS e JavaScript reali caricati in un documento di test, più verifiche statiche di percorsi e risorse. Non equivalgono a un collaudo HTTPS o su dispositivi fisici.
- I percorsi del navigatore sono indicativi e **non** sostituiscono segnaletica e vie di evacuazione.
- Documentazione di rilascio: `README_V52.md` e `VERIFICHE_V52.md`. I documenti V51 e precedenti sono conservati come storico.
