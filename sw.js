
let cacheName = 'currencyConverter'

self.addEventListener('install', (e)=>{

  e.waitUntil(
    caches.open(cacheName).then((cache)=>{

      return cache.addAll([
        "index.html",
        "index.js"
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

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});