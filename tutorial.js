/* AulaFinder V47 · guida interattiva. Solo contenuti locali, nessun servizio esterno. */
(()=>{
  'use strict';
  const page=document.getElementById('tutorialPage');
  if(!page)return;
  const tabs=[...page.querySelectorAll('[data-tutorial-select]')];
  const panels=[...page.querySelectorAll('[data-tutorial-panel]')];
  const prev=page.querySelector('#tutorialPrev');
  const next=page.querySelector('#tutorialNext');
  const counter=page.querySelector('#tutorialProgressCount');
  const bar=page.querySelector('#tutorialProgressBar');
  const fill=page.querySelector('#tutorialProgressFill');
  const hint=page.querySelector('#tutorialNavHint');
  const titles=['Inizia dalla ricerca','Trova l’orario giusto','Scopri le disponibilità','Impara a orientarti','Chiedi a Finder','La guida è completa!'];
  let active=0;
  function show(index,{focus=false}={}){
    active=Math.max(0,Math.min(tabs.length-1,index));
    tabs.forEach((tab,i)=>{
      const selected=i===active;
      tab.classList.toggle('is-active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    });
    panels.forEach((panel,i)=>{panel.hidden=i!==active;});
    counter.innerHTML=String(active+1).padStart(2,'0')+' <small>/ 06</small>';
    bar.setAttribute('aria-valuenow',String(active+1));
    fill.style.width=`${(active+1)/tabs.length*100}%`;
    prev.disabled=active===0;
    next.innerHTML=active===tabs.length-1?'Ricomincia <span aria-hidden="true">↻</span>':'Avanti <span aria-hidden="true">→</span>';
    hint.textContent=titles[active];
    if(focus)tabs[active].focus({preventScroll:true});
  }
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>show(Number(tab.dataset.tutorialSelect)));
    tab.addEventListener('keydown',e=>{
      const idx=Number(tab.dataset.tutorialSelect);
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();
      const target=e.key==='Home'?0:e.key==='End'?tabs.length-1:
        (idx+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      show(target,{focus:true});
    });
  });
  prev.addEventListener('click',()=>show(active-1));
  next.addEventListener('click',()=>show(active===tabs.length-1?0:active+1));
  page.querySelector('#tutorialOpenFinder')?.addEventListener('click',event=>{
    // Evita che il click globale (fuori dal pannello Finder) lo richiuda subito.
    event.stopPropagation();
    const launch=document.getElementById('finderLaunch');
    if(launch&&launch.getAttribute('aria-expanded')!=='true')launch.click();
    document.getElementById('finderClass')?.focus({preventScroll:true});
  });
  show(0);
})();
