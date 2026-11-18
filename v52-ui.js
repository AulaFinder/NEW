/* AulaFinder V52 · enhancements only, no server or AI capabilities invented. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const nested=new URLSearchParams(location.search).has('af52guide')||window.frameElement?.id==='af51LiveFrame';
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;

 // One live guided site: expose only the current tutorial function in the embedded UI.
 if(nested){
  document.documentElement.classList.add('af52-in-demo');
  const pages=['home','orari','orari','navigator','home','piantina','home'];
  let activeStep=0;
  document.addEventListener('click',event=>{
   if(!event.isTrusted)return; // The guide itself may programmatically change sections.
   const el=event.target.closest('a[href], [data-page], [data-schedule], #menuButton, #sidebarClose, #finderLaunch, #finderClose, #logoButton, #themeToggle');
   if(!el)return;
   const allowedFinder=activeStep===4&&(el.matches('#finderLaunch, #finderClose'));
   const allowedSchedule=(activeStep===1||activeStep===2)&&el.matches('[data-schedule]')&&el.closest('#orariPage');
   if(allowedFinder||allowedSchedule||el.matches('#themeToggle'))return;
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  },true);
  function selectStep(n){
   activeStep=Math.max(0,Math.min(6,Number(n)||0));
   document.documentElement.dataset.af52DemoStep=String(activeStep);
   const page=pages[activeStep];
   // Try native app navigation; without replacing the app with a fake iframe document.
   const nav=document.querySelector(`.side-link[data-page="${page}"]`);
   nav?.click();
   if(activeStep===1||activeStep===2){
    const category=activeStep===1?'classes':'freeRooms';
    document.querySelector(`#orariPage [data-schedule="${category}"]`)?.click();
   }
   if(activeStep!==4 && $('finderPanel') && !$('finderPanel').hidden){$('finderClose')?.click();}
   if(activeStep===4 && $('finderPanel')?.hidden){$('finderLaunch')?.click();}
   if(activeStep===6){
    requestAnimationFrame(()=>document.querySelector('#siteFooter')?.scrollIntoView({block:'start',behavior:'instant'}));
   }else{
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
   }
  }
  window.addEventListener('message',event=>{
   if(event.origin!==location.origin||event.source!==window.parent)return;
   if(event.data?.type==='aulafinder-v52-guide-step')selectStep(event.data.step);
  });
  // Even on refresh, embedded mode never starts on a privileged Admin screen.
  requestAnimationFrame(()=>selectStep(0));
  return;
 }

 // Finder: physically pin the freely placed orb at the exact position chosen by the visitor.
 const launch=$('finderLaunch'),panel=$('finderPanel'),controls=panel?.querySelector('.finder-window-controls');
 if(launch&&controls){
  const key='aulafinder.finder.pinned.v52';
  const pin=document.createElement('button');
  pin.type='button';pin.id='af52FinderPin';pin.className='finder-window-btn af52-finder-pin';
  pin.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="m16 3 5 5-4 1-3 3-2 5-2-2-5 5-1-1 5-5-2-2 5-2 3-3z"/></svg>';
  let pinned=false;
  try{pinned=localStorage.getItem(key)==='true';}catch(_){}
  function renderPin(){
   document.documentElement.classList.toggle('af52-orb-pinned',pinned);
   pin.setAttribute('aria-pressed',String(pinned));
   pin.setAttribute('aria-label',pinned?'Sblocca la posizione di Finder':'Blocca Finder in questa posizione');
   pin.title=pinned?'Posizione bloccata: sblocca per trascinare':'Blocca Finder dove lo hai spostato';
   launch.title=pinned?'Finder bloccato in questa posizione: clicca per aprirlo':'Trascina Finder dove vuoi e usa la puntina per bloccarlo';
  }
  pin.addEventListener('click',()=>{
   pinned=!pinned;
   try{localStorage.setItem(key,String(pinned));}catch(_){}
   renderPin();
  });
  launch.addEventListener('pointerdown',e=>{
   if(!pinned)return;
   // Prevent V51 drag gesture without blocking normal click to open the assistant.
   e.stopImmediatePropagation();
  },true);
  controls.prepend(pin);renderPin();
 }

 // Sidebar/footer: the fade follows the pointer or keyboard focus, not a perpetual repaint.
 for(const selector of ['#siteFooter','.site-header','.home-search-area']){
  const el=document.querySelector(selector);if(!el)continue;
  let frameId=0;
  el.addEventListener('pointermove',e=>{
   if(frameId||reduced())return;
   const x=e.clientX,y=e.clientY;
   frameId=requestAnimationFrame(()=>{
    const r=el.getBoundingClientRect();
    el.style.setProperty('--af52-px',((x-r.left)/Math.max(1,r.width)*100).toFixed(1)+'%');
    el.style.setProperty('--af52-py',((y-r.top)/Math.max(1,r.height)*100).toFixed(1)+'%');
    frameId=0;
   });
  },{passive:true});
 }

 // Offscreen animation policy: pause ornamental gradient if the element isn't visible.
 if('IntersectionObserver' in window){
  const watch=new IntersectionObserver(entries=>{
   entries.forEach(entry=>entry.target.classList.toggle('af52-offscreen',!entry.isIntersecting));
  },{rootMargin:'60px'});
  ['#versioniList','#siteFooter','#finderLaunch'].forEach(sel=>{const el=document.querySelector(sel);if(el)watch.observe(el);});
 }
 // Enhanced Admin dashboard, deliberately local and read-only diagnostics.
 const api=window.AulaFinderAdminData,consolePanel=$('af51AdminConsole');
 if(api&&consolePanel){
  const info={af52AdminClasses:Object.keys(window.AULAFINDER_DATA?.classes||{}).length,
   af52AdminRooms:Object.keys(window.AULAFINDER_DATA?.rooms||{}).length,
   af52AdminTeachers:Object.keys(window.AULAFINDER_DATA?.teachers||{}).length,
   af52AdminEdits:api.getEdits().length};
  Object.entries(info).forEach(([id,count])=>{if($(id))$(id).textContent=count.toLocaleString('it-IT');});
  const host=$('af52AdminHistory');
  if(host){
   const edits=api.getEdits().slice(-6).reverse();
   if(edits.length)host.replaceChildren(...edits.map(e=>{
    const li=document.createElement('li');li.textContent=`${e.classId}, ${e.day}, ${e.hour}ª ora: ${e.subject} · ${e.room} · ${e.teacher}`;return li;
   }));
  }
 }
})();
