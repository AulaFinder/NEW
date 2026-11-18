/* AulaFinder V50 · Interazioni coerenti, senza dipendenze esterne. */
(()=>{
 'use strict';
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 const actionSound=new Audio('assets/logo-tap.wav');actionSound.preload='auto';actionSound.volume=.30;
 const playTap=()=>{try{actionSound.pause();actionSound.currentTime=0;actionSound.play()?.catch?.(()=>{});}catch(_){}};

 // I tre marchi (header, menu e footer) attivano solo un'animazione, anche su PC.
 const brandSelector='.brand-title[data-page="home"],#sidebarClose,.footer-logo';
 function pulseBrand(el){
  const target=el.closest('#sidebarClose')||el;
  target.classList.remove('af50-brand-active');void target.offsetWidth;
  target.classList.add('af50-brand-active');
  setTimeout(()=>target.classList.remove('af50-brand-active'),1100);
  playTap();
 }
 document.querySelectorAll('.brand-title[data-page="home"],#sidebarClose').forEach(el=>{
  el.setAttribute('aria-label','Anima il marchio AulaFinder');
  el.title='Anima il marchio';
 });
 const footerLogo=document.querySelector('.footer-logo');
 if(footerLogo){footerLogo.tabIndex=0;footerLogo.setAttribute('role','button');footerLogo.setAttribute('aria-label','Anima il logo AulaFinder');footerLogo.title='Anima il logo';}
 document.addEventListener('click',e=>{
  const el=e.target.closest(brandSelector);
  if(!el)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  pulseBrand(el);
 },true);
 footerLogo?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pulseBrand(footerLogo);}});

 // Logo principale: apertura e ritorno senza invisibilità residua / animazioni appese.
 const logoButton=document.getElementById('logoButton');
 const dialog=document.getElementById('logoDialog');
 const photo=dialog?.querySelector('img');
 let logoClosing=false,logoAnimation=null;
 function openLogo(){
  if(!dialog||dialog.open||logoClosing)return;
  dialog.showModal();playTap();
  if(reduced()||!photo)return;
  logoAnimation?.cancel();
  const a=logoButton.getBoundingClientRect(),b=photo.getBoundingClientRect();
  const dx=a.left+a.width/2-b.left-b.width/2,dy=a.top+a.height/2-b.top-b.height/2;
  const scale=Math.max(.05,Math.min(1,a.width/b.width));
  logoAnimation=photo.animate([
   {transform:`translate(${dx}px,${dy}px) scale(${scale})`,opacity:.4,filter:'brightness(1.8) drop-shadow(0 0 14px #8fffea)'},
   {transform:'translate(0,0) scale(1.045)',opacity:1,offset:.72,filter:'brightness(1.15) drop-shadow(0 0 9px #76f9ef)'},
   {transform:'translate(0,0) scale(1)',opacity:1,filter:'brightness(1)'}
  ],{duration:520,easing:'cubic-bezier(.18,.83,.22,1)',fill:'both'});
  logoAnimation.finished.finally(()=>{logoAnimation?.cancel();logoAnimation=null;}).catch(()=>{});
 }
 function closeLogo(){
  if(!dialog?.open||logoClosing)return;
  logoClosing=true;
  logoAnimation?.cancel();logoAnimation=null;
  const finish=()=>{if(!logoClosing)return;logoClosing=false;try{dialog.close();}catch(_){};
   logoButton?.classList.remove('af50-logo-arriving');void logoButton?.offsetWidth;logoButton?.classList.add('af50-logo-arriving');
   setTimeout(()=>logoButton?.classList.remove('af50-logo-arriving'),600);
  };
  if(reduced()||!photo||!logoButton){finish();return;}
  const a=photo.getBoundingClientRect(),b=logoButton.getBoundingClientRect();
  const dx=b.left+b.width/2-a.left-a.width/2,dy=b.top+b.height/2-a.top-a.height/2;
  const factor=Math.max(.05,Math.min(1,b.width/a.width));
  logoAnimation=photo.animate([
   {transform:'translate(0,0) scale(1)',opacity:1},
   {transform:`translate(${dx}px,${dy}px) scale(${factor})`,opacity:1,filter:'brightness(1.6) drop-shadow(0 0 12px #8cffea)'}
  ],{duration:410,easing:'cubic-bezier(.45,0,.65,.95)',fill:'both'});
  const current=logoAnimation;
  current.finished.then(()=>{current.cancel();if(logoAnimation===current)logoAnimation=null;finish();}).catch(finish);
  setTimeout(finish,490); // fallback for browsers that interrupt an animation
 }
 document.addEventListener('click',e=>{
  if(e.target.closest('#logoButton')){e.preventDefault();e.stopImmediatePropagation();openLogo();return;}
  if(dialog?.open&&e.target===dialog){e.preventDefault();e.stopImmediatePropagation();closeLogo();}
 },true);
 dialog?.addEventListener('cancel',e=>{e.preventDefault();closeLogo();},true);

 // Preview enlargement: true viewport modal, zoomable and scrollable.
 const lightbox=document.createElement('div');lightbox.id='af50Lightbox';lightbox.hidden=true;
 lightbox.setAttribute('role','dialog');lightbox.setAttribute('aria-modal','true');lightbox.setAttribute('aria-label','Anteprima della Home a schermo intero');
 lightbox.innerHTML='<div class="af50-lightbox-top"><strong id="af50LightboxTitle">Anteprima storica</strong><div class="af50-lightbox-actions"><button type="button" id="af50LightboxMinus" aria-label="Riduci zoom">−</button><span id="af50LightboxPercent">100%</span><button type="button" id="af50LightboxPlus" aria-label="Aumenta zoom">+</button><button type="button" id="af50LightboxClose" aria-label="Chiudi anteprima">✕</button></div></div><div class="af50-lightbox-scroll" tabindex="0" aria-label="Anteprima scorrevole"><img id="af50LightboxImage" alt="Home AulaFinder ingrandita"></div>';
 document.body.append(lightbox);
 const lightScroll=lightbox.querySelector('.af50-lightbox-scroll'),lightImage=lightbox.querySelector('#af50LightboxImage');
 let zoom=1,lightOpener=null;
 function setLightZoom(value){zoom=Math.max(.7,Math.min(3.5,value));lightImage.style.width=Math.round(100*zoom)+'%';lightbox.querySelector('#af50LightboxPercent').textContent=Math.round(zoom*100)+'%';}
 function closeLightbox(){if(lightbox.hidden)return;lightbox.hidden=true;document.body.classList.remove('af50-modal-open');lightImage.removeAttribute('src');lightOpener?.focus?.({preventScroll:true});}
 document.addEventListener('click',e=>{
  const btn=e.target.closest('.af50-version-fullscreen');if(!btn)return;
  const img=btn.querySelector('img');if(!img)return;
  const url=img.getAttribute('src')||img.dataset.src;if(!url)return;
  lightOpener=btn;lightImage.src=url;lightImage.alt=img.alt;
  lightbox.querySelector('#af50LightboxTitle').textContent=btn.getAttribute('aria-label')?.replace('Apri a schermo intero ','')||'Anteprima storica';
  lightbox.hidden=false;document.body.classList.add('af50-modal-open');setLightZoom(1);lightScroll.scrollTo(0,0);
  lightbox.querySelector('#af50LightboxClose').focus({preventScroll:true});
 });
 lightbox.querySelector('#af50LightboxClose').addEventListener('click',closeLightbox);
 lightbox.querySelector('#af50LightboxMinus').addEventListener('click',()=>setLightZoom(zoom-.25));
 lightbox.querySelector('#af50LightboxPlus').addEventListener('click',()=>setLightZoom(zoom+.25));
 lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
 lightbox.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();closeLightbox();}
  if(e.key==='Tab'){
   const controls=[...lightbox.querySelectorAll('button')],first=controls[0],last=controls.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 lightScroll.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();setLightZoom(zoom+(e.deltaY<0?.2:-.2));},{passive:false});

 // Home quick access: explicit counts from selected timetable hour, not live presence.
 const DATA=window.AULAFINDER_DATA;
 const homeStats=[['freeRoomsShortcut','rooms'],['freeTeachersShortcut','teachers']];
 const quick=[];
 if(DATA)for(const [id,kind] of homeStats){
  const button=document.getElementById(id);if(!button)continue;
  const last=[...button.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
  if(!last)continue;
  const label=document.createElement('span');label.className='af50-quick-body';
  const headline=document.createElement('strong');headline.textContent=last.textContent.trim();
  const meta=document.createElement('small');meta.className='af50-quick-meta';
  label.append(headline,meta);last.replaceWith(label);quick.push({kind,meta});
 }
 function refreshQuick(){
  const day=document.getElementById('daySelect')?.value||DATA?.days?.[0],h=Number(document.getElementById('hourSelect')?.value||'1')-1;
  for(const item of quick){
   const n=item.kind==='rooms'?(DATA.freeRooms?.[day]?.[h]||[]).length:Object.values(DATA.teachers||{}).filter(t=>!(t.days?.[day]||[])[h]).length;
   item.meta.textContent=n+' '+(item.kind==='rooms'?'aule':'docenti')+' senza lezione prevista · '+(h+1)+'ª ora';
  }
 }
 document.getElementById('daySelect')?.addEventListener('change',refreshQuick);
 document.getElementById('hourSelect')?.addEventListener('change',refreshQuick);
 if(DATA)refreshQuick();

 // Tutorial: richer guidance, still entirely within each of the seven original steps.
 const extra=[
  ['Come cercare', 'Puoi inserire il codice di un’aula (T.08), la classe o la sigla del docente. I risultati reali compaiono sotto la ricerca. Aprendo una scheda trovi l’orario del giorno e il collegamento alla piantina.'],
  ['Leggere l’orario', 'Le sei ore sono quelle caricate da lunedì a venerdì. Le aule mostrano chi le occupa; i docenti mostrano classe e aula. Nella sezione completa puoi aggiungere l’elemento ai preferiti.'],
  ['Cosa vuol dire libero', 'Nessuna lezione in quell’ora non significa che una stanza sia prenotabile o che il professore sia in sede. Per i docenti la sezione reale distingue anche le ore buche tra due lezioni.'],
  ['Come seguire il tracciato', 'Seleziona partenza, destinazione e scale/ascensore. Puoi scegliere anche le stanze dalla piantina. Le tappe di piano mostrano entrata e uscita dal nucleo verticale. I percorsi sono schematici, mai indicazioni per un’emergenza.'],
  ['Fare una domanda efficace', 'Scegli la classe e prova «Che materie ho domani?» oppure «Quante ore fa il prof BA AN?». Finder usa dati locali; microfono e voce dipendono dal supporto del browser.'],
  ['Orientarsi con le mappe', 'Scegli uno dei cinque piani; nella sezione reale puoi anche aprire la piantina a schermo intero, ingrandirla e trascinarla in entrambe le direzioni. Le posizioni non sono rilevate dal GPS.'],
  ['Navigare e chiedere aiuto', 'Nel footer trovi gli autori e l’email di contatto. Il menu laterale raccoglie cronologia, preferiti e l’archivio Versioni. Toccare la scritta AulaFinder anima il marchio senza cambiare pagina.']
 ];
 document.querySelectorAll('#tutorialPage [data-tutorial-panel]').forEach((panel,i)=>{
  const copy=panel.querySelector('.af48-tour-copy');if(!copy||!extra[i])return;
  const tip=document.createElement('div');tip.className='af50-tour-detail';
  const head=document.createElement('strong');head.textContent=extra[i][0];
  const para=document.createElement('p');para.textContent=extra[i][1];tip.append(head,para);copy.append(tip);
 });

 // Ensure browser toolbar color follows actual theme, including automatic change.
 const themeMeta=document.querySelector('meta[name="theme-color"]');
 const refreshMeta=()=>{if(themeMeta)themeMeta.content=document.documentElement.dataset.theme==='dark'?'#071f29':'#145968';};
 const observer=new MutationObserver(refreshMeta);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});refreshMeta();
})();
