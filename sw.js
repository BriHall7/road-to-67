// Keeps the app working offline. Bump VERSION when the app changes.
const VERSION="r67-v6";
const SHELL=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  // App page: try the internet first so updates arrive, fall back to the saved copy offline.
  if(e.request.mode==="navigate"){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put("index.html",c));return r}).catch(()=>caches.match("index.html")));return}
  // Everything else (icons, fonts): saved copy first.
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok||r.type==="opaque"){const c=r.clone();caches.open(VERSION).then(x=>x.put(e.request,c))}return r})));
});
