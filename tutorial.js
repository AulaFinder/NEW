/* AulaFinder V49: tutorial autonomo; dati e piantine provengono dal sito reale. */
(()=>{
 'use strict';
 const page=document.getElementById('tutorialPage');
 const DATA=window.AULAFINDER_DATA;
 if(!page||!DATA)return;
 const $=id=>document.getElementById(id);
 const all=(selector,root=page)=>Array.from(root.querySelectorAll(selector));
 const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 const scrollIfNeeded=element=>{
  if(!element||page.hidden)return;
  const r=element.getBoundingClientRect();
  if(r.top<90||r.top>innerHeight-110)element.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});
 };
 const tabs=all('[data-tutorial-select]'), panels=all('[data-tutorial-panel]');
 const progress=$('tutorialProgressBar'),fill=$('tutorialProgressFill'),counter=$('tutorialProgressCount');
 const prev=$('tutorialPrev'),next=$('tutorialNext'),hint=$('tutorialNavHint');
 const names=['Prova la ricerca','Consulta gli orari','Scopri le disponibilità','Prova il navigatore','Chiedi a Finder','Esplora le mappe','Scopri il progetto'];
 let current=0;
 function show(i,focus=false){
  current=Math.max(0,Math.min(panels.length-1,i));
  tabs.forEach((tab,j)=>{const active=j===current;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
  panels.forEach((panel,j)=>panel.hidden=j!==current);
  counter.textContent=`${current+1} / ${panels.length}`;
  progress.setAttribute('aria-valuenow',String(current+1));
  fill.style.width=`${(current+1)*100/panels.length}%`;
  prev.disabled=current===0;next.textContent=current===panels.length-1?'Ricomincia ↻':'Avanti →';
  hint.textContent=names[current];
  if(focus)tabs[current].focus({preventScroll:true});
  scrollIfNeeded(panels[current]);
 }
 tabs.forEach(tab=>{
  tab.addEventListener('click',()=>show(Number(tab.dataset.tutorialSelect)));
  tab.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();const i=Number(tab.dataset.tutorialSelect);
   const index=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
   show(index,true);
  });
 });
 prev.addEventListener('click',()=>show(current-1));
 next.addEventListener('click',()=>show(current===tabs.length-1?0:current+1));
 const makeOption=(id,text)=>{const o=document.createElement('option');o.value=id;o.textContent=text;return o;};
 const elText=(id,text)=>{const el=$(id);if(el)el.textContent=text;};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const days=DATA.days;
 const sortCodes=(a,b)=>a.localeCompare(b,'it',{numeric:true});

 // Ricerca: usa gli stessi dati reali di classi, aule e docenti.
 const searchInput=$('af49TourSearch');
 function doSearch(){
  const q=normalize(searchInput.value);
  const host=$('af49TourSearchResult');host.replaceChildren();
  if(!q){host.textContent='Digita un nome, una sigla o un codice aula.';return;}
  const categories=[['classes','Classe'],['rooms','Aula'],['teachers','Professore']];
  const items=categories.flatMap(([kind,label])=>Object.entries(DATA[kind]).filter(([id,item])=>[id,item.name||''].some(v=>normalize(v).includes(q))).slice(0,6).map(([id,item])=>({kind,label,id})));
  if(!items.length){host.textContent='Nessuna corrispondenza negli orari caricati.';return;}
  const wrap=document.createElement('div');wrap.className='af49-mini-results';
  items.slice(0,8).forEach(v=>{
   const item=document.createElement('div');item.className='af49-mini-result';
   const strong=document.createElement('strong');strong.textContent=v.label+' '+v.id;
   const span=document.createElement('span');span.textContent='Presente negli orari';
   item.append(strong,span);wrap.appendChild(item);
  });host.appendChild(wrap);
 }
 $('af49TourSearchGo').addEventListener('click',doSearch);
 searchInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();doSearch();}});

 // Orari: anteprima con lezioni effettive, non righe riempite a caso.
 const cat=$('af49TourCategory'),entity=$('af49TourEntity');
 function categories(){
  const keys=Object.keys(DATA[cat.value]||{}).sort(sortCodes);
  entity.replaceChildren(...keys.map(k=>makeOption(k,k)));
  renderSchedule();
 }
 function renderSchedule(){
  const item=DATA[cat.value]?.[entity.value],host=$('af49TourScheduleResult');
  if(!item){host.textContent='Nessun orario disponibile.';return;}
  const frag=document.createDocumentFragment();
  const h=document.createElement('strong');h.textContent=(cat.value==='classes'?'Classe ':cat.value==='rooms'?'Aula ':'Docente ')+entity.value;
  frag.append(h);
  const rows=document.createElement('div');rows.className='af49-mini-schedule';
  for(const d of days){
   const slots=(item.days?.[d]||[]).slice(0,6);
   const row=document.createElement('div');const day=document.createElement('b');day.textContent=d;
   const content=document.createElement('span');
   const classes=slots.map((s,i)=>s?`${i+1}ª ${s.subject||s.class||s.room||'Lezione'}`:null).filter(Boolean);
   content.textContent=classes.length?classes.slice(0,3).join(' · ')+(classes.length>3?'…':''):'Nessuna lezione indicata';
   row.append(day,content);rows.append(row);
  }frag.append(rows);host.replaceChildren(frag);
 }
 cat.addEventListener('change',categories);entity.addEventListener('change',renderSchedule);
 categories();

 // Disponibilità: giorno/ora scelti qui, senza interagire con i controlli del sito esterni.
 const dSel=$('af49TourDay'),hSel=$('af49TourHour');
 dSel.replaceChildren(...days.map(day=>makeOption(day,day)));
 hSel.replaceChildren(...[1,2,3,4,5,6].map(n=>makeOption(String(n),n+'ª ora')));
 dSel.value=$('daySelect')?.value||days[0]; hSel.value=$('hourSelect')?.value||'1';
 let availability='rooms';
 function renderAvailability(){
  const d=dSel.value,i=Number(hSel.value)-1;
  const ids=availability==='rooms'?(DATA.freeRooms?.[d]?.[i]||[]):Object.entries(DATA.teachers).filter(([,item])=>!(item.days?.[d]||[])[i]).map(([id])=>id);
  const host=$('af49TourAvailabilityResult');host.replaceChildren();
  const t=document.createElement('strong');t.textContent=(availability==='rooms'?'Aule senza lezione':'Docenti senza lezione')+': '+ids.length;
  const p=document.createElement('p');p.textContent=ids.length?ids.slice(0,36).join(' · ')+(ids.length>36?' · …':''):'Nessuna disponibilità indicata.';
  const note=document.createElement('small');note.textContent=availability==='teachers'?'L’assenza di lezione non conferma che il docente sia a scuola.':'Dati estratti dagli orari, non disponibilità in tempo reale.';
  host.append(t,p,note);
 }
 all('[data-af49-availability]').forEach(button=>button.addEventListener('click',()=>{
  availability=button.dataset.af49Availability;
  all('[data-af49-availability]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  renderAvailability();
 }));
 dSel.addEventListener('change',renderAvailability);hSel.addEventListener('change',renderAvailability);renderAvailability();

 const floorLabels={sotto:'Piano sotterraneo',terra:'Piano terra',primo:'Piano 1',secondo:'Piano 2',terzo:'Piano 3'};
 function actualPlan(floor){
  const source=document.querySelector('#piantinaPage #'+floor+' svg.plan');
  if(!source)return null;
  const copy=source.cloneNode(true);copy.removeAttribute('id');
  copy.classList.add('af49-copied-plan');
  copy.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
  copy.querySelectorAll('g.room').forEach(room=>{
   room.removeAttribute('tabindex');room.removeAttribute('role');
  });
  return copy;
 }
 const floorSel=$('af49TourFloor'),mapHost=$('af49TourMapSlot');
 function renderPlan(){
  const map=actualPlan(floorSel.value);mapHost.replaceChildren();
  if(!map){mapHost.textContent='Piantina non disponibile.';return;}
  mapHost.append(map);elText('af49TourRoomName','Tocca una stanza sulla piantina originale.');
 }
 floorSel.addEventListener('change',renderPlan);
 mapHost.addEventListener('click',e=>{
  const g=e.target.closest('g.room');if(!g)return;
  const t=(g.dataset.t||'').split('·')[0].trim();
  mapHost.querySelectorAll('.af49-tour-selected').forEach(el=>el.classList.remove('af49-tour-selected'));
  g.classList.add('af49-tour-selected');elText('af49TourRoomName',t||'Ambiente selezionato');
 });
 renderPlan();

 // Navigatore: stesso calcolo di percorso dell'app, su una COPIA della vera planimetria.
 const from=$('af49TourNavFrom'),to=$('af49TourNavTo'),mode=$('af49TourMode');
 const roomList=window.AulaFinderNavigator?.getRooms?.()||Object.keys(DATA.rooms);
 from.replaceChildren(...roomList.map(id=>makeOption(id,id)));
 to.replaceChildren(...roomList.map(id=>makeOption(id,id)));
 from.value=roomList.includes('S.01')?'S.01':roomList[0];
 to.value=roomList.includes('T.08')?'T.08':roomList.find(id=>id!==from.value);
 const routeHost=$('af49TourRouteResult');
 function drawRoute(){
  routeHost.replaceChildren();
  const result=window.AulaFinderNavigator?.previewRoute?.(from.value,to.value,mode.value);
  if(!result){routeHost.textContent='Nessun percorso verificabile con questi ambienti o questa modalità.';return;}
  let active=0;
  function renderStage(){
   const stage=result.stages[active];routeHost.replaceChildren();
   const title=document.createElement('strong');title.textContent=`${active+1}/${result.stages.length} · ${floorLabels[stage.floor]}`;
   routeHost.append(title);
   const svg=actualPlan(stage.floor);
   if(svg){
    const points=stage.points||[];
    if(points.length>1){
     const NS='http://www.w3.org/2000/svg';
     const path=document.createElementNS(NS,'path');
     path.setAttribute('d',points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' '));
     path.setAttribute('class','af49-route-line');
     const first=svg.querySelector('g.plan-rotated g.room');
     if(first)first.parentNode.insertBefore(path,first);else (svg.querySelector('g.plan-rotated')||svg).append(path);
    }
    const container=document.createElement('div');container.className='af49-tour-plan';container.appendChild(svg);routeHost.append(container);
   }
   if(result.stages.length>1){
    const controls=document.createElement('div');controls.className='af49-route-controls';
    const bPrev=document.createElement('button');bPrev.type='button';bPrev.textContent='← Precedente';bPrev.disabled=active===0;
    const bNext=document.createElement('button');bNext.type='button';bNext.textContent='Successivo →';bNext.disabled=active===result.stages.length-1;
    bPrev.addEventListener('click',()=>{active--;renderStage();});bNext.addEventListener('click',()=>{active++;renderStage();});
    controls.append(bPrev,bNext);routeHost.append(controls);
   }
  }
  renderStage();
 }
 $('af49TourRouteGo').addEventListener('click',drawRoute);

 // Finder: usa lo stesso motore di risposte locali del vero pannello.
 const classSel=$('af49TourFinderClass');
 classSel.replaceChildren(makeOption('','Scegli la classe'),...Object.keys(DATA.classes).sort(sortCodes).map(id=>makeOption(id,'Classe '+id)));
 const finderInput=$('af49TourFinderInput');
 function askFinder(){
  const q=finderInput.value.trim();if(!q)return;
  const reply=window.AulaFinderVoice?.respond?.(q,classSel.value,{noNavigation:true})||'Apri Finder e scegli la classe per consultare gli orari.';
  elText('af49TourFinderAnswer',reply);
 }
 $('af49TourFinderAsk').addEventListener('click',askFinder);
 finderInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();askFinder();}});

 // Footer: contenuti CLONATI dal footer originale, senza menu o link che spostano la pagina.
 const footerHost=$('af49TourFooter');
 for(const selector of ['#siteFooter .footer-intro','#siteFooter .footer-purpose','#siteFooter .footer-info']){
  const src=document.querySelector(selector);if(!src)continue;
  const node=src.cloneNode(true);node.removeAttribute('id');
  node.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  footerHost.append(node);
 }
 show(0);
})();
