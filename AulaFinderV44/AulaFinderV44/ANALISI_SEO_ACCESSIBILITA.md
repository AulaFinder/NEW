# AulaFinder V22 · Analisi SEO on-page e accessibilità

**Base:** pacchetto V20 per GitHub Pages con i file direttamente nella root del repository.

## Verifica HTML

- **Lingua:** `<html lang="it">` presente.
- **Titolo SEO:** `<title>AulaFinder | Liceo Scientifico G.B. Grassi</title>` presente.
- **Meta description:** presente, riscritta in modo sintetico e specifico per aule, classi, docenti e orari.
- **Viewport e configurazione PWA:** presenti e conservati.
- **Attributi `alt`:** tutti gli 8 elementi `<img>` hanno un valore `alt` (logo header, carboncino, 4 avatar, logo footer, logo ingrandito). Non mancavano alt da aggiungere.
- **Gerarchia titoli:** la Home ha un `h1` e i blocchi inferiori hanno `h2`. Le altre viste usano ciascuna un `h1`, ma sono nascoste quando inattive. Il titolo `Cronologia` è dentro un'area di navigazione secondaria. Nessun errore grave di ordine dei titoli individuato.
- **Form:** campo di ricerca etichettato; selettori giorno/ora e selezione orario etichettati; opzioni piano collegate alle proprie etichette.

## Interventi effettuati

1. Inserito URL canonico dell'app pubblicata, `https://leonardofiadino09-jpg.github.io/AulaFinder/`.
2. Inseriti Open Graph (titolo, descrizione, URL, immagine e testo alternativo) e Twitter Card per i link condivisi.
3. Aggiunto un link "Vai al contenuto principale", visibile quando raggiunto da tastiera.
4. Cambiato il raggruppamento delle SVG delle piantine da `role="img"` a `role="group"`, per non presentare le mappe interattive come immagini atomiche; i singoli locali mantengono nome accessibile e controlli da tastiera.
5. Rimossi i contorni di focus rosso/arancio e sostituiti con contorni turchesi visibili: sia per pulsanti sia per selettori, switch e locali SVG.
6. Aggiunti ascensore accanto alle scale della T.08 ed entrata a destra della T.07, piano terra.
7. Aggiornato il nome della cache del service worker affinché la PWA possa ricevere correttamente i file modificati.

## Limiti da conoscere

- AulaFinder è un'app a schermata unica: risultati, orari e schede vengono costruiti in JavaScript, senza URL individuali e normali link HTML. I motori di ricerca potranno comprendere la Home, ma **non è garantita l'indicizzazione di ogni classe o aula**. Non ho trasformato la navigazione in pagine statiche perché altererebbe l'architettura del progetto.
- `alt` e titoli corretti non garantiscono conformità WCAG completa. Per un audit esaustivo servirebbero test assistivi reali (VoiceOver e TalkBack), controllo automatico del contrasto su tutti i componenti e test sull'app installata.
- Le schermate di AulaFinder includono orari scolastici e dati relativi a docenti: prima di favorirne l'indicizzazione pubblica è necessario confrontarsi con l'istituto.
- La posizione dei due nuovi elementi della piantina riproduce le indicazioni ricevute, non costituisce una planimetria certificata per emergenze.

## Test effettuati

- 8 configurazioni su Chromium: 320, 390, 768 e 1366 px, ognuna in tema chiaro e scuro.
- 3 configurazioni mobile con interazioni touch simulate: 320 px tema scuro, 390 px tema chiaro e scuro.
- Ricerca, selettori giorno e ora, menu Orari apribile/richiudibile, pagine orari e piantine, zoom del locale selezionato, nuovi elementi T.08/T.07.
- Nessun errore JavaScript rilevato; nessun overflow orizzontale della pagina nelle dimensioni testate.
- Integrità del pacchetto e presenza di manifest, icone, immagini e file offline verificata.
- **Non testato:** Safari e iOS fisici, pubblicazione remota del repository, installazione reale della PWA, validazione WCAG con utenti reali.


## Aggiornamento V22
- Ingresso del piano terra ridisegnato come riquadro dedicato con icona porta.
- Blocco T.08 corretto in formato coerente con gli altri piani: scale e ascensore nello stesso elemento.
- Footer aggiornato con link diretto a Gmail precompilato verso aulafinder@gmail.com.
