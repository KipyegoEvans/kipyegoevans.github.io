
let cacheName = 'currencyConverter'

self.addEventListener('install', (e)=>{

  e.waitUntil(
    caches.open(cacheName).then((cache)=>{

      return cache.addAll([
        "index.html",
        "index.js",
        "main.css"
        ]);
    })
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
//df
self.addEventListener('fetch', (e)=> {
  var requestUrl = new URL(event.request.url);
  if (requestUrl.pathname === '/api/v5/convert') {
    return;
  }
  e.respondWith(
      caches.open(cacheName).then((cache)=>{
        return cache.match(e.request).then((res)=>{
          return res || fetch(e.request);
        })
      })
    )
});