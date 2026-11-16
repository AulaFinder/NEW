# AulaFinder V47

## Modifiche introdotte sulla V46

1. **Navigatore**: il pin corallo della destinazione viene disegnato al centro geometrico dell'aula, inclusa la Palestra. Il calcolo del percorso e il tracciato dei corridoi non sono stati cambiati.
2. **Logo**: al passaggio del mouse il logo si illumina progressivamente, compare un alone e passa un riflesso animato. L'immagine originale non è stata modificata.
3. **Titolo AulaFinder**: ridotto il bagliore della scritta «Aula» in modo da mantenere un buon contrasto. L'elettrone orbitante della V46 è mantenuto.
4. **Interfaccia**: micro-animazioni su pulsanti, schede, passaggi di pagina, ricerca e Finder. Sono rispettate le preferenze di movimento ridotto (`prefers-reduced-motion`).
5. **Tutorial**: realizzata una guida interattiva di sei tappe con pulsanti che aprono le funzioni vere del sito, progressione, accesso via tastiera e FAQ.
6. **PWA**: nome cache aggiornato e `tutorial.js` incluso nella cache offline.

## Struttura

- `index.html`: struttura del sito e markup della guida
- `style.css`: stile e animazioni
- `navigator.js`: marcatore di arrivo al centro dell'aula
- `tutorial.js`: logica dei sei capitoli della guida
- `sw.js`: cache PWA aggiornata

Tutti gli altri file funzionali (compresi `data.js`, `piantina.js`, `map-orientation.js`, `finder.js`) sono invariati rispetto alla V46.

## Installazione / GitHub Pages

Caricare **il contenuto** della cartella `AulaFinderV47` nella directory principale del repository GitHub Pages, senza creare una sottocartella aggiuntiva. Conservare tutti i file e le cartelle `assets/` e `icons/`.

Per la navigazione offline il service worker rinfresca la cache quando la nuova versione diventa attiva. In caso di vecchia versione: chiudere tutte le schede del sito, riaprirle e aggiornare la pagina.

I percorsi rimangono schematici e non sono adatti a emergenze o evacuazioni.
