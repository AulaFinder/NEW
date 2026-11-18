# AulaFinder V51 · Note di rilascio

**Base:** ZIP originale AulaFinder V50 allegato dall'utente.  **Data:** 18 novembre 2026.  **Cartella di consegna:** `AulaFinderV51/`.

## Modifiche implementate

**Finder**
- Riutilizzato integralmente il nuovo file originale dell'orb allegato dall'utente (`assets/finder-orb.webm`), con poster WebP compatto e video MP4 di fallback della V50.
- Nessun autofocus su campo testo o classe all'apertura; non richiama involontariamente la tastiera mobile.
- Finestra trascinabile e ridimensionabile dall'angolo destro inferiore con mouse/touch/pen o frecce della tastiera; dimensioni ricordate localmente e limitate al viewport. Resta l'espansione a schermo intero.
- Chiusura accelerata verso il pulsante orb; rimosso il contorno ciano non desiderato su focus non da tastiera; suggerimenti contestuali animati relativi a tutte le sezioni principali.
- Waveform esclusivamente **visiva** durante la registrazione vocale, dove disponibile. Nessuna voce di sintesi e nessun effetto sonoro.

**Tutorial**
- Tutorial originale di sette tappe preservato, arricchito con un iframe del **sito reale** nella stessa sezione. I comandi della guida aprono nella demo ricerca, orari, disponibilità, navigatore, Finder, piantine e footer.
- Prevenuto ricorsivamente il caricamento di altre copie del tutorial dentro il tutorial; schermata di caricamento iniziale saltata nell'istanza incorporata.

**Admin**
- Accesso locale `kiwi` con tastiera virtuale, visibilità password e pulsanti accessibili.
- Editor su classe, giorno, ora, materia, docente, aula. Ricostruzione degli indici docenti/aule/stanze disponibili, blocco dei conflitti introdotti su aula/docente e limiti di validazione.
- Salvataggio in `localStorage` con ricaricamento, annullamento per singola lezione e totale, export e import JSON.
- Chiarito nell'interfaccia che questo sistema statico non ha sicurezza server e le modifiche non vengono automaticamente pubblicate.

**Altre sezioni**
- Corretto **4AS, mercoledì 4ª ora, Informatica 1.07** in tutte le strutture dati.
- Home, barra laterale, elementi mobili, pulsante Professori liberi e leggibilità con gradienti/contrasti migliorati.
- Versioni: ricostruita anteprima V51, archivio a **51 versioni** preservando tutte quelle precedenti, evidenziazione dei termini cercati e controllo fullscreen discreto sulle anteprime; andamento cromatico locale lungo la timeline.
- Orari: rimossa intestazione ridondante; controllo dei contrasti e microinterazioni.
- Navigatore: conservata e verificata la logica V50 che instrada dal centro stanza al corridoio e dal corridoio al centro della destinazione, con animazioni continue sulla legenda e sui marcatori.
- Nessuna animazione acqua o effetto sonoro; rispettato `prefers-reduced-motion`.
- Service worker aggiornato a `aulafinder-pwa-v51`, asset di tutte le 51 preview e nuovi script inclusi nella cache.

## Pubblicazione e limiti

Pubblicare il contenuto della cartella `AulaFinderV51/` nel repository GitHub Pages, mantenendo le cartelle degli asset. Il tutorial con sito incorporato richiede origine web coerente; provare con HTTP(S), non `file://`. Audio e acquisizione vocale non sono richiesti per le ricerche testuali. La disponibilità oraria è derivata dai dati locali e non dai movimenti effettivi degli studenti.

Per i risultati dei controlli e ciò che non è stato possibile verificare in un sito distribuito, consultare `VERIFICHE_V51.md`.
