/* V50: caricamento resiliente. Il sito non rimane mai bloccato dietro il filmato. */
(()=>{
 'use strict';
 const overlay=document.getElementById('appLoading');
 const video=document.getElementById('appLoadingVideo');
 if(!overlay)return;
 if(new URLSearchParams(location.search).has('af51tutorial')||window.frameElement?.id==='af51LiveFrame'){overlay.hidden=true;video?.pause();return;}
 let appReady=document.readyState==='complete',introFinished=false,closing=false;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const status={ready:false,finished:false,closed:false,videoPlayed:false,videoError:null};
 window.AulaFinderIntroStatus=status;
 function finish(){introFinished=true;status.finished=true;close();}
 function ready(){appReady=true;status.ready=true;close();}
 function close(){
  if(closing||!appReady||!introFinished)return;
  closing=true;overlay.setAttribute('aria-hidden','true');overlay.classList.add('is-leaving');
  const hide=()=>{
   if(status.closed)return;
   status.closed=true;overlay.hidden=true;try{video?.pause();}catch(_){}
  };
  overlay.addEventListener('transitionend',hide,{once:true});
  setTimeout(hide,750);
 }
 if(appReady)ready();else window.addEventListener('load',ready,{once:true});
 if(reduced||!video){finish();return;}
 video.addEventListener('playing',()=>{status.videoPlayed=true;},{once:true});
 video.addEventListener('ended',finish,{once:true});
 video.addEventListener('error',()=>{status.videoError='Il video non è stato riprodotto';setTimeout(finish,600);},{once:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&!introFinished)finish();});
 try{
  const p=video.play();
  p?.catch?.(e=>{status.videoError=e?.name||'Autoplay bloccato';setTimeout(finish,900);});
 }catch(e){status.videoError='Avvio video non disponibile';setTimeout(finish,900);}
 setTimeout(finish,5200);
})();
