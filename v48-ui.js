/* AulaFinder V48: centering of selections without touching the business logic. */
(()=>{
  'use strict';
  // V47 replaces the result title text dynamically; preserve the requested icon.
  const resultHeading=document.getElementById('resultsTitle');
  if(resultHeading){
    const svg=resultHeading.querySelector('svg')?.cloneNode(true);
    if(svg){
      new MutationObserver(()=>{
        if(!resultHeading.querySelector('svg'))resultHeading.prepend(svg.cloneNode(true));
      }).observe(resultHeading,{childList:true});
    }
  }
  const prefersReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function center(element,block='center'){
    if(!element||element.closest('[hidden]')||!element.getClientRects().length)return;
    try{element.scrollIntoView({behavior:prefersReduced()?'instant':'smooth',block,inline:'nearest'});}catch(_){}
  }
  // Focus on actual selected result rather than the menu button that triggered it.
  function activeContent(){
    const page=document.querySelector('.page:not([hidden])');
    if(!page)return null;
    if(page.id==='orariPage')return page.querySelector('#scheduleContents') || page.querySelector('h1');
    if(page.id==='navigatorPage')return page.querySelector('#navRouteResult:not([hidden])')||page.querySelector('#navigatorForm');
    if(page.id==='tutorialPage')return page.querySelector('#tutorialStage');
    if(page.id==='versioniPage')return page.querySelector('#versioniList');
    return page.querySelector('h1')||page;
  }
  const contentSelectors='[data-page],[data-schedule],[data-room],[data-choice],[data-suggest],[data-free-teacher],[data-favorite],[data-history],[data-full-schedule],[data-tutorial-select],[data-nav-choice],.orari-category-tabs button';
  document.addEventListener('click',event=>{
    if(!event.target.closest)return;
    const accordion=event.target.closest('#versioniPage summary, #tutorialPage .tutorial-faq summary');
    if(accordion){setTimeout(()=>center(accordion.closest('details'),'center'),90);return;}
    if(!event.target.closest(contentSelectors))return;
    // Delayed until the existing page handler has rendered the destination.
    setTimeout(()=>center(activeContent(),event.target.closest('[data-schedule]')?'center':'start'),100);
  },true);
  document.addEventListener('change',event=>{
    const target=event.target;
    if(!target.matches('select,input[type="checkbox"],input[type="radio"]'))return;
    setTimeout(()=>{
      const page=document.querySelector('.page:not([hidden])');
      if(page?.id==='orariPage')center(page.querySelector('#scheduleContents'),'center');
      else if(page?.id==='piantinaPage')center(target.closest('.floor-filter')||target,'center');
      else if(page?.id==='navigatorPage')center(target.closest('.navigator-field')||target,'center');
    },110);
  },true);
})();
