/* AulaFinder · Navigatore scolastico V24.
 * PERCORSI SCHEMATICI: i segmenti di corridoio sono una ricostruzione dai disegni SVG,
 * non una verifica topografica della posizione delle porte o delle barriere architettoniche.
 * È vietato usarli per evacuazione o emergenze.
 */
(() => {
  'use strict';
  const root=document.getElementById('navigatorPage');
  if(!root) return;
  const $=sel=>root.querySelector(sel);
  const NS='http://www.w3.org/2000/svg';
  const floors=['sotto','terra','primo','secondo','terzo'];
  const labels={sotto:'Piano sotterraneo',terra:'Piano terra',primo:'Piano 1',secondo:'Piano 2',terzo:'Piano 3'};
  const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim().replace(/\s+/g,' ');
  const canon=s=>norm(s).replace(/^AULA\s+/,'').replace(/[.\s]/g,'');
  const safe=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const svgNode=(tag,attributes={})=>{const el=document.createElementNS(NS,tag);Object.entries(attributes).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;};
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const point=(x,y)=>({x,y});
  const close=(a,b)=>distance(a,b)<0.01;
  const fmt=n=>Math.round(n*100)/100;

  // Centrelines ricostruite DAI disegni del sito: nessuna distanza reale viene stimata.
  // I cinque blocchi "Scale e ascensore" rappresentano il nucleo verticale principale.
  const halls={
    sotto:[[[692,126],[745,126],[781,126]],[[746,76],[746,126]],[[781,114],[781,126],[781,225]],[[781,114],[905,114]],[[781,225],[745,225]],[[781,225],[781,259],[818,259],[818,271]]],
    terra:[[[260,393],[382,393]],[[382,393],[382,416]],[[382,393],[392,393],[392,367],[440,367],[523,367]],[[392,367],[392,352],[441,352]],[[441,352],[441,367]],[[440,367],[440,383]],[[427,383],[523,383]],[[407,367],[407,460],[407,477]],[[523,383],[529,383]]],
    primo:[[[260,119],[377,119],[430,119],[535,119]],[[377,119],[377,141]],[[430,119],[430,92],[430,77],[409,77]],[[483,119],[483,94]],[[535,119],[535,111]]],
    secondo:[[[618,462],[738,462],[790,462],[790,450],[897,450]],[[738,462],[738,485]],[[738,462],[738,416],[790,416]],[[790,416],[790,450]],[[806,450],[806,435]],[[846,450],[846,436]],[[897,450],[897,442]]],
    terzo:[[[630,559],[740,559],[750,559],[795,559],[795,553],[896,553]],[[750,559],[750,583]],[[816,557.752475],[816,535]],[[855,555.435644],[855,535]],[[896,553],[905,552]]]
  };
  // Dati delle aule leggibili dalle mappe già presenti nella V23.
  const locations=[];
  floors.forEach(floor=>{
    const map=document.querySelector('#'+floor+' svg.plan');
    if(!map)return;
    map.querySelectorAll('g.room').forEach(g=>{
      const text=(g.dataset.t||'').split('·')[0].trim();
      if(!/^(?:[STP]\.\d+|[123]\.\d+|Palestra|Ingresso|Archivio|Caldaie)$/i.test(text))return;
      const box=g.querySelector('rect.box,rect.entrance-box,path.box,rect,path');
      if(!box)return;
      // The English laboratory (2.14) has an irregular SVG path, not a rect.
      // getBBox handles both shapes so it remains navigable like every other classroom.
      const bounds=box.getBBox();
      const x=bounds.x,y=bounds.y,w=bounds.width,h=bounds.height;
      locations.push({id:text,floor,description:(g.dataset.t||'').split('·').slice(1).join('·').trim(),cx:Number(g.dataset.cx),cy:Number(g.dataset.cy),rect:{x,y,w,h}});
    });
  });
  const uniq=new Map();
  // Palestra compare su sotterraneo e terra: scelto il piano terra come ingresso convenzionale.
  locations.forEach(r=>{const key=canon(r.id);if(!uniq.has(key)||r.id==='Palestra'&&r.floor==='terra')uniq.set(key,r);});
  const selectable=[...uniq.values()].sort((a,b)=>floors.indexOf(a.floor)-floors.indexOf(b.floor)||a.id.localeCompare(b.id,'it',{numeric:true}));
  // Every room visible on the plans is available in text search, including specialist labs.
  // Descriptions are alternative names; we never guess a room merely from a shared number.
  const searchNorm=s=>norm(s).replace(/[^A-Z0-9]/g,'');
  const roomAliases=loc=>{
    const desc=loc.description||'';
    const simplified=desc.replace(/^(?:LAB\.?|LABORATORIO)\s*(?:DI\s*)?/i,'');
    return [loc.id,`Aula ${loc.id}`,desc,`${desc} ${loc.id}`,`Lab ${simplified}`,`Laboratorio di ${simplified}`].filter(Boolean).map(searchNorm);
  };
  const lookup=s=>{
    const exact=uniq.get(canon(s));if(exact)return exact;
    const key=searchNorm(s);if(!key)return null;
    const matches=selectable.filter(loc=>roomAliases(loc).includes(key));
    return matches.length===1?matches[0]:null;
  };
  const variants=s=>locations.filter(r=>canon(r.id)===canon(s));
  const from=$('#navFrom'),to=$('#navTo');
  // Custom suggestion list replaces the native datalist. Native suggestions wrongly
  // match the same room number across different floors (e.g. T.01 vs 2.01).
  const fieldChoices=new Map([[from,$('#navFromSuggestions')],[to,$('#navToSuggestions')]]);
  const roomsOnFloor=prefix=>selectable.filter(loc=>{
    if(prefix==='S')return loc.floor==='sotto'&&/^S\./i.test(loc.id);
    if(prefix==='P')return loc.floor==='sotto'&&/^P\./i.test(loc.id);
    if(prefix==='T')return loc.floor==='terra'&&/^T\./i.test(loc.id);
    return loc.floor===({1:'primo',2:'secondo',3:'terzo'}[prefix]);
  });
  let selectedSuggestion=-1;
  function suggestionCandidates(raw){
    const q=searchNorm(raw);
    if(!q)return selectable.map(loc=>({loc,score:0}));
    const floorToken=norm(raw).replace(/^(?:AULA)\s*/,'').match(/^([SPT123])(?=\.|\s|\d|$)/);
    const floorPool=floorToken?roomsOnFloor(floorToken[1]):selectable;
    return floorPool.map(loc=>{
      const aliases=roomAliases(loc);
      const exact=aliases.some(a=>a===q);
      const starts=aliases.some(a=>a.startsWith(q));
      const token=aliases.some(a=>a.includes(q));
      const score=exact?130:starts?100:token?60:-1;
      return {loc,score};
    }).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score||selectable.indexOf(a.loc)-selectable.indexOf(b.loc));
  }
  function hideSuggestions(input){
    const list=fieldChoices.get(input);if(!list)return;
    list.hidden=true;input.setAttribute('aria-expanded','false');selectedSuggestion=-1;
  }
  function showSuggestions(input){
    const list=fieldChoices.get(input);if(!list)return;
    for(const other of fieldChoices.keys())if(other!==input)hideSuggestions(other);
    const hits=suggestionCandidates(input.value);
    list.innerHTML=hits.length?hits.map(({loc},i)=>`<button type="button" role="option" data-nav-choice="${loc.id}" aria-selected="false" data-idx="${i}"><strong>${loc.id}</strong>${loc.description?`<span>${loc.description}</span>`:''}<small>${labels[loc.floor]}</small></button>`).join(''):'<p class="nav-no-matches">Nessun ambiente trovato.</p>';
    list.hidden=false;input.setAttribute('aria-expanded','true');selectedSuggestion=-1;
  }
  function pickSuggestion(input,id){
    const loc=lookup(id);if(!loc)return;
    input.value=loc.id;
    hideSuggestions(input);
    invalidateRoute();
  }
  fieldChoices.forEach((list,input)=>{
    input.addEventListener('focus',()=>showSuggestions(input));
    input.addEventListener('input',()=>showSuggestions(input));
    input.addEventListener('keydown',e=>{
      if(e.key==='Escape'){hideSuggestions(input);return;}
      const buttons=[...list.querySelectorAll('[data-nav-choice]')];
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){
        e.preventDefault();if(list.hidden)showSuggestions(input);
        const options=[...list.querySelectorAll('[data-nav-choice]')];if(!options.length)return;
        selectedSuggestion=(selectedSuggestion+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;
        options.forEach((b,i)=>b.setAttribute('aria-selected',String(i===selectedSuggestion)));
        options[selectedSuggestion].scrollIntoView({block:'nearest'});
      }else if(e.key==='Enter'&&!list.hidden&&buttons.length){
        e.preventDefault();pickSuggestion(input,buttons[Math.max(selectedSuggestion,0)].dataset.navChoice);
      }
    });
    list.addEventListener('pointerdown',e=>{
      const btn=e.target.closest('[data-nav-choice]');if(!btn)return;
      e.preventDefault();pickSuggestion(input,btn.dataset.navChoice);
    });
    input.addEventListener('blur',()=>{requestAnimationFrame(()=>{
      if(!list.contains(document.activeElement))hideSuggestions(input);
    });});
  });
  document.addEventListener('pointerdown',e=>{
    fieldChoices.forEach((list,input)=>{if(!input.closest('.navigator-field').contains(e.target))hideSuggestions(input);});
  });
  let activePick='from';
  let latestRoute=null;
  let pickerFloor='terra';
  const currentFields=()=>[lookup(from.value),lookup(to.value)];
  // Scale e ascensori allineati per posizione su tutti i livelli.
  // Ogni gruppo è associato per posizione, non solo tramite etichetta generica.
  const laneHints={
    core:{sotto:[751.865,142.750],terra:[381.35,417.07],primo:[376.95,141.095],secondo:[738.915,485.605],terzo:[749.965,583.145]},
    eastStairs:{sotto:[817.525,100.985],terra:[441.060,368.970],primo:[444.780,93.685],secondo:[806.145,436.090],terzo:[816.800,535.385]},
    farStairs:{sotto:[903.625,115.890],terra:[529.480,385.120],primo:[535.655,111.080],secondo:[898.100,450.820],terzo:[905.815,552.390]},
    eastLift:{primo:[483.125,93.685],secondo:[846.295,436.090],terzo:[855.020,535.385]}
  };
  const connectors=[];
  Object.entries(laneHints).forEach(([lane,byFloor])=>Object.entries(byFloor).forEach(([floor,[x,y]])=>{
    const nodes=[...document.querySelectorAll('#'+floor+' g.room')];
    const g=nodes.filter(el=>lane==='eastLift'?/ascensore/i.test(el.dataset.t)&&!/scale/i.test(el.dataset.t):/scale/i.test(el.dataset.t)).sort((a,b)=>Math.hypot(+a.dataset.cx-x,+a.dataset.cy-y)-Math.hypot(+b.dataset.cx-x,+b.dataset.cy-y))[0];
    if(!g)return;
    const dist=Math.hypot(+g.dataset.cx-x,+g.dataset.cy-y);
    if(dist>22)return;
    const rect=g.querySelector('rect');
    connectors.push({id:lane+'-'+floor,lane,floor,cx:+g.dataset.cx,cy:+g.dataset.cy,rect:{x:+rect.getAttribute('x'),y:+rect.getAttribute('y'),w:+rect.getAttribute('width'),h:+rect.getAttribute('height')}});
  }));
  const routeCache=new Map();
  function cachedHall(floor,a,b){
    const key=`${floor}:${a.id}:${a.cx}:${a.cy}>${b.id}:${b.cx}:${b.cy}`;
    if(routeCache.has(key))return routeCache.get(key);
    const pts=shortestHall(floor,a,b);
    routeCache.set(key,pts);
    return pts;
  }
  const routeLength=points=>points?.slice(1).reduce((sum,p,i)=>sum+distance(p,points[i]),0)??Infinity;
  const notice=(message,error=false)=>{$('#navMessage').textContent=message;$('#navMessage').classList.toggle('nav-error',error)};
  const allSegments=floor=>(halls[floor]||[]).flatMap(line=>line.slice(1).map((pt,i)=>[point(...line[i]),point(...pt)]));
  function projection(p,a,b){const dx=b.x-a.x,dy=b.y-a.y;const len=dx*dx+dy*dy||1;const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/len));return point(a.x+t*dx,a.y+t*dy);}
  function entranceFor(loc,segments){
    const {x,y,w,h}=loc.rect;
    const sides=[point(x+w/2,y),point(x+w/2,y+h),point(x,y+h/2),point(x+w,y+h/2)];
    let chosen=null;
    sides.forEach(door=>segments.forEach(([a,b],idx)=>{
      const snap=projection(door,a,b),dist=distance(door,snap);
      if(!chosen||dist<chosen.dist)chosen={door,snap,idx,dist};
    }));
    return chosen;
  }
  const cross=(a,b)=>a.x*b.y-a.y*b.x;
  function intersection(a,b,c,d){
    const r=point(b.x-a.x,b.y-a.y),s=point(d.x-c.x,d.y-c.y);
    const denom=cross(r,s);if(Math.abs(denom)<1e-9)return null;
    const q=point(c.x-a.x,c.y-a.y),t=cross(q,s)/denom,u=cross(q,r)/denom;
    if(t<-.00001||t>1.00001||u<-.00001||u>1.00001)return null;
    return point(a.x+t*r.x,a.y+t*r.y);
  }
  // Il Navigatore costruisce un grafo dalle aree di corridoio REALMENTE disegnate,
  // anziché attraversare in diagonale le pareti. Non implica percorsi verificati sul posto.
  const walkGridCache=new Map();
  function walkingGrid(floor){
    if(walkGridCache.has(floor))return walkGridCache.get(floor);
    const svg=document.querySelector('#'+floor+' svg.plan');
    const corridor=svg?.querySelector(':scope > path');
    if(!svg||!corridor||typeof corridor.isPointInFill!=='function')return null;
    const vb=svg.viewBox.baseVal,step=1.8;
    const nx=Math.ceil(vb.width/step)+1,ny=Math.ceil(vb.height/step)+1;
    const rooms=[...svg.querySelectorAll('g.room .box')].map(b=>{const r=b.getBBox();return{
      x:r.x+.38,y:r.y+.38,x2:r.x+r.width-.38,y2:r.y+r.height-.38
    };});
    const valid=new Uint8Array(nx*ny),coord=n=>point(vb.x+(n%nx)*step,vb.y+Math.floor(n/nx)*step);
    for(let i=0;i<valid.length;i++){
      const p=coord(i);
      if(rooms.some(r=>p.x>=r.x&&p.x<=r.x2&&p.y>=r.y&&p.y<=r.y2))continue;
      if(corridor.isPointInFill(new DOMPoint(p.x,p.y)))valid[i]=1;
    }
    const grid={nx,ny,valid,coord};walkGridCache.set(floor,grid);return grid;
  }
  function actualHall(floor,start,end){
    const grid=walkingGrid(floor);if(!grid)return undefined;
    const {nx,ny,valid,coord}=grid;
    function nearest(loc){let best=-1,dist=Infinity;
      for(let i=0;i<valid.length;i++)if(valid[i]){const p=coord(i),d=(p.x-loc.cx)**2+(p.y-loc.cy)**2;
        if(d<dist){dist=d;best=i}}
      return best;
    }
    const source=nearest(start),target=nearest(end);
    if(source<0||target<0)return null;
    const prev=new Int32Array(valid.length);prev.fill(-1);
    const queue=new Int32Array(valid.length);
    const visited=new Uint8Array(valid.length);
    let head=0,tail=0;queue[tail++]=source;visited[source]=1;
    while(head<tail && !visited[target]){
      const u=queue[head++],x=u%nx,y=(u-x)/nx;
      const neighbors=[x>0?u-1:-1,x<nx-1?u+1:-1,y>0?u-nx:-1,y<ny-1?u+nx:-1];
      for(const v of neighbors)if(v>=0&&valid[v]&&!visited[v]){visited[v]=1;prev[v]=u;queue[tail++]=v;}
    }
    if(!visited[target])return null;
    const cells=[];for(let u=target;u>=0;u=prev[u]){cells.push(u);if(u===source)break;}
    cells.reverse();
    const points=cells.map(coord),compressed=[];
    for(let i=0;i<points.length;i++){
      if(i>0&&i<points.length-1){const a=points[i-1],b=points[i],c=points[i+1];
        if(Math.abs((b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x))<.001)continue;
      }
      compressed.push(points[i]);
    }
    // La linea termina ai bordi delle stanze, senza attraversare il testo delle aule.
    return compressed.filter((p,i)=>i===0||!close(p,compressed[i-1]));
  }
  function shortestHall(floor,start,end){
    const actual=actualHall(floor,start,end);
    if(actual && actual.length)return actual;
    // Piantina parzialmente disconnessa: usa solo i collegamenti schematici predefiniti.
    const segments=allSegments(floor),fst=entranceFor(start,segments),lst=entranceFor(end,segments);
    if(!fst||!lst)return null;
    // Create a graph from every corridor segment and their geometric intersections.
    const onSeg=segments.map(([a,b])=>[a,b]);
    for(let i=0;i<segments.length;i++)for(let j=i+1;j<segments.length;j++){
      const crossAt=intersection(...segments[i],...segments[j]);
      if(crossAt){onSeg[i].push(crossAt);onSeg[j].push(crossAt)}
      // Covers branches that begin at an interior point of a straight hallway.
      segments[j].forEach(p=>{if(distance(projection(p,...segments[i]),p)<.001)onSeg[i].push(p)});
      segments[i].forEach(p=>{if(distance(projection(p,...segments[j]),p)<.001)onSeg[j].push(p)});
    }
    onSeg[fst.idx].push(fst.snap);onSeg[lst.idx].push(lst.snap);
    const graph=new Map();
    const key=p=>`${Math.round(p.x*1000)}:${Math.round(p.y*1000)}`;
    const pts=new Map();
    function connect(a,b){const ak=key(a),bk=key(b);pts.set(ak,a);pts.set(bk,b);if(!graph.has(ak))graph.set(ak,[]);if(!graph.has(bk))graph.set(bk,[]);const d=distance(a,b);if(d>.001){graph.get(ak).push([bk,d]);graph.get(bk).push([ak,d]);}}
    onSeg.forEach((nodeSet,i)=>{
      const [a,b]=segments[i];const uniqNode=[...new Map(nodeSet.map(p=>[key(p),p])).values()];
      const denom=(b.x-a.x)**2+(b.y-a.y)**2||1;
      uniqNode.sort((m,n)=>(((m.x-a.x)*(b.x-a.x)+(m.y-a.y)*(b.y-a.y))-((n.x-a.x)*(b.x-a.x)+(n.y-a.y)*(b.y-a.y)))/denom);
      for(let j=1;j<uniqNode.length;j++)connect(uniqNode[j-1],uniqNode[j]);
    });
    const source=key(fst.snap),destination=key(lst.snap);
    const d=new Map([[source,0]]),prev=new Map(),todo=new Set(graph.keys());
    while(todo.size){let u=null,min=Infinity;for(const k of todo)if((d.get(k)??Infinity)<min){u=k;min=d.get(k)}
      if(u===null||u===destination)break;todo.delete(u);
      for(const [v,w] of graph.get(u)||[])if(todo.has(v)&&(d.get(v)??Infinity)>min+w){d.set(v,min+w);prev.set(v,u)}
    }
    if(!d.has(destination))return null;
    const middle=[];let cur=destination;while(cur){middle.push(pts.get(cur));if(cur===source)break;cur=prev.get(cur)}middle.reverse();
    const result=[fst.door,fst.snap,...middle.slice(1),lst.snap,lst.door];
    return result.filter((p,i)=>!i||!close(p,result[i-1]));
  }

  function cloneMap(floor,where,{routePoints=[],start=null,end=null,transfer=false}={}){
    where.innerHTML='';
    const original=document.querySelector('#'+floor+' svg.plan');
    if(!original)return;
    const map=original.cloneNode(true);map.classList.add('nav-plan');map.setAttribute('aria-label','Piantina schematica di '+labels[floor]);
    map.querySelectorAll('g.room').forEach(g=>{
      const text=(g.dataset.t||'').split('·')[0].trim();
      const location=locations.find(loc=>loc.floor===floor&&canon(loc.id)===canon(text));
      const valid=!!location;
      if(valid){g.classList.add('nav-room');g.setAttribute('data-nav-id',location.id);g.setAttribute('aria-label','Seleziona '+location.id);g.setAttribute('tabindex','0');}
      else{g.removeAttribute('tabindex');g.removeAttribute('role');g.classList.remove('nav-room');g.style.pointerEvents='none';}
      if((start&&canon(text)===canon(start.id))||(end&&canon(text)===canon(end.id)))g.classList.add('nav-endpoint-room');
    });
    map.querySelectorAll('.top').forEach(g=>g.remove());
    if(routePoints.length){
      const layer=svgNode('g',{class:'nav-route-layer','aria-hidden':'true'});
      // Draw the route BEHIND the room text and icons (the original g.room are appended afterwards).
      const unique=routePoints.filter((p,i)=>i===0||!close(p,routePoints[i-1]));
      const d=unique.length?`M ${fmt(unique[0].x)} ${fmt(unique[0].y)} `+unique.slice(1).map(p=>`L ${fmt(p.x)} ${fmt(p.y)}`).join(' '):'';
      const defs=svgNode('defs');const grad=svgNode('linearGradient',{id:'aula-nav-route-gradient',x1:'0%',y1:'0%',x2:'100%',y2:'60%'});
      [['0%','#19404A'],['35%','#26A7A9'],['72%','#9DE8D7'],['100%','#26A7A9']].forEach(([offset,color])=>grad.append(svgNode('stop',{offset,'stop-color':color})));
      defs.append(grad);layer.append(defs);
      layer.append(svgNode('path',{d,class:'nav-route-shadow'}));
      layer.append(svgNode('path',{d,class:'nav-route-polyline'}));
      const a=unique[0],b=unique.at(-1);
      if(a&&start)layer.append(svgNode('circle',{cx:a.x,cy:a.y,r:3.2,class:'nav-route-start'}));
      if(b&&end)layer.append(svgNode('circle',{cx:b.x,cy:b.y,r:3.2,class:'nav-route-end'}));
      if(transfer && b){layer.append(svgNode('circle',{cx:b.x,cy:b.y,r:6.8,class:'nav-transfer-pulse'}));layer.append(svgNode('circle',{cx:b.x,cy:b.y,r:3.8,class:'nav-route-transfer'}));}
      const firstRoom=map.querySelector('g.room');
      if(firstRoom)map.insertBefore(layer,firstRoom);else map.appendChild(layer);
    }
    where.appendChild(map);
  }
  function renderPicker(){
    $('#navPickerFloor').value=pickerFloor;
    $('#navPickerTitle').textContent=activePick==='from'?'Scegli la partenza dalla piantina':'Scegli la destinazione dalla piantina';
    const holder=$('#navPickerMap');cloneMap(pickerFloor,holder);
  }
  function togglePicker(field){
    const picker=$('#navPicker');
    if(!picker.hidden&&activePick===field){picker.hidden=true;return}
    activePick=field;
    const loc=lookup(field==='from'?from.value:to.value);
    pickerFloor=loc?.floor||pickerFloor;
    picker.hidden=false;
    renderPicker();
    root.querySelectorAll('[data-nav-pick]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.navPick===field)));
    picker.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'nearest'});
  }
  const floorName=i=>labels[floors[i]];
  const stageState={index:0,stages:[]};
  function bestRoute(a,b,mode){
    // Include both gym levels: underground is a valid arrival without climbing to ground.
    const starts=variants(a.id).length?variants(a.id):[a];
    const ends=variants(b.id).length?variants(b.id):[b];
    let best=null;
    for(const origin of starts)for(const destination of ends){
      const fi=floors.indexOf(origin.floor),ti=floors.indexOf(destination.floor);
      const min=Math.min(fi,ti),max=Math.max(fi,ti);
      const active=connectors.filter(c=>{
        if(floors.indexOf(c.floor)<min||floors.indexOf(c.floor)>max)return false;
        return mode==='lift' ? ['core','eastLift'].includes(c.lane):c.lane!=='eastLift';
      });
      const nodes=[{...origin,id:'origin',realId:origin.id},...active,{...destination,id:'destination',realId:destination.id}];
      const pathCache=new Map();
      const edges=new Map(nodes.map((_,i)=>[i,[]]));
      const edgeDetails=new Map();
      for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
        const u=nodes[i],v=nodes[j];
        if(u.floor===v.floor){
          // The direct trip is measured using the actual hallway sketch, never Euclidean through rooms.
          const pts=cachedHall(u.floor,u,v);
          if(!pts||!pts.length)continue;
          const w=Math.max(0.1,routeLength(pts));
          edges.get(i).push([j,w]);edges.get(j).push([i,w]);edgeDetails.set(i+','+j,pts);
        }else if(u.lane&&v.lane&&u.lane===v.lane&&Math.abs(floors.indexOf(u.floor)-floors.indexOf(v.floor))===1){
          const w=50;edges.get(i).push([j,w]);edges.get(j).push([i,w]);
        }
      }
      // Dijkstra with no detour to higher/lower floors outside the start→destination span.
      const costs=nodes.map(()=>Infinity),prev=nodes.map(()=>-1),todo=new Set(nodes.map((_,i)=>i));costs[0]=0;
      while(todo.size){let i=-1,bestCost=Infinity;for(const j of todo)if(costs[j]<bestCost){bestCost=costs[j];i=j;}
        if(i<0||i===nodes.length-1)break;todo.delete(i);
        for(const [j,w] of edges.get(i)){if(todo.has(j)&&costs[i]+w<costs[j]){costs[j]=costs[i]+w;prev[j]=i;}}
      }
      if(!Number.isFinite(costs.at(-1)))continue;
      const seq=[];let at=nodes.length-1;while(at>=0){seq.push(at);if(at===0)break;at=prev[at];}seq.reverse();
      if(seq[0]!==0)continue;
      const stages=[];let current=null;
      for(let k=0;k<seq.length-1;k++){
        const x=seq[k],y=seq[k+1],u=nodes[x],v=nodes[y];
        if(u.floor===v.floor){
          let pts=edgeDetails.get(Math.min(x,y)+','+Math.max(x,y));
          if(!pts)continue;
          if(x>y)pts=[...pts].reverse();
          if(!current||current.floor!==u.floor){current={floor:u.floor,points:[],start:null,end:null,transfer:false};stages.push(current);}
          for(const pt of pts){if(!current.points.length||!close(current.points.at(-1),pt))current.points.push(pt);}
        }else{
          if(!current||current.floor!==u.floor){current={floor:u.floor,points:[point(u.cx,u.cy)],start:null,end:null,transfer:false};stages.push(current);}
          current.transfer=true;
          current.exitLane=u.lane;
          current=null;
        }
      }
      if(!stages.length)stages.push({floor:origin.floor,points:[point(origin.cx,origin.cy)],start:origin,end:destination,transfer:false});
      stages[0].start=origin;
      stages[stages.length-1].end=destination;
      const choice={a:origin,b:destination,mode,stages,cost:costs.at(-1)};
      if(!best||choice.cost<best.cost)best=choice;
    }
    return best;
  }
  function renderRouteStage(index){
    if(!latestRoute)return;
    stageState.index=Math.max(0,Math.min(index,stageState.stages.length-1));
    const i=stageState.index,r=stageState.stages[i];
    const count=stageState.stages.length;
    $('#navCurrentStep').textContent=`${i+1} / ${count}`;
    $('#navStepPrev').disabled=i===0;
    $('#navStepNext').disabled=i===count-1;
    const role=count===1?'Percorso':i===0?'Partenza':i===count-1?'Arrivo':'Cambio piano';
    $('#navStepFloor').textContent=labels[r.floor];
    $('#navStepInstruction').textContent=count===1?`Segui il percorso evidenziato da ${latestRoute.a.id} a ${latestRoute.b.id}.`:
      i===0?`Parti da ${latestRoute.a.id}. Segui il percorso fino al collegamento verticale evidenziato.`:
      i===count-1?`Dal collegamento verticale raggiungi ${latestRoute.b.id}.`:
      `Attraversa ${labels[r.floor]} e segui le indicazioni per ${latestRoute.mode==='lift'?'l’ascensore':'le scale'}.`;
    $('#navStepRole').textContent=role;
    const map=$('#navActiveMap');
    cloneMap(r.floor,map,{routePoints:r.points,start:r.start,end:r.end,transfer:r.transfer});
  }
  function invalidateRoute(){latestRoute=null;stageState.stages=[];$('#navRouteResult').hidden=true;notice('Premi Visualizza percorso per calcolare il tragitto.');}
  function performRoute(scroll=false){
    const [a,b]=currentFields();
    if(!a||!b){latestRoute=null;$('#navRouteResult').hidden=true;notice('Controlla Da e A: scegli due ambienti presenti nell’elenco o nella piantina.',true);return false;}
    if(a.id===b.id){latestRoute=null;$('#navRouteResult').hidden=true;notice('Partenza e destinazione coincidono. Seleziona due ambienti diversi.',true);return false;}
    const mode=$('#navTravelMode').value;
    const result=bestRoute(a,b,mode);
    if(!result){latestRoute=null;$('#navRouteResult').hidden=true;notice('Collegamento non disponibile con questa modalità. Prova scale/ascensore oppure altre aule.',true);return false;}
    latestRoute=result;stageState.stages=result.stages;
    notice(`Percorso trovato: ${result.a.id} → ${result.b.id} · ${result.stages.length} ${result.stages.length===1?'piano':'piani'}.`);
    const target=$('#navRouteResult');target.hidden=false;
    target.innerHTML=`<div class="navigator-summary"><p>${safe(result.a.id)} → ${safe(result.b.id)}<small>${safe(labels[result.a.floor])} → ${safe(labels[result.b.floor])}</small></p><span class="nav-mode-tag">${mode==='lift'?'Ascensore':'Scale'}</span></div>
      <section class="nav-stepper" aria-label="Navigazione passo dopo passo"><div class="nav-stepper-controls"><button type="button" id="navStepPrev" aria-label="Passaggio precedente">←</button><div><span class="nav-stepper-counter" id="navCurrentStep"></span><h2 id="navStepFloor"></h2><span id="navStepRole"></span></div><button type="button" id="navStepNext" aria-label="Passaggio successivo">→</button></div>
      <div class="navigator-map" id="navActiveMap"></div><p id="navStepInstruction" class="navigator-route-instruction"></p></section>`;
    renderRouteStage(0);
    if(scroll)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    return true;
  }
  root.addEventListener('click',e=>{if(e.target.closest('#navStepPrev'))renderRouteStage(stageState.index-1);if(e.target.closest('#navStepNext'))renderRouteStage(stageState.index+1)});
  $('#navigatorForm').addEventListener('submit',e=>{e.preventDefault();performRoute(true)});
  root.querySelectorAll('[data-nav-pick]').forEach(b=>b.addEventListener('click',()=>togglePicker(b.dataset.navPick)));
  $('#navPickerClose').addEventListener('click',()=>{$('#navPicker').hidden=true;root.querySelectorAll('[data-nav-pick]').forEach(el=>el.setAttribute('aria-pressed','false'))});
  $('#navPickerFloor').addEventListener('change',e=>{pickerFloor=e.target.value;renderPicker()});
  $('#navSwap').addEventListener('click',()=>{const value=from.value;from.value=to.value;to.value=value;hideSuggestions(from);hideSuggestions(to);invalidateRoute()});
  $('#navTravelMode').addEventListener('change',invalidateRoute);
  [from,to].forEach(input=>{
    input.addEventListener('change',()=>{hideSuggestions(input);invalidateRoute();});
    input.addEventListener('input',invalidateRoute);
  });
  // Prevent the existing Piantina click/keyboard handlers from selecting copied SVG elements.
  root.querySelectorAll('#navPickerMap,#navRouteResult').forEach(container=>{
    container.addEventListener('click',e=>{
      const room=e.target.closest('g.nav-room');
      if(room&&container.id==='navPickerMap'){
        const input=activePick==='from'?from:to;
        input.value=room.dataset.navId;
        hideSuggestions(input);
        $('#navPicker').hidden=true;
        root.querySelectorAll('[data-nav-pick]').forEach(el=>el.setAttribute('aria-pressed','false'));
        invalidateRoute();notice(`${room.dataset.navId} selezionata. ${lookup(from.value)&&lookup(to.value)?'Premi Visualizza percorso.':'Completa l’altro campo e premi Visualizza percorso.'}`);
      }
      if(e.target.closest('svg.plan'))e.stopPropagation();
    },true);
    container.addEventListener('keydown',e=>{
      if((e.key==='Enter'||e.key===' ')&&e.target.closest('g.nav-room')){
        e.preventDefault();e.stopPropagation();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));
      }
    },true);
  });
  window.AulaFinderNavigator={
    route:(origin,destination)=>{from.value=origin;to.value=destination;invalidateRoute();return true;},
    setDestination:(destination)=>{const loc=lookup(destination);if(!loc)return false;to.value=loc.id;hideSuggestions(to);
      invalidateRoute();notice(`Destinazione: ${loc.id}. ${lookup(from.value)?'Premi Visualizza percorso.':'Ora scegli da quale ambiente partire.'}`);
      return true;},
    getRooms:()=>selectable.map(x=>x.id)
  };
})();
