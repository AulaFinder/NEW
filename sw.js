/* AulaFinder V52 rifatta · offline di supporto, aggiornamenti network-first. */
const VERSION='v52-rifatta-20261119-1';
const PREFIX='aulafinder-pwa-';
const CACHE=PREFIX+VERSION;
const CORE=['./','./index.html','./style.css','./piantina.css','./v48.css','./v49.css','./v50.css','./v51.css','./v52.css','./data.js','./script.js','./finder.js','./navigator.js','./versioni.js','./v52-ui.js'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // Un singolo file non ancora pubblicato non può bloccare l'aggiornamento.
  await Promise.allSettled(CORE.map(async url=>{
   const response=await fetch(url,{cache:'reload'});
   if(response.ok)await cache.put(url,response);
  }));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 // I video e le richieste parziali devono andare direttamente al browser.
 if(req.headers.has('range') || /\.(mp4|webm)$/i.test(url.pathname))return;
 event.respondWith((async()=>{
  try{
   // HTML/CSS/JS sempre rivalidati; immagini originali e icone usano la cache HTTP normale.
   const code=/\.(?:html|css|js)$/i.test(url.pathname);
   const res=await fetch(req,(req.mode==='navigate'||code)?{cache:'no-cache'}:undefined);
   if(res.ok){
    const copy=res.clone();
    event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.put(req,copy);}catch(_){}})());
   }
   return res;
  }catch(_){
   const cache=await caches.open(CACHE);
   return await cache.match(req) || (req.mode==='navigate'?await cache.match('./index.html'):undefined) || Response.error();
  }
 })());
});
