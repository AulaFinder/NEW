/* AulaFinder V49: interazioni di presentazione. Non modifica orari o geometrie SVG originali. */
(()=>{
 'use strict';
 const reduce=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 const isMobile=()=>matchMedia('(max-width:680px)').matches;
 const prefers=()=>reduce()?'instant':'smooth';

 // I marchi sul telefono diventano controlli di animazione, non scorciatoie Home.
 function markBrand(element){
  if(!element)return;
  element.classList.remove('af49-brand-glow');void element.offsetWidth;
  element.classList.add('af49-brand-glow');
  const end=()=>element.classList.remove('af49-brand-glow');
  element.addEventListener('animationend',end,{once:true});
  setTimeout(end,1000);
 }
 function refreshBrandLabels(){
  document.querySelectorAll('.brand-title[data-page="home"],#sidebarClose').forEach(el=>{
   if(!el.dataset.af49OriginalLabel)el.dataset.af49OriginalLabel=el.getAttribute('aria-label')||'';
   if(isMobile())el.setAttribute('aria-label','Anima il marchio AulaFinder');
   else if(el.dataset.af49OriginalLabel)el.setAttribute('aria-label',el.dataset.af49OriginalLabel);
  });
 }
 document.addEventListener('click',event=>{
  if(!isMobile())return;
  const brand=event.target.closest('.brand-title[data-page="home"],#sidebarClose,.footer-logo');
  if(brand){
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
   markBrand(brand);
  }
 },true);
 refreshBrandLabels();window.addEventListener('resize',refreshBrandLabels,{passive:true});

 // Ritorno animato del logo dal dialogo alla sua posizione nel titolo.
 const dialog=document.getElementById('logoDialog');
 const originalLogo=document.querySelector('#logoButton img');
 let closingLogo=false;
 function closeLogo(){
  if(!dialog?.open||closingLogo)return;
  if(reduce()||!originalLogo){dialog.close();return;}
  closingLogo=true;dialog.classList.add('af49-logo-returning');
  const picture=dialog.querySelector('img');
  const a=picture.getBoundingClientRect(),b=originalLogo.getBoundingClientRect();
  const startX=a.left+a.width/2,startY=a.top+a.height/2,endX=b.left+b.width/2,endY=b.top+b.height/2;
  const sx=b.width/a.width,sy=b.height/a.height;
  const anim=picture.animate([
   {transform:'translate(0,0) scale(1)',opacity:1,filter:'brightness(1)'},
   {transform:`translate(${endX-startX}px,${endY-startY}px) scale(${sx},${sy})`,opacity:.9,filter:'brightness(1.42) drop-shadow(0 0 13px #8efdea)'}
  ],{duration:480,easing:'cubic-bezier(.23,.83,.2,1)',fill:'forwards'});
  const finish=()=>{
   try{dialog.close();}catch(_){}
   dialog.classList.remove('af49-logo-returning');closingLogo=false;
   originalLogo.closest('button')?.classList.add('af49-logo-landing');
   setTimeout(()=>originalLogo.closest('button')?.classList.remove('af49-logo-landing'),600);
  };
  anim.finished.then(finish).catch(finish);
 }
 dialog?.addEventListener('click',e=>{
  if(isMobile()&&e.target===dialog){e.preventDefault();e.stopImmediatePropagation();closeLogo();}
 },true);
 dialog?.addEventListener('cancel',e=>{if(isMobile()){e.preventDefault();closeLogo();}},true);

 // Le piantine esistenti vengono CLONATE: stessi SVG, stessa geometria e stessi testi.
 const cards=[...document.querySelectorAll('#piantinaPage .plan-card')];
 const viewer=document.createElement('div');viewer.id='af49MapViewer';viewer.className='af49-map-viewer';viewer.hidden=true;
 viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label','Piantina a schermo intero');
 viewer.innerHTML=`<div class="af49-map-viewer-bar"><strong id="af49ViewerTitle">Piantina</strong><div class="af49-viewer-buttons"><button type="button" id="af49ZoomOut" aria-label="Riduci ingrandimento">−</button><span id="af49ZoomLabel" aria-live="polite">100%</span><button type="button" id="af49ZoomIn" aria-label="Ingrandisci mappa">+</button><button type="button" id="af49ViewerClose" aria-label="Chiudi la piantina a schermo intero">✕</button></div></div><div class="af49-map-viewer-scene"><div class="af49-map-viewer-stage" id="af49ViewerStage"></div></div><div class="af49-map-viewer-note" id="af49ViewerNote" aria-live="polite">Tocca un'aula per vedere il nome.</div>`;
 document.body.append(viewer);
 const stage=viewer.querySelector('#af49ViewerStage');
 let opener=null,zoom=1;
 function setZoom(value){
  zoom=Math.min(2.6,Math.max(.75,value));
  stage.style.setProperty('--af49-viewer-zoom',zoom);
  viewer.querySelector('#af49ZoomLabel').textContent=Math.round(zoom*100)+'%';
 }
 function showFloor(card){
  const svg=card.querySelector('svg.plan');if(!svg)return;
  opener=document.activeElement;
  stage.replaceChildren();
  const copy=svg.cloneNode(true);copy.classList.add('af49-viewer-plan');copy.removeAttribute('id');
  copy.querySelectorAll('g.room').forEach(g=>{g.removeAttribute('tabindex');g.removeAttribute('role');});
  stage.append(copy);
  viewer.querySelector('#af49ViewerTitle').textContent=card.querySelector('.plan-banner h2')?.textContent||'Piantina';
  viewer.dataset.theme=document.documentElement.dataset.theme||'light';
  viewer.hidden=false;document.body.classList.add('af49-map-fullscreen-open');setZoom(1);
  viewer.querySelector('#af49ViewerClose').focus({preventScroll:true});
  viewer.querySelector('#af49ViewerNote').textContent="Ruota il telefono per una visione più ampia oppure usa i controlli di ingrandimento.";
  // Fullscreen API opzionale: l'overlay funziona anche su Safari senza supporto alla API.
  if(viewer.requestFullscreen){
   try {
    const p=viewer.requestFullscreen();
    p?.then?.(()=>{
     try {screen.orientation?.lock?.('landscape')?.catch?.(()=>{});}catch(_){}
    })?.catch?.(()=>{});
   }catch(_){}
  }
 }
 function closeViewer(){
  if(viewer.hidden)return;
  viewer.hidden=true;stage.replaceChildren();document.body.classList.remove('af49-map-fullscreen-open');
  if(document.fullscreenElement===viewer)document.exitFullscreen?.().catch?.(()=>{});
  opener?.focus?.({preventScroll:true});
 }
 cards.forEach(card=>{
  const banner=card.querySelector('.plan-banner');if(!banner)return;
  const button=document.createElement('button');button.type='button';button.className='af49-plan-expand';
  button.setAttribute('aria-label','Apri '+(banner.querySelector('h2')?.textContent||'piantina')+' a schermo intero orizzontale');
  button.title='Visualizza a schermo intero';
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg><span class="sr-only">Schermo intero</span>';
  banner.append(button);
  button.addEventListener('click',()=>showFloor(card));
 });
 viewer.querySelector('#af49ViewerClose').addEventListener('click',closeViewer);
 viewer.querySelector('#af49ZoomIn').addEventListener('click',()=>setZoom(zoom+.25));
 viewer.querySelector('#af49ZoomOut').addEventListener('click',()=>setZoom(zoom-.25));
 viewer.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();closeViewer();}
  if(e.key==='Tab'){
   const buttons=[...viewer.querySelectorAll('button:not([disabled])')];
   const first=buttons[0],last=buttons.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 viewer.addEventListener('click',e=>{
  const g=e.target.closest('g.room');if(!g)return;
  const name=(g.dataset.t||'').split('·')[0].trim();
  stage.querySelectorAll('.af49-room-highlight').forEach(el=>el.classList.remove('af49-room-highlight'));
  g.classList.add('af49-room-highlight');viewer.querySelector('#af49ViewerNote').textContent=name||'Ambiente selezionato';
 });
 document.addEventListener('fullscreenchange',()=>{
  if(!document.fullscreenElement&&!viewer.hidden){
   // Se il sistema esce dal fullscreen, resta il visualizzatore accessibile.
   viewer.classList.add('af49-viewer-fallback');
  }
 });

 // Feedback visivo su touch senza eliminare il focus visibile per chi usa tastiera.
 document.addEventListener('pointerdown',e=>{
  const target=e.target.closest('button,.floor-option,summary');
  if(!target||target.closest('#af49MapViewer')&&target.disabled)return;
  target.classList.remove('af49-tap-glow');void target.offsetWidth;target.classList.add('af49-tap-glow');
  setTimeout(()=>target.classList.remove('af49-tap-glow'),480);
 },{passive:true});
})();
