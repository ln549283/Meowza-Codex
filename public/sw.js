const CACHE='meowza-pwa-shell-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',(event)=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',(event)=>{
  const request=event.request;
  if(request.method!=='GET')return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response.ok&&new URL(request.url).origin===self.location.origin){const cache=await caches.open(CACHE);void cache.put(request,response.clone());}
      return response;
    }catch{
      const cached=await caches.match(request);
      if(cached)return cached;
      if(request.mode==='navigate'){const fallback=await caches.match('./');if(fallback)return fallback;}
      throw new Error('offline');
    }
  })());
});
