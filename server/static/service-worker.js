const version = '1.0.6';
const CACHE = `${version}::PWAsite`;
const installFiles = ['/', '/api/records?keywords=', '/images/logo152.png', '/manifest.json'];

// install static assets
function installStaticFiles() {
  return caches.open(CACHE)
    .then(cache => cache.addAll(installFiles));
}

// clear old caches
function clearOldCaches() {
  return caches.keys()
    .then(keylist => Promise.all(
      keylist
        .filter(key => key !== CACHE)
        .map(key => caches.delete(key)),
    ));
}

// application installation
self.addEventListener('install', (event) => {
  console.log('service worker: install');

  // cache core files
  event.waitUntil(
    installStaticFiles()
      .then(() => self.skipWaiting()),
  );
});


// application activated
self.addEventListener('activate', (event) => {
  console.log('service worker: activate');

  // delete old caches
  event.waitUntil(
    clearOldCaches()
      .then(() => self.clients.claim()),
  );
});

function postMessage(msg) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(msg);
    });
  });
}

// application fetch network data
self.addEventListener('fetch', (event) => {
  const { url, method } = event.request;
  const offline = !navigator.onLine;

  // abandon non-GET requests
  if (offline && method === 'POST') {
    postMessage('sw.post');
    return;
  }
  if (offline && method === 'PUT') {
    postMessage('sw.put');
    return;
  }
  if (offline && method === 'DELETE') {
    postMessage('sw.delete');
    return;
  }

  event.respondWith(
    caches.open(CACHE)
      .then(cache => cache.match(event.request)
        .then((response) => {
          if (response) {
            // return cached file
            console.log(`cache fetch: ${url}`);
            return response;
          }
          // make network request
          return fetch(event.request, { mode: 'no-cors' })
            .then((newreq) => {
              console.log(`network fetch: ${url}`);
              if (newreq.ok) cache.put(event.request, newreq.clone());
              return newreq;
            })
            .catch(() => postMessage(url));
        })),
  );
});
