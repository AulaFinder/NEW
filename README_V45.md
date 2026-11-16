# AulaFinder V45

Base: AulaFinderV44, mantenute le piantine e gli orari originali.

## Funzionalità introdotte

- Selezione delle aule sulla piantina: clonazione con rotazione invariata e ingrandimento corretto; etichette dei locali speciali sempre visibili.
- Navigatore: segnaposto di arrivo a forma di aula, legenda corrispondente e percorso con gradiente più contrastato.
- Preferiti della Home: solo stella, accesso ai preferiti invariato.
- Pulsanti menu/Home: allineamento centrale interno a tutte le risoluzioni mobile.
- Motto dell'intestazione: Il tuo navigatore scolastico.
- Professori liberi: default solo ore buche (assenza di lezione con almeno una lezione precedente e successiva nello stesso giorno); switch per tutte le ore senza lezione. I dati non confermano la presenza a scuola.
- Admin: pulsante ripristinato nel footer con contenuto in fase di elaborazione.
- Finder: assistente contestuale che interroga `data.js`, richiede la classe per le domande personali, offre prompt rapidi e risposta testuale. La sintesi vocale viene utilizzata quando la domanda è stata dettata. Microfono opzionale tramite Web Speech API (non disponibile ovunque).
- Ricerca Home: dettatura vocale, dove supportata.
- SEO: titolo, descrizioni, indicizzazione consentita, metadati social, JSON-LD WebSite, sitemap. Non è possibile garantire un posizionamento specifico sui motori di ricerca.

## Note tecniche e privacy

Finder **non è un servizio di IA remota**: interpreta un insieme limitato di domande e legge gli orari già nel sito. Non inventa modifiche scolastiche in tempo reale. Per usare il riconoscimento vocale occorre un browser con supporto Web Speech API, HTTPS e permesso del microfono. Alcuni browser elaborano la voce sui propri server. Per privacy il sito non salva registrazioni audio; la classe scelta viene memorizzata solo localmente nel browser.

## Pubblicazione

Carica **tutto il contenuto** della cartella `AulaFinderV45` nella root del repository GitHub Pages (non annidare la cartella).
Per contribuire all'indicizzazione, verifica il dominio e invia `https://leonardofiadino09-jpg.github.io/AulaFinder/sitemap.xml` nella Google Search Console. Il file robots.txt nel sottopercorso non sostituisce quello eventualmente richiesto alla root del dominio.
