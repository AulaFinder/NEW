/* V51 — UI additiva per Finder, tutorial, Versioni, Orari e accessibilità. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 // Demo LIVE: load the real site in the same section, not a mockup or external URL.
 const frame=$('af51LiveFrame'),jump=$('af51LiveJump'),tip=$('af51LiveTip');
 const isNestedDemo=new URLSearchParams(location.search).has('af51tutorial');
 if(frame&&!isNestedDemo&&frame.dataset.liveSrc)frame.src=frame.dataset.liveSrc; // never recursively embed the tutorial inside itself
 if(frame&&isNestedDemo)frame.removeAttribute('src');
 const targets=['home','orari','orari','navigator','home','piantina','home'];
 const actions=[
  'Cerca una classe, un docente o un’aula nella Home della demo.',
  'Apri Orari e scegli una classe, un’aula o un docente.',
  'Apri Orari → Aule libere o Professori liberi e seleziona la fascia.',
  'Imposta la partenza e la destinazione nel Navigatore reale.',
  'Apri Finder toccando l’orb luminoso, poi scrivi una domanda.',
  'Cambia piano e seleziona le stanze delle piantine originali.',
  'Esplora il footer, la navigazione e le informazioni del progetto.'
 ];
 function currentStep(){return Number(document.querySelector('[data-tutorial-select][aria-selected="true"]')?.dataset.tutorialSelect||0);}
 function guideTip(){const n=currentStep();if(tip)tip.textContent=`${n+1}/7 · ${actions[n]}`;if(jump)jump.textContent='Apri '+(['Ricerca','Orari','Disponibilità','Navigatore','Finder','Piantine','Footer'][n])+' nella demo';}
 const tour=document.getElementById('tutorialPage');
 if(tour){tour.addEventListener('click',()=>requestAnimationFrame(guideTip));guideTip();}
 jump?.addEventListener('click',()=>{
  const n=currentStep(),win=frame?.contentWindow,doc=win?.document;
  if(!doc){if(tip)tip.textContent='La demo è ancora in caricamento.';return;}
  const target=n===6?doc.querySelector('.footer-brand'):doc.querySelector(`.side-link[data-page="${targets[n]}"]`);
  target?.click();
  if(n===2)doc.querySelector('[data-schedule="freeRooms"]')?.click();
  if(n===4)doc.querySelector('#finderLaunch')?.click();
  if(n===6)doc.querySelector('footer')?.scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'});
  if(n!==6)doc.querySelector('#mainContent')?.scrollTo?.({top:0});
  guideTip();
 });
 // Avoid replaying the intro inside the framed full site.
 if(isNestedDemo){
  document.documentElement.classList.add('af51-inside-demo');
  const loading=$('appLoading');if(loading){loading.hidden=true;$('appLoadingVideo')?.pause();}
 }

 // Contextual, animated suggestions span all major sections and remain meaningful.
 const promptGroups={
  home:['Come posso cercare una classe o un professore?','Come posso consultare gli orari completi?','Quali aule sono libere alla terza ora?','Come posso salvare i preferiti?'],
  results:['Come leggo i risultati della ricerca?','Come apro la piantina dell’aula trovata?','Come controllo le ore settimanali di un docente?'],
  orari:['Come consulto l’orario completo di una classe?','Quali professori hanno un’ora buca?','Quante ore settimanali ha il docente MA AL?','Come cambio giorno e ora?'],
  navigator:['Come uso il navigatore tra due aule?','Come scelgo il percorso usando le scale?','Posso selezionare una stanza sulla piantina?'],
  piantina:['Come trovo un’aula sulle piantine?','Come ingrandisco una piantina?','Come cambio piano nella mappa?'],
  versioni:['Come posso consultare le versioni precedenti?','Come visualizzo una Home storica a schermo intero?','Cosa è cambiato nella V51?'],
  tutorial:['Come funziona il tutorial interattivo?','Posso provare il sito dentro la guida?','Come posso imparare a usare Finder?'],
  admin:['Come funziona la sezione Admin?','Come posso gestire gli orari locali?']
 };
 const suggestions=$('finderPrompts');
 let promptPage='';
 function refreshPrompts(){
  const page=document.querySelector('#mainContent>.page:not([hidden])')?.id?.replace(/Page$/,'')||'home';
  if(page===promptPage||!suggestions)return;promptPage=page;
  const questions=[...(promptGroups[page]||promptGroups.home),...promptGroups.home.filter(q=>!(promptGroups[page]||[]).includes(q))].slice(0,6);
  suggestions.replaceChildren(...questions.map((q,i)=>{
   const btn=document.createElement('button');btn.type='button';btn.textContent=q;btn.dataset.finderPrompt=q;
   btn.className='af51-suggestion';btn.style.setProperty('--af51-index',i);return btn;
  }));
 }
 refreshPrompts();
 document.addEventListener('click',e=>{if(e.target.closest('[data-page],[data-schedule],#finderLaunch'))requestAnimationFrame(refreshPrompts);});
 // Watching page hidden changes handles back/forward controls without polling.
 const main=$('mainContent');
 if(main)new MutationObserver(refreshPrompts).observe(main,{subtree:true,attributes:true,attributeFilter:['hidden']});

 // Visual voice level: use Web Audio analyser only for graphics, never output audio.
 const mics=[$('searchVoiceButton'),$('finderMic')].filter(Boolean);
 const visual=new Map();
 function stopMic(btn){
  const v=visual.get(btn);if(v){v.active=false;cancelAnimationFrame(v.frame);v.stream?.getTracks().forEach(t=>t.stop());v.ctx?.close?.().catch(()=>{});visual.delete(btn);}
  btn.classList.remove('af51-listening');
  btn.style.removeProperty('--af51-volume');
 }
 async function startMic(btn){
  if(visual.has(btn))return;
  btn.classList.add('af51-listening');
  const obj={active:true,frame:0,ctx:null,stream:null};visual.set(btn,obj);
  if(reduced())return;
  try{
   if(!navigator.mediaDevices?.getUserMedia||!window.AudioContext&&!window.webkitAudioContext)return;
   const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
   if(!obj.active){stream.getTracks().forEach(t=>t.stop());return;}obj.stream=stream;
   const ctx=new (window.AudioContext||window.webkitAudioContext)();obj.ctx=ctx;
   const analyser=ctx.createAnalyser();analyser.fftSize=256;
   ctx.createMediaStreamSource(stream).connect(analyser); // intentionally NOT connected to speakers
   const buffer=new Uint8Array(analyser.frequencyBinCount),bars=[...btn.querySelectorAll('.af51-wave i')];
   function paint(){
    if(!obj.active)return;
    analyser.getByteFrequencyData(buffer);
    bars.forEach((el,i)=>{
     const from=2+i*10,to=Math.min(buffer.length,from+10);
     let sum=0;for(let j=from;j<to;j++)sum+=buffer[j];
     const level=Math.max(.2,Math.min(1.1,sum/Math.max(1,to-from)/85));
     el.style.setProperty('--af51-bar',level.toFixed(2));
    });obj.frame=requestAnimationFrame(paint);
   }paint();
  }catch(_){/* Recognizer may still work while WebAudio permission is unavailable. */}
 }
 mics.forEach(btn=>{
  const monitor=new MutationObserver(()=>{if(btn.getAttribute('aria-pressed')==='true')startMic(btn);else stopMic(btn);});
  monitor.observe(btn,{attributes:true,attributeFilter:['aria-pressed']});
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)mics.forEach(stopMic);});

 // Version timeline follows hover or keyboard selection as well.
 const historyList=$('versioniList');
 if(historyList){
  historyList.addEventListener('pointermove',e=>{
   const r=historyList.getBoundingClientRect();historyList.style.setProperty('--af51-history-y',((e.clientY-r.top)/r.height*100).toFixed(2)+'%');
  },{passive:true});
  historyList.addEventListener('focusin',e=>{
   const r=historyList.getBoundingClientRect(),p=e.target.getBoundingClientRect();historyList.style.setProperty('--af51-history-y',((p.top+p.height/2-r.top)/r.height*100).toFixed(2)+'%');
  });
 }
 // Sidebar gradient follows pointer position and keyboard focus without altering navigation.
 const sidebar=$('sidebar');
 if(sidebar){
  sidebar.addEventListener('pointermove',e=>{
   const r=sidebar.getBoundingClientRect();sidebar.style.setProperty('--af51-side-y',((e.clientY-r.top)/r.height*100).toFixed(2)+'%');
  },{passive:true});
  sidebar.addEventListener('focusin',e=>{
   const r=sidebar.getBoundingClientRect(),p=e.target.getBoundingClientRect();sidebar.style.setProperty('--af51-side-y',((p.top+p.height/2-r.top)/r.height*100).toFixed(2)+'%');
  });
 }
 // Gradient touch feedback: no water ripples; disable on reduced-motion preference.
 document.addEventListener('pointerdown',e=>{
  if(reduced())return;
  const btn=e.target.closest('button,.side-link,.versioni-entry>summary');
  if(!btn||btn.disabled||btn.closest('.af51-admin-keyboard'))return;
  const r=btn.getBoundingClientRect();btn.style.setProperty('--af51-touch-x',((e.clientX-r.left)/r.width*100)+'%');
  btn.classList.remove('af51-gradient-touch');void btn.offsetWidth;btn.classList.add('af51-gradient-touch');
  btn.addEventListener('animationend',()=>btn.classList.remove('af51-gradient-touch'),{once:true});
 },{passive:true});

 // Browser return animation of Finder kept; refresh webm when visible to avoid a frozen orb.
 const launch=$('finderLaunch'),launchVideo=launch?.querySelector('video');
 document.addEventListener('visibilitychange',()=>{if(document.hidden)launchVideo?.pause();else launchVideo?.play?.().catch(()=>{});});
 launchVideo?.play?.().catch(()=>{});
})();
