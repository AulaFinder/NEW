/* V51 - Modifiche locali agli orari. Caricato PRIMA delle pagine, per avere indici coerenti. */
(() => {
 'use strict';
 const STORAGE='aulafinder.admin.overrides.v51';
 const base=JSON.parse(JSON.stringify(window.AULAFINDER_DATA));
 const copy=o=>JSON.parse(JSON.stringify(o));
 const slots=['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì'];
 const keys=new Set(Object.keys(base.rooms));
 const teachers=new Set(Object.keys(base.teachers));
 const eligibleRooms=new Set(Object.values(base.freeRooms).flat(2));
 const keyOf=o=>`${o.classId}|${o.day}|${o.hour}`;
 function normalize(raw){
  if(!Array.isArray(raw)||raw.length>300)throw Error('Il file non contiene un elenco di modifiche valido (massimo 300).');
  const edits=new Map();
  for(const entry of raw){
   if(!entry||typeof entry!=='object'||!Object.prototype.hasOwnProperty.call(base.classes,entry.classId)||!slots.includes(entry.day)||!Number.isInteger(entry.hour)||entry.hour<1||entry.hour>6)throw Error('Classe, giorno o ora non validi.');
   if(typeof entry.subject!=='string'||!entry.subject.trim()||entry.subject.length>90||typeof entry.teacher!=='string'||!entry.teacher.trim()||!baseTeacherCodes.includes(entry.teacher)||typeof entry.room!=='string'||!keys.has(entry.room))throw Error('Materia, docente o aula non validi.');
   edits.set(keyOf(entry),{classId:entry.classId,day:entry.day,hour:entry.hour,subject:entry.subject.trim(),teacher:entry.teacher,room:entry.room});
  }
  return [...edits.values()];
 }
 const baseTeacherCodes=[...new Set([...teachers].map(x=>x.replace(/ \(.*\)$/,'')),...Object.values(base.classes).flatMap(c=>Object.values(c.days).flat().filter(Boolean).map(l=>l.teacher)))].sort();
 function teacherMatches(id,lesson){
   if(id===lesson.teacher)return true;
   if(!id.startsWith(lesson.teacher+' ('))return false;
   const tag=id.match(/\((.*?)\)$/)?.[1]||'';
   return lesson.subject.toLocaleUpperCase('it').includes(tag) || (tag==='SCIENZE' && /SCIENZE/i.test(lesson.subject));
 }
 function matchClass(room,day,index){
   const items=[];
   for(const [classId,c] of Object.entries(base.classes)){
    const l=working.classes[classId]?.days?.[day]?.[index];
    if(l && l.room===room)items.push({class:classId,teacher:l.teacher,subject:l.subject});
   }
   return items;
 }
 let working;
 function build(raw){
  const edits=normalize(raw);working=copy(base);
  const changed=new Set();
  for(const e of edits){
   const i=e.hour-1,old=working.classes[e.classId].days[e.day][i];
   changed.add(e.day+'|'+i);
   working.classes[e.classId].days[e.day][i]={subject:e.subject,teacher:e.teacher,room:e.room};
  }
  for(const combined of changed){
   const [day,h]=combined.split('|'),i=Number(h);
   const all=[];
   for(const [classId,c] of Object.entries(working.classes)){
    const l=c.days?.[day]?.[i];if(l)all.push({...l,classId});
   }
   // Non sovrascrivere lezioni di altre classi: blocca solo conflitti introdotti dalle modifiche.
   for(const e of edits.filter(x=>x.day===day&&x.hour===i+1)){
    if(e.room!=='Palestra' && all.some(x=>x.classId!==e.classId&&x.room===e.room))throw Error(`${e.room} è già occupata da un’altra classe (${day}, ${i+1}ª ora).`);
    if(all.some(x=>x.classId!==e.classId&&x.teacher===e.teacher))throw Error(`Il docente ${e.teacher} risulta già assegnato a un’altra classe in questa fascia.`);
   }
   // Ogni indice stanza viene ricostruito dal solo orario classi nel punto cambiato.
   for(const [room,obj] of Object.entries(working.rooms)){
    const lessons=all.filter(l=>l.room===room).map(l=>({subject:l.subject,teacher:l.teacher,class:l.classId}));
    if(!lessons.length){obj.days[day][i]=null;continue;}
    obj.days[day][i]=lessons.length===1?lessons[0]:{
      subject:[...new Set(lessons.map(l=>l.subject))].join(', '),
      teacher:lessons.map(l=>l.teacher).join(', '),
      class:lessons.map(l=>l.class).join(', '),lessons
    };
   }
   // Riflette la stessa modifica anche nel calendario di ciascun docente.
   for(const [id,obj] of Object.entries(working.teachers)){
    const lessons=all.filter(l=>teacherMatches(id,l)).map(l=>({subject:l.subject,class:l.classId,room:l.room}));
    if(!lessons.length){obj.days[day][i]=null;continue;}
    obj.days[day][i]=lessons.length===1?lessons[0]:{...lessons[0],lessons};
   }
   // Conservarne la stessa eleggibilità delle liste pubblicate, senza inventare nuove aule.
   const free=Object.keys(working.rooms).filter(room=>eligibleRooms.has(room)&&!working.rooms[room].days[day][i]);
   const originalOrder=Object.keys(base.rooms);
   working.freeRooms[day][i]=free.sort((a,b)=>originalOrder.indexOf(a)-originalOrder.indexOf(b));
  }
  return working;
 }
 function load(){try{const raw=JSON.parse(localStorage.getItem(STORAGE)||'[]');const result=build(raw);window.AULAFINDER_DATA=result;return {ok:true,count:normalize(raw).length};}catch(e){console.warn('AulaFinder Admin: modifiche locali non applicate',e);window.AULAFINDER_DATA=copy(base);return {ok:false,error:e.message};}}
 const result=load();
 window.AulaFinderAdminData={base,loadResult:result,storage:STORAGE,normalize,build,baseTeacherCodes,
   getEdits:()=>{try{return normalize(JSON.parse(localStorage.getItem(STORAGE)||'[]'));}catch(_){return[];}},
   commit(raw){const edits=normalize(raw);build(edits);localStorage.setItem(STORAGE,JSON.stringify(edits));return edits.length;},
   export(){return JSON.stringify({format:'AulaFinder-V51-overrides',version:1,exportedAt:new Date().toISOString(),overrides:this.getEdits()},null,2);}
 };
})();
