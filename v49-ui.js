/* AulaFinder V49: interazioni di presentazione. Non modifica orari o geometrie SVG originali. */
(()=>{
 'use strict';
 const reduce=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 const isMobile=()=>matchMedia('(max-width:680px)').matches;
 const prefers=()=>reduce()?'instant':'smooth';

 // V50 gestisce marchi e finestra logo in modo unificato su tutti i dispositivi.
 // Le piantine esistenti vengono CLONATE: stessi SVG, stessa geometria e stessi testi.
 const cards=[...document.querySelectorAll('#piantinaPage .plan-card')];
 const viewer=document.createElement('div');viewer.id='af49MapViewer';viewer.className='af49-map-viewer';viewer.hidden=true;
 viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label','Piantina a schermo intero');
 viewer.innerHTML=`<div class="af49-map-viewer-bar"><strong id="af49ViewerTitle">Piantina</strong><div class="af49-viewer-buttons"><button type="button" id="af49ZoomOut" aria-label="Riduci ingrandimento">−</button><span id="af49ZoomLabel" aria-live="polite">100%</span><button type="button" id="af49ZoomIn" aria-label="Ingrandisci mappa">+</button><button type="button" id="af49ViewerClose" aria-label="Chiudi la piantina a schermo intero">✕</button></div></div><div class="af49-map-viewer-scene" tabindex="0" aria-label="Mappa scorrevole: trascina per esplorare le aule"><div class="af49-map-viewer-stage" id="af49ViewerStage"></div></div><div class="af49-map-viewer-note" id="af49ViewerNote" aria-live="polite">Tocca un'aula per vedere il nome.</div>`;
 document.body.append(viewer);
 const stage=viewer.querySelector('#af49ViewerStage');
 const scene=viewer.querySelector('.af49-map-viewer-scene');
 let opener=null,zoom=1,fitWidth=900,fitHeight=600;
 function setZoom(value){
  zoom=Math.min(2.6,Math.max(.75,value));
  stage.style.width=Math.round(fitWidth*zoom)+'px';stage.style.height=Math.round(fitHeight*zoom)+'px';
  const svg=stage.querySelector('svg.plan');if(svg){svg.style.width='100%';svg.style.height='100%';}
  stage.style.transform='none';
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
  viewer.hidden=false;document.body.classList.add('af49-map-fullscreen-open');
  const vb=copy.viewBox.baseVal;const sceneWidth=scene.clientWidth||innerWidth,sceneHeight=scene.clientHeight||innerHeight-100;
  const ratio=vb.width&&vb.height?vb.width/vb.height:1.5;fitWidth=Math.min(sceneWidth,sceneHeight*ratio);fitHeight=fitWidth/ratio;
  setZoom(1);scene.scrollLeft=0;scene.scrollTop=0;
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
 function zoomAt(value,px=.5,py=.5){
  const before=zoom;const left=scene.scrollLeft,top=scene.scrollTop;
  setZoom(value);
  const ratio=zoom/before;
  scene.scrollLeft=(left+scene.clientWidth*px)*ratio-scene.clientWidth*px;
  scene.scrollTop=(top+scene.clientHeight*py)*ratio-scene.clientHeight*py;
 }
 let pan=null;
 scene.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pan={id:e.pointerId,x:e.clientX,y:e.clientY,left:scene.scrollLeft,top:scene.scrollTop,moved:false};});
 scene.addEventListener('pointermove',e=>{if(!pan||e.pointerId!==pan.id)return;const dx=e.clientX-pan.x,dy=e.clientY-pan.y;
  if(Math.hypot(dx,dy)>7){pan.moved=true;try{scene.setPointerCapture(e.pointerId);}catch(_){}scene.scrollLeft=pan.left-dx;scene.scrollTop=pan.top-dy;}});
 scene.addEventListener('pointerup',()=>{pan=null;});scene.addEventListener('pointercancel',()=>{pan=null;});
 scene.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();const r=scene.getBoundingClientRect();zoomAt(zoom+(e.deltaY<0?.15:-.15),(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);},{passive:false});
 viewer.querySelector('#af49ViewerClose').addEventListener('click',closeViewer);
 viewer.querySelector('#af49ZoomIn').addEventListener('click',()=>zoomAt(zoom+.25));
 viewer.querySelector('#af49ZoomOut').addEventListener('click',()=>zoomAt(zoom-.25));
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
  if(!target||target.matches('.team-member')||target.closest('#af49MapViewer')&&target.disabled)return;
  target.classList.remove('af49-tap-glow');void target.offsetWidth;target.classList.add('af49-tap-glow');
  setTimeout(()=>target.classList.remove('af49-tap-glow'),480);
 },{passive:true});
})();
