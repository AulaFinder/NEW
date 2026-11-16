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
    if(panel.hidden || !custom)return;
    const r=button.getBoundingClientRect();
    const {w,h}=bounds();
    const pw=Math.min(395,w-16);
    const left=clamp(r.right-pw,8,Math.max(8,w-pw-8));
    panel.style.width=`${pw}px`;
    panel.style.left=`${left}px`;
    panel.style.right='auto';
    const spaceAbove=r.top-10;
    const spaceBelow=h-r.bottom-10;
    if(spaceAbove>=Math.min(350,h*.45) || spaceAbove>spaceBelow){
      panel.style.bottom=`${Math.max(7,h-r.top+8)}px`;
      panel.style.top='auto';
      panel.style.maxHeight=`${Math.max(150,spaceAbove-12)}px`;
    }else{
      panel.style.top=`${r.bottom+8}px`;
      panel.style.bottom='auto';
      panel.style.maxHeight=`${Math.max(150,spaceBelow-10)}px`;
    }
  }
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
