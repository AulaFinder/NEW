/* AulaFinder V48 · Finder freely draggable with mouse/touch, keyboard activation unchanged. */
(()=>{
  'use strict';
  const button=document.getElementById('finderLaunch');
  const panel=document.getElementById('finderPanel');
  if(!button||!panel)return;
  let pointer=null, suppressClick=false;
  let custom=false;
  const pad=7;
  const bounds=()=>({w:window.innerWidth,h:window.innerHeight});
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function place(left,top,save=true){
    const {w,h}=bounds();
    const rect=button.getBoundingClientRect();
    const x=clamp(left,pad,Math.max(pad,w-rect.width-pad));
    const y=clamp(top,pad,Math.max(pad,h-rect.height-pad));
    button.style.left=`${x}px`;button.style.top=`${y}px`;
    button.style.right='auto';button.style.bottom='auto';
    custom=true;
    if(save){try{localStorage.setItem('aulafinder.finder.position',JSON.stringify({x:x/w,y:y/h}));}catch(_){}}
    positionPanel();
  }
  function positionPanel(){
    if(panel.hidden||panel.classList.contains('is-expanded')||!custom)return;
    const r=button.getBoundingClientRect();const {w,h}=bounds();
    const pw=Math.min(panel.offsetWidth||395,w-16);
    const left=clamp(r.right-pw,8,Math.max(8,w-pw-8));
    panel.style.left=`${left}px`;panel.style.right='auto';
    const ph=Math.min(panel.offsetHeight||520,h-24);
    const spaceAbove=r.top-10,spaceBelow=h-r.bottom-10;
    if(spaceAbove>spaceBelow&&spaceAbove>=Math.min(240,ph*.65)){
      panel.style.top='auto';panel.style.bottom=`${Math.max(7,h-r.top+8)}px`;
    }else{
      panel.style.top=`${r.bottom+8}px`;panel.style.bottom='auto';
    }
  }
  const grip=document.getElementById('finderResize');
  function resizePanel(w,h){
    panel.classList.remove('is-expanded');
    document.getElementById('finderExpand')?.setAttribute('aria-pressed','false');
    const maxW=Math.max(265,window.innerWidth-16),maxH=Math.max(210,window.innerHeight-16);
    panel.style.width=`${clamp(w,265,maxW)}px`;
    panel.style.height=`${clamp(h,210,maxH)}px`;
    panel.style.maxHeight=`${maxH}px`;
    panel.classList.add('is-custom-sized');positionPanel();
    try{localStorage.setItem('aulafinder.finder.size',JSON.stringify({w:panel.offsetWidth,h:panel.offsetHeight}));}catch(_){}
  }
  let sizing=null;
  grip?.addEventListener('pointerdown',e=>{
    if(e.button!==0&&e.pointerType==='mouse')return;
    const r=panel.getBoundingClientRect();sizing={id:e.pointerId,x:e.clientX,y:e.clientY,w:r.width,h:r.height};
    try{grip.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();
  });
  grip?.addEventListener('pointermove',e=>{if(!sizing||e.pointerId!==sizing.id)return;resizePanel(sizing.w+e.clientX-sizing.x,sizing.h+e.clientY-sizing.y);});
  ['pointercancel','pointerup'].forEach(type=>grip?.addEventListener(type,()=>{sizing=null;}));
  grip?.addEventListener('keydown',e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const step=e.shiftKey?40:16;resizePanel(panel.offsetWidth+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),panel.offsetHeight+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0));});
  panel.addEventListener('finder:resize',()=>{if(!panel.classList.contains('is-expanded'))positionPanel();});
  try{const stored=JSON.parse(localStorage.getItem('aulafinder.finder.size')||'null');if(Number.isFinite(stored?.w)&&Number.isFinite(stored?.h))resizePanel(stored.w,stored.h);}catch(_){}
  button.addEventListener('pointerdown',e=>{
    if(e.button!==0 && e.pointerType==='mouse')return;
    const r=button.getBoundingClientRect();
    pointer={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:r.left,top:r.top,moved:false};
    try{button.setPointerCapture(e.pointerId);}catch(_){}
  });
  button.addEventListener('pointermove',e=>{
    if(!pointer || pointer.id!==e.pointerId)return;
    const dx=e.clientX-pointer.startX,dy=e.clientY-pointer.startY;
    if(Math.hypot(dx,dy)>7)pointer.moved=true;
    if(pointer.moved){button.classList.add('is-dragging');place(pointer.left+dx,pointer.top+dy,false);}
  });
  function finish(e){
    if(!pointer || pointer.id!==e.pointerId)return;
    const moved=pointer.moved;
    pointer=null;button.classList.remove('is-dragging');
    if(moved){
      const r=button.getBoundingClientRect();place(r.left,r.top,true);
      suppressClick=true;
    }
  }
  button.addEventListener('pointerup',finish);
  button.addEventListener('pointercancel',finish);
  button.addEventListener('click',e=>{
    if(suppressClick){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;}
  },true);
  window.addEventListener('resize',()=>{
    if(!custom)return;
    const r=button.getBoundingClientRect();place(r.left,r.top,false);
  });
  new MutationObserver(positionPanel).observe(panel,{attributes:true,attributeFilter:['hidden']});
  try{
    const saved=JSON.parse(localStorage.getItem('aulafinder.finder.position')||'null');
    if(saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)){
      const {w,h}=bounds();place(saved.x*w,saved.y*h,false);
    }
  }catch(_){}
})();
