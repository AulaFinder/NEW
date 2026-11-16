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
  const maxOutput = 900;
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

  const setOpen = open => {
    panel.hidden=!open;
    launch.setAttribute('aria-expanded',String(open));
    if(open){
      const active=window.AulaFinderBridge?.getCurrentClass?.();
      if(active && allClasses.includes(active) && !selectedClass){selectedClass=active;select.value=active;}
      if(!selectedClass)select.focus({preventScroll:true});
      else input.focus({preventScroll:true});
    }else{
      try {activeRecognition?.stop();} catch (_) {}
      launch.focus({preventScroll:true});
    }
  };
  launch.addEventListener('click',()=>setOpen(panel.hidden));
  close.addEventListener('click',()=>setOpen(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !panel.hidden)setOpen(false);});
  document.addEventListener('click',e=>{
    if(!panel.hidden && !panel.contains(e.target) && !launch.contains(e.target))setOpen(false);
  });

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

  function answer(raw){
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
      const italian=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('it'));
      if(italian)msg.voice=italian;
      window.speechSynthesis.speak(msg);
    }catch(_){}
  }
  function ask(question){
    const q=String(question||'').trim();if(!q)return;
    if(panel.hidden)setOpen(true);
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
        status.textContent=err==='not-allowed'?'Microfono non autorizzato. Concedi il permesso dal browser o scrivi.':err==='no-speech'?'Non ho sentito nulla. Riprova o scrivi la domanda.':`Riconoscimento vocale non disponibile (${err}). Puoi scrivere.`;
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
  window.AulaFinderVoice={ask,open:()=>setOpen(true),getClass:()=>selectedClass};
})();
