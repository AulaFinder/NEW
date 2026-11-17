/* AulaFinder V48: guida con anteprime clonate dal DOM vero del sito. */
(()=>{
  'use strict';
  const page=document.getElementById('tutorialPage');
  if(!page)return;
  const tabs=Array.from(page.querySelectorAll('[data-tutorial-select]'));
  const panels=Array.from(page.querySelectorAll('[data-tutorial-panel]'));
  const progress=page.querySelector('#tutorialProgressBar');
  const fill=page.querySelector('#tutorialProgressFill');
  const counter=page.querySelector('#tutorialProgressCount');
  const hint=page.querySelector('#tutorialNavHint');
  const prev=page.querySelector('#tutorialPrev');
  const next=page.querySelector('#tutorialNext');
  const returnButton=document.getElementById('tutorialReturn');
  const stages=['Inizia dalla ricerca','Scopri gli orari','Consulta le disponibilità','Segui le indicazioni','Parla con Finder','Esplora le piantine','Conosci il progetto'];
  let current=0, returnStep=null, inExternalPreview=false;
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollTo=(node,block='start')=>node?.scrollIntoView({behavior:reduced()?'auto':'smooth',block,inline:'nearest'});
  const findPage=()=>document.querySelector('.page:not([hidden])')?.id;

  function updateReturn(){
    returnButton.hidden=returnStep===null || (findPage()==='tutorialPage' && !inExternalPreview);
  }
  function show(index,{focus=false}={}){
    current=Math.max(0,Math.min(tabs.length-1,index));
    tabs.forEach((tab,i)=>{
      tab.setAttribute('aria-selected',String(i===current));
      tab.classList.toggle('is-active',i===current);
      tab.tabIndex=i===current?0:-1;
    });
    panels.forEach((panel,i)=>panel.hidden=i!==current);
    progress.setAttribute('aria-valuenow',String(current+1));
    fill.style.width=`${(current+1)/tabs.length*100}%`;
    counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(tabs.length).padStart(2,'0')}`;
    prev.disabled=current===0;
    next.textContent=current===tabs.length-1?'Ricomincia ↻':'Avanti →';
    hint.textContent=stages[current];
    if(focus)tabs[current].focus({preventScroll:true});
    scrollTo(page.querySelector('#tutorialStage'),'center');
  }

  // Previews are *real DOM fragments*, never drawn/fake illustrations.
  // Cloned controls are disabled so user actions affect only the real app.
  function clone(selector){
    const source=document.querySelector(selector);
    if(!source)return null;
    const element=source.cloneNode(true);
    element.removeAttribute('hidden');
    [element,...element.querySelectorAll('*')].forEach(el=>{
      el.removeAttribute('id');
      el.removeAttribute('for');
      el.removeAttribute('aria-controls');
      el.removeAttribute('aria-labelledby');
      el.removeAttribute('aria-describedby');
      if(el.matches('button,input,select,textarea,a,[tabindex]')){
        if('disabled' in el)el.disabled=true;
        el.setAttribute('tabindex','-1');
        if(el.matches('a'))el.removeAttribute('href');
      }
    });
    element.classList.add('af48-preview-fragment');
    return element;
  }
  function wrapPreview(host,sources,config={}){
    host.replaceChildren();
    const label=document.createElement('span');label.className='af48-preview-caption';label.textContent='Anteprima dal sito';
    host.append(label);
    const box=document.createElement('div');box.className='af48-preview-content';
    if(config.className)box.classList.add(config.className);
    sources.forEach(selector=>{
      const el=clone(selector);if(el)box.append(el);
    });
    host.append(box);
    if(!box.children.length){
      const p=document.createElement('p');p.textContent='Apri la sezione per vedere la funzione.';box.append(p);
    }
  }
  function renderPreviews(){
    const s={
      search:['#homePage .home-intro','#searchForm'],
      orari:['#orariPage .orari-category-tabs','#orariPage .orari-filter-row'],
      liberi:['#freeRoomsShortcut','#freeTeachersShortcut'],
      navigatore:['#navigatorPage .navigator-inputs','#navigatorPage .navigator-action-row'],
      finder:['#finderPanel .finder-panel-head','#finderPanel .finder-conversation','#finderPanel .finder-form'],
      piantina:['#piantinaPage #terra .plan-banner','#piantinaPage #terra svg.plan'],
      footer:['#siteFooter .footer-intro','#siteFooter .team-list','#siteFooter .footer-info']
    };
    // Floor preview: real SVG from the map, with its real viewBox; no fabricated geometry.
    Object.entries(s).forEach(([name,selectors])=>{
      const host=page.querySelector(`[data-tutorial-preview="${name}"]`);
      if(host)wrapPreview(host,selectors,{className:'af48-preview-'+name});
    });
  }
  function markExit(){returnStep=current;inExternalPreview=false;updateReturn();}
  page.querySelectorAll('.af48-tour-cta').forEach(button=>{
    button.addEventListener('click',event=>{
      if(button.id==='tutorialOpenFinder'){
        event.stopPropagation();
        markExit();inExternalPreview=true;
        const launch=document.getElementById('finderLaunch');
        if(launch&&launch.getAttribute('aria-expanded')!=='true')launch.click();
        updateReturn();
      }else if(button.id==='tutorialGoFooter'){
        markExit();inExternalPreview=true;updateReturn();scrollTo(document.getElementById('siteFooter'));
      }else{
        markExit();
        // Existing page/schedule click handling does the actual navigation.
      }
    });
  });
  page.querySelectorAll('[data-tutorial-select]').forEach(tab=>{
    tab.addEventListener('click',()=>show(Number(tab.dataset.tutorialSelect)));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const nextIdx=event.key==='Home'?0:event.key==='End'?tabs.length-1:
        (Number(tab.dataset.tutorialSelect)+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      show(nextIdx,{focus:true});
    });
  });
  prev.addEventListener('click',()=>show(current-1));
  next.addEventListener('click',()=>show(current===tabs.length-1?0:current+1));
  returnButton.addEventListener('click',()=>{
    const restore=returnStep??current;
    if(findPage()!=='tutorialPage')document.querySelector('[data-page="tutorial"].side-link')?.click();
    inExternalPreview=false;
    show(restore);
    returnStep=null;
    updateReturn();
  });
  new MutationObserver(()=>updateReturn()).observe(page,{attributes:true,attributeFilter:['hidden']});
  document.querySelector('[data-page="tutorial"].side-link')?.addEventListener('click',()=>{
    inExternalPreview=false;
    returnStep=null;
    updateReturn();
  });
  renderPreviews();
  show(0);
  updateReturn();
})();
