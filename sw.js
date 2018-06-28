
let cacheName = 'currencyConverter'

self.addEventListener('install', (e)=>{

  e.waitUntil(
    caches.open(cacheName).then((cache)=>{

      return cache.addAll([
        "index.hmtl",
        "index.js",
        "main.css"
        ]);
    });
  );
})

self.addEventListener('activate', (e)=>{
  e.waitUntil(

    caches.keys().then((names)=>{
        Promise.all(
          names.filter((name)=>{
            return name !== cacheName;
          }).map((name)=>{
            return caches.delete(name);
          })
          );
      })

    )
})

self.addEventListener('fetch', (e)=>{

  event.respondWith(
      caches.open(cacheName).then((cache)=>{
        return cache.match(event.request) || fetch(event.request);
      })
    );

})