/* Schermata iniziale con filmato fornito dagli studenti. Mai bloccare l'applicazione. */
(()=>{
  'use strict';
  const overlay=document.getElementById('appLoading');
  const video=document.getElementById('appLoadingVideo');
  if(!overlay)return;
  let appReady=document.readyState==='complete';
  let introFinished=false;
  let closing=false;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function close(){
    if(closing || !appReady || !introFinished)return;
    closing=true;
    overlay.classList.add('is-leaving');
    overlay.setAttribute('aria-hidden','true');
    window.setTimeout(()=>{overlay.hidden=true;try{video?.pause();}catch(_){}},320);
  }
  function finishIntro(){introFinished=true;close();}
  function ready(){appReady=true;close();}
  if(appReady)ready();else window.addEventListener('load',ready,{once:true});
  if(reduced || !video){finishIntro();return;}
  video.addEventListener('ended',finishIntro,{once:true});
  video.addEventListener('error',finishIntro,{once:true});
  // Il filmato parte su desktop e mobile a ogni nuovo caricamento/refresh.
  // Se l'autoplay è vietato, mostra almeno brevemente il fotogramma/poster
  // invece di far scomparire l'anteprima all'istante; poi lascia usare il sito.
  try {
    const start=video.play();
    if(start && typeof start.catch==='function')
      start.catch(()=>window.setTimeout(finishIntro,1100));
  } catch (_) { window.setTimeout(finishIntro,1100); }
  window.setTimeout(finishIntro,5200);
})();
