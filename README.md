# AulaFinder · Il tuo navigatore scolastico

**Versione attuale: V49 · Il salto di qualità.**

AulaFinder è una web app/PWA realizzata per il **Liceo Scientifico G.B. Grassi di Saronno**: ricerca di aule, classi e docenti, orari, piantine, navigazione tra i piani e assistenza Finder. I dati sugli orari sono quelli caricati nell'app, **non aggiornamenti in tempo reale**.

## Cosa puoi fare

- Cercare aule, classi e sigle dei docenti con suggerimenti, cronologia e preferiti.
- Consultare orari settimanali, aule libere, professori senza lezione e ore buche.
- Esplorare cinque piantine originali e, su smartphone, aprirle a schermo intero, con un visualizzatore che si adatta anche al formato orizzontale.
- Usare il Navigatore tra gli ambienti, inclusi Archivio, Caldaie e Palestra, con scale/ascensore e passaggi tra piani quando esiste un percorso verificabile sulla geometria della mappa.
- Chiedere a Finder suggerimenti in linguaggio naturale: aiuto con lo zaino, le materie, le prossime lezioni e l'uso del sito. **Finder è un assistente locale basato su regole e orari, non un modello AI generativo né un servizio Internet.**
- Usare il **Tutorial autonomo** in sette tappe, con esempi interattivi e copie autentiche delle piantine.
- Consultare tutte le **49 versioni** e aprire le anteprime delle Home ricavate dagli archivi storici, dalla V1 alla V49.
- Alternare tema chiaro/scuro e installare la PWA dove supportata dal browser.

## Avvertenze e privacy

- Le disponibilità delle aule e dei docenti derivano dall'orario caricato; sostituzioni e assenze non sono rilevate in tempo reale.
- I docenti sono riportati tramite sigle/iniziali per tutela della privacy.
- Il Navigatore è **schematico** e non va usato per evacuazioni o emergenze.
- Il riconoscimento vocale funziona solo sui browser che espongono API compatibili e concedono accesso al microfono: alcuni browser possono richiedere servizi di trascrizione online o non consentire il riconoscimento. La chat testuale funziona senza microfono.
- Per la lettura a voce alta Finder sceglie solo una **voce italiana locale del dispositivo**, se presente. Non è stata introdotta una voce proprietaria uniforme su tutti i telefoni.
- Il breve suono di apertura viene tentato soltanto durante l'introduzione. I browser mobili possono bloccarlo per le regole sull'autoplay; il sito resta utilizzabile senza suono.
- Su iOS e su alcuni browser il blocco della rotazione tramite API non è disponibile: il visualizzatore delle mappe ha un fallback CSS.

## Pubblicare su GitHub Pages

1. Estrai lo ZIP **AulaFinderV49.zip**. All'interno trovi la cartella **`V49/`**.
2. Carica **il contenuto di `V49/`** nella cartella principale del repository, non la cartella `V49` intera, se il sito deve continuare a funzionare all'URL `/AulaFinder/`.
3. Mantieni intatte le sottocartelle `assets/` e `icons/`, i file `.js`, `.css`, `manifest.webmanifest` e `sw.js`.
4. Attiva GitHub Pages dalle impostazioni del repository e controlla la pubblicazione HTTPS. Il service worker utilizza la cache **`aulafinder-pwa-v49`**; dopo l'aggiornamento può servire un ricaricamento completo.
5. Verifica su **Android e iPhone reali** il video, il microfono, il visualizzatore fullscreen e l'uso della tastiera assistiva prima della consegna definitiva.

## Documentazione nella release

- `README_V49.md`: dettagli della V49.
- `CHANGELOG.md`: registro storico aggiornato.
- `STORICO_VERSIONI.md`: indice V1–V49 e fonte delle informazioni recuperate.
- `VERIFICHE_V49.md`: controlli eseguiti, bug corretti e limiti dei test.
- `ANALISI_V49.md`: problematiche, proposte di miglioramento e priorità consigliate.
- `GITHUB_ABOUT.txt`: descrizione breve pronta per il campo About del repository.

**Contatto del progetto:** [aulafinder@gmail.com](mailto:aulafinder@gmail.com).
