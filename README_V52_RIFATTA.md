# AulaFinder V52 – ricostruzione pulita

**Base:** AulaFinderV51.zip. Ripresa delle modifiche V52 da specifica originale: effetti aurici, Home, fullscreen piantine, tutorial unico, Navigatore, Versioni, Orari, footer, Finder e Admin.

**Risorse originali:** tutte le immagini PNG/JPG e i video della V51 sono presenti e NON compressi, convertiti o sostituiti. La sola nuova anteprima V52 è conservata in WebP come le anteprime storiche della V51.

**PWA/cache:** versione aggiornata del service worker che privilegia sempre la rete e non rimane bloccata quando manca un file; richieste statiche HTML versionate per evitare vecchi CSS/JS. Supporto offline di fallback.

## Pubblicazione su GitHub Pages (repository AulaFinder/V52)

1. Apri il repository locale `V52` da GitHub Desktop con **Repository → Show in Explorer**.
2. Copia e sostituisci il **contenuto di questa cartella** nella radice del repository (non la cartella che la contiene). Mantieni `.git`. Rimuovi eventuale `.github/workflows/pubblica.yml` relativo al vecchio sistema ZIP.
3. Da GitHub Desktop: **Commit to main → Push origin**.
4. Su GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.
5. Con deploy completato (Actions verde), apri `https://aulafinder.github.io/V52/` in una nuova finestra in incognito; se hai un vecchio service worker, aggiorna una seconda volta.

Questa distribuzione è un sito statico pronto da caricare: `index.html` è nella radice con `assets`, `icons`, CSS e JS. Non richiede build né GitHub Actions personalizzate.

**Limiti onesti:** i dati Admin rimangono nel browser locale, Finder usa dati scolastici e non un modello online, alcuni comportamenti come microfono/permessi dipendono dal browser.
