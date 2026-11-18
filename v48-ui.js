/* V50 · Scroll intelligente: il menu non nasconde più intestazione e controlli. */
(()=>{
 'use strict';
 const h=document.getElementById('resultsTitle');
 if(h){const svg=h.querySelector('svg')?.cloneNode(true);if(svg)new MutationObserver(()=>{if(!h.querySelector('svg'))h.prepend(svg.cloneNode(true));}).observe(h,{childList:true});}
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 function reveal(el){
  if(!el||el.closest('[hidden]')||!el.getClientRects().length)return;
  const r=el.getBoundingClientRect(),topPad=96,bottomPad=20;
  if(r.top>=topPad && r.top<=innerHeight-bottomPad)return;
  const delta=r.top<topPad?r.top-topPad:r.top-innerHeight+bottomPad;
  window.scrollTo({top:Math.max(0,scrollY+delta),behavior:reduced()?'instant':'smooth'});
 }
 document.addEventListener('click',e=>{
  const target=e.target.closest('button,summary');if(!target)return;
  if(target.matches('[data-page],.side-link,#menuButton,#sidebarClose,.brand-title,[data-schedule]'))return;
  if(target.matches('#versioniPage summary,#tutorialPage .tutorial-faq summary')){
   setTimeout(()=>reveal(target),140);return;
  }
  if(target.matches('[data-nav-choice], [data-suggest], [data-room], [data-free-teacher]')){
   setTimeout(()=>reveal(document.querySelector('.page:not([hidden]) h1')),90);
  }
 },true);
})();
