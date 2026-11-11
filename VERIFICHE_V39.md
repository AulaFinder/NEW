# Verifiche AulaFinderV39

## Obiettivo
Usare la planimetria originale corretta e ruotarla di 180° **senza ridisegnare le stanze**.

## Intervento eseguito
- base di partenza: codice completo di AulaFinderV36;
- modifica limitata al file `map-orientation.js`;
- rotazione dell'intera piantina a 180°;
- contro-rotazione di ogni `g.room` attorno al proprio centro (`data-cx`, `data-cy`) per mantenere identici:
  - riquadri;
  - scritte;
  - icone;
  - layout interno dei locali speciali.

## Controlli eseguiti
- check sintassi JavaScript di:
  - `map-orientation.js`
  - `piantina.js`
  - `script.js`
- verifica che il resto del progetto non sia stato alterato rispetto alla base scelta;
- verifica che l'intervento sia confinato alla sola logica di orientamento della piantina.

## Risultato atteso
Le mappe devono corrispondere alle versioni corrette originali, ma ruotate di 180°, senza deformazioni o sovrapposizioni introdotte da overlay ricostruiti.
