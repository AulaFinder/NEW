/* AulaFinder V48 · Tutorial basato su schermate REALI del sito, 7 tappe e ritorno contestuale. */
(()=>{
  'use strict';
  const page=document.getElementById('tutorialPage');
  if(!page)return;
  const tabs=[...page.querySelectorAll('[data-tutorial-select]')];
  const panels=[...page.querySelectorAll('[data-tutorial-panel]')];
  const prev=page.querySelector('#tutorialPrev');
  const next=page.querySelector('#tutorialNext');
  const count=page.querySelector('#tutorialProgressCount');
  const bar=page.querySelector('#tutorialProgressBar');
  const fill=page.querySelector('#tutorialProgressFill');
  const hint=page.querySelector('#tutorialNavHint');
  const back=document.getElementById('tutorialReturn');
  const captions=['Cerca aule, classi e professori','Consulta l’orario settimanale','Trova le disponibilità','Segui il navigatore','Chiedi a Finder','Esplora piantine e preferiti','Scopri chi siamo'];
  let active=0;
  let returnPending=false;
  const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function center(el){
    if(!el)return;
    requestAnimationFrame(()=>{
      // Keep the selected section centered without scrolling input fields during typing.
      el.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'center',inline:'nearest'});
    });
  }
  function show(i,{focus=false,scroll=false}={}){
    active=Math.min(tabs.length-1,Math.max(0,i));
    tabs.forEach((t,k)=>{const sel=k===active;t.classList.toggle('is-active',sel);t.setAttribute('aria-selected',String(sel));t.tabIndex=sel?0:-1;});
    panels.forEach((p,k)=>p.hidden=k!==active);
    count.innerHTML=String(active+1).padStart(2,'0')+' <small>/ '+String(tabs.length).padStart(2,'0')+'</small>';
    bar.setAttribute('aria-valuenow',String(active+1));bar.setAttribute('aria-valuemax',String(tabs.length));
    fill.style.width=`${(active+1)/tabs.length*100}%`;
    prev.disabled=active===0;
    next.innerHTML=active===tabs.length-1?'Ricomincia <span aria-hidden="true">↻</span>':'Avanti <span aria-hidden="true">→</span>';
    hint.textContent=captions[active];
    if(focus)tabs[active].focus({preventScroll:true});
    document.dispatchEvent(new CustomEvent('aulafinder:tutorial-step',{detail:{step:active}}));
    if(scroll)center(page.querySelector('#tutorialStage'));
  }
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>show(Number(tab.dataset.tutorialSelect),{scroll:true}));
    tab.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();const i=Number(tab.dataset.tutorialSelect);
      const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      show(n,{focus:true,scroll:true});
    });
  });
  prev.addEventListener('click',()=>show(active-1,{scroll:true}));
  next.addEventListener('click',()=>show(active===tabs.length-1?0:active+1,{scroll:true}));

  function returnFromPreview(){
    back.hidden=true;
    returnPending=false;
    const navigation=document.querySelector('.side-link[data-page="tutorial"]');
    if(navigation)navigation.click();
    requestAnimationFrame(()=>{show(active);window.scrollTo({top:page.getBoundingClientRect().top+window.scrollY-12,behavior:reduced()?'auto':'smooth'});});
  }
  back.addEventListener('click',returnFromPreview);
  document.addEventListener('click',e=>{
    const target=e.target.closest?.('[data-page],[data-schedule]');
    if(target && target!==back && !page.hidden && !target.closest('#tutorialPage')){
      // Someone navigated out by the main sidebar; do not show a back button unnecessarily.
      returnPending=false;back.hidden=true;
    }
  },true);
  page.addEventListener('click',e=>{
    const demo=e.target.closest('[data-page],[data-schedule],[data-tutorial-footer]');
    if(!demo)return;
    returnPending=true;
    if(demo.dataset.tutorialFooter){
      e.stopPropagation();
      back.hidden=false;
      document.getElementById('siteFooter')?.scrollIntoView({block:'center',behavior:reduced()?'auto':'smooth'});
      return;
    }
    // The main app's delegated click will open the new page. Reveal the contextual return link after.
    setTimeout(()=>{if(returnPending)back.hidden=false;},0);
  },false);
  page.querySelector('#tutorialOpenFinder')?.addEventListener('click',e=>{
    e.stopPropagation();
    const launch=document.getElementById('finderLaunch');
    if(launch && launch.getAttribute('aria-expanded')!=='true')launch.click();
    document.getElementById('finderClass')?.focus({preventScroll:true});
  });
  // Auto-hide the return button when coming back to the tutorial via the sidebar.
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-page="tutorial"]')){
      back.hidden=true;returnPending=false;
    }
  });
  show(0);
})();
