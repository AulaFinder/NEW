# AulaFinder V29 · Correzioni UX e Navigatore

Sito e PWA del progetto scolastico **AulaFinder**, per il Liceo Scientifico G.B. Grassi di Saronno. Basato direttamente sulla V28: palette, struttura, immagini, dati degli orari e geometrie delle piantine non sono stati sostituiti.

## Cosa cambia rispetto alla V28

- **Ingrandimento logo:** animazione breve con apertura progressiva e micro-ingrandimento, senza modificare il file del logo né aggiungere una X. Si chiude cliccando fuori o con Esc; rispetta `prefers-reduced-motion`.
- **Ricerca nella sezione Orari:** placeholder specifico alla categoria: «Cerca una classe», «Cerca un’aula», «Cerca un professore». Nell'ordinamento dei docenti, la voce ora è «Cognome Nome» (in assenza di nominativi reali viene ancora usata la sigla disponibile) o «Materia».
- **Cronologia e preferiti:** la lista scorre *solo* quando contiene più di quattro voci; la sua altezza diventa fissa e il browser non deve più far comparire/sparire la scrollbar durante i cambi di layout. Lo scroll viene conservato negli aggiornamenti. Restano possibili rimozione singola e totale.
- **Navigatore:** un elenco personalizzato sostituisce i suggerimenti nativi del browser. Mostra tutti gli ambienti quando il campo è vuoto, ma se scrivi il prefisso del piano (`S`, `P`, `T`, `1`, `2`, `3`), i risultati riguardano esclusivamente quel piano. Digitando `T01` non compaiono stanze `1.01`, `2.01`, ecc. Selezione con mouse/touch, frecce, Invio ed Esc.
- **Laboratorio di inglese 2.14:** la stanza ha una **forma SVG irregolare (`path`)**, non un rettangolo. Il Navigatore ora ne legge i contorni e permette di selezionarla dal campo (codice o nome), dalla piantina e nei tragitti. La stessa logica permette la gestione di altre forme irregolari in futuro.
- **Cambio tema:** controllo sole/luna allineato verticalmente a Giorno e Ora; breve animazione dell'icona, con opzione di movimento ridotto.

## Pubblicazione su GitHub Pages

1. Estrai questo ZIP.
2. Carica **il contenuto direttamente nella root** del repository `leonardofiadino09-jpg/AulaFinder`, senza aggiungere una cartella `AulaFinder` esterna. Mantieni `assets/` e `icons/`.
3. In **Settings → Pages** usa branch `main` e `/ (root)`; deve essere presente `index.html` nella root.
4. Verifica l'indirizzo: `https://leonardofiadino09-jpg.github.io/AulaFinder/`.
5. Aggiorna l'app PWA su uno smartphone già installato: aprila con Internet, ricarica la pagina e riavvia se necessario. La cache è aggiornata alla **V29**.

## Test effettuati

- Chromium: larghezze **320, 390, 768, 1366 px**, ciascuna in tema chiaro e scuro (**8/8**).
- Apertura e chiusura del logo, cambio tema e animazione, ricerca specifica delle tre categorie, preferiti oltre quattro elementi con barra di scorrimento stabile, rimozione singola, nuovi suggerimenti per codice e descrizione, laboratorio inglese e scelta della destinazione.
- Tutti i prefissi di piano (`S`, `P`, `T`, `1`, `2`, `3`) verificati su desktop e mobile; allineamento dei tre controlli dell'header verificato.
- **536 combinazioni di itinerario** con partenza da Ingresso, 2.14, S.07 e 3.01 verso gli altri ambienti, in entrambe le modalità scale/ascensore: nessun percorso mancante nei casi eseguiti.
- Laboratorio **2.14** selezionato direttamente sulla piantina sia a 1366 px sia a 390 px.
- Controllo sintassi JavaScript e integrità del file ZIP.

**Limiti dei test:** le verifiche sono state svolte con Chromium e viewport simulate; non costituiscono una prova su Safari/iPhone fisici né una verifica del sito già pubblicato su GitHub.

## Limiti di utilizzo

- I percorsi sono **schematici**, ricostruiti dai disegni: devono essere verificati fisicamente dall'istituto, specialmente per le porte, gli ascensori, l'accessibilità e i passaggi effettivi. Non sono adatti a evacuazioni o emergenze.
- Orari e docenti liberi non rappresentano disponibilità/presenza in tempo reale.
- Cronologia e preferiti sono conservati solo nel browser del dispositivo, senza sincronizzazione.
- Prima della pubblicazione degli orari reali su un repository pubblico, verificare l'autorizzazione della scuola.
