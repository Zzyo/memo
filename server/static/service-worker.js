const version = '1.0.11';
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

// cache get method
function cacheGetMethod(req) {
  const { referrer } = req;
  const fetchApi = `/api/record?${referrer.split('?')[1]}`;
  caches.open(CACHE)
    .then((cache) => {
      fetch(fetchApi)
        .then((newreq) => {
          console.log(`cache get method: ${fetchApi}`);
          if (newreq.ok) cache.put(fetchApi, newreq.clone());
          return newreq;
        });
    });
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

  // abandon non-GET requests
  if (method === 'POST') {
    if (offline) {
      postMessage('sw.post');
    }
    return;
  }
  if (method === 'PUT') {
    if (offline) {
      postMessage('sw.put');
    } else {
      cacheGetMethod(event.request);
    }
    return;
  }
  if (method === 'DELETE') {
    if (offline) {
      postMessage('sw.delete');
    }
    return;
  }

  const request = isCORSRequest(url, HOST_NAME) ? new Request(url, { mode: 'cors', headers: myHeaders }) : event.request;

  console.log('event.request', request);
  event.respondWith(
    caches.open(CACHE)
      .then(cache => cache.match(request)
        .then((response) => {
          if (response && (offline || isCORSRequest(url, HOST_NAME))) {
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
