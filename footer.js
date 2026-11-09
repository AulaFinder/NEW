// AulaFinder: selezione autori. Su PC resta attivo l'hover CSS; su mobile il tap rivela il nome.
(() => {
  'use strict';
  const buttons = Array.from(document.querySelectorAll('.team-member'));
  const caption = document.getElementById('teamSelectedName');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const wasSelected = btn.classList.contains('is-selected');
    buttons.forEach(other => { other.classList.remove('is-selected'); other.setAttribute('aria-pressed', 'false'); });
    if (wasSelected) { caption.hidden = true; caption.textContent = ''; return; }
    btn.classList.add('is-selected'); btn.setAttribute('aria-pressed', 'true');
    caption.textContent = btn.dataset.person; caption.hidden = false;
  }));
})();
