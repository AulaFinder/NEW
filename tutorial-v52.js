/* V52 · tour unico: sette tappe dentro il sito reale, senza demo parallele. */
(()=>{
 'use strict';
 const page=document.getElementById('tutorialPage');
 if(!page)return;
 const frame=document.getElementById('af51LiveFrame');
 const tabs=[...page.querySelectorAll('[data-tutorial-select]')];
 const progress=document.getElementById('tutorialProgressBar');
 const fill=document.getElementById('tutorialProgressFill');
 const prev=document.getElementById('tutorialPrev'),next=document.getElementById('tutorialNext');
 const counter=document.getElementById('tutorialProgressCount');
 const heading=document.getElementById('af51LiveGuideTitle');
 const paragraph=document.getElementById('af52GuideDescription');
 const stepNumber=document.getElementById('af52GuideStepNumber');
 const hint=document.getElementById('tutorialNavHint');
 const steps=[
  {heading:'Ricerca: trova quello che ti serve',description:'Nella Home digita una classe, per esempio 4AS, oppure il nome di un’aula o la sigla di un docente. Premi Cerca e apri un risultato per vedere le informazioni disponibili.',page:'home'},
  {heading:'Orari: scegli classe, aula o docente',description:'La demo ti porta nella sezione Orari. Usa i comandi per selezionare la categoria, cercare un elemento e leggere il calendario della settimana.',page:'orari',schedule:'classes'},
  {heading:'Disponibilità: aule e professori liberi',description:'Seleziona la scheda Aule libere. Cambia giorno e ora per vedere gli ambienti disponibili. Prova anche Professori liberi: indica soltanto l’assenza di lezioni programmate.',page:'orari',schedule:'freeRooms'},
  {heading:'Navigatore: scegli partenza e arrivo',description:'Nelle due barre indica gli ambienti di partenza e destinazione. Puoi usare i suggerimenti o il selettore sulla piantina e visualizzare il percorso schematico.',page:'navigator'},
  {heading:'Finder: fai una domanda in linguaggio naturale',description:'Premi l’orb per aprire Finder, seleziona eventualmente la classe e prova a chiedere “Che lezioni ho domani?”. Finder interpreta le domande con i dati scolastici disponibili.',page:'home',finder:true},
  {heading:'Piantine: esplora un piano',description:'Usa i filtri dei piani e tocca un’aula per visualizzarne il nome. Prova anche il pulsante di ingrandimento: vedrai la piantina originale.',page:'piantina'},
  {heading:'Footer: progetto e contatti',description:'Qui trovi chi ha realizzato AulaFinder, i riferimenti e le informazioni sul progetto. Il pulsante Admin non fa parte del tutorial pubblico.',page:'home',footer:true}
 ];
 let step=0;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function sendToDemo(){
  if(!frame?.contentWindow)return;
  frame.contentWindow.postMessage({type:'aulafinder-v52-guide-step',step},location.origin==='null'?'*':location.origin);
 }
 function show(index,focus=false){
  step=Math.min(steps.length-1,Math.max(0,index));
  const item=steps[step];
  tabs.forEach((el,i)=>{
   el.classList.toggle('is-active',i===step);
   el.setAttribute('aria-selected',String(i===step));
   el.tabIndex=i===step?0:-1;
  });
  heading.textContent=item.heading;paragraph.textContent=item.description;
  stepNumber.textContent=String(step+1).padStart(2,'0')+' / 07';
  counter.textContent=(step+1)+' / 7';
  hint.textContent=item.heading;
  progress?.setAttribute('aria-valuenow',String(step+1));
  if(fill)fill.style.width=((step+1)/7*100)+'%';
  prev.disabled=step===0;
  next.textContent=step===6?'Ricomincia ↻':'Avanti →';
  if(focus)tabs[step]?.focus({preventScroll:true});
  sendToDemo();
 }
 tabs.forEach(el=>{
  el.addEventListener('click',()=>show(Number(el.dataset.tutorialSelect)));
  el.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();
   const i=Number(el.dataset.tutorialSelect);
   show(e.key==='Home'?0:e.key==='End'?6:(i+(e.key==='ArrowRight'?1:-1)+7)%7,true);
  });
 });
 prev.addEventListener('click',()=>show(step-1));
 next.addEventListener('click',()=>show(step===6?0:step+1));
 frame?.addEventListener('load',()=>{sendToDemo();});
 // Lazy loading is only activated when the actual tutorial becomes visible.
 const watcher=new MutationObserver(()=>{if(!page.hidden)sendToDemo();});
 watcher.observe(page,{attributes:true,attributeFilter:['hidden']});
 show(0);
})();
