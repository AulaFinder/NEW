# Verifiche AulaFinder V47

## Metodo

Test automatici e visuali in Chromium con JavaScript, CSS e immagini del progetto caricati integralmente. Visualizzazioni mobili simulate; **non** sono state eseguite prove su smartphone reali o su Safari fisico.

## 1. Navigatore

- **S.01 → S.03**: arrivo centrato sul rettangolo S.03; scarto a 1366 px **0,012 px**, a 390 px **0,005 px**, a 320 px **0,004 px**.
- **S.01 → T.01** (cambio piano): il marcatore d'arrivo coincide con il centro dell'aula T.01; controllo dei punti scale e della presenza della linea.
- **S.01 → Palestra**: marcatore centrato sulla Palestra del piano sotterraneo.
- Il tracciato e il grafo dei corridoi non sono stati modificati.
- Le voci della legenda, il pin corallo e i simboli di partenza/scale restano presenti.

## 2. Tutorial

- Sei schede selezionabili: Ricerca, Orari, Disponibilità, Navigatore, Finder, Preferiti e mappe.
- Navigazione con Avanti, Indietro, schede e tasti freccia, Home/End.
- Barra di avanzamento e contatore aggiornati sulla tappa corrente.
- Pulsante «Prova Finder» apre il pannello (corretto anche il caso di chiusura accidentale da click esterno).
- Collegamenti «Prova ora» verso Home, Orari, Aule libere, Navigatore, Piantina funzionanti.
- Quattro FAQ espandibili presenti.

## 3. Animazioni

- Hover su logo PC: alone visibile, riflesso animato, luminosità controllata.
- Hover sul titolo: gradiente e orbita della V46 mantenuti, testo «Aula» più leggibile con `brightness(1.035)`.
- Test `prefers-reduced-motion: reduce` a 390 e 1366 px: animazioni non essenziali disattivate, tutorial e navigatore funzionanti.

## 4. Responsive e temi

- Collaudi completi: **320**, **390** (chiaro e scuro), **768**, **1366** px.
- Ulteriori controlli dei sei capitoli, senza overflow: **375**, **430** (scuro), **1440** px.
- Nessun errore JavaScript nei casi verificati.
- Nessun overflow orizzontale indesiderato nei casi verificati.

## 5. Conservazione delle funzionalità

Confronto dei file della V46 e della V47 prima della documentazione: **54 file identici**, quattro modificati (`index.html`, `style.css`, `navigator.js`, `sw.js`) e uno nuovo (`tutorial.js`). `data.js`, immagini, piantine, altri algoritmi, Finder e orari non sono stati alterati.

## Limiti

Le prove descritte verificano i casi elencati; non garantiscono l'assenza di ogni difetto su tutti i dispositivi e browser. I tragitti sono costruiti sulle piantine schematiche del sito, non su una mappatura topografica certificata.
