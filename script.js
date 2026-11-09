/* AulaFinder • JavaScript vanilla.
 * Tutti gli orari sono integrati nel sito tramite data.js, senza link esterni.
 * Giorni: lunedì-venerdì. Ore: 1-6. Nessuna presenza è rilevata in tempo reale.
 */
(() => {
  'use strict';
  const DATA = window.AULAFINDER_DATA;
  if (!DATA) { console.error('AulaFinder: data.js mancante'); return; }

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const daySelect = $('#daySelect');
  const hourSelect = $('#hourSelect');
  const searchInput = $('#searchInput');
  const names = {classes:'Orari classi',rooms:'Orari aule',teachers:'Orari professori',freeRooms:'Orari aule libere',freeTeachers:'Orari professori liberi'};
  // Icone SVG coerenti con il mockup: aula, gruppo classe e tocco accademico.
  const entityIcons = {
    rooms: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" class=\"entity-icon\" fill=\"currentColor\"><path d=\"M12 2a8 8 0 0 0-8 8c0 5.3 8 12 8 12s8-6.7 8-12a8 8 0 0 0-8-8Zm0 11.1a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Z\"/></svg>",
    classes: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" class=\"entity-icon\" fill=\"currentColor\"><circle cx=\"12\" cy=\"6\" r=\"3.5\"/><circle cx=\"4.5\" cy=\"9\" r=\"2.7\"/><circle cx=\"19.5\" cy=\"9\" r=\"2.7\"/><path d=\"M5 21v-3c0-3.6 2.7-6 7-6s7 2.4 7 6v3H5Zm-5-1v-3.2c0-2.5 1.5-4.4 4-4.7 1 .1 1.9.5 2.5 1.2A7.7 7.7 0 0 0 3 19.2v.8H0Zm24 0h-3v-.8a7.7 7.7 0 0 0-3.5-5.9c.7-.7 1.5-1.1 2.5-1.2 2.5.3 4 2.2 4 4.7V20Z\"/></svg>",
    teachers: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" class=\"entity-icon\" fill=\"currentColor\"><path d=\"M12 2 0 8.5 12 15l9-4.9v6.3h2V8.5L12 2Zm-6 11v4.8C7.4 19.3 9.7 20 12 20s4.6-.7 6-2.2V13l-6 3.3L6 13Z\"/></svg>"
  };
  // Un'unica famiglia di icone SVG in TUTTE le sezioni e risultati.
  const clockIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="entity-icon" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>';
  const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="entity-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/></svg>';
  const planIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="plan-link-icon" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15m6-12v15"/></svg>';
  const coffeeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="entity-icon" fill="currentColor"><path d="M5 8h12v6.1A5.9 5.9 0 0 1 11.1 20H10.9A5.9 5.9 0 0 1 5 14.1V8Zm12 1.1h1.7a3.3 3.3 0 0 1 0 6.6H17v-2.2h1.7a1.1 1.1 0 0 0 0-2.2H17V9.1ZM4 21h15v1.5H4V21ZM8 2.1c2.1 1.5-1.1 2.5 1 4H7.4C5.3 4.4 8.4 3.5 8 2.1Zm4 0c2.1 1.5-1.1 2.5 1 4h-1.6c-2.1-1.7 1-2.6.6-4Z"/></svg>';
  const scheduleIcons = {...entityIcons,freeRooms:entityIcons.rooms,freeTeachers:coffeeIcon,clock:clockIcon,search:searchIcon};
  document.querySelectorAll('[data-icon]').forEach(el=>{
    el.innerHTML=scheduleIcons[el.dataset.icon]||clockIcon;
  });
  const TEACHER_NAMES = window.AULAFINDER_DOCENTI?.names || {};
  // Formato aule: sempre con il punto e lo zero davanti (T.02, P.04, S.01...).
  const renRoom = (r) => { const m=String(r).match(/^(Informatica\s+)?([PST])\.?(\d+)$/i); return m ? (m[1]||'')+m[2].toUpperCase()+'.'+m[3].padStart(2,'0') : r; };
  const canon = (s) => norm(renRoom(norm(s).replace(/^AULA\s+/,''))).replace(/[.\s]/g,'');
  const state = {page:'home',schedule:'classes',selection:'',result:null,history:[],favorites:[],freeTeacherFilter:'',scheduleReturn:'orari'};
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();
  const date = () => daySelect.value;
  const hour = () => Number(hourSelect.value);
  const lesson = (item, day=date(), index=hour()-1) => item?.days?.[day]?.[index] || null;
  // Subject always appears after teacher name/alias in every view.
  function teacherKey(code,subject=''){
    if(code==='BA AN' && subject) return /inglese/i.test(subject)?'BA AN (INGLESE)':'BA AN (SCIENZE)';
    return code;
  }
  function teachingSubject(id){
    const teacher=DATA.teachers[id];
    if(!teacher) return 'Materia non specificata';
    let arr=[...new Set(Object.values(teacher.days).flat().filter(Boolean).map(x=>x.subject))];
    if(arr.includes('Matematica e Fisica')) arr=arr.filter(x=>!['Matematica','Fisica'].includes(x));
    if(arr.includes('Italiano e Latino')) arr=arr.filter(x=>!['Italiano','Latino'].includes(x));
    if(arr.includes('Storia e Filosofia')) arr=arr.filter(x=>!['Filosofia','Storia'].includes(x));
    return arr.join(' / ');
  }
  function teacherBase(code,subject=''){
    const key=teacherKey(code,subject);
    return TEACHER_NAMES[key] || TEACHER_NAMES[code] || code.replace(/ \(.*?\)$/,'');
  }
  function prof(code,subject=''){
    const key=teacherKey(code,subject);
    const subj=subject || teachingSubject(key);
    return `Prof. ${teacherBase(code,subject)} (${subj})`;
  }
  const label = (kind,id) => kind === 'classes' ? `Classe ${id}` : (kind === 'rooms'||kind==='mapRooms') ? (['Palestra','Ingresso','Archivio','Caldaie'].includes(id)?id:`Aula ${id}`) : prof(id);
  // Ordine richiesto per TUTTE le liste: S, P, Palestra, T, 1, 2, 3.
  // L'etichetta 'Informatica X' usa il piano/codice X, senza perdere il nome.
  function roomSortKey(id){
    const original=String(id);
    const upper=original.toUpperCase();
    const base=upper.replace(/^INFORMATICA\s+/, '');
    const isLab=upper!==base ? 1 : 0;
    if(/^S(?:\d|\.)/.test(base)) return [0,parseFloat(base.slice(1).replace('.',''))||0,isLab,original];
    if(/^P\.\d/.test(base)) return [1,parseFloat(base.slice(2))||0,isLab,original];
    if(base==='PALESTRA') return [2,0,0,original];
    if(/^T(?:\d|\.)/.test(base)) return [3,parseFloat(base.slice(1).replace('.',''))||0,isLab,original];
    const match=base.match(/^([123])\.(\d+)$/);
    if(match) return [3+Number(match[1]),Number(match[2]),isLab,original];
    return [7,999,0,original];
  }
  function sortRooms(a,b){const aa=roomSortKey(a),bb=roomSortKey(b);for(let i=0;i<Math.max(aa.length,bb.length);i++){if(aa[i]===undefined)return-1;if(bb[i]===undefined)return 1;const cmp=typeof aa[i]==='number'&&typeof bb[i]==='number'?aa[i]-bb[i]:String(aa[i]).localeCompare(String(bb[i]),'it',{numeric:true});if(cmp)return cmp;}return 0;}


  // Preferiti per questo dispositivo: nessun account, dati locali.
  const knownRoomKeys=new Set(Object.keys(DATA.rooms).map(id=>norm(id).replace(/^INFORMATICA\s+/, '').replace(/[.\s]/g,'')));
  const mapRoomIds=[...new Set([...document.querySelectorAll('#piantinaPage g.room')].map(g=>(g.dataset.t||'').split('·')[0].trim()).filter(id=>/^(?:[STP]\.\d+|[123]\.\d+|Palestra|Ingresso|Archivio|Caldaie)$/i.test(id)))].filter(id=>!knownRoomKeys.has(norm(id).replace(/^INFORMATICA\s+/,'').replace(/[.\s]/g,''))).sort(sortRooms);
  const isValidFavorite=(v)=>v&&['rooms','classes','teachers','mapRooms'].includes(v.kind)&&(v.kind==='mapRooms'?mapRoomIds.includes(v.id):!!DATA[v.kind]?.[v.id]);
  function iconFor(kind){return entityIcons[kind==='mapRooms'?'rooms':kind]||entityIcons.rooms;}
  try { const saved=JSON.parse(localStorage.getItem('aulafinder.favorites')||'[]');
    if(Array.isArray(saved))state.favorites=saved.filter(v=>v&&isValidFavorite(v)).slice(0,50);
  }catch(_){}
  const isFavorite=(kind,id)=>state.favorites.some(v=>v.kind===kind&&v.id===id);
  function favButton(kind,id,extra=''){
    const saved=isFavorite(kind,id);
    return `<button type="button" class="favorite-toggle ${extra}" data-favorite-kind="${escapeHtml(kind)}" data-favorite-id="${escapeHtml(id)}" aria-pressed="${saved}" aria-label="${saved?'Rimuovi dai preferiti':'Aggiungi ai preferiti'}: ${escapeHtml(label(kind,id))}" title="${saved?'Rimuovi dai preferiti':'Aggiungi ai preferiti'}"><span aria-hidden="true">${saved?'★':'☆'}</span></button>`;
  }
  function persistFavorites(){try{localStorage.setItem('aulafinder.favorites',JSON.stringify(state.favorites));}catch(_){}}
  function renderFavorites(){
    const list=$('#favoritesList'),home=$('#homeFavorites');
    if(!list||!home)return;
    const previousScroll=list.scrollTop;
    list.classList.toggle('is-scrollable',state.favorites.length>4);
    list.innerHTML=state.favorites.length?state.favorites.map((v,i)=>`<div class="favorites-item"><button type="button" class="favorites-open" data-fav-open="${i}"><span aria-hidden="true" class="icon-inline">${iconFor(v.kind)}</span>${escapeHtml(label(v.kind,v.id))}</button><button class="favorites-remove" data-fav-remove="${i}" type="button" aria-label="Rimuovi ${escapeHtml(label(v.kind,v.id))} dai preferiti" title="Rimuovi">★</button></div>`).join(''):'<p class="small-muted">Nessun preferito salvato.</p>';
    list.scrollTop=previousScroll;
    home.hidden=state.favorites.length===0;
    $('#clearFavoritesButton').disabled=state.favorites.length===0;
    home.innerHTML=state.favorites.length?`<strong>★ Preferiti</strong>`+state.favorites.slice(0,5).map((v,i)=>`<button type="button" data-fav-open="${i}">${escapeHtml(v.kind==='teachers'?teacherBase(v.id):v.id)}</button>`).join(''):'';
  }
  function clearFavorites(){
    if(!state.favorites.length || !window.confirm('Vuoi cancellare tutti i preferiti?'))return;
    state.favorites=[];persistFavorites();renderFavorites();
    if(state.page==='results')renderResults();
    if(state.page==='orari')renderSchedule();
  }
  function setFavorite(kind,id,forceRemove=false){
    if(!(kind==='mapRooms'?mapRoomIds.includes(id):DATA[kind]?.[id]))return;
    const wasSaved=isFavorite(kind,id);
    state.favorites=state.favorites.filter(v=>!(v.kind===kind&&v.id===id));
    if(!forceRemove&&!wasSaved)state.favorites.unshift({kind,id});
    persistFavorites();renderFavorites();
    if(state.page==='results')renderResults();
    if(state.page==='orari')renderSchedule();
    if(!$('#searchSuggestions').hidden)previewSuggestions();
  }
  try { const saved = JSON.parse(localStorage.getItem('aulafinder.history') || '[]'); if(Array.isArray(saved)) state.history=saved.slice(0,8).map(h=>h&&(h.kind==='rooms'||h.kind==='mapRooms')?{...h,id:renRoom(h.id)}:h).filter(h=>isValidFavorite(h)); } catch (_) {}
  // Giorno iniziale: quello di oggi (fuso Europe/Rome); dopo le 13:40 si passa al giorno successivo. Dal venerdì (o nel weekend) si torna al lunedì.
  const romeNow = new Date();
  const romeWeekday = new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:'Europe/Rome'}).format(romeNow);
  const romeMinutes = (() => {
    const p = new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'Europe/Rome'}).formatToParts(romeNow);
    return Number(p.find(x => x.type === 'hour').value) * 60 + Number(p.find(x => x.type === 'minute').value);
  })();
  const weekIndex = {Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6}[romeWeekday] ?? 0;
  let targetIndex = weekIndex + (romeMinutes > 13 * 60 + 40 ? 1 : 0);
  if (targetIndex > 4) targetIndex = 0;
  const schoolDays = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì'];
  const targetDay = DATA.days.find(d => norm(d) === norm(schoolDays[targetIndex]));
  daySelect.value = targetDay || 'Lunedì';
  // Ora di lezione in base all'orario attuale (fuso Europe/Rome); fuori da queste fasce si apre sulla 1ª ora.
  const currentHour = (() => {
    const parts = new Intl.DateTimeFormat('it-IT',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'Europe/Rome'}).formatToParts(new Date());
    const h = Number(parts.find(p => p.type === 'hour')?.value), m = Number(parts.find(p => p.type === 'minute')?.value);
    const t = h * 60 + m, at = (hh, mm) => hh * 60 + mm;
    const slots = [[2, at(7,55), at(8,50)], [3, at(8,51), at(9,45)], [4, at(9,46), at(10,50)], [5, at(10,51), at(11,45)], [6, at(11,46), at(12,50)]];
    const slot = slots.find(([, from, to]) => t >= from && t <= to);
    return slot ? String(slot[0]) : '1';
  })();
  hourSelect.value = currentHour;

  function addHistory(kind, id) {
    state.history=[{kind,id},...state.history.filter(e=>!(e.kind===kind&&e.id===id))].slice(0,8);
    try {localStorage.setItem('aulafinder.history',JSON.stringify(state.history));}catch(_){}
    renderHistory();
  }
  function renderHistory(){
    const historyBox=$('#historyList');
    const previousScroll=historyBox.scrollTop;
    historyBox.classList.toggle('is-scrollable',state.history.length>4);
    historyBox.innerHTML = state.history.length ? state.history.map((h,i)=>
      `<div class="history-entry"><button class="history-item" type="button" data-history="${i}"><span class="icon-inline">${iconFor(h.kind)}</span><span>${escapeHtml(label(h.kind,h.id))}</span></button><button class="history-remove" type="button" data-history-remove="${i}" aria-label="Rimuovi ${escapeHtml(label(h.kind,h.id))} dalla cronologia" title="Rimuovi dalla cronologia">×</button></div>`).join(''):
      '<p class="small-muted">Nessuna ricerca recente.</p>';
    historyBox.scrollTop=previousScroll;
    $('#clearHistoryButton').disabled = state.history.length === 0;
  }
  function removeHistory(index){
    if(!Number.isInteger(index)||index<0||index>=state.history.length)return;
    state.history.splice(index,1);
    try{localStorage.setItem('aulafinder.history',JSON.stringify(state.history));}catch(_){}
    renderHistory();
  }
  function clearHistory(){
    if (!state.history.length) return;
    if (!window.confirm('Vuoi cancellare tutta la cronologia delle ricerche?')) return;
    state.history = [];
    try { localStorage.removeItem('aulafinder.history'); } catch (_) {}
    renderHistory();
  }
  function closeMenu(){
    $('#sidebar').classList.remove('is-open');
    $('#sidebarBackdrop').hidden=true;
    $('#menuButton').setAttribute('aria-expanded','false');
    $('#menuButton').setAttribute('aria-label','Apri menu');
    document.body.classList.remove('mobile-menu-open');
  }
  function openMenu(){
    $('#sidebar').classList.add('is-open');
    $('#sidebarBackdrop').hidden=false;
    $('#menuButton').setAttribute('aria-expanded','true');
    $('#menuButton').setAttribute('aria-label','Chiudi menu');
    if(window.matchMedia('(max-width:680px)').matches) document.body.classList.add('mobile-menu-open');
  }
  // Il pulsante Orari controlla realmente l'espansione del sottomenu.
  // Conserviamo il suo stato anche quando si cambia pagina.
  function setScheduleSubnavExpanded(expanded){
    $('#scheduleSubnav').hidden = !expanded;
    $('.side-link[data-page="orari"]').setAttribute('aria-expanded',String(expanded));
  }
  function go(page){
    // La pagina Orari è un unico dashboard: niente sottopagine ridondanti.
    if(page==='schedule') page='orari';
    state.page=page;
    if(page!=='piantina' && page!=='results') state.planFromResult=false;
    const planBack=$('#planBackButton'); if(planBack) planBack.hidden=!(page==='piantina' && state.planFromResult);
    $$('.page').forEach(p=>p.hidden=p.id!==`${page}Page`);
    if(page==='orari') setScheduleSubnavExpanded(true);
    $$('.side-link').forEach(b => b.classList.toggle('is-active',b.dataset.page===page));
    closeMenu();
    $('#searchSuggestions').hidden=true;
    if(page==='results') renderResults();
    if(page==='orari') renderSchedule();
    $('#mainContent').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'auto'});
  }

  const teacherCompare=(a,b)=>teacherBase(a).localeCompare(teacherBase(b),'it',{numeric:true,sensitivity:'base'}) || teachingSubject(a).localeCompare(teachingSubject(b),'it',{sensitivity:'base'}) || a.localeCompare(b,'it',{numeric:true});
  const allEntries = ['rooms','classes','teachers'].flatMap(kind=>Object.keys(DATA[kind]).sort(kind==='rooms'?sortRooms:kind==='teachers'?teacherCompare:(a,b)=>a.localeCompare(b,'it',{numeric:true})).map(id=>({kind,id})));
  // Ricerca intelligente su codici, sigle, nominativi e materie, con punteggio stabile.
  const accent=s=>norm(s).replace(/[^A-Z0-9]+/g,'');
  function searchTerms(entry){
    let terms=[entry.id,label(entry.kind,entry.id)];
    if(entry.kind==='teachers'){
      terms.push(teacherBase(entry.id),prof(entry.id),teachingSubject(entry.id));
      terms.push(entry.id.replace(/\s*\(.*?\)$/,''));
      terms.push(...teacherBase(entry.id).split(/[\s-]+/));
    }
    if(entry.kind==='rooms'||entry.kind==='mapRooms'){
      terms.push('AULA '+entry.id,entry.id.replace(/\./g,''));
      if(/^S\./i.test(entry.id))terms.push('SOTTERRANEO '+entry.id);
      if(/^T\./i.test(entry.id))terms.push('PIANO TERRA '+entry.id);
      if(/^INFORMATICA /i.test(entry.id))terms.push(entry.id.replace(/^INFORMATICA /i,''));
    }
    if(entry.kind==='classes')terms.push('CLASSE '+entry.id,entry.id.replace(/S$/,'')+' SCIENZE APPLICATE');
    return [...new Set(terms.flatMap(t=>[norm(t),accent(t)]).filter(Boolean))];
  }
  const searchIndex=[...allEntries,...mapRoomIds.map(id=>({kind:'mapRooms',id}))].map(e=>({...e,terms:searchTerms(e)}));
  function editDistanceMax2(a,b){
    if(Math.abs(a.length-b.length)>2)return 3;
    const prev=Array.from({length:b.length+1},(_,i)=>i),cur=new Array(b.length+1);
    for(let i=1;i<=a.length;i++){
      cur[0]=i;let min=cur[0];
      for(let j=1;j<=b.length;j++){
        cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
        if(cur[j]<min)min=cur[j];
      }
      if(min>2)return 3;
      for(let j=0;j<=b.length;j++)prev[j]=cur[j];
    }
    return prev[b.length];
  }
  function searchScore(e,q,compact){
    let score=-1;
    const plain=norm(e.id),short=accent(e.id);
    for(const term of e.terms){
      const value=term.replace(/[^A-Z0-9]/g,'');
      if(term===q||value===compact)score=Math.max(score,110);
      else if(term.startsWith(q)||value.startsWith(compact))score=Math.max(score,88-Math.min(15,value.length-compact.length));
      else if(q.length>=3&&(term.includes(q)||value.includes(compact)))score=Math.max(score,66-Math.min(20,value.length-compact.length));
      else if(compact.length>=4&&Math.abs(value.length-compact.length)<=2){const d=editDistanceMax2(value,compact);if(d<=2)score=Math.max(score,44-9*d);}
    }
    if(short===compact||plain===q)score+=20;
    if(isFavorite(e.kind,e.id) && score>=0)score+=5;
    return score;
  }
  function matchQuery(raw){
    let q=norm(raw).replace(/^(AULA|CLASSE|DOCENTE|PROFESSORE|PROFESSORESSA|PROF\.)\s*/,'').trim();
    if(!q)return [];
    const compact=accent(q);if(!compact)return [];
    const matched=searchIndex.map(e=>({e,score:searchScore(e,q,compact)})).filter(r=>r.score>=0);
    const best=Math.max(-1,...matched.map(x=>x.score));
    const subjectQuery=searchIndex.some(r=>r.kind==='teachers'&&norm(teachingSubject(r.id))===q);
    const threshold=best>=110?(subjectQuery?72:105):best>=78?60:best>=50?44:0;
    return matched.filter(r=>r.score>=threshold)
      .sort((a,b)=>b.score-a.score||(['classes','rooms','mapRooms','teachers'].indexOf(a.e.kind)-['classes','rooms','mapRooms','teachers'].indexOf(b.e.kind))||a.e.id.localeCompare(b.e.id,'it',{numeric:true}))
      .slice(0,60).map(r=>({kind:r.e.kind,id:r.e.id}));
  }
  let suggestionIndex=-1;
  function previewSuggestions(){
    const matches=matchQuery(searchInput.value).slice(0,12),box=$('#searchSuggestions');
    suggestionIndex=-1;
    if(!searchInput.value.trim()||!matches.length){box.hidden=true;box.innerHTML='';return;}
    box.innerHTML=matches.map((e,i)=>`<button type="button" role="option" aria-selected="false" data-suggest="${i}"><span class="icon-inline">${iconFor(e.kind)}</span><span class="suggestion-title">${escapeHtml(label(e.kind,e.id))}</span>${isFavorite(e.kind,e.id)?'<span class="favorite-mark" aria-label="Preferito">★</span>':''}<span class="suggestion-meta">${escapeHtml({classes:'Classe',rooms:'Aula',mapRooms:'Ambiente',teachers:'Docente'}[e.kind])}</span></button>`).join('');
    box.setAttribute('role','listbox');box.hidden=false;box.style.maxHeight='min(280px,45vh)';
  }
  searchInput.addEventListener('keydown',e=>{
    const box=$('#searchSuggestions');
    if(e.key==='Escape'){box.hidden=true;return;}
    if(box.hidden)return;
    const opts=[...box.querySelectorAll('[data-suggest]')];
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();suggestionIndex=(suggestionIndex+(e.key==='ArrowDown'?1:-1)+opts.length)%opts.length;
      opts.forEach((x,i)=>x.setAttribute('aria-selected',String(i===suggestionIndex)));
      opts[suggestionIndex]?.scrollIntoView({block:'nearest'});
    }else if(e.key==='Enter'&&suggestionIndex>=0){
      e.preventDefault();const item=matchQuery(searchInput.value)[suggestionIndex];if(item){searchInput.value=item.id;openResult(item.kind,item.id);}
    }
  });
  function openResult(kind,id,remember=true){
    const item=kind==='mapRooms'?mapRoomIds.includes(id):DATA[kind]?.[id];
    if(!item) return;
    state.result={kind,id};
    if(remember) addHistory(kind,id);
    go('results');
  }
  function submitSearch(){
    const feedback=$('#searchFeedback');
    if(!searchInput.value.trim()){
      feedback.hidden=false;feedback.textContent='Inserisci un’aula, una classe o un professore prima di cercare.';
      searchInput.focus();return;
    }
    feedback.hidden=true;
    const matches=matchQuery(searchInput.value);
    $('#searchSuggestions').hidden=true;
    if(matches.length===1){openResult(matches[0].kind,matches[0].id);return;}
    state.result={matches,query:searchInput.value.trim()};
    go('results');
  }
  function roomName(room){return room==='Palestra'?'Palestra':room ? `Aula ${room}` : 'Aula non indicata';}
  function cardsFor(item,kind){
    const day=date();
    const selected=hour()-1;
    const v=lesson(item);
    let heading='',line='',extra='',badge='',headline='';
    if(kind==='rooms'){
      headline=item.id==='Palestra'?'Palestra':`Aula ${item.id}`;
      badge=v?'Occupata':'Libera';
      heading=v?(v.lessons?`${v.subject} · ${v.lessons.length} classi`: `${v.class} · ${v.subject}`):'Aula libera';
      line=v?(v.lessons?v.lessons.map(e=>`${e.class}: ${prof(e.teacher,e.subject)}`).join(' · '):prof(v.teacher,v.subject)):'Nessuna lezione prevista';
      extra=`${day} · ${hour()}ª ora`;
    } else if(kind==='classes'){
      headline=`Classe ${item.id}`;
      badge=v?'Lezione':'Nessuna lezione';
      heading=v?v.subject:'Nessuna lezione prevista';
      line=v?`${prof(v.teacher,v.subject)} · ${roomName(v.room)}`:'Nessuna aula assegnata';
      extra=`${day} · ${hour()}ª ora`;
    } else {
      headline=`${prof(item.id)}`;
      badge=v?'Lezione':'Ora libera';
      heading=v?`${v.subject} · ${v.class}`:'Nessuna lezione prevista';
      line=v?roomName(v.room):'Nessuna aula assegnata';
      extra=`${day} · ${hour()}ª ora`;
    }
    const typeClass=kind==='rooms'?'room':kind==='classes'?'class':'teacher';
    const icon=iconFor(kind);
    // Aula da mostrare in piantina: l'aula cercata, oppure quella in cui si trovano classe/prof nell'ora selezionata.
    const planRoom=kind==='rooms'?item.id:(v?.room||'');
    const planButton=`<button type="button" class="plan-link-button" ${planRoom?`data-plan-room="${escapeHtml(planRoom)}"`:'disabled title="Nessuna aula in questo orario"'}>${planIcon}Vedi piantina</button>`;
    return `<article class="result-card type-${typeClass}">
      <div class="result-banner"><span class="banner-icon" aria-hidden="true">${icon}</span><h2>${escapeHtml(headline)}</h2>${favButton(kind,item.id)}</div>
      <div class="result-body">
        <div class="result-header">${planButton}<span class="status-pill ${v?'':'free'}">${escapeHtml(badge)}</span></div>
        <section class="current-lesson"><p class="eyebrow">${escapeHtml(extra)}</p><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(line)}</p></section>
        <div class="daily-heading"><h3><span class="icon-inline">${clockIcon}</span>Orario</h3><span>${escapeHtml(day)}</span></div>
        <div class="hours-list">${item.days[day].map((slot,i)=>hourRow(kind,slot,i,selected)).join('')}</div>
        <button class="complete-schedule-button" type="button" data-full-schedule="${escapeHtml(kind)}" data-entity="${escapeHtml(item.id)}">Apri l’orario completo →</button>
      </div>
    </article>`;
  }
  function hourRow(kind,v,i,selected){
    let title='Nessuna lezione prevista',small='',location='';
    if(!v && kind==='rooms')title='Aula libera';
    if(!v && kind==='teachers')title='Ora libera';
    if(v){
      if(kind==='rooms'){
        title=v.lessons?`${v.subject} · ${v.lessons.map(e=>e.class).join(', ')}`:`${v.class} · ${v.subject}`;
        small=v.lessons?v.lessons.map(e=>`${e.class}: ${prof(e.teacher,e.subject)}`).join(' · '):prof(v.teacher,v.subject);
        location='';
      }
      if(kind==='classes'){title=v.subject;small=`${prof(v.teacher,v.subject)}`;location=roomName(v.room);}
      if(kind==='teachers'){title=`${v.subject} · ${v.class}`;location=roomName(v.room);}
    }
    return `<div class="hour-row ${i===selected?'is-selected':''}">
      <span class="hour-number">${i+1}</span>
      <div class="hour-data"><strong>${escapeHtml(title)}</strong>${small?`<small>${escapeHtml(small)}</small>`:''}</div>
      ${location?`<span class="hour-location">${escapeHtml(location)}</span>`:''}
    </div>`;
  }
  function renderMapOnly(id){
    return `<article class="result-card type-room"><div class="result-banner"><span class="banner-icon" aria-hidden="true">${entityIcons.rooms}</span><h2>${escapeHtml(label('mapRooms',id))}</h2>${favButton('mapRooms',id)}</div>
    <div class="result-body"><section class="current-lesson"><h3>Ambiente presente nella piantina</h3><p>Per questo ambiente non è disponibile una scheda oraria nei dati caricati.</p></section>
    <div class="map-only-actions"><button type="button" class="plan-link-button" data-plan-room="${escapeHtml(id)}">${planIcon} Vedi piantina</button>
    <button type="button" class="plan-link-button" data-nav-destination="${escapeHtml(id)}">Portami qui</button></div></div></article>`;
  }
  function renderResults(){
    const area=$('#searchResults'); const r=state.result;
    if(!r) {area.innerHTML='';return;}
    if(r.matches){
      $('#resultsTitle').textContent=`Risultati per “${r.query || 'ricerca'}”`;
      if(!r.matches.length){
        area.innerHTML=`<div class="no-results"><h2>Nessun risultato trovato</h2><p>Controlla il codice della classe, dell’aula o il docente. Sono ricercabili le sigle dei professori.</p></div>`;
      }else{
        area.innerHTML=`<div class="result-choices">${r.matches.map((e,i)=>`<button type="button" class="choice-button" data-choice="${i}"><span class="icon-inline">${iconFor(e.kind)}</span>${escapeHtml(label(e.kind,e.id))}${isFavorite(e.kind,e.id)?' ★':''} →</button>`).join('')}</div>`;
      }
    }else{
      const item=r.kind==='mapRooms'?mapRoomIds.includes(r.id):DATA[r.kind]?.[r.id];
      $('#resultsTitle').textContent=label(r.kind,r.id);
      area.innerHTML=item?(r.kind==='mapRooms'?renderMapOnly(r.id):cardsFor(item,r.kind)):'<p>Nessun dato disponibile.</p>';
    }
  }

  // Ricerca intelligente specifica degli Orari: tollera punti/spazi, prefissi e piccoli errori.
  const scheduleSearch=$('#scheduleQuickSearch');
  const scheduleQuickResults=$('#scheduleQuickResults');
  const teacherSort=$('#scheduleTeacherSort');
  const surnameOf=id=>{
    const full=teacherBase(id).trim();
    // In assenza del cognome verificato, usa la sigla originale senza inventare nulla.
    return /\s/.test(full)&&!/^[A-Z]{1,3}(?:\s[A-Z]{1,3})+(?:\s\(.+\))?$/i.test(full)
      ?full.split(/\s+/).at(-1):full;
  };
  function scheduleSort(kind,a,b){
    if(kind==='rooms')return sortRooms(a,b);
    if(kind==='classes')return a.localeCompare(b,'it',{numeric:true});
    // Gli orari dei professori restano ordinati per sigla, senza i filtri di disponibilità.
    return surnameOf(a).localeCompare(surnameOf(b),'it',{sensitivity:'base'})||a.localeCompare(b,'it');
  }
  function editDist(a,b){
    if(Math.abs(a.length-b.length)>2)return 3;
    let p=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++){const q=[i];for(let j=1;j<=b.length;j++)q[j]=Math.min(q[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=q;}
    return p[b.length];
  }
  function scheduleSearchScore(kind,id,q){
    const parts=kind==='teachers'?[id,teacherBase(id),teachingSubject(id),prof(id)]:[id,label(kind,id)];
    const c=x=>norm(x).replace(/[^A-Z0-9]/g,'');
    const needle=c(q);if(!needle)return 0;
    let score=-1;
    for(const t of parts){const text=c(t);if(!text)continue;
      if(text===needle)score=Math.max(score,120);
      else if(text.startsWith(needle))score=Math.max(score,94);
      else if(text.includes(needle))score=Math.max(score,75);
      else if(needle.length>=3 && t.split(/[\s/().]+/).some(w=>c(w).startsWith(needle)))score=Math.max(score,65);
      else if(needle.length>=4 && editDist(text.slice(0,needle.length+1),needle)<=1)score=Math.max(score,32);
    }
    return score;
  }
  function scheduleEntries(){
    const kind=state.schedule;
    const ids=Object.keys(DATA[kind]||{});
    if(kind==='teachers' && teacherSort.value==='subject')
      return ids.sort((a,b)=>teachingSubject(a).localeCompare(teachingSubject(b),'it',{sensitivity:'base'})||scheduleSort(kind,a,b));
    return ids.sort((a,b)=>scheduleSort(kind,a,b));
  }
  function renderScheduleQuickSearch(){
    if(!['classes','rooms','teachers'].includes(state.schedule))return;
    const kind=state.schedule,q=scheduleSearch.value.trim();
    const hits=scheduleEntries().map(id=>({id,rank:scheduleSearchScore(kind,id,q)})).filter(v=>v.rank>=0).sort((a,b)=>b.rank-a.rank||scheduleSort(kind,a.id,b.id));
    const shown=hits.slice(0,9);
    scheduleQuickResults.hidden=!q||!shown.length;
    scheduleQuickResults.innerHTML=q?shown.map(v=>`<button type="button" role="option" data-schedule-search-id="${escapeHtml(v.id)}"><span aria-hidden="true" class="icon-inline">${iconFor(kind)}</span>${escapeHtml(label(kind,v.id))}${kind==='teachers'?` <small>${escapeHtml(teachingSubject(v.id))}</small>`:''}</button>`).join(''):'';
  }
  function setScheduleEntity(id){
    if(!DATA[state.schedule]?.[id])return;
    state.selection=id;$('#scheduleEntity').value=id;
    scheduleQuickResults.hidden=true;scheduleSearch.value='';
    renderSchedule();
  }
  function openSchedule(kind, requestedId=''){
    // Anche dai risultati si arriva allo STESSO dashboard, senza ripetere il selettore del giorno.
    state.scheduleReturn = requestedId && state.page === 'results' ? 'results' : 'orari';
    const back=$('#scheduleBackButton');
    back.hidden=state.scheduleReturn !== 'results';
    back.dataset.page='results';
    state.schedule=kind;
    if(requestedId) state.selection=requestedId;
    $$('#scheduleSubnav button').forEach(b=>b.classList.toggle('is-active',b.dataset.schedule===kind));
    $$('.orari-category-tabs button').forEach(b=>{
      const selected=b.dataset.schedule===kind;
      b.classList.toggle('is-active',selected);
      b.setAttribute('aria-pressed',String(selected));
    });
    const select=$('#scheduleEntity');
    if(kind!=='freeRooms' && kind!=='freeTeachers'){
      const entries=scheduleEntries();
      select.innerHTML=entries.map(id=>`<option value="${escapeHtml(id)}">${escapeHtml(label(kind,id))}</option>`).join('');
      if(!entries.includes(state.selection)) state.selection=entries[0];
      select.value=state.selection;
      $('#scheduleControls').hidden=false;
      scheduleSearch.value='';scheduleQuickResults.hidden=true;
      $('#scheduleTeacherSortWrap').hidden=kind!=='teachers';
      $('#scheduleEntityLabel').textContent=kind==='classes'?'Seleziona classe':kind==='rooms'?'Seleziona aula':'Cerca un professore';
      scheduleSearch.placeholder=kind==='classes'?'Cerca una classe':kind==='rooms'?'Cerca un’aula':'Cerca un professore';
      scheduleSearch.setAttribute('aria-label',scheduleSearch.placeholder);
      $('#scheduleFilterCaption').hidden=true;
    }else{
      $('#scheduleControls').hidden=true;scheduleQuickResults.hidden=true;
      $('#scheduleTeacherSortWrap').hidden=true;
      state.selection='';
      $('#scheduleFilterCaption').hidden=true;
    }
    go('orari');
  }
  function weeklyCell(kind, slot, day, index){
    const active=day===date() && index===hour()-1;
    let subject='—', detail='', location='';
    if(slot){
      subject=slot.subject;
      if(kind==='rooms')detail=slot.lessons?slot.lessons.map(e=>`${e.class} · ${prof(e.teacher,e.subject)}`).join(' | '):`${slot.class} · ${prof(slot.teacher,slot.subject)}`;
      if(kind==='classes'){ detail=prof(slot.teacher,slot.subject);location=slot.room||''; }
      if(kind==='teachers'){ detail=`Classe ${slot.class}`;location=slot.room||''; }
    }
    return `<div class="weekly-cell ${active?'is-current':''} ${slot?'':'is-empty'}">
      <strong>${escapeHtml(subject)}</strong>
      ${detail?`<small>${escapeHtml(detail)}</small>`:''}
      ${location?`<small class="weekly-location">${escapeHtml(location)}</small>`:''}
    </div>`;
  }
  function renderFullWeek(item,kind){
    const weekdays=DATA.days;
    const columns=weekdays.map(day=>`<div class="weekly-day ${day===date()?'is-today':''}">${escapeHtml(day.slice(0,3))}</div>`).join('');
    const rows=Array.from({length:6},(_,i)=>
      `<div class="weekly-number">${i+1}<span>ª ora</span></div>`+
      weekdays.map(day=>weeklyCell(kind,item.days[day][i],day,i)).join('')
    ).join('');
    const tag=kind==='rooms'?'room':kind==='classes'?'class':'teacher';
    return `<article class="result-card type-${tag} full-schedule orari-weekly-card">
      <div class="orari-weekly-heading">
        <div><h2>${escapeHtml(label(kind,item.id))}</h2><p>Orario settimanale · Dal lunedì al venerdì</p></div>
        <span class="orari-weekly-mark" aria-hidden="true">${scheduleIcons[kind]}</span>
      </div>
      <div class="orari-weekly-body">
        <div class="weekly-scroll" role="region" aria-label="Orario settimanale di ${escapeHtml(label(kind,item.id))}" tabindex="0">
          <div class="weekly-grid"><div class="weekly-corner">Ora</div>${columns}${rows}</div>
        </div>
      </div>
    </article>`;
  }

  // Indirizzo dedotto esclusivamente dal codice della classe (es. 1AS/4BS).
  function classTrack(code){
    return /S$/i.test(code)?'Scienze Applicate':'Tradizionale';
  }
  // L'aula di riferimento è quella più frequente, non un dato amministrativo ufficiale.
  function mainClassRoom(item){
    const counts=new Map();
    DATA.days.forEach(day=>item.days[day].forEach(slot=>{
      const room=slot?.room;
      if(room && room!=='Palestra' && !/^Informatica\s/i.test(room)) counts.set(room,(counts.get(room)||0)+1);
    }));
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||sortRooms(a[0],b[0]))[0]?.[0] || null;
  }
  function panelRow(labelTxt,valueTxt){
    return `<div class="orari-panel-row"><dt>${escapeHtml(labelTxt)}</dt><dd>${escapeHtml(valueTxt)}</dd></div>`;
  }
  function renderScheduleInfo(){
    const kind=state.schedule, id=state.selection;
    let title='', rows='', note='';
    if(kind==='classes'){
      const item=DATA.classes[id]; if(!item) return '';
      title=`Classe ${id}`;
      rows=panelRow('Indirizzo',classTrack(id));
      const mainRoom=mainClassRoom(item);
      rows+=panelRow('Aula principale',mainRoom||'Non disponibile');
      note='Aula individuata in base alla frequenza nell’orario settimanale; non è una sede fissa certificata.';
    }else if(kind==='rooms'){
      const item=DATA.rooms[id]; if(!item) return '';
      title=label('rooms',id);
      const occ=Object.values(item.days).flat().filter(Boolean).length;
      const now=lesson(item);
      rows=panelRow('Lezioni programmate',String(occ));
      rows+=panelRow('Ora selezionata',now?'Occupata':'Libera');
    }else if(kind==='teachers'){
      const item=DATA.teachers[id]; if(!item) return '';
      title=teacherBase(id);
      rows=panelRow('Materia',teachingSubject(id));
      const classes=[...new Set(Object.values(item.days).flat().filter(Boolean).map(x=>x.class))].sort((a,b)=>a.localeCompare(b,'it',{numeric:true}));
      rows+=panelRow('Classi',classes.join(' · ')||'Non indicate');
    }else if(kind==='freeRooms'){
      title='Aule libere';
      rows=panelRow('Disponibili adesso',String(DATA.freeRooms[date()]?.[hour()-1]?.length||0));
      note='Disponibilità secondo l’orario previsto, non in tempo reale.';
    }else if(kind==='freeTeachers'){
      title='Professori liberi';
      rows=panelRow('Senza lezione prevista',String(freeTeachersAt(date(),hour()-1).length));
      note='Non indica se il docente è effettivamente presente a scuola.';
    }
    return `<div class="orari-info-inner"><span class="orari-info-icon" aria-hidden="true">${scheduleIcons[kind]}</span>
      <div class="orari-info-title-row"><h2>${escapeHtml(title)}</h2>${['classes','rooms','teachers'].includes(kind)?favButton(kind,id,'orari-favorite-toggle'):''}</div><dl class="orari-info-details">${rows}</dl>
      ${note?`<p class="orari-info-note">${escapeHtml(note)}</p>`:''}</div>`;
  }

  // Libero = nessuna lezione prevista nell'orario del docente per quel giorno e ora.
  // Non certifica la presenza fisica del professore nella scuola.
  const teacherIds=Object.keys(DATA.teachers).sort(teacherCompare);
  function freeTeachersAt(day,index){
    return teacherIds.filter(id=>!DATA.teachers[id].days?.[day]?.[index]);
  }
  function teacherChips(ids){
    return ids.map(id=>`<button class="teacher-chip" type="button" data-free-teacher="${escapeHtml(id)}"><span>${escapeHtml(prof(id))}</span></button>`).join('');
  }
  function filteredTeacherList(ids){
    const query=norm(state.freeTeacherFilter),compact=query.replace(/[^A-Z0-9]/g,'');
    return query?ids.filter(id=>[id,teacherBase(id),teachingSubject(id),prof(id)].some(s=>norm(s).includes(query)||norm(s).replace(/[^A-Z0-9]/g,'').includes(compact))):ids;
  }
  function renderFreeTeacherMatches(){
    const box=$('#freeTeacherMatches');if(!box)return;
    const available=freeTeachersAt(date(),hour()-1),
      filtered=filteredTeacherList(available).sort((a,b)=>surnameOf(a).localeCompare(surnameOf(b),'it',{sensitivity:'base'}));
    $('#freeTeacherCount').textContent=`${filtered.length} ${filtered.length===1?'professore':'professori'} ${state.freeTeacherFilter?'trovati':'senza lezione prevista'}`;
    box.innerHTML=teacherChips(filtered)||'<p>Nessun docente corrisponde alla ricerca in questa fascia.</p>';
  }
  function renderFreeTeachers(){
    const day=date(),index=hour()-1;
    const columns=DATA.days.map(d=>`<div class="weekly-day ${d===day?'is-today':''}">${escapeHtml(d.slice(0,3))}</div>`).join('');
    const rows=Array.from({length:6},(_,i)=>`<div class="weekly-number">${i+1}<span>ª ora</span></div>`+
      DATA.days.map(d=>{const avail=freeTeachersAt(d,i),active=d===day&&index===i;
        return `<button type="button" class="weekly-cell free-teacher-slot ${active?'is-current':''}" data-free-slot-day="${escapeHtml(d)}" data-free-slot-hour="${i+1}" aria-pressed="${active}" aria-label="${escapeHtml(d)}, ${i+1}ª ora: ${avail.length} professori senza lezione prevista"><strong>${avail.length} docenti</strong><small>${active?'Selezionata':'Visualizza elenco'}</small></button>`;
      }).join('')).join('');
    return `<article class="result-card type-free full-schedule orari-weekly-card">
      <div class="result-banner"><span class="banner-icon" aria-hidden="true">${coffeeIcon}</span><h2>Professori liberi</h2></div>
      <div class="result-body">
        <section class="current-lesson free-teacher-current"><p class="eyebrow">${escapeHtml(day)} · ${hour()}ª ora</p>
          <h3 id="freeTeacherCount"></h3>
          <label class="free-teacher-search-label" for="freeTeacherSearch">Cerca per docente, sigla o materia</label>
          <input id="freeTeacherSearch" class="free-teacher-search" type="search" autocomplete="off" placeholder="Es. BA AN, matematica, inglese" value="${escapeHtml(state.freeTeacherFilter)}" aria-controls="freeTeacherMatches"/>
          
          <div class="free-teacher-list" id="freeTeacherMatches" tabindex="0" role="region" aria-label="Elenco dei professori liberi"></div>
        </section>
        <h3 class="weekly-title">Disponibilità settimanale</h3>
        <div class="weekly-scroll" role="region" aria-label="Professori senza lezione per giorno e ora" tabindex="0"><div class="weekly-grid"><div class="weekly-corner">Ora</div>${columns}${rows}</div></div>
      </div>
    </article>`;
  }
  function renderSchedule(){
    const kind=state.schedule, box=$('#scheduleContents');
    const infoPanel=$('#scheduleInfoPanel');
    infoPanel.hidden=kind==='freeRooms'||kind==='freeTeachers';
    $('#orariPage .orari-content-grid').classList.toggle('without-info-panel',infoPanel.hidden);
    infoPanel.innerHTML=infoPanel.hidden?'':renderScheduleInfo();
    if(kind==='freeTeachers'){box.innerHTML=renderFreeTeachers();renderFreeTeacherMatches();return;}
    if(kind==='freeRooms'){
      const all=DATA.freeRooms[date()]||[];
      const days=DATA.days;
      const columns=days.map(d=>`<div class="weekly-day">${escapeHtml(d)}</div>`).join('');
      const rows=Array.from({length:6},(_,i)=>`<div class="weekly-number">${i+1}</div>`+
        days.map(day=>{
          const available=DATA.freeRooms[day]?.[i]||[];
          const active=day===date()&&i===hour()-1;
          return `<div class="weekly-cell free-weekly-cell ${active?'is-current':''}"><strong>${available.length} aule libere</strong>
            <span class="room-names">${[...available].sort(sortRooms).map(x=>escapeHtml(x)).join(' · ')||'Nessuna aula'}</span></div>`;
        }).join('')).join('');
      box.innerHTML=`<article class="result-card type-free full-schedule">
        <div class="result-banner"><span class="banner-icon" aria-hidden="true">${scheduleIcons.freeRooms}</span><h2>Aule libere</h2></div>
        <div class="result-body">
          <section class="current-lesson"><p class="eyebrow">${hour()}ª ora · ${escapeHtml(date())}</p><h3>${all[hour()-1]?.length||0} aule libere</h3>
          <div class="free-room-list">${[...(all[hour()-1]||[])].sort(sortRooms).map(name=>`<button class="room-chip" type="button" data-room="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('')||'<p>Nessuna aula disponibile.</p>'}</div></section>
          <h3 class="weekly-title">Disponibilità settimanale</h3>
          <div class="weekly-scroll" role="region" aria-label="Disponibilità aule della settimana" tabindex="0"><div class="weekly-grid"><div class="weekly-corner">Ora</div>${columns}${rows}</div></div>
        </div></article>`;
      return;
    }
    const item=DATA[kind]?.[state.selection];
    box.innerHTML=item?renderFullWeek(item,kind):'<p>Seleziona una voce.</p>';
  }
  function updateTimeDependent(){
    if(state.page==='results') renderResults();
    if(state.page==='orari') renderSchedule();
  }

  $('#searchForm').addEventListener('submit', e=>{e.preventDefault();submitSearch();});
  searchInput.addEventListener('input',()=>{$('#searchFeedback').hidden=true;previewSuggestions();});
  document.addEventListener('input',e=>{if(e.target.id==='freeTeacherSearch'){state.freeTeacherFilter=e.target.value;renderFreeTeacherMatches();}});
  daySelect.addEventListener('change',updateTimeDependent);
  hourSelect.addEventListener('change',updateTimeDependent);
  $('#scheduleEntity').addEventListener('change',e=>{state.selection=e.target.value;renderSchedule();});
  scheduleSearch.addEventListener('input',renderScheduleQuickSearch);
  scheduleSearch.addEventListener('keydown',e=>{
    if(e.key==='Escape'){scheduleQuickResults.hidden=true;return;}
    if(e.key==='Enter'){
      const first=scheduleQuickResults.querySelector('[data-schedule-search-id]');
      if(first){e.preventDefault();setScheduleEntity(first.dataset.scheduleSearchId);}
    }
  });
  teacherSort.addEventListener('change',()=>{
    if(state.page!=='orari'||state.schedule!=='teachers')return;
    const select=$('#scheduleEntity');
    const entries=scheduleEntries();
    select.innerHTML=entries.map(id=>`<option value="${escapeHtml(id)}">${escapeHtml(label('teachers',id))}</option>`).join('');
    select.value=state.selection;
    if(scheduleSearch.value.trim())renderScheduleQuickSearch();
  });

  $('#menuButton').addEventListener('click',()=>$('#sidebar').classList.contains('is-open')?closeMenu():openMenu());
  $('#sidebarBackdrop').addEventListener('click',()=>{closeMenu();$('#menuButton').focus();});
  window.addEventListener('resize',()=>{if(window.innerWidth>680 && document.body.classList.contains('mobile-menu-open'))closeMenu();});
  window.addEventListener('resize',()=>{const box=$('#searchSuggestions');if(!box.hidden)fitSuggestions(box);});
  // Il logo si ingrandisce senza X: un clic fuori dall'immagine lo richiude.
  const logoDialog = $('#logoDialog');
  $('#logoButton').addEventListener('click',()=>logoDialog.showModal());
  logoDialog.addEventListener('click', e=>{
    if(e.target===logoDialog) logoDialog.close();
  });
  // Freccia su: visibile soltanto quando l'utente ha sceso abbastanza la pagina.
  const backToTop = $('#backToTop');
  const updateBackToTop = () => {
    const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
    const enoughContent = scrollableDistance > 250;
    // Anche su desktop con pagine più corte, il pulsante appare verso il fondo.
    const threshold = Math.min(Math.max(320, window.innerHeight * .65), scrollableDistance * .58);
    const pastTop = window.scrollY > threshold;
    backToTop.hidden = !(enoughContent && pastTop);
  };
  window.addEventListener('scroll', updateBackToTop, {passive:true});
  window.addEventListener('resize', updateBackToTop, {passive:true});
  backToTop.addEventListener('click',()=>{
    window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  });
  updateBackToTop();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.addEventListener('click',e=>{
    if (!e.target.closest('#searchForm, #searchSuggestions')) $('#searchSuggestions').hidden=true;
    if(!e.target.closest('#scheduleQuickSearch,#scheduleQuickResults'))scheduleQuickResults.hidden=true;
    const btn=e.target.closest('button'); if(!btn)return;
    if(btn.id === 'clearHistoryButton') { clearHistory(); return; }
    if(btn.id === 'clearFavoritesButton'){clearFavorites();return;}
    if(btn.hasAttribute('data-history-remove')){removeHistory(Number(btn.dataset.historyRemove));return;}
    if(btn.hasAttribute('data-schedule-search-id')){setScheduleEntity(btn.dataset.scheduleSearchId);return;}
    if(btn.hasAttribute('data-free-slot-day')){
      daySelect.value=btn.dataset.freeSlotDay;hourSelect.value=btn.dataset.freeSlotHour;
      renderSchedule();return;
    }
    if(btn.hasAttribute('data-favorite-kind')){setFavorite(btn.dataset.favoriteKind,btn.dataset.favoriteId);return;}
    if(btn.hasAttribute('data-fav-open')){const v=state.favorites[Number(btn.dataset.favOpen)];if(v)openResult(v.kind,v.id);return;}
    if(btn.hasAttribute('data-fav-remove')){const v=state.favorites[Number(btn.dataset.favRemove)];if(v)setFavorite(v.kind,v.id,true);return;}
    if(btn.hasAttribute('data-nav-destination')){
      const room=btn.dataset.navDestination;
      if(window.AulaFinderNavigator?.setDestination(room))go('navigator');return;
    }
    if(btn.hasAttribute('data-plan-room')){
      state.planFromResult=true; go('piantina');
      requestAnimationFrame(()=>window.AFPiantina?.show(btn.dataset.planRoom));
      return;
    }
    if(btn.hasAttribute('data-full-schedule')){
      openSchedule(btn.dataset.fullSchedule,btn.dataset.entity);
      return;
    }
    // Primo clic: apre Orari. Secondo clic: richiude soltanto il sottomenu.
    // Su smartphone lasciamo il cassetto aperto per scegliere subito una voce.
    if(btn.matches('.side-link[data-page="orari"]')){
      if(!$('#scheduleSubnav').hidden){
        setScheduleSubnavExpanded(false);
      }else{
        openSchedule(state.schedule || 'classes');
        if(window.matchMedia('(max-width:680px)').matches) openMenu();
      }
      return;
    }
    if(btn.hasAttribute('data-page')){
      if(btn.dataset.page==='orari'){openSchedule(state.schedule||'classes');return;}
      go(btn.dataset.page);return;
    }
    if(btn.hasAttribute('data-schedule')){
      openSchedule(btn.dataset.schedule);return;
    }
    if(btn.hasAttribute('data-history')){
      const item=state.history[Number(btn.dataset.history)];if(item)openResult(item.kind,item.id);return;
    }
    if(btn.hasAttribute('data-suggest')){
      const item=matchQuery(searchInput.value)[Number(btn.dataset.suggest)];
      if(item){searchInput.value=item.id;openResult(item.kind,item.id);}return;
    }
    if(btn.hasAttribute('data-choice')){
      const item=state.result?.matches?.[Number(btn.dataset.choice)];
      if(item)openResult(item.kind,item.id);return;
    }
    if(btn.hasAttribute('data-free-teacher')){ openResult('teachers',btn.dataset.freeTeacher);return; }
    if(btn.hasAttribute('data-room')){
      const id=btn.dataset.room;
      if(DATA.rooms[id])openResult('rooms',id);
      else {
        state.result={matches:[],query:id};go('results');
        $('#searchResults').innerHTML=`<div class="no-results"><h2>${escapeHtml(id)}</h2><p>L'aula compare nell'elenco delle aule libere, ma non ha una scheda nell'orario aule fornito.</p></div>`;
      }
    }
  });
  window.AulaFinderRoomSchedule=(room)=>{
    const id=Object.keys(DATA.rooms).find(key=>canon(key)===canon(room));
    if(!id)return false;
    openSchedule('rooms',id);
    return true;
  };
  const themeButton=$('#themeToggle');
  const systemTheme=window.matchMedia('(prefers-color-scheme: dark)');
  const refreshThemeLabel=()=>{
    const dark=document.documentElement.dataset.theme==='dark';
    themeButton.setAttribute('aria-label',`Passa alla modalità ${dark?'chiara':'scura'}`);
    themeButton.title=`Attiva modalità ${dark?'chiara':'scura'}`;
    themeButton.innerHTML=dark?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.1 15.3A8.4 8.4 0 0 1 8.7 3.9 8.5 8.5 0 1 0 20.1 15.3Z"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  };
  themeButton.addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem('aulafinder.theme',next);}catch(_){}
    refreshThemeLabel();
    themeButton.classList.remove('theme-switching');
    // Re-trigger the short icon transition when toggled repeatedly.
    void themeButton.offsetWidth;
    themeButton.classList.add('theme-switching');
  });
  themeButton.addEventListener('animationend',()=>themeButton.classList.remove('theme-switching'));
  systemTheme.addEventListener('change',e=>{try{if(localStorage.getItem('aulafinder.theme'))return;}catch(_){}document.documentElement.dataset.theme=e.matches?'dark':'light';refreshThemeLabel()});
  refreshThemeLabel();
  renderFavorites();
  renderHistory();
  go('home');
})();
