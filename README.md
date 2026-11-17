# AulaFinder · Il tuo navigatore scolastico

**Versione attuale: V48**, ricostruita **dalla V47 originale**.

AulaFinder è un'applicazione web per il Liceo Scientifico G.B. Grassi di Saronno: ricerca di aule, classi e docenti, orari, disponibilità, piantine e itinerari schematici tra ambienti della scuola. È realizzata dagli studenti e consultabile anche da smartphone.

## Funzioni principali

- **Ricerca** di classi, aule e professori con suggerimenti, preferiti e cronologia.
- **Orari** settimanali di classi, aule e professori.
- **Aule libere e professori liberi** in base all'orario caricato (non dati in tempo reale).
- **Piantine** con selezione dei piani, scelta delle aule e accesso diretto a orario o navigazione.
- **Navigatore** con percorso schematico, scelta scale/ascensore e passaggi tra piani; disponibile anche per Archivio e Caldaie dove il percorso è verificabile.
- **Finder**, assistente basato sugli orari locali con domande testuali e dettatura opzionale; pulsante spostabile, icona personalizzata e orb in loop.
- **Tutorial** in sette tappe con anteprime dei componenti reali del sito e pulsante per tornare alla guida dopo aver provato una funzione.
- **Versioni**, cronologia consultabile da V1 a V48, con ricerca e dettagli espandibili; sono indicati chiaramente i periodi senza documentazione verificabile.
- **Modalità chiara/scura**, PWA e consultazione offline delle risorse incluse nella cache.

## Installazione su GitHub Pages

1. Estrai lo ZIP `AulaFinderV48.zip`.
2. Carica **il contenuto interno** della cartella `AulaFinderV48/` direttamente nella **root del repository**, mantenendo cartelle `assets/` e `icons/`.
3. La homepage resta `index.html` e il sito può essere distribuito da GitHub Pages (Settings → Pages).
4. Pubblica la nuova release e verifica che il Service Worker carichi la cache `v48` per sostituire file vecchi.

> Attenzione: i tragitti sono schematici e **non sono adatti a emergenze o evacuazioni**. Gli orari non garantiscono disponibilità e presenza in tempo reale; nomi dei docenti in sigla per tutela della privacy.

## Documentazione e storico

- `README_V48.md`: modifiche della V48.
- `VERIFICHE_V48.md`: test eseguiti e loro limiti.
- `CHANGELOG.md`: modifiche documentabili dalla V1 alla V48.
- `STORICO_VERSIONI.md`: indice sintetico di tutte le versioni.
- `SPECIFICA_V48.md`: requisiti della V48 e test di accettazione.
- `GITHUB_ABOUT.txt`: descrizione breve per il campo About di GitHub.

Le versioni V1–V48 sono tutte elencate, ma la cronologia non inventa i dettagli mancanti. Non viene modificato il contenuto di `data.js` né l'algoritmo dei percorsi della V47.
