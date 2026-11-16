/* AulaFinder V48 · Scroll selected results into view, never interrupt typing. */
(()=>{
  'use strict';
  const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const move=(el)=>{
    if(!el || !el.isConnected || el.hidden || el.closest('[hidden]'))return;
    el.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center',inline:'nearest'});
  };
  document.addEventListener('click',e=>{
    const el=e.target.closest?.('button');
    if(!el || el.closest('#finderPanel') || el.id==='finderLaunch' || el.closest('#tutorialPage') || el.closest('#piantinaPage .plan-body') || el.closest('.room-actions'))return;
    if(el.matches('.orari-category-tabs button, [data-schedule]')){
      requestAnimationFrame(()=>requestAnimationFrame(()=>move(document.getElementById('orariFilterRow'))));
    }else if(el.matches('[data-fav-open],[data-history]')){
      requestAnimationFrame(()=>requestAnimationFrame(()=>move(document.querySelector('#searchResults .result-card, #orariPage .orari-schedule-main'))));
    }else if(el.matches('#navStepNext,#navStepPrev')){
      requestAnimationFrame(()=>move(document.querySelector('#navActiveMap')));
    }
  });
  document.addEventListener('change',e=>{
    const el=e.target;
    if(!el.matches?.('#scheduleEntity,#scheduleTeacherSort,#daySelect,#hourSelect,#navTravelMode,.floor-option input[type="checkbox"]'))return;
    // Header selectors stay put: don't pull the page away from the current interaction.
    if(el.matches('#daySelect,#hourSelect'))return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(el.id==='scheduleEntity'||el.id==='scheduleTeacherSort')move(document.getElementById('scheduleContents'));
      else if(el.matches('.floor-option input')){
        const visible=[...document.querySelectorAll('.plan-card')].find(p=>!p.hidden);
        if(visible)move(visible);
      }
    }));
  });
})();
