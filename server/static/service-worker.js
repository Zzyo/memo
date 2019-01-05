const version = '1.0.9';
const CACHE = `${version}::PWAsite`;
const HOST_NAME = 'www.xiaojiachen.com';
const staticFiles = ['/', '/api/records?keywords=', '/images/logo152.png', '/manifest.json'];

const myHeaders = new Headers();
myHeaders.append('origin', `https://${HOST_NAME}`);

// install static assets
function installStaticFiles() {
  return caches.open(CACHE).then(cache => cache.addAll(staticFiles));
}

// install fetch assets
function installFetchFiles() {
  return fetch('/assets.txt').then(res => res.text()).then((resp) => {
    const str = resp.substr(0, resp.length - 7);
    const fetchFiles = str.split('|split|');
    fetchFiles.forEach((url) => {
      const request = new Request(url, { mode: 'cors', cache: 'no-store', headers: myHeaders });
      caches.open(CACHE)
        .then(cache => cache.match(request)
          .then((response) => {
            if (!response) {
              fetch(request)
                .then((newreq) => {
                  console.log(`message fetch: ${url}`);
                  if (newreq.ok) cache.put(request, newreq.clone());
                  return newreq;
                });
            }
          }));
    });
  });
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

function isCORSRequest(url, host) {
  return url.search(host) !== 8;
}

// application installation
self.addEventListener('install', (event) => {
  console.log('service worker: install');

  // cache core files
  event.waitUntil(
    installStaticFiles()
      .then(() => installFetchFiles())
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

  console.log('fetch', url, method);
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

  const request = isCORSRequest(url, HOST_NAME) ? new Request(url, { mode: 'cors', headers: myHeaders }) : event.request;

  event.respondWith(
    caches.open(CACHE)
      .then(cache => cache.match(request)
        .then((response) => {
          if (response && offline) {
            // return cached file
            console.log(`cache fetch: ${url}`);
            return response;
          }
          // make network request
          return fetch(request)
            .then((newreq) => {
              console.log(`network fetch: ${url}`);
              if (newreq.ok) cache.put(request, newreq.clone());
              return newreq;
            })
            .catch(() => postMessage(url));
        })),
  );
});
