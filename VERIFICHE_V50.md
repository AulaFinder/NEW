# Verifiche V50 · Test eseguiti

**18 novembre 2026.** Sono stati eseguiti test automatici nel motore Chromium, caricando direttamente HTML, CSS e JavaScript nel documento. Il sistema di esecuzione qui presente **blocca per policy la navigazione a URL locali/esterni**; quindi non è stato possibile verificare il caricamento reale via HTTP o installazione PWA. Non vengono dichiarati inesistenti test end-to-end.

| Test | Risultato | Evidenza / nota |
| --- | --- | --- |
| Sintassi JavaScript di tutti i file | PASS | `node --check` (eseguito a fine rilascio) |
| Init desktop 1366×800 e mobile 390×844 | PASS | Nessun errore JS nelle simulazioni; dati locali disponibili |
| Schermata Versioni | PASS | 50 elementi, V50 corrente, V49 precedente |
| Anteprima fullscreen | PASS | Apertura del viewer e chiusura, controlli disponibili |
| Finder | PASS | Apertura, chiusura, domanda docente, 18 ore per sigla di prova `AL SI` corrette coi dati |
| Marchio | PASS | Click da Orari non forza Home |
| Logo | PASS | Dialog aperto e richiuso con Esc |
| Tutorial | PASS | Sette note contestuali presenti |
| Home | PASS | Contatori di disponibilità calcolati dai dati per giorno e ora |
| Navigator | PASS | Tracce di esempio: `Palestra→T.08`, `Palestra→2.09`, `T.08→1.03`, `T.08→T.11`, `S.01→T.02`; polilinea visibile nella UI |
| Mappa fullscreen | PASS | Zoom 260%: su desktop esempio 3744×1440 rispetto a viewport 1440×805; su mobile scroll orizzontale esempio 1014 contro 390 pixel |
| Tema mobile | PASS parziale | Simulazione `prefers-color-scheme:dark` e toggle; localStorage non verificabile su documento `about:blank` |
| Freccia Orari dark mobile | PASS | Contrasto calcolato CSS: colore chiaro e controllo esposto |
| Media originali, autoplay audio | NON verificato su dispositivo | Browser e policy impediscono prova sonora/codec reale |
| PWA offline e aggiornamento reale | NON verificato su dispositivo | Cache e riferimenti controllati staticamente |
| Route walking fisiche | Non certificabili | La mappa resta uno schema; non sono stati percorsi i corridoi di persona |

**Nota sulla testabilità:** per simulare il codice è stato necessario nascondere programmaticamente l'overlay video, perché il browser di test impedisce di caricare il file multimediale. Nell'app reale un fallback temporizzato garantisce la sua chiusura anche se il video fallisce.

## Controlli manuali consigliati prima della pubblicazione

1. Android Chrome e iOS Safari: intro, fallback, autoplay audio; tema di sistema e salvataggio della scelta manuale dopo riavvio.
2. Maps fullscreen: verifica touch su ogni piano a orientamento verticale/orizzontale, drag su entrambi gli assi, uscita schermo intero.
3. Route della Palestra, scale e ascensore: confronto fisico con la segnaletica per escludere tratti attraversanti muri/porte non percorribili.
4. Finder: microfono e voce italiana locale, invio e suono in diversi browser.
5. PWA GitHub Pages: aggiornamento della cache da v49 a v50 e funzionamento offline.
6. Contrasto e navigazione completa con tastiera/lettore di schermo.
