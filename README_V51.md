# AulaFinder V51 | 18 novembre 2026

## Aprire il progetto
Apri `index.html` con un server locale o pubblica l'intera cartella su GitHub Pages / un hosting statico HTTPS. Per una prova locale con Python, dalla cartella AulaFinderV51:

```bash
python -m http.server 8000
```

Poi visita `http://localhost:8000`. **È importante servire i file via HTTP(S)**: il Tutorial incorpora il sito dentro un iframe della stessa origine e, aprendolo direttamente come `file://`, alcuni browser bloccano o limitano la comunicazione fra i documenti. Microfono e riconoscimento vocale richiedono un browser compatibile e un contesto sicuro (HTTPS o localhost) e il permesso dell'utente.

## Cosa cambia nella V51

- **Finder**: all'apertura non seleziona automaticamente i campi e non apre la tastiera mobile; finestra trascinabile e ridimensionabile con presa dedicata (anche da tastiera), comando a schermo intero corretto, bordo di focus non ciano, logo video originale silenzioso, suggerimenti che ruotano senza elenco invasivo, risposta orientata a tutte le sezioni del sito e percorsi da/a più ambienti; microfono con barre animate dall'intensità del suono quando consentito dal browser.
- **Suoni**: eliminata la sintesi vocale dell'assistente; i video restano muti e le animazioni non producono effetti audio.
- **Navigatore**: il tratto disegnato si estende dal centro geometrico dell'ambiente di partenza al centro dell'ambiente di arrivo (conservando il grafo dei corridoi). Animazioni sobrie in loop per i simboli della legenda. I percorsi sono schemi informativi basati sulle piantine, non misurazioni certificate né indicazioni per evacuazione.
- **Tutorial**: sette tappe con una copia interattiva del sito vero all'interno della sezione. La navigazione della mini-app non porta fuori dal tutorial e non duplica i dati. Il tutorial non si incorpora ricorsivamente.
- **Admin**: nuova area grafica ad alto contrasto, keypad virtuale QWERTY con feedback, pulsante per mostrare il codice, schermata di riepilogo e blocco sessione. Password locale impostata a **kiwi**. **Attenzione**: essendo un sito statico, la password verificata nel browser è dimostrativa e **non è una protezione server**. Nessun dato amministrativo sensibile è modificabile nell'area.
- **Versioni**: sezione con V1–V51 navigabili e ricercabili, parole trovate evidenziate, barra cronologica con gradiente e selezione arrotondata, anteprime verificabili e pulsante di ingrandimento con sola icona. Non sono inventate immagini o cronologie per versioni assenti nei file disponibili.
- **Interfaccia**: animazioni intelligenti del marchio senza spostamenti di pagina; focus più pulito su mouse/touch; risposta di sfondo al tocco come increspature d'acqua, con limitazione delle animazioni e rispetto della preferenza di riduzione del movimento; menu Orari e palette ritoccati, numeri delle ore totali in forte contrasto, pulsanti e simboli riallineati, gradiente mobile più uniforme, pulsante Finder non sovrapposto ad Admin nel footer.
- **Offline**: versione del service worker aggiornata alla V51; aggiunti i nuovi script alla cache dell'app.

## Provenienza e limite importante

**Questa V51 è stata sviluppata dalla copia completa di AulaFinder V48 recuperabile nella sessione di lavoro.** Gli ZIP V49 e V50 menzionati nella conversazione precedente non erano disponibili come file originali in questa sessione. Di conseguenza **non è garantita la conservazione delle modifiche introdotte esclusivamente in V49/V50**. Non sostituire una V50 in produzione senza prima confrontare le cartelle. L'animazione Finder riutilizza `assets/finder-orb.webm` presente nella V48: non è stato fornito un nuovo file del logo nel turno corrente.

## Test
Leggere `VERIFICHE_V51.md`. Le prove DOM in Chromium sono state effettuate caricando HTML/CSS/JS locali e simulando le interazioni; questa piattaforma ha bloccato la normale navigazione HTTP/file nel browser di test, quindi non è stato possibile completare un collaudo integrale dell'iframe live, dell'installazione PWA e della registrazione audio su dispositivi reali. Sono richieste prove finali manuali su Chrome/Firefox/Safari e su telefono prima della consegna.
