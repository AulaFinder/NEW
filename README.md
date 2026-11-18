# AulaFinder V30 – Correzioni Navigatore e Orari mobile

Questa versione parte **integralmente da AulaFinder V29**. Sono conservati dati degli orari, piantine, layout, PWA, tema, ricerca generale, preferiti, cronologia, logo, footer e icone.

## Modifiche

1. **Navigatore:** corretta la lettura delle geometrie SVG. Le piantine originali sono nascoste nella navigazione e `getBBox()` / `isPointInFill()` su quei nodi restituivano valori vuoti; i percorsi finivano su linee schematiche non vincolate ai corridoi. Ora viene costruita una copia SVG fuori schermo, ma effettivamente renderizzata, per misurare le stanze e calcolare il tracciato sulle aree pedonali disegnate. Il programma non disegna più percorsi alternativi inventati se l'area della mappa non permette il collegamento. I passaggi tra piani usano gli elementi verticali rappresentati nella piantina.
2. **Navigatore / suggerimenti:** corretto il conflitto tra `blur` e clic/tocco sui risultati della ricerca; la tendina non si chiude trascinando il cursore sulla lista o scorrendola. La selezione da mouse viene acquisita prima della perdita del focus.
3. **Orari docenti:** la selezione dell'orario del docente rimane accessibile per sigla. **Ordinamento per cognome/sigla o materia** e filtro per nome/materia sono disponibili nella sezione **Professori liberi** (non nell'orario standard dei docenti).
4. **Mobile / Orari:** nascosto il menu a tendina che duplicava la ricerca testuale. Il riepilogo informativo compare prima della griglia, anche su schermi piccoli.
5. **Header mobile:** hamburger a sinistra del logo; pulsante Home e tema a destra. Il pulsante tema viene spostato sopra, liberando spazio per giorno e ora. Su PC l'intestazione rimane invariata.
6. **PWA:** aggiornata la versione della cache del service worker per distribuire le modifiche quando il sito è pubblicato.

## Test

Verificati i caricamenti del DOM e le interazioni con Chromium per larghezze 320, 360, 375, 390, 430, 680, 768, 1024, 1366 e 1440 px, sia in tema chiaro sia scuro nel campione. Controllati navigazione, input dei suggerimenti (mouse e touch simulato), ordinamento/ricerca Professori liberi, riepilogo mobile prima della griglia, percorso sul corridoio, assenza di overflow ed errori JavaScript. Sono stati verificati più percorsi sullo stesso piano e tra piani diversi; i campionamenti dei tratti disegnati sono interni ai corridoi delle planimetrie SVG.

**Limite importante:** queste piantine sono schematiche. Il percorso segue le aree visibili dei corridoi nel disegno, ma non è una verifica sul posto di accessi, porte, barriere o indicazioni di sicurezza. **Non usarlo per emergenze/evacuazione.** Non è stato eseguito un test su dispositivi fisici Android o iOS, Safari né una pubblicazione GitHub Pages reale.

## Installazione / GitHub Pages

Il file `index.html` deve restare nella root del progetto con `style.css`, `script.js`, `navigator.js`, `data.js`, `piantina.js`, `sw.js` e le cartelle `assets`/`icons`. In GitHub Pages estrarre tutto il contenuto direttamente nella root del repository (non caricare solo lo ZIP). Il progetto include `.nojekyll`.

Gli orari nei file sono previsioni scolastiche, non posizioni rilevate in tempo reale.


## V32: puntino scale anche in discesa
Il navigatore ora visualizza lo stesso puntino sul punto di accesso alle scale o all'ascensore sia sul piano di partenza sia sul piano di arrivo, compresi i percorsi in discesa. I marker sono sopra gli elementi della piantina per restare visibili; cambiano soltanto navigator.js, una regola CSS e la versione della cache PWA.


## V33 · Preferiti e indicazioni del Navigatore
- Preferiti: solo stella vuota/piena, senza contorno o sfondo colorato (bordo di focus soltanto da tastiera).
- Navigatore: punto pieno = partenza / uscita verso scale o ascensore; cerchio vuoto = destinazione / arrivo dal collegamento verticale.
- Simboli in primo piano rispetto alle stanze delle piantine; legenda affiancata su desktop e sotto la mappa su mobile.
- Service worker aggiornato alla cache V33. Gli orari, le mappe, l'algoritmo di percorso e le immagini non sono stati alterati.


## V34 · Navigazione e mobile
- La Palestra mantiene entrambe le geometrie di accesso (terra e seminterrato); il percorso sceglie la variante raggiungibile con costo minore.
- Algoritmo dei corridoi: Dijkstra con penalizzazione della vicinanza ai muri, senza uscire dalla superficie transitabile.
- Ore scolastiche visualizzate come 1, 2, 3, 4, 5, 6.
- Menu mobile: il pulsante hamburger scompare quando il pannello è aperto, pulsante × interno per chiudere, e la sezione Orari chiude il pannello.
- Professori liberi: la fascia dei filtri vuota è nascosta.
- Dropdown di selezione orari ripristinato su mobile, accanto alla ricerca digitata.
- Cognome Nome sostituisce Cognome / sigla nell'ordinamento dei professori.
- Schermata di caricamento provvisoria con il logo originale, adattiva, in attesa dell'immagine di riferimento non presente fra gli allegati di questa richiesta.


## Video di apertura fornito dagli studenti
- Il filmato `assets/aulafinder-caricamento.mp4` è una copia **identica** del video caricato, non rielaborata.
- Schermata responsive con logo al centro su PC e mobile, audio silenziato per permettere autoplay e `playsinline` per evitare il lettore a schermo intero sui telefoni.
- Al termine del filmato la schermata si chiude. In caso di restrizioni autoplay, errore o connessione lenta, l'app non resta bloccata. Chi ha attivato la riduzione del movimento visualizza soltanto una schermata statica per un breve momento.
- Il file poster JPG è ricavato direttamente da un fotogramma del video. La PWA memorizza il poster ma lascia gestire lo streaming MP4 al browser per rispettare le richieste HTTP Range.
- Test: verificati poster/riproduzione in Chromium tramite anteprima a 1366 e 390 px; orari e percorso S.01 → Palestra già verificati nell'insieme di test V34. Non verificati Safari e dispositivi fisici.

## V35 · Ritocchi mirati
- Nel menu mobile, al posto della X compare il logo originale e la scritta AulaFinder con effetto orbitale, coerenti con l'intestazione. Toccare il marchio chiude il menu e torna alla Home; restano disponibili il tocco sullo sfondo e il tasto Esc.
- Il filmato originale di caricamento è invariato. Sul mobile, per eliminare lo stacco netto fra video e bande, il filmato sfuma ai margini superiore/inferiore sopra uno sfondo coordinato e sfocato ricavato dal poster originale.
- Cache PWA aggiornata. Nessuna modifica agli orari, alle piantine o all'algoritmo del navigatore.


## V39
- piantina rifatta con approccio conservativo: mantenuta la planimetria originale e applicata solo la rotazione a 180° dell'intero piano, raddrizzando i gruppi stanza per conservare layout, scritte e icone senza deformazioni.
