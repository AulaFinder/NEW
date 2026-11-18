/* AulaFinder V45 - Finder: assistente deterministico basato esclusivamente sugli orari locali.
   Il riconoscimento vocale e' opzionale e dipende dalle API del browser. */
(() => {
  'use strict';
  const DATA = window.AULAFINDER_DATA;
  const panel = document.getElementById('finderPanel');
  if (!DATA || !panel) return;
  const $ = id => document.getElementById(id);
  const launch = $('finderLaunch'), close = $('finderClose'), select = $('finderClass');
  const log = $('finderConversation'), input = $('finderQuestion');
  const form = $('finderForm'), status = $('finderStatus');
  const voiceSearch = $('searchVoiceButton'), voiceFinder = $('finderMic');
  const daySel = $('daySelect'), hourSel = $('hourSelect'), mainSearch = $('searchInput');
  const days = DATA.days;
  const lower = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const teacherLabel = code => code || 'Docente non indicato';
  const maxOutput = 2600;
  let selectedClass = '';
  let lastVoiceInput = false;
  let activeRecognition = null;

  const allClasses = Object.keys(DATA.classes).sort((a,b)=>a.localeCompare(b,'it',{numeric:true}));
  select.insertAdjacentHTML('beforeend', allClasses.map(id=>`<option value="${id}">Classe ${id}</option>`).join(''));
  try { const stored = localStorage.getItem('aulafinder.finder.class');if(allClasses.includes(stored))selectedClass=stored; } catch (_) {}
  select.value=selectedClass;
  select.addEventListener('change',()=>{
    selectedClass=select.value;
    try {localStorage.setItem('aulafinder.finder.class',selectedClass);}catch(_){}
  });

  // Origin-aware opening and closing, independent of device width.
  let panelMotion=null,desiredOpen=false;
  const prefersReduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
  function animatePanel(open){
    panelMotion?.cancel();panelMotion=null;
    const r=panel.getBoundingClientRect(),b=launch.getBoundingClientRect();
    const dx=b.left+b.width/2-r.left-r.width/2;
    const dy=b.top+b.height/2-r.top-r.height/2;
    const compact={transform:`translate(${dx}px, ${dy}px) scale(.10)`,opacity:0,filter:'blur(5px)'};
    const full={transform:'translate(0,0) scale(1)',opacity:1,filter:'blur(0)'};
    const anim=panel.animate(open?[compact,full]:[full,compact],{
       duration:open?430:330,easing:open?'cubic-bezier(.18,.86,.23,1)':'cubic-bezier(.45,0,.7,.18)',fill:'both'
    });panelMotion=anim;
    anim.finished.then(()=>{
      if(panelMotion!==anim)return;
      if(!open&&!desiredOpen)panel.hidden=true;
      anim.cancel();panelMotion=null;
    }).catch(()=>{});
  }
  const setOpen = open => {
    desiredOpen=!!open;
    if(open){
      panel.hidden=false;
      updatePanelPosition();
      if(!prefersReduced())animatePanel(true);
      const active=window.AulaFinderBridge?.getCurrentClass?.();
      if(active && allClasses.includes(active) && !selectedClass){selectedClass=active;select.value=active;}
      if(!selectedClass)select.focus({preventScroll:true});else input.focus({preventScroll:true});
    }else{
      try{activeRecognition?.stop();}catch(_){}
      if(panel.hidden){launch.setAttribute('aria-expanded','false');return;}
      if(prefersReduced()){panelMotion?.cancel();panel.hidden=true;panelMotion=null;}
      else animatePanel(false);
      launch.focus({preventScroll:true});
    }
    launch.setAttribute('aria-expanded',String(open));
  };
  // Drag button by pointer (mouse/touch/stylus), keep native keyboard click.
  const posKey='aulafinder.finder.position.v48';
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  let drag=null, suppressNextClick=false;
  function applyPosition(right,bottom){
    launch.style.right=clamp(right,8,Math.max(8,innerWidth-launch.offsetWidth-8))+'px';
    launch.style.bottom=clamp(bottom,8,Math.max(8,innerHeight-launch.offsetHeight-8))+'px';
  }
  function restorePosition(){try{const saved=JSON.parse(localStorage.getItem(posKey)||'null');if(saved&&Number.isFinite(saved.right)&&Number.isFinite(saved.bottom))applyPosition(saved.right,saved.bottom);}catch(_){}}
  function updatePanelPosition(){
    if(panel.hidden||panel.classList.contains('is-maximized'))return;
    if(typeof panelCustom!=='undefined'&&panelCustom&&panelSaved){movePanel(panelSaved.x,panelSaved.y);return;}
    const r=launch.getBoundingClientRect();
    const w=panel.offsetWidth,h=panel.offsetHeight;
    // Prefer above the button, otherwise below it; never leave the viewport.
    const left=clamp(r.right-w,8,Math.max(8,innerWidth-w-8));
    const top=r.top>=h+16?r.top-h-8:clamp(r.bottom+8,8,Math.max(8,innerHeight-h-8));
    panel.style.left=left+'px';panel.style.top=top+'px';panel.style.right='auto';panel.style.bottom='auto';
  }
  launch.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    const r=launch.getBoundingClientRect();
    drag={pointerId:event.pointerId,x:event.clientX,y:event.clientY,right:innerWidth-r.right,bottom:innerHeight-r.bottom,moved:false};
    try{launch.setPointerCapture(event.pointerId);}catch(_){}
  });
  launch.addEventListener('pointermove',event=>{
    if(!drag||drag.pointerId!==event.pointerId)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(Math.hypot(dx,dy)>7)drag.moved=true;
    if(!drag.moved)return;
    launch.classList.add('is-dragging');
    applyPosition(drag.right-dx,drag.bottom-dy);
    updatePanelPosition();
  });
  function finishDrag(event){
    if(!drag||drag.pointerId!==event.pointerId)return;
    if(drag.moved){
      suppressNextClick=true;
      try{localStorage.setItem(posKey,JSON.stringify({right:parseFloat(launch.style.right),bottom:parseFloat(launch.style.bottom)}));}catch(_){}
    }
    drag=null;launch.classList.remove('is-dragging');
  }
  launch.addEventListener('pointerup',finishDrag);
  launch.addEventListener('pointercancel',finishDrag);
  launch.addEventListener('click',event=>{
    if(suppressNextClick){suppressNextClick=false;event.preventDefault();return;}
    setOpen(!desiredOpen);
    updatePanelPosition();
  });
  window.addEventListener('resize',()=>{
    if(launch.style.right){applyPosition(parseFloat(launch.style.right),parseFloat(launch.style.bottom));}
    updatePanelPosition();
  });
  requestAnimationFrame(restorePosition);
  close.addEventListener('click',()=>setOpen(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && desiredOpen)setOpen(false);});
  document.addEventListener('click',e=>{
    if(desiredOpen && !panel.contains(e.target) && !launch.contains(e.target))setOpen(false);
  });

  // Finestra mobile: spostamento trascinando la testata e posizione persistente.
  const panelKey='aulafinder.finder.panel.v49';
  const panelHead=panel.querySelector('.finder-panel-head');
  let windowDrag=null,panelCustom=false,panelSaved=null;
  try{const v=JSON.parse(localStorage.getItem(panelKey)||'null');if(v&&Number.isFinite(v.x)&&Number.isFinite(v.y)){panelSaved=v;panelCustom=true;}}catch(_){}
  function limitPanel(x,y){
    const w=panel.offsetWidth||320,h=panel.offsetHeight||350;
    return {x:clamp(x,8,Math.max(8,innerWidth-w-8)),y:clamp(y,8,Math.max(8,innerHeight-h-8))};
  }
  function movePanel(x,y){
    const p=limitPanel(x,y);panel.style.left=p.x+'px';panel.style.top=p.y+'px';panel.style.right='auto';panel.style.bottom='auto';
    return p;
  }
  function savePanel(){
    const rect=panel.getBoundingClientRect();panelSaved=movePanel(rect.left,rect.top);panelCustom=true;
    try{localStorage.setItem(panelKey,JSON.stringify(panelSaved));}catch(_){}
  }
  panelHead.tabIndex=0;
  panelHead.setAttribute('aria-label','Intestazione di Finder. Trascina per spostare la finestra; da tastiera usa Ctrl più frecce.');
  panelHead.addEventListener('pointerdown',event=>{
    if(event.button!==0||event.target.closest('button')||panel.classList.contains('is-maximized'))return;
    const r=panel.getBoundingClientRect();windowDrag={id:event.pointerId,x:event.clientX,y:event.clientY,left:r.left,top:r.top,moved:false};
    try{panelHead.setPointerCapture(event.pointerId);}catch(_){}
  });
  panelHead.addEventListener('pointermove',event=>{
    if(!windowDrag||windowDrag.id!==event.pointerId)return;
    const dx=event.clientX-windowDrag.x,dy=event.clientY-windowDrag.y;
    if(Math.hypot(dx,dy)>6)windowDrag.moved=true;
    if(windowDrag.moved){panel.classList.add('is-window-dragging');movePanel(windowDrag.left+dx,windowDrag.top+dy);}
  });
  function finishWindowDrag(event){
    if(!windowDrag||windowDrag.id!==event.pointerId)return;
    if(windowDrag.moved)savePanel();windowDrag=null;panel.classList.remove('is-window-dragging');
  }
  panelHead.addEventListener('pointerup',finishWindowDrag);panelHead.addEventListener('pointercancel',finishWindowDrag);
  panelHead.addEventListener('keydown',event=>{
    if(!event.ctrlKey||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const r=panel.getBoundingClientRect();const step=event.shiftKey?40:15;
    movePanel(r.left+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0),r.top+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0));savePanel();
  });
  $('finderExpand')?.addEventListener('click',()=>{
    const expanded=panel.classList.toggle('is-maximized');$('finderExpand').setAttribute('aria-pressed',String(expanded));
    $('finderExpand').textContent=expanded?'⤡':'⤢';
    if(!expanded){if(panelCustom&&panelSaved)movePanel(panelSaved.x,panelSaved.y);else updatePanelPosition();}
  });
  // Riavvia il filmato leggero soltanto quando Finder è visibile; evita un timer continuo.
  const orb=panel.querySelector('.finder-head-orb video');
  function resumeOrb(){
    if(panel.hidden||document.hidden||!orb)return;
    orb.loop=true;orb.muted=true;
    if(orb.paused || orb.ended){try{const p=orb.play();p?.catch?.(()=>{});}catch(_){}}
  }
  orb?.addEventListener('pause',()=>orb.classList.add('is-paused'));
  orb?.addEventListener('playing',()=>orb.classList.remove('is-paused'));
  orb?.addEventListener('ended',()=>{orb.currentTime=0;resumeOrb();});
  document.addEventListener('visibilitychange',resumeOrb);
  window.addEventListener('focus',resumeOrb);
  const panelObserver=new MutationObserver(()=>{if(!panel.hidden)resumeOrb();});
  panelObserver.observe(panel,{attributes:true,attributeFilter:['hidden']});
  window.addEventListener('resize',()=>{
    if(panelCustom&&panelSaved&&!panel.classList.contains('is-maximized'))movePanel(panelSaved.x,panelSaved.y);
  });
  // Suggerimenti organizzati per casi d'uso; nessun testo è inviato a servizi esterni.
  const questions=[
    ['Per la scuola',['Sono distrutto, aiutami a preparare lo zaino per domani','Che materie ho domani?','Che lezioni ho oggi?','Quali materie ho venerdì?','Cosa ho alla prossima ora?','Che aula ho dopo?','Mostrami l’orario di lunedì','Quante lezioni ho mercoledì?']],
    ['Aule e docenti',['Quali aule sono libere?','Ci sono aule disponibili alla terza ora?','Quali professori sono liberi?','Quali docenti hanno un’ora buca?','Dove si trova S.07?','Dov’è l’Archivio?','A che piano si trova la Palestra?','Come trovo la T.08?']],
    ['Come usare AulaFinder',['Come funziona il navigatore?','Come posso aprire una piantina a schermo intero?','Come aggiungo un preferito?','Come cambio il tema scuro?','Come cerco un professore?','Dove vedo le versioni precedenti?','Come uso il tutorial?','Come posso contattarvi?','A cosa serve Finder?','Non mi funziona il microfono, cosa faccio?']]
  ];
  const promptBox=$('finderPrompts');
  if(promptBox){
    promptBox.replaceChildren();
    questions.forEach(([heading,items])=>{
      const group=document.createElement('div');group.className='finder-prompt-group';
      const title=document.createElement('strong');title.textContent=heading;group.append(title);
      items.forEach(q=>{const b=document.createElement('button');b.type='button';b.dataset.finderPrompt=q;b.textContent=q;group.append(b);});
      promptBox.append(group);
    });
  }


  function nowRome(){
    const now=new Date();
    const short = new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Rome',weekday:'short'}).format(now);
    const dayIndex={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6}[short]??0;
    return {dayIndex,now};
  }
  function tomorrow(){const n=nowRome().dayIndex;return n+1;}
  const tomorrowSchoolLabel=()=>{
    const i=tomorrow();return i<5?days[i]:null;
  };
  function nextSchoolDay(day){const idx=days.indexOf(day);return days[(idx+1)%5];}
  const roomLabel = room => room ? (room==='Palestra' ? 'Palestra' : `aula ${room}`) : 'aula non indicata';
  const slotText = (slot, idx) => slot ? `${idx+1}: ${slot.subject} (${roomLabel(slot.room)}, ${teacherLabel(slot.teacher)})` : `${idx+1}: nessuna lezione prevista`;

  function answerLegacy(raw){
    const q=lower(raw).replace(/[?!.]/g,' ');
    const day=daySel.value, index=Number(hourSel.value)-1;
    const classId=selectedClass || window.AulaFinderBridge?.getCurrentClass?.();
    const item=DATA.classes[classId];
    const needsClass = /materi|lezion|prossima|domani|oggi|orario|dove.*(mia|prossima)|che aula (ho|avr)/.test(q);
    if(needsClass&&!item)return 'Per rispondere devo conoscere la tua classe. Selezionala dal menu “La tua classe” qui sopra.';

    if(/domani|giorno dopo/.test(q)){
      const tom=tomorrowSchoolLabel();
      if(!tom)return 'Domani non è un giorno scolastico (lunedì-venerdì). Puoi chiedermi il prossimo giorno di scuola.';
      const slots=item.days[tom]||[];
      return `Domani, ${tom}, la classe ${classId} ha:\n${slots.map(slotText).join('\n')}`;
    }
    if(/oggi/.test(q)){
      const d=nowRome().dayIndex;
      if(d>=5)return 'Oggi non è previsto un giorno scolastico: gli orari disponibili sono da lunedì a venerdì.';
      return `Oggi, ${days[d]}, la classe ${classId} ha:\n${(item.days[days[d]]||[]).map(slotText).join('\n')}`;
    }
    if(/prossim|ora dopo|che lezione ho dopo|che materia ho dopo/.test(q)){
      const nextIndex=index+1;
      if(nextIndex>=6){
        const nextDay=nextSchoolDay(day);
        const nextSlot=item.days[nextDay]?.[0];
        return `Hai selezionato la 6ª ora di ${day}, quindi non ci sono altre ore quel giorno. La prima ora del giorno scolastico successivo, ${nextDay}, è: ${nextSlot?`${nextSlot.subject}, ${roomLabel(nextSlot.room)}, con ${teacherLabel(nextSlot.teacher)}`:'nessuna lezione prevista'}.`;
      }
      const slot=item.days[day]?.[nextIndex];
      if(/dove|aula/.test(q))return slot ? `Alla ${nextIndex+1}ª ora di ${day}, la classe ${classId} sarà in ${roomLabel(slot.room)} per ${slot.subject}.` : `Alla ${nextIndex+1}ª ora di ${day} non è prevista una lezione per la classe ${classId}.`;
      return slot ? `Alla ${nextIndex+1}ª ora di ${day} hai ${slot.subject}, in ${roomLabel(slot.room)}, con ${teacherLabel(slot.teacher)}.` : `Alla ${nextIndex+1}ª ora di ${day} non è prevista una lezione per la classe ${classId}.`;
    }
    if(/ora buca|ore buche|professor.*liber|docent.*liber/.test(q)){
      const free=Object.entries(DATA.teachers).filter(([,teacher])=>{
        const a=teacher.days?.[day]||[];
        return !a[index] && a.slice(0,index).some(Boolean) && a.slice(index+1).some(Boolean);
      }).map(([id])=>id);
      return `A ${day}, ${index+1}ª ora, i professori con un'ora buca sono ${free.length}${free.length?': '+free.slice(0,18).join(', ')+(free.length>18?'…':''):'.'}. È una previsione da orario, non una conferma della loro presenza a scuola.`;
    }
    if(/aul.*liber|aula disponibile|aule disponibili/.test(q)){
      const free=DATA.freeRooms[day]?.[index]||[];
      return `Aule libere a ${day}, ${index+1}ª ora (${free.length}): ${free.join(', ')||'nessuna'}. Non sono disponibilità in tempo reale.`;
    }
    if(/orario|tutte.*lezion|settimana/.test(q)){
      window.AulaFinderBridge?.showClass?.(classId);
      return `Ho aperto l'orario completo della classe ${classId}. Puoi consultare tutte le materie, le aule e i docenti della settimana.`;
    }
    if(/quale (aula|lezione|materia)|che (aula|lezione|materia)|cosa ho/.test(q)){
      const match=q.match(/(?:ora|alla)\s*([1-6])/);
      const wanted=match?Number(match[1])-1:index;
      const slot=item?.days?.[day]?.[wanted];
      if(!item)return 'Seleziona prima la tua classe nel menu Finder.';
      return slot?`Per la classe ${classId}, ${day}, ${wanted+1}ª ora: ${slot.subject}, ${roomLabel(slot.room)}, con ${teacherLabel(slot.teacher)}.`:`Per la classe ${classId}, ${day}, ${wanted+1}ª ora non c'è una lezione prevista.`;
    }
    const roomMatch=q.match(/\b([stp])\s*\.?\s*(\d{1,2})\b|\b([123])\.(\d{1,2})\b/);
    if(roomMatch){
      const code=roomMatch[1]?`${roomMatch[1].toUpperCase()}.${roomMatch[2].padStart(2,'0')}`:`${roomMatch[3]}.${roomMatch[4].padStart(2,'0')}`;
      const floor=code[0]==='S'||code[0]==='P'?'semiterrato':code[0]==='T'?'piano terra':`piano ${code[0]}`;
      return `L'aula ${code} si trova al ${floor}. Per vedere la posizione esatta, apri Piantina o Navigatore.`;
    }
    return `Posso rispondere a domande come: “Che materie ho domani?”, “Che lezione ho la prossima ora?”, “Dove sarà la mia prossima aula?”, “Quali aule sono libere?” oppure “Mostrami l'orario della mia classe”.\nPer “prossima ora” e le disponibilità seguo Giorno e Ora selezionati nell'intestazione del sito.`;
  }

  // Motore locale: interpreta richieste naturali senza inviare messaggi a servizi esterni.
  const dialogue={lastIntent:null,lastDay:null};
  function normalizedText(s){return lower(s).replace(/[’']/g,"'").replace(/[?!,:;]+/g,' ').replace(/\s+/g,' ').trim();}
  function schoolDay(raw){
    const s=normalizedText(raw);
    const base=nowRome().dayIndex;
    if(/dopodomani|dopo domani/.test(s))return {day:days[base+2]||null,label:'dopodomani'};
    if(/domani/.test(s))return {day:days[base+1]||null,label:'domani'};
    if(/oggi|stasera|stamattina/.test(s))return {day:days[base]||null,label:'oggi'};
    const found=days.find(d=>s.includes(lower(d)));
    if(found)return {day:found,label:found};
    if(/prossim[oa] giorno|prossim[oa] settimana|giorno dopo/.test(s))return {day:days[(base+1)%5],label:'prossimo giorno scolastico'};
    return null;
  }
  function itemClass(classOverride=''){
    const id=classOverride||selectedClass||window.AulaFinderBridge?.getCurrentClass?.()||'';
    return {id,item:DATA.classes[id]||null};
  }
  function classesForDay(item,day){return (item?.days?.[day]||[]).slice(0,6);}
  function prettyLesson(slot,i){
    return slot?`${i+1}ª ora: ${slot.subject||'Materia non indicata'} · ${slot.room||'aula non indicata'}${slot.teacher?' · '+slot.teacher:''}`:`${i+1}ª ora: nessuna lezione prevista`;
  }
  function subjectsFor(item,day){return [...new Set(classesForDay(item,day).filter(Boolean).map(s=>s.subject).filter(Boolean))];}
  const siteHelp={
    versioni:'Apri Versioni dal menu laterale. Puoi cercare per parola o per numero e aprire le schede con le anteprime delle Home storiche.',
    preferiti:'Apri il risultato di un’aula, classe o professore e tocca la stella. Troverai le ricerche salvate nei Preferiti del menu.',
    mappe:'Apri Piantina, scegli il piano e tocca l’aula. Puoi anche ingrandire la mappa a schermo intero con il pulsante in alto a destra.',
    navigatore:'Apri Navigatore, scegli partenza e destinazione digitando il nome dell’aula o selezionandola sulla piantina. Poi premi «Mostra percorso». Le indicazioni sono schematiche e non vanno usate per emergenze.',
    ricerca:'Nella Home digita un’aula, una classe o la sigla di un docente. Puoi scegliere un suggerimento, poi consultare il risultato e il relativo orario.',
    tutorial:'Apri Tutorial per provare tutte le funzioni in sette tappe, rimanendo sempre nella guida.',
    tema:'In alto c’è il pulsante con il sole o la luna. Ti permette di passare dal tema chiaro a quello scuro.',
    contatti:'Per aiuto, domande o segnalazioni puoi scrivere a aulafinder@gmail.com.'
  };
  function smartAnswer(raw,override='',options={}){
    const q=normalizedText(raw), compact=q.replace(/[.\s]+/g,'');
    if(!q)return 'Scrivimi pure la tua domanda.';
    const {id,item}=itemClass(override);
    const soft=/stanc[oa]|esaust[oa]|non ho voglia|sono distrutt[oa]|sono cotto|sono sfatt[oa]|stressat[oa]|ansia|sfinito/.test(q);
    const prefix=soft?'Capisco, quando sei stanco anche preparare lo zaino sembra un’impresa. Ti semplifico tutto. 💚\n\n':'';
    const mentionedDay=schoolDay(q);
    const carry=/cartella|zaino|portare a scuola|cosa port|preparare le cose|materiale|libri da portare/.test(q);
    const study=/materie|lezion|orari|orario|lezione|cosa ho|che ho|programma|prossim.*aula|che aula|dove.*prossima aula|ore ho/.test(q);
    const follow=/^(e |invece |anche |per |martedi|mercoledi|giovedi|venerdi|lunedi|domani|dopodomani)/.test(q);
    const intent=carry?'bag':/aule? liber|stanza libera|aule? disponibil/.test(q)?'freeRooms':/professor[ie] liber|docent[ie] liber|ore buche/.test(q)?'freeTeachers':study?'schedule':null;
    const effective=intent||(follow&&mentionedDay?dialogue.lastIntent:null);
    const day=mentionedDay?.day|| (carry?days[(nowRome().dayIndex+1)%5]:(dialogue.lastDay||$('daySelect').value));
    const dayLabel=mentionedDay?.label||day;

    if(/chi sei|cosa sai fare|come funziona finder|sei un'ai|sei un'intelligenza artificiale|sei vero/.test(q)){
      return 'Sono Finder, l’assistente locale di AulaFinder. Posso capire tante domande scritte normalmente e consultare gli orari della scuola, ma non sono un chatbot con accesso a Internet e non invento informazioni. Prova: «Sono stanco e devo preparare lo zaino per domani».';
    }
    if(/microfono|audio|non mi sente|non funziona la voce|riconoscimento vocal/.test(q)){
      return 'Puoi usare Finder scrivendo. Per dettare, controlla i permessi del microfono nelle impostazioni del browser e che nessun’altra app lo stia usando. Il riconoscimento vocale dipende dal browser e può non funzionare offline.';
    }
    if(/mail|email|contatt|scrivervi|segnalazione|aiuto umano/.test(q))return siteHelp.contatti;
    if(/version[ie]|changelog|aggiornament|novit[aà]|cronologia versioni|storia del progetto/.test(q))return siteHelp.versioni;
    if(/preferit|stella|salvar|memorizz/.test(q))return siteHelp.preferiti;
    if(/tema|scur[oa]|chiar[oa]|notturn[oa]|luna|luminosit/.test(q))return siteHelp.tema;
    if(/tutorial|guida|spiegami il sito|come si usa aulafinder/.test(q))return siteHelp.tutorial;
    if(/piantin|mapp[ae]|schermo intero|pian[oi] dell[ao] scuol|dove si trova.*pian/.test(q)&& !/dove si trova.*(?:[stp]\.?\d+|[123]\.\d+|palestra|archivio|caldaie)/.test(q))return siteHelp.mappe;
    if(/navigat|percors|come arriv|come raggiung|indicazioni|scale o ascensore/.test(q))return siteHelp.navigatore;
    if(/come cerc|ricerc|come trovo una classe|cercare un prof/.test(q))return siteHelp.ricerca;

    if(/(?:quante|numero|totale|ore).*ore|ore.*(?:settimanali|settimana|totale)|quanto (?:insegna|lavora)/.test(q)&&/prof|docent|insegn|sigla/.test(q)){
      const ids=Object.keys(DATA.teachers);
      const matched=ids.filter(k=>{const l=lower(k);return q.includes(l)&&l.length>1;})
        .sort((a,b)=>b.length-a.length)[0];
      if(!matched)return 'Per calcolare il totale settimanale scrivimi la sigla del docente, ad esempio «Quante ore fa il prof BA AN?». Puoi anche aprire Orari → Professori.';
      const hours=Object.values(DATA.teachers[matched].days||{}).flat().filter(Boolean).length;
      return `Il docente ${matched} ha ${hours} ore di lezione previste in totale dal lunedì al venerdì, in base agli orari caricati. Non rappresentano tutte le ore lavorative del docente.`;
    }
    // Indicazioni per una stanza. Distingue sempre posizione/orario previsto da presenza reale.
    const roomMatch=q.match(/\b([stp])\s*\.?\s*(\d{1,2})\b|\b([123])\s*\.\s*(\d{1,2})\b|\b(palestra|archivio|caldaie|caldaia)\b/i);
    const code=roomMatch?roomMatch[5]?roomMatch[5].replace(/^caldaia$/,'Caldaie').replace(/^./,c=>c.toUpperCase()):roomMatch[1]?`${roomMatch[1].toUpperCase()}.${roomMatch[2].padStart(2,'0')}`:`${roomMatch[3]}.${roomMatch[4].padStart(2,'0')}`:null;
    if(code && /dove|trov|piano|posizione|aula|stanza/.test(q) && !/(materie|lezioni|orario|liber)/.test(q)){
      const floors=code==='Palestra'?'tra piano terra e sotterraneo':code==='Archivio'||code==='Caldaie'?'al piano sotterraneo':code.startsWith('S.')||code.startsWith('P.')?'al piano sotterraneo':code.startsWith('T.')?'al piano terra':`al piano ${code[0]}`;
      return `${code} si trova ${floors}. Per vedere il punto preciso usa Piantina; per arrivarci usa Navigatore.`;
    }
    if(effective==='freeRooms'){
      const d=day&&days.includes(day)?day:$('daySelect').value;
      const hourMatch=q.match(/(?:ora|alla)\s*([1-6])/);
      const hourIdx=hourMatch?Number(hourMatch[1])-1:Number($('hourSelect').value)-1;
      const free=DATA.freeRooms[d]?.[hourIdx]||[];
      dialogue.lastIntent='freeRooms';dialogue.lastDay=d;
      return `${d}, ${hourIdx+1}ª ora: ${free.length} aule senza lezione prevista. ${free.length?free.join(', '):'Nessuna aula indicata.'}\nNon è una disponibilità aggiornata in tempo reale.`;
    }
    if(effective==='freeTeachers'){
      const d=day&&days.includes(day)?day:$('daySelect').value;
      const h=Number($('hourSelect').value)-1;
      const gaps=/buca|intermed/.test(q);
      const free=Object.entries(DATA.teachers).filter(([,t])=>{const a=t.days?.[d]||[];return !a[h]&&(!gaps||(a.slice(0,h).some(Boolean)&&a.slice(h+1).some(Boolean)));}).map(([id])=>id);
      dialogue.lastIntent='freeTeachers';dialogue.lastDay=d;
      return `${d}, ${h+1}ª ora: ${free.length} docenti ${gaps?'con un’ora buca':'senza lezione prevista'}. ${free.length?free.slice(0,25).join(', ')+(free.length>25?'…':''):'Nessuno segnalato.'}\nNon indica la presenza fisica dei docenti.`;
    }
    if(effective==='bag'||effective==='schedule'){
      if(!item)return prefix+'Per consultare il tuo orario devo conoscere la tua classe. Selezionala nel menu «La tua classe».';
      if(!day||!days.includes(day))return prefix+'Per quel giorno non risultano lezioni nel calendario disponibile, che va dal lunedì al venerdì. Puoi chiedermi il prossimo giorno scolastico.';
      const slots=classesForDay(item,day);
      dialogue.lastIntent=effective;dialogue.lastDay=day;
      if(carry||effective==='bag'){
        const subjects=subjectsFor(item,day);
        return prefix+`Per ${dayLabel} (${day}), la classe ${id} ha queste materie:\n${subjects.map(s=>'• '+s).join('\n')||'Nessuna materia indicata.'}\n\nPrima di chiudere lo zaino, controlla sul registro i compiti e il materiale specifico. Quelli non sono disponibili in AulaFinder.`;
      }
      if(/solo materie|quali materie|che materie/.test(q))return prefix+`Materie di ${day} per ${id}: ${subjectsFor(item,day).join(', ')||'nessuna lezione'}.`;
      if(/prossim|ora dopo|adesso|ora corrente/.test(q)){
        const base=Number($('hourSelect').value)-1;
        const idx=/prossim|dopo/.test(q)?Math.min(5,base+1):base;
        return prefix+`Per la ${idx+1}ª ora di ${day} (${id}): ${prettyLesson(slots[idx],idx)}. Uso l’ora selezionata in alto nel sito.`;
      }
      return prefix+`Orario di ${day} per la classe ${id}:\n${slots.map(prettyLesson).join('\n')}`;
    }
    if(/ciao|buongiorno|buonasera|salve|hey finder|ehi finder/.test(q))return 'Ciao! Sono qui per darti una mano. Dimmi che classe fai oppure chiedimi qualcosa sul sito e sugli orari.';
    return prefix+'Posso aiutarti con gli orari e con AulaFinder. Per esempio: «Sono stanco, cosa metto nello zaino domani?», «Che aula ho alla prossima ora?», «Quali aule sono libere?», «Dove si trova S.07?», «Come funziona il navigatore?» oppure «Dove trovo le versioni?».';
  }
  function answer(raw,classOverride='',options={}){
    return smartAnswer(raw,classOverride,options);
  }

  function addMessage(text,who){
    const node=document.createElement('p');
    node.className='finder-message finder-message-'+who;
    node.textContent=String(text).slice(0,maxOutput);
    log.appendChild(node);
    while(log.children.length>13)log.removeChild(log.firstElementChild);
    log.scrollTop=log.scrollHeight;
  }
  function say(text){
    if(!lastVoiceInput || !('speechSynthesis' in window))return;
    lastVoiceInput=false;
    try {
      window.speechSynthesis.cancel();
      const msg=new SpeechSynthesisUtterance(text.slice(0,600));
      msg.lang='it-IT';msg.rate=1.04;
      const italian=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('it')&&v.localService===true);
      if(!italian)return; // Non utilizziamo una voce remota per simulare una voce offline.
      msg.voice=italian;msg.pitch=1.05;msg.rate=1.02;
      window.speechSynthesis.speak(msg);
    }catch(_){}
  }
  const soundAsk=new Audio('assets/finder-ask.wav');soundAsk.preload='auto';soundAsk.volume=.37;
  function playAskSound(){try{soundAsk.pause();soundAsk.currentTime=0;const result=soundAsk.play();result?.catch?.(()=>{});}catch(_){}}
  function ask(question){
    const q=String(question||'').trim();if(!q)return;
    if(!desiredOpen)setOpen(true);
    playAskSound();
    addMessage(q,'user');
    let reply;
    try{reply=answer(q);}catch(e){console.error('Finder error:',e);reply='Non riesco a consultare questa informazione. Riprova a selezionare la classe.';}
    addMessage(reply,'assistant');
    say(reply);
  }
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);input.value='';});
  $('finderPrompts').addEventListener('click',e=>{const btn=e.target.closest('[data-finder-prompt]');if(btn)ask(btn.dataset.finderPrompt);});

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micButtons=[voiceSearch,voiceFinder];
  if(!SR){
    micButtons.forEach(el=>{if(!el)return;el.disabled=true;el.title='Riconoscimento vocale non supportato: usa la tastiera';el.setAttribute('aria-label','Microfono non disponibile in questo browser');});
    status.textContent='Finder funziona anche senza microfono. Il riconoscimento vocale non è disponibile in questo browser.';
  }else{
    const listen=(target,button)=>{
      if(activeRecognition){try{activeRecognition.stop();}catch(_){}return;}
      const rec=new SR();activeRecognition=rec;
      rec.lang='it-IT';rec.interimResults=false;rec.continuous=false;rec.maxAlternatives=1;
      button.setAttribute('aria-pressed','true');
      if(target==='finder')status.textContent='Ascolto in corso… parla ora.';
      rec.onresult=e=>{
        const transcript=Array.from(e.results).map(r=>r[0]?.transcript||'').join(' ').trim();
        if(!transcript)return;
        if(target==='search'){
          mainSearch.value=transcript;
          mainSearch.dispatchEvent(new Event('input',{bubbles:true}));
          mainSearch.focus();
        }else{
          input.value=transcript;
          lastVoiceInput=true;
          ask(transcript);input.value='';
        }
      };
      rec.onerror=e=>{
        const err=e.error;
        status.textContent=err==='not-allowed'?'Microfono bloccato: consenti l’accesso nelle impostazioni del browser.':err==='audio-capture'?'Il browser non riesce ad accedere al microfono. Controlla i permessi, chiudi altre app che lo usano e riprova. Puoi sempre scrivere.':err==='no-speech'?'Non ho sentito nulla. Riprova parlando vicino al microfono.':err==='network'?'Il riconoscimento vocale del browser richiede una connessione e ora non è disponibile. La chat scritta funziona offline.':`Microfono non disponibile (${err}). Puoi scrivere.`;
      };
      rec.onend=()=>{
        button.setAttribute('aria-pressed','false');activeRecognition=null;
        if(target==='finder'&&status.textContent.startsWith('Ascolto'))status.textContent='Premi il microfono per parlare o scrivi la tua domanda.';
      };
      try{rec.start();}catch(_){button.setAttribute('aria-pressed','false');activeRecognition=null;status.textContent='Impossibile avviare il microfono. Puoi sempre scrivere.';}
    };
    voiceSearch.addEventListener('click',()=>listen('search',voiceSearch));
    voiceFinder.addEventListener('click',()=>listen('finder',voiceFinder));
  }
  window.AulaFinderVoice={ask,respond:(question,classOverride,options)=>answer(question,classOverride,options),open:()=>setOpen(true),getClass:()=>selectedClass};
})();
