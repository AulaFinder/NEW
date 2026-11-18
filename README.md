# AulaFinder · Il tuo navigatore scolastico

**Versione attuale: V50 · Orizzonti nuovi (18 novembre 2026).**

AulaFinder è la web app/PWA del progetto scolastico per il **Liceo Scientifico G.B. Grassi di Saronno**. Il pacchetto V50 parte dalla V49 originale, senza sostituire i dati degli orari o i cinque SVG delle piantine.

## Cosa puoi fare

- Cercare aule, classi e docenti per sigla, conservando suggerimenti, preferiti e cronologia.
- Consultare orari da lunedì a venerdì, aule senza lezione, ore buche e **numero di ore di lezione previste a settimana per docente**.
- Consultare le cinque piantine; aprirle a schermo intero, ingrandirle e scorrere in orizzontale e verticale, quando la dimensione della mappa supera il display.
- Usare il Navigatore per individuare un percorso schematico lungo i corridoi, inclusa la Palestra e i cambi di piano con scale/ascensore.
- Fare domande a **Finder**, che risponde dagli orari locali senza usare un servizio AI remoto. Finder ha ora un lanciatore circolare animato e un nuovo effetto di ingresso/uscita; la lettura vocale dipende dal dispositivo.
- Seguire il Tutorial autonomo in sette tappe, ora arricchito con suggerimenti contestuali.
- Consultare l'archivio di **50 versioni** e aprire a schermo intero le anteprime delle Home con zoom.
- Usare il tema automatico del sistema su mobile, con possibilità di modifica manuale.

## Note importanti

- I dati sulle disponibilità derivano dagli **orari pubblicati**, non da presenze in tempo reale; le ore settimanali indicate sono ore di **lezione**, non ore lavorative complessive.
- I percorsi sono schematici e non sostituiscono segnaletica, istruzioni di sicurezza o vie di evacuazione.
- Il filmato di ingresso resta quello originale. I tre brevi effetti sonori sono nuovi e prodotti per V50; l'autoplay audio può essere vietato dal browser.
- Microfono e lettura vocale dipendono dal browser e dalle voci disponibili. Non è garantita una voce identica su tutti i dispositivi.
- Le immagini **V1–V48** sono gli scatti d'archivio ricevuti nella V49; la schermata **V49** è stata rigenerata dal codice V49 originale per correggere l'assenza del simbolo Orari nella precedente acquisizione. Le altre anteprime storiche non sono state inventate o ritoccate arbitrariamente.

## Pubblicare su GitHub Pages

1. Estrai **AulaFinderV50.zip**: contiene la cartella `V50/`.
2. Se vuoi mantenere il sito all'URL `/AulaFinder/`, pubblica **il contenuto della cartella `V50/`** nella radice del repository, non la cartella stessa.
3. Mantieni tutte le cartelle `assets/`, `icons/` e tutti i file `.js`, `.css`, `manifest.webmanifest` e `sw.js`.
4. La cache PWA è ora `aulafinder-pwa-v50`. Dopo l'aggiornamento può essere necessario aggiornare la pagina o chiudere e riaprire la PWA.
5. Prima di dichiarare il sito pronto in produzione, verifica su Android/iPhone reali audio, rotazione mappa, microfono e comportamento delle animazioni.

## Documentazione

- `README_V50.md`: funzionalità e dettagli del rilascio.
- `VERIFICHE_V50.md`: controlli eseguiti e loro limiti.
- `CHECKLIST_V50.md`: richieste delle note e stato.
- `STORICO_VERSIONI.md`: storia delle versioni e provenienza delle anteprime.
- `CHANGELOG.md`: cronologia delle modifiche.
- I file `README_V49.md`, `VERIFICHE_V49.md` e simili sono conservati come **documenti storici**.

**Contatto:** aulafinder@gmail.com
