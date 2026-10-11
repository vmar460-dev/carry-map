// Carry Reciprocity Map v17 - keeps the app working offline after the first visit.
const CACHE="carry-v17";
const APP=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;              // maps, routes, search: always live
  // app files: try the network first (gets weekly updates), fall back to the saved copy offline
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
});
