/* AulaFinder V51 · interactive tutorial powered by the ACTUAL site in a same-origin
   embedded browsing context; no screenshots, fake data or duplicate business logic. */
(()=>{
 'use strict';
 if(new URLSearchParams(location.search).has('af_tutorial_embed')){
   document.body.classList.add('af-tutorial-embed');
   return; // Never nest another copy of the site inside the tutorial copy.
 }
 const page=document.getElementById('tutorialPage');if(!page)return;
 const mounts=[...page.querySelectorAll('.tutorial-live-mount')];if(!mounts.length)return;
 const frame=document.createElement('iframe');
 frame.className='af-tutorial-site-frame';frame.title='AulaFinder completo e interattivo: prova le funzioni qui, senza uscire dal tutorial';
 frame.src='./index.html?af_tutorial_embed=1';frame.loading='lazy';frame.setAttribute('allow','microphone');
 const tip=document.createElement('div');tip.className='af-tutorial-live-banner';
 tip.innerHTML='<span class="af-tutorial-live-dot" aria-hidden="true"></span><strong>Sito reale, modalità prova</strong><span>Puoi cliccare, cercare e navigare direttamente qui.</span>';
 let ready=false,active=0;
 function visit(step){
   if(!ready)return;
   let doc,win;try{doc=frame.contentDocument;win=frame.contentWindow;}catch(_){return;}
   if(!doc||!win)return;
   try{
     const route=step===0?'home':step===1?'orari':step===2?'orari':step===3?'navigator':step===4?'home':step===5?'piantina':'home';
     if(route==='orari'){
       const kind=step===2?'freeRooms':'classes';
       doc.querySelector(`[data-schedule="${kind}"]`)?.click();
     }else doc.querySelector(`.side-link[data-page="${route}"]`)?.click();
     if(step===4){win.AulaFinderVoice?.open?.();}
     else {
       const panel=doc.getElementById('finderPanel');
       if(panel&&!panel.hidden)doc.getElementById('finderClose')?.click();
     }
     if(step===6){
       requestAnimationFrame(()=>doc.getElementById('siteFooter')?.scrollIntoView({behavior:'auto',block:'start'}));
     }else win.scrollTo({top:0,behavior:'instant'});
   }catch(e){console.warn('Tutorial preview navigation:',e);}
 }
 function activate(step){
   active=step;const mount=mounts[step];if(!mount)return;
   mount.replaceChildren();mount.append(tip,frame);
   visit(step);
 }
 frame.addEventListener('load',()=>{
   ready=true;
   const doc=frame.contentDocument;
   if(doc){
     doc.body.classList.add('af-tutorial-embed');
     doc.querySelectorAll('.side-link[data-page="tutorial"]').forEach(el=>{el.hidden=true;el.setAttribute('aria-hidden','true');});
     // No confusing nested tutorial, but every other module remains real and operational.
     const cover=doc.getElementById('appLoading');if(cover)cover.hidden=true;
     const video=doc.getElementById('appLoadingVideo');try{video?.pause();}catch(_){}
   }
   visit(active);
 });
 document.addEventListener('aulafinder:tutorial-step',e=>activate(e.detail.step));
 window.AulaFinderTutorialLab={activate};
 activate(0);
})();
