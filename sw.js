
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

// self.addEventListener('fetch', (e)=>{

//   event.respondWith(
//       caches.open(cacheName).then((cache)=>{
//         return cache.match(event.request);
//       })
//     )

// })