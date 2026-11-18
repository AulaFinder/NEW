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
      // Non spostare il focus su input/select: su mobile aprirebbe la tastiera.
    }else{
      try {activeRecognition?.stop();} catch (_) {}
      stopMeter();
      if(document.activeElement?.closest?.("#finderPanel"))launch.focus({preventScroll:true});
    }
  };
  const expand=$('finderExpand');
  expand?.addEventListener('click',()=>{const expanded=panel.classList.toggle('is-expanded');expand.setAttribute('aria-pressed',String(expanded));expand.setAttribute('aria-label',expanded?'Riduci Finder':'Espandi Finder');panel.dispatchEvent(new Event('finder:resize'));});
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
    if(/navig|percors|come arriv|come raggiung|strad|andare (a|da)/.test(q)){
      const rooms=[...raw.matchAll(/(?:[STP]\s*\.?\s*\d{1,2}|[123]\s*\.\s*\d{1,2})/gi)].map(x=>x[0].replace(/\s+/g,'').toUpperCase().replace(/^([STP])(?=\d)/,'$1.'));
      const [fromRoom,toRoom]=rooms;
      if(fromRoom&&toRoom&&window.AulaFinderNavigator?.setRoute){const done=window.AulaFinderNavigator.setRoute(fromRoom,toRoom);return done?`Percorso pronto da ${fromRoom} a ${toRoom}. Apri Navigatore per seguire i passaggi.`:`Non riesco a verificare il percorso da ${fromRoom} a ${toRoom}. Controlla i codici delle aule e riprova dal Navigatore.`;}
      if(toRoom||fromRoom){const room=toRoom||fromRoom;window.AulaFinderNavigator?.setDestination?.(room);return `Ho impostato ${room} come destinazione nel navigatore. Indica anche l'aula di partenza per calcolare il percorso.`;}
      return 'Per usare il navigatore, indicami due aule. Esempio: “Come vado da 1.01 a 3.04?”. Puoi anche aprire Navigatore e scegliere le aule direttamente sulla piantina.';
    }
    if(/piantin|mapp|piano|edific|dov.e.*(aula|laboratorio)/.test(q))return 'Nella sezione Piantina puoi scegliere il piano, selezionare un’aula e visualizzarne la posizione. Per andare da una stanza a un’altra usa il Navigatore.';
    if(/tutorial|guida|come funziona|come si usa|aiuto|cosa (puoi|sai) fare/.test(q))return 'Posso aiutarti a trovare orari di classi, aule e docenti, disponibilità e percorsi. La sezione Tutorial contiene esercizi interattivi su tutte le funzioni.';
    if(/version|aggiornam|novita|novità|cambiament/.test(q))return 'La sezione Versioni racconta le revisioni del progetto e mostra le anteprime disponibili. Le vecchie anteprime non presenti nei file non vengono inventate.';
    if(/preferit|salva|stellina|cronologia/.test(q))return 'Usa la stella ★ nei risultati per aggiungere un’aula, una classe o un docente ai Preferiti. Le ricerche recenti si trovano nel menu laterale.';
    if(/admin|password|accesso riservato/.test(q))return 'La sezione Admin si trova nell’intestazione e nel footer. L’accesso locale ha una tastiera dedicata, ma non sostituisce una protezione server.';
    if(/(professor|docent|insegnant).*(quante|totale|ore)|(quante|totale).*(ore).*(professor|docent)/.test(q))return 'Apri la scheda del docente dalla ricerca o da Orari → Professori. Lì trovi la distribuzione delle lezioni settimanali.';
    if(/(orari|orario).*(aula|professor|docent)/.test(q))return 'In Orari puoi scegliere “Aule” o “Professori”, cercare la sigla o il codice e consultare la settimana completa.';
    if(/(liber|disponib).*(aula|professor|docent)/.test(q))return 'In Orari → Aule libere e Orari → Professori liberi trovi la disponibilità prevista per giorno e ora. Per i docenti puoi distinguere le vere ore buche dalle ore senza lezione.';
    return 'Posso aiutarti con ricerca, orari, professori e aule libere, piantine, navigatore, preferiti, tutorial e versioni. Prova a formulare la domanda con il nome della funzione o un codice aula, e ti guiderò con le informazioni effettivamente disponibili.';
  }

  function addMessage(text,who){
    const node=document.createElement('p');
    node.className='finder-message finder-message-'+who;
    node.textContent=String(text).slice(0,maxOutput);
    log.appendChild(node);
    while(log.children.length>13)log.removeChild(log.firstElementChild);
    log.scrollTop=log.scrollHeight;
  }
  // V51: niente audio generato, nemmeno dopo una domanda via microfono.
  function say(){lastVoiceInput=false;}
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
  const prompts=[
    'Come arrivo da 1.01 a 3.04?', 'Che materie ho domani?', 'Quali aule sono libere alla seconda ora?',
    'Come trovo un professore?', 'Come si usa la piantina?', 'Che lezione ho la prossima ora?',
    'Che cosa sono le ore buche dei docenti?', 'Come aggiungo un preferito?',
    'Dove si trova il laboratorio di informatica?', 'Come consulto le versioni?',
    'Mostrami l’orario della mia classe', 'Cosa posso cercare nel sito?',
    'Come vedo il percorso tra due piani?', 'Come funziona il tutorial?',
    'Che cosa indica un’aula libera?', 'Dove trovo l’orario di un’aula?'];
  let promptOffset=0;
  function renderPrompts(){
    const host=$('finderPrompts');host.replaceChildren();
    for(let i=0;i<2;i++){
      const text=prompts[(promptOffset+i)%prompts.length];
      const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.finderPrompt=text;
      b.style.animationDelay=`${i*110}ms`;host.append(b);
    }
  }
  renderPrompts();
  window.setInterval(()=>{if(!panel.hidden&&!document.activeElement?.closest?.('.finder-prompt-zone')){promptOffset=(promptOffset+2)%prompts.length;renderPrompts();}},7200);
  $('finderPromptNext')?.addEventListener('click',()=>{promptOffset=(promptOffset+2)%prompts.length;renderPrompts();});
  $('finderPrompts').addEventListener('click',e=>{const btn=e.target.closest('[data-finder-prompt]');if(btn)ask(btn.dataset.finderPrompt);});

  let meterStream=null,meterCtx=null,meterFrame=0;
  const meterButtons=[voiceSearch,voiceFinder].filter(Boolean);
  function stopMeter(){
    if(meterFrame)cancelAnimationFrame(meterFrame);meterFrame=0;
    meterStream?.getTracks().forEach(t=>t.stop());meterStream=null;
    if(meterCtx){meterCtx.close().catch(()=>{});meterCtx=null;}
    meterButtons.forEach(b=>{b.classList.remove('is-listening');b.style.removeProperty('--voice-level');b.querySelectorAll('.af-voice-bars i').forEach(x=>x.style.removeProperty('--bar-level'));});
  }
  async function startMeter(button){
    stopMeter();button.classList.add('is-listening');
    if(!navigator.mediaDevices?.getUserMedia||!(window.AudioContext||window.webkitAudioContext))return;
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
      if(!button.classList.contains('is-listening')){stream.getTracks().forEach(t=>t.stop());return;}
      meterStream=stream;meterCtx=new (window.AudioContext||window.webkitAudioContext)();
      const analyser=meterCtx.createAnalyser();analyser.fftSize=512;analyser.smoothingTimeConstant=.68;
      meterCtx.createMediaStreamSource(stream).connect(analyser);
      const samples=new Uint8Array(analyser.frequencyBinCount);
      const bars=[...button.querySelectorAll('.af-voice-bars i')];
      const paint=()=>{
        analyser.getByteFrequencyData(samples);
        bars.forEach((bar,i)=>{
          const lo=Math.floor((i+1)*samples.length/16),hi=Math.min(samples.length,lo+Math.floor(samples.length/16));
          let sum=0;for(let j=lo;j<hi;j++)sum+=samples[j];
          const level=Math.max(.14,Math.min(1,(sum/Math.max(1,hi-lo))/135));
          bar.style.setProperty('--bar-level',String(level));
        });
        meterFrame=requestAnimationFrame(paint);
      };paint();
    }catch(_){/* Fallback visuale se il browser nega l'accesso separato all'analizzatore. */}
  }
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
      button.setAttribute('aria-pressed','true');startMeter(button);
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
        button.setAttribute('aria-pressed','false');activeRecognition=null;stopMeter();
        if(target==='finder'&&status.textContent.startsWith('Ascolto'))status.textContent='Premi il microfono per parlare o scrivi la tua domanda.';
      };
      try{rec.start();}catch(_){button.setAttribute('aria-pressed','false');activeRecognition=null;stopMeter();status.textContent='Impossibile avviare il microfono. Puoi sempre scrivere.';}
    };
    voiceSearch.addEventListener('click',()=>listen('search',voiceSearch));
    voiceFinder.addEventListener('click',()=>listen('finder',voiceFinder));
  }
  window.AulaFinderVoice={ask,open:()=>setOpen(true),getClass:()=>selectedClass};
})();
