/* AulaFinder V51 · interactions: local admin demo, version explorer, ambient water,
   brand animation. This static build does not provide server-side authentication. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const reduced=()=>window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 const escapeHTML=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 // Clicking AulaFinder plays the existing orbit animation without navigating.
 document.querySelectorAll('.af-animated-brand, #sidebarClose').forEach(brand=>{
   brand.addEventListener('click',()=>{
     brand.classList.remove('is-brand-activated');void brand.offsetWidth;
     brand.classList.add('is-brand-activated');
   });
   brand.addEventListener('animationend',e=>{if(e.animationName==='afBrandPulse')brand.classList.remove('is-brand-activated');});
 });
 // The enlarged-logo reveal closes with a short, responsive motion.
 $('logoDialog')?.addEventListener('close',()=>{$('logoButton')?.blur();});

 // Ripple effect: one lightweight DOM ripple per deliberate touch and limited dragging.
 if(!reduced()){
   const surface=document.createElement('div');surface.className='af-water-layer';surface.setAttribute('aria-hidden','true');document.body.append(surface);
   let lastTime=0,lastX=NaN,lastY=NaN;
   const ripple=(x,y,small=false)=>{
     if(surface.childElementCount>8)surface.firstElementChild?.remove();
     const el=document.createElement('span');el.className='af-water-ring'+(small?' is-trail':'');
     el.style.left=x+'px';el.style.top=y+'px';surface.append(el);
     el.addEventListener('animationend',()=>el.remove(),{once:true});
   };
   document.addEventListener('pointerdown',e=>{
     if(!e.isPrimary||e.pointerType==='mouse'&&e.button!==0)return;
     ripple(e.clientX,e.clientY);lastX=e.clientX;lastY=e.clientY;lastTime=performance.now();
   },{passive:true});
   document.addEventListener('pointermove',e=>{
     if(e.pointerType!=='touch'||!e.isPrimary||!(e.buttons&1))return;
     const now=performance.now();
     if(now-lastTime<95||Math.hypot(e.clientX-lastX,e.clientY-lastY)<22)return;
     lastTime=now;lastX=e.clientX;lastY=e.clientY;ripple(lastX,lastY,true);
   },{passive:true});
 }

 // Local-only admin lock and animated fully accessible keyboard.
 const form=$('adminForm'),pass=$('adminPassword'),keyboard=$('adminKeyboard');
 if(form&&pass&&keyboard){
   const chars='QWERTYUIOPASDFGHJKLZXCVBNM';
   chars.split('').forEach(c=>{
     const key=document.createElement('button');key.type='button';key.textContent=c;key.dataset.key=c.toLowerCase();key.setAttribute('aria-label','Inserisci lettera '+c);
     keyboard.append(key);
   });
   for(const [text,action,label] of [['⌫','back','Cancella l’ultimo carattere'],['Pulisci','clear','Cancella tutta la password']]){
     const key=document.createElement('button');key.type='button';key.textContent=text;key.dataset.action=action;key.className='af-admin-key-special';key.setAttribute('aria-label',label);keyboard.append(key);
   }
   keyboard.addEventListener('click',e=>{
     const key=e.target.closest('button');if(!key)return;
     if(key.dataset.action==='back')pass.value=pass.value.slice(0,-1);
     else if(key.dataset.action==='clear')pass.value='';
     else pass.value=(pass.value+key.dataset.key).slice(0,30);
     key.classList.remove('is-pressed');void key.offsetWidth;key.classList.add('is-pressed');
     $('adminError').textContent='Codice pronto per la verifica.';
   });
   $('adminReveal')?.addEventListener('click',e=>{
     const visible=pass.type==='text';pass.type=visible?'password':'text';e.currentTarget.setAttribute('aria-pressed',String(!visible));
   });
   const lock=$('adminLock'),unlocked=$('adminUnlocked'),error=$('adminError');
   let attempts=0;
   form.addEventListener('submit',e=>{
     e.preventDefault();
     // Non usare questa verifica per proteggere dati veri: è interamente nel browser.
     if(pass.value.trim().toLowerCase()==='kiwi'){
       lock.hidden=true;unlocked.hidden=false;pass.value='';attempts=0;
       const data=window.AULAFINDER_DATA||{};
       const stats=[['Classi',Object.keys(data.classes||{}).length],['Aule negli orari',Object.keys(data.rooms||{}).length],['Docenti',Object.keys(data.teachers||{}).length],['Giorni scolastici',(data.days||[]).length]];
       $('adminStats').innerHTML=stats.map(([label,value])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('');
       unlocked.querySelector('h2')?.setAttribute('tabindex','-1');unlocked.querySelector('h2')?.focus({preventScroll:true});
     }else{
       attempts++;error.textContent='Codice non riconosciuto. Verifica le lettere e riprova.';
       lock.classList.remove('af-admin-error-shake');void lock.offsetWidth;lock.classList.add('af-admin-error-shake');
       pass.value='';
     }
   });
   $('adminLockAgain')?.addEventListener('click',()=>{lock.hidden=false;unlocked.hidden=true;error.textContent='Accesso protetto da codice locale.';});
   $('adminVisitVersion')?.addEventListener('click',()=>document.querySelector('.side-link[data-page="versioni"]')?.click());
 }

 // Version archive. We never fabricate historical images or change logs.
 const list=$('versionsList'),detail=$('versionsDetail'),search=$('versionsSearch');
 if(list&&detail&&search){
   const facts={
     48:{title:'Finder e guida visiva',desc:'Versione archiviata in questo pacchetto. Sono presenti Finder con video originale, navigazione e tutorial con schermate reali.',images:['anteprima_home_hover_PC.png','anteprima_mappa_390_light.png','anteprima_navigatore_1366_chiaro.png']},
     51:{title:'Interazioni e accessibilità',desc:'Finder ridimensionabile e silenzioso, microfono con waveform, Admin dimostrativo, tutorial con mini-app, navigatore dal centro delle aule e rifiniture di accessibilità.',images:['anteprima_V51_home.png','anteprima_V51_mobile.png','anteprima_V51_admin_login.png']}
   };
   let current=51;let query='';
   const mark=(value,q)=>{
     const text=String(value),i=text.toLowerCase().indexOf(q.toLowerCase());
     if(!q||i<0)return escapeHTML(text);
     return escapeHTML(text.slice(0,i))+'<mark>'+escapeHTML(text.slice(i,i+q.length))+'</mark>'+escapeHTML(text.slice(i+q.length));
   };
   const lightbox=document.createElement('dialog');lightbox.className='af-version-lightbox';lightbox.setAttribute('aria-label','Anteprima a schermo intero');
   lightbox.innerHTML='<button type="button" aria-label="Chiudi anteprima" class="af-version-lightbox-close">×</button><img alt="Anteprima della versione ingrandita"/>';
   document.body.append(lightbox);
   lightbox.querySelector('button').addEventListener('click',()=>lightbox.close());
   lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
   detail.addEventListener('click',e=>{
     const btn=e.target.closest('[data-version-fullscreen]');if(!btn)return;
     lightbox.querySelector('img').src=btn.dataset.versionFullscreen;
     lightbox.showModal();
   });
   function renderList(){
     list.innerHTML='';let hits=0;
     for(let n=51;n>=1;n--){
       const fact=facts[n],title=fact?.title||'Archivio non incluso';
       if(query&&!(`v${n} ${n} ${title} ${fact?.desc||''}`.toLowerCase().includes(query.toLowerCase())))continue;
       hits++;const button=document.createElement('button');button.type='button';button.dataset.version=String(n);
       button.className='af-version-item'+(n===current?' is-current':'')+(fact?' is-available':'');
       button.setAttribute('aria-current',n===current?'true':'false');
       button.innerHTML=`<span class="af-version-badge">${mark('V'+n,query)}</span><span class="af-version-name">${mark(title,query)}</span><span class="af-version-dot" aria-hidden="true"></span>`;
       list.append(button);
     }
     if(!hits)list.innerHTML='<p class="af-version-empty">Nessuna versione corrispondente. Prova un altro termine.</p>';
   }
   function renderDetail(){
     const fact=facts[current];
     if(!fact){
       detail.innerHTML=`<span class="af-admin-eyebrow">ARCHIVIO STORICO</span><h2>Versione V${current}</h2><p>Il file originale e le immagini di questa versione non sono inclusi nella base recuperabile. Per evitare anteprime e modifiche inventate, qui non è disponibile una scheda dettagliata.</p><div class="af-archive-empty">Nessuna anteprima verificabile in questo pacchetto.</div>`;
       return;
     }
     const imgs=fact.images.map((src,i)=>`<figure class="af-version-image"><img src="${src}" alt="Schermata ${i+1} di AulaFinder V${current}" loading="lazy"/><button type="button" data-version-fullscreen="${src}" title="Apri anteprima ingrandita" aria-label="Ingrandisci anteprima ${i+1}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 4H4v4M4 4l6 6M16 20h4v-4m0 4-6-6"/></svg></button></figure>`).join('');
     detail.innerHTML=`<span class="af-admin-eyebrow">VERSIONE DISPONIBILE</span><h2>V${current} · ${escapeHTML(fact.title)}</h2><p>${escapeHTML(fact.desc)}</p><div class="af-version-gallery">${imgs}</div>`;
   }
   list.addEventListener('click',e=>{const b=e.target.closest('[data-version]');if(!b)return;current=Number(b.dataset.version);renderList();renderDetail();});
   search.addEventListener('input',()=>{query=search.value.trim();renderList();});
   renderList();renderDetail();
 }
})();
