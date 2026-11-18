# Checklist di rilascio V49

**Legenda:** COMPLETATO = implementato e verificato dove possibile in browser virtuale; PARZIALE = esiste una dipendenza esterna/hardware o un controllo manuale residuo; NON IMPLEMENTATO = escluso intenzionalmente per non fornire un falso risultato.

## Richieste del progetto

| Richiesta | Stato e nota |
|---|---|
| Marchio AulaFinder mobile senza ritorno Home | COMPLETATO — intestazione, menu e footer; desktop conserva navigazione. |
| Animazione rientro logo sul telefono | COMPLETATO — Web Animations e fallback per movimento ridotto; serve prova visuale su telefono. |
| Freccia Orari mobile nel riquadro | COMPLETATO — stessi ingombri delle altre voci. |
| Rimozione FAQ navigatore in emergenza dal tutorial | COMPLETATO — domanda rimossa; resta l’avvertenza generale di sicurezza. |
| Piantine a schermo intero orizzontale | PARZIALE — visualizzatore e fallback funzionano in Chromium, blocco orientamento dipende da browser. |
| Gradiente navigatore animato | COMPLETATO — barra, legenda, linea SVG; animazioni ridotte su richiesta del sistema. |
| Pin arrivo centrato | COMPLETATO — ancorato al centro del rettangolo originale della stanza. |
| Partenza Palestra nella stanza | COMPLETATO — marcatore dentro la palestra con collegamento visivo verso il corridoio. |
| Rimozione terminologia hamburger/burger dalla pagina Versioni | COMPLETATO — nomi neutrali del menu; changelog aggiornato. |
| Ricerca intelligente Versioni | COMPLETATO — numeri, sigle, sinonimi ed errori; test V49/49/versione 49/findr. |
| Versione attuale V49 senza dicitura basata sulla V47 | COMPLETATO — pagina Versioni aggiornata. |
| Animazione logo menu/footer mobile | COMPLETATO — luce al tocco, non naviga alla Home. |
| Tutorial totalmente interno | COMPLETATO — tutte le tappe con elementi funzionali autonomi. |
| Contatto email nelle FAQ | COMPLETATO — aulafinder@gmail.com. |
| Passi tutorial senza zero iniziale | COMPLETATO — da 1 a 7. |
| Disponibilità interattive nel tutorial | COMPLETATO — aule/professori con dati reali, filtri giorno/ora. |
| Eliminazione Torna al tutorial | COMPLETATO — nessun cambio pagina dai controlli della guida. |
| Testo introduttivo e frase Navigatore | COMPLETATO — riscritti in italiano naturale. |
| Scroll del tutorial pertinente | COMPLETATO — spostamento solo quando il pannello non è sufficientemente visibile. |
| Piantine originali nel tutorial | COMPLETATO — cloni degli SVG V48 identici, nessuna riscrittura geometrica. |
| Palette navigatore chiaro/scuro | COMPLETATO — sfondi, barre e legenda varianti; matematica percorso invariata. |
| Orb Finder in ciclo | PARZIALE — MP4 H264 leggero con loop, retry e fallback WebP; autoplay reale dipende da browser. |
| Finestra Finder trascinabile/intelligente | COMPLETATO — spostabile, massimizzabile, minimizzabile, posizione salvata, tastiera Ctrl+frecce. |
| X chiusura centrata | COMPLETATO — SVG dentro pulsante display grid. |
| Molte domande Finder | COMPLETATO — suggerimenti raggruppati in categorie. |
| Voce proprietaria uguale per tutti, offline | NON IMPLEMENTATO — non riproducibile in modo affidabile senza modello TTS locale distribuito. |
| Finder aiuto colloquiale / zaino | COMPLETATO — parser locale e risposte amichevoli; non è un LLM generativo. |
| Audio-capture su qualunque telefono | PARZIALE — messaggi/percorso permessi migliorati, compatibilità hardware non forzabile. |
| Pulsante Finder animato | COMPLETATO — sfumatura, anello, effetto tocco. |
| Animazioni e gradienti coerenti | COMPLETATO — mirati, con preferenza movimento ridotto. |
| Contorni dei controlli | COMPLETATO — focus visibile accessibile con accento luminoso, non rimosso. |
| Scorciatoie Home più curate | COMPLETATO — Aule libere e Professori liberi in palette contrastate. |
| Metadati pubblicazione/indicizzazione | PARZIALE — struttura SEO e sitemap aggiornata; posizione su Google non garantibile. |
| Versioni: V49 salto di qualità, storico completo | COMPLETATO — V1–V49 con fonti e dettagli. |
| Anteprima Home di ogni versione | COMPLETATO — 49 file WebP tratti da file reali, oltre a V8a e V8b. |
| Analisi criticità e idee future | COMPLETATO — ANALISI_V49.md. |
| Intro fluida e suono solo apertura | PARZIALE — fallback e limite temporale, suono tentato una sola volta e potenzialmente bloccato dal browser. |
| Accessibilità universale | PARZIALE — verifiche automatiche e supporto riduzione movimento; certificazione universale e test fisici non effettuati. |
| Check desktop/mobile, V49 e resoconto | COMPLETATO — 67/67 test; limiti espliciti. |
| Cartella principale sempre Vnumero | COMPLETATO — cartella V49 all’interno dell’archivio. |
| README, CHANGELOG e documentazione GitHub | COMPLETATO — file aggiornati nel pacchetto. |

### Cosa non va confuso con un risultato garantito

Una voce proprietaria offline, il microfono operativo su tutti i telefoni, il ranking di Google e una certificazione di accessibilità per ogni disabilità non possono essere dichiarati ottenuti solo dal codice. I punti sono descritti come limitazioni e non come implementazioni completate.
