const CACHE='meowza-pwa-shell-v2';
const SHELL=['./'];

self.addEventListener('install',(event)=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(SHELL);await self.skipWaiting();})());});
self.addEventListener('activate',(event)=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',(event)=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{try{const response=await fetch(request,{cache:'no-store'});if(response.ok){const cache=await caches.open(CACHE);await cache.put('./',response.clone());}return response;}catch(error){const cached=await caches.match('./');if(cached)return cached;throw error;}})());return;
  }
  event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok){const cache=await caches.open(CACHE);void cache.put(request,response.clone());}return response;}catch(error){const cached=await caches.match(request);if(cached)return cached;throw error;}})());
});
