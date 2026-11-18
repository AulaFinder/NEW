# Verifiche AulaFinder V49

**Risultati delle suite automatizzate: 67/67 controlli superati.**

## Ambiente e metodo

- Browser Chromium headless, test HTML/CSS/JavaScript incorporati nelle pagine di test per aggirare il blocco alle navigazioni `http://` e `file://` nell’ambiente.
- Viewport controllati: **320, 375, 390, 430, 681, 768, 1024, 1366 e 1920 px**.
- Suite base di 25 prove e suite estesa di 42 prove. Risultati non riproducono tutte le condizioni hardware di un telefono.
- Static check: `node --check` sui file JavaScript principali, controllo dei riferimenti nel service worker e confronto esatto dei cinque SVG originali e dei dati scolastici.
- I file video/audio vengono controllati come asset/codec; la riproduzione in un vero Safari/Android non è verificabile da questo ambiente.

## Controlli superati (suite base)

| Prova | Esito |
|---|---|
| load no JS errors | OK |
| home visible | OK |
| 49 version cards | OK |
| 5 fullscreen plan buttons | OK |
| tutorial panel count 7 | OK |
| versioni visible | OK |
| V49 badge visible | OK |
| preview buttons count | OK |
| tutorial visible | OK |
| tutorial search works | OK |
| availability has real data | OK |
| real SVG in tutorial | OK |
| finder zaino natural | OK |
| finder maximize | OK |
| route S01 Archivio | OK |
| route S01 Caldaie | OK |
| fullscreen map dialog | OK |
| fullscreen original svg | OK |
| fullscreen zoom | OK |
| fullscreen closes | OK |
| mobile brand does not navigate home | OK |
| no new JS errors | OK |
| mobile no horizontal viewport overflow | OK |
| desktop no overflow | OK |
| desktop brand returns home | OK |

## Controlli superati (suite estesa)

| Prova | Esito |
|---|---|
| unchanged data.js | OK |
| unchanged map-orientation.js | OK |
| unchanged config-docenti.js | OK |
| original SVG sotto | OK |
| original SVG terra | OK |
| original SVG primo | OK |
| original SVG secondo | OK |
| original SVG terzo | OK |
| no duplicate HTML ids | OK |
| assets version 1-49 | OK |
| all version preview images nonempty | OK |
| all PWA cache assets exist | OK |
| cache version 49 | OK |
| video and sound present | OK |
| tutorial email contact | OK |
| tutorial no cross-page actions | OK |
| no return tutorial button | OK |
| no emergency question in tutorial | OK |
| versioni 49 rows | OK |
| versioni search V49 | OK |
| versioni search versione 49 | OK |
| versioni search 49 | OK |
| versioni search findr | OK |
| versioni search navigatore | OK |
| versioni search gradiente | OK |
| version preview initially hidden | OK |
| version preview opened | OK |
| version preview image actual path | OK |
| version preview closes | OK |
| tutorial numbered no leading zero | OK |
| in tutorial real route | OK |
| finder tutorial internal | OK |
| stays tutorial page | OK |
| viewport no x overflow 320 | OK |
| viewport no x overflow 375 | OK |
| viewport no x overflow 390 | OK |
| viewport no x overflow 430 | OK |
| viewport no x overflow 681 | OK |
| viewport no x overflow 768 | OK |
| viewport no x overflow 1024 | OK |
| viewport no x overflow 1366 | OK |
| viewport no x overflow 1920 | OK |

## Problema reale individuato e risolto

Durante il primo test della V49 il Navigatore calcolava correttamente `S.01 → Archivio`, ma l’evento `change` del campo in perdita di focus poteva **cancellare il percorso appena mostrato**. È stato rimosso l’invalidamento di percorso ridondante sull’evento `change` (l’evento `input` invalida correttamente prima del submit). I test sono stati ripetuti e ora il percorso viene conservato.

## Regressioni evitate

- `data.js` **identico** alla V48 verificata.
- `map-orientation.js` **identico** alla V48.
- `config-docenti.js` **identico** alla V48.
- I cinque elementi `svg.plan` di tutte le piantine sono **identici** byte-per-byte a livello di serializzazione DOM HTML.
- Il navigatore continua a usare il calcolo dei corridoi precedente; la V49 cambia solo la rappresentazione e il punto grafico della Palestra.
- Sono presenti e non vuote 49 anteprime storiche della Home più le due varianti V8a/V8b.

## Limitazioni note (non dichiarate risolte)

1. **Riconoscimento vocale**: su smartphone può fallire con `audio-capture`, `not-allowed` o con browser che non implementano `SpeechRecognition`; la V49 distingue meglio gli errori ma non può correggere driver, permessi o browser non compatibili.
2. **Voce personalizzata**: non è stata introdotta una voce identica proprietaria; viene usata una voce italiana locale del sistema quando disponibile.
3. **Suono di apertura**: per policy autoplay alcuni browser impediscono il suono finché l’utente non interagisce. Il codice tenta una sola volta e non interrompe l’accessibilità del sito.
4. **Fullscreen e orientamento**: Fullscreen API e `screen.orientation.lock()` hanno supporto variabile sui telefoni; il CSS del visualizzatore fornisce un fallback ma va provato su Safari/iOS.
5. **Accessibilità**: la presenza di etichette, focus visibile e `prefers-reduced-motion` non è una certificazione universale WCAG; occorrono prove manuali con screen reader reali, ingrandimento testo e utenti con esigenze diverse.
6. **Hosting/offline**: non è stata eseguita una pubblicazione su GitHub Pages né una sessione offline vera con service worker attivato. Sono stati verificati sintassi, asset e nome della cache.
7. **Ranking nei motori di ricerca**: dipende da indicizzazione, contenuti, concorrenza e segnali esterni; non è controllabile solo con aggiornamenti al codice.

## Accettazione residua raccomandata

Prima della consegna pubblica verificare su almeno un Android e un iPhone: apertura, microfono, scelta aula/palestra, rotazione fullscreen, orb e suono, navigazione tramite tastiera assistiva e screen reader, caricamento offline e aggiornamento PWA. Nessun test virtuale può sostituire queste prove.
