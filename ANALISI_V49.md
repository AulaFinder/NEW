# Analisi tecnica AulaFinder dopo la V49

## Miglioramenti prioritari prima della consegna definitiva

1. **Prova su telefoni reali (alta priorità).** Verificare Safari su iPhone e Chrome su Android, soprattutto fullscreen, rotazione, campo microfono, tastiera virtuale e orb/video. Le API e i codec disponibili non sono uguali su tutte le piattaforme.
2. **Riconoscimento vocale offline (alta priorità per la funzione voce).** Web Speech non garantisce supporto locale né autorizzazioni su tutti i browser. Per un'esperienza identica servirebbe un modello di trascrizione distribuito con l'app, con trade-off importanti di peso, prestazioni e privacy; non è incluso nella V49.
3. **Dati aggiornati (alta priorità).** L'orario è statico: inserire una data di revisione visibile e una procedura controllata di aggiornamento; in seguito valutare un'integrazione con fonti scolastiche autorizzate.
4. **Accessibilità con utenti e tecnologie assistive (alta priorità).** Test reali con VoiceOver, TalkBack, NVDA, zoom testo 200/400%, navigazione solo tastiera, contrasto in tutte le condizioni e sensibilità al movimento. I test automatici non possono certificare usabilità per ogni disabilità.
5. **Versioni storiche (media priorità).** Tenere gli screenshot pre-generati e aggiornare i testi del changelog da commit/tag reali quando il repository avrà una storia Git completa.
6. **Durata del caricamento (media priorità).** Il video introduttivo è relativamente pesante per connessioni lente; monitorare tempi e frequenza degli errori e, se necessario, prevedere uno skip esplicito e progressivo.
7. **Test del percorso per tutti gli ingressi (media priorità).** Validare i collegamenti Palestra e accessi scala/ascensore con sopralluogo e segnaletica reale; il percorso non sostituisce cartelli o procedure di sicurezza.
8. **Prestazioni della PWA (media priorità).** Preferire cache aggiornabile e screenshot storici compressi; verificare rete mobile lenta, quota disco, aggiornamento del service worker e comportamento offline reale.

## Funzioni da valutare per la V50

- «Prepara lo zaino» con preferenze utente locali (es. materie/priorità della classe), senza raccogliere informazioni sensibili.
- Modalità accessibilità avanzata con ingrandimento del testo e controllo di animazioni/effetti.
- Ricerca nelle versioni anche per intervallo, categoria e data reale delle release, quando disponibili dati attendibili.
- Controllo automatico dei dati/JSON orari in CI e suite Playwright eseguibile a ogni release.
- «Segnala un errore dell'aula» con bozza email a `aulafinder@gmail.com`, senza inviare automaticamente dati personali.

## Limiti non aggirati artificialmente

L'audio all'apertura può essere impedito dal browser per policy autoplay. Nessuna voce TTS uniforme proprietaria e nessun riconoscimento offline universale sono stati introdotti. Le prove su screenshot e viewport virtuali non equivalgono a test su iPhone/Android reali né su assistive technology: queste parti vanno verificate prima della pubblicazione definitiva.
