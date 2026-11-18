# AulaFinder V49 · Il salto di qualità

Release ricostruita dalla **V48 verificata**, integrando la cronologia delle versioni ricavata dai file originali V1–V48.

## Esperienza e interfaccia

- Su smartphone i marchi AulaFinder dell'intestazione, del menu e del footer si illuminano al tocco, senza rientrare automaticamente nella Home. Su PC il comportamento dei collegamenti rimane quello precedente.
- Animazione di ritorno del logo ingrandito alla posizione originale, quando supportata dall'API Web Animations; scorciatoia per chi preferisce meno movimento.
- Pulsante Orari e freccia del menu mobile allineati all'interno della stessa voce.
- Colori, contrasto, indicatori a gradiente e marcatori della legenda del Navigatore aggiornati in entrambi i temi; anima la linea del percorso senza modificare il calcolo dei corridoi.
- Controlli per aprire ciascuna piantina in fullscreen con zoom e modalità orizzontale/fallback CSS su smartphone; gli SVG originali sono preservati.
- Accenti animati su Finder e sui due collegamenti rapidi della Home; contorno del focus visibile per la tastiera, rispettando `prefers-reduced-motion`.

## Finder

- Assistenza locale più flessibile per richieste scritte in modo colloquiale, ad esempio «Sono stanco e devo preparare lo zaino per domani».
- Suggerimenti raggruppati per argomenti, pannello trascinabile con tastiera/mouse/touch, ingrandimento e riduzione, chiusura centrata.
- Video orb alleggerito e riproduzione ciclica con tentativo di ripresa e formato fallback.
- Errori microfono spiegati più precisamente: il funzionamento dipende da browser, permessi e dispositivi; nessuna tecnologia esterna è stata aggiunta per garantire il riconoscimento vocale su ogni telefono.
- Voce italiana locale disponibile solo se già installata sul dispositivo. Una voce esclusiva identica ovunque **non è stata implementata** perché non garantibile senza un modello vocale dedicato.

## Tutorial e versioni

- Sette tappe **integralmente interne** al tutorial: ricerca, orari, disponibilità, navigatore, Finder, piantine e footer.
- Le piantine delle tappe sono copie degli SVG originali; le lezioni e i risultati demo provengono dai dati della scuola.
- FAQ con contatto email e spiegazione delle iniziali dei docenti.
- Pagina Versioni con ricerca tollerante agli errori, 49 schede apribili e **49 immagini anteprima reali**, più le varianti storiche V8a e V8b.

## Navigatore e avvio

- Marcatori più centrati sulle aule e partenza dalla Palestra evidenziata all'interno della stanza, con tratto di collegamento al corridoio.
- Corretta la cancellazione involontaria del percorso al rilascio del campo di destinazione.
- Filmato di ingresso reso più robusto con completamento automatico in caso di video bloccato; breve suono locale tentato soltanto al primo avvio e nel rispetto delle restrizioni audio del browser.

## Note sulle verifiche

Sono stati eseguiti test automatici in Chromium a livello HTML/CSS/JS, su desktop e viewport mobili, test di sintassi, comparazioni dei file originali e integrità dell'archivio. **Non costituiscono una certificazione di accessibilità universale né sostituiscono test su dispositivi fisici.** Vedi `VERIFICHE_V49.md`.
