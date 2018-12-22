const CACHEPREFIX = 'lwjgl-static-';
const CACHENAME = CACHEPREFIX + 'VERSION';
const FILES = [];
const ROUTES = [];
const WHITELIST = [/^\/(js|css|img|svg)\//, /^\/manifest.webmanifest/];

// TODO: Create a separate cache for images
// TODO: Inject the manifest in the SW
// TODO: Cache basic files on installation, as before but:
// TODO: send a message post-install with the current route so we can cache dependencies - ONLY FOR NEW SW INSTALLATIONS

async function cacheFiles() {
  const cache = await caches.open(CACHENAME);
  return cache.addAll(FILES);
}

async function clearOldCaches() {
  const keys = await caches.keys();
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key !== CACHENAME && key.indexOf(CACHEPREFIX) === 0) {
      await caches.delete(key);
    }
  }
}

self.addEventListener('install', event => event.waitUntil(cacheFiles()));

self.addEventListener('activate', event => event.waitUntil(clearOldCaches()));

self.addEventListener('message', event => event.data.action === 'skipWaiting' && self.skipWaiting());

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  let req = event.request;

  if (req.method !== 'GET' || url.hostname !== self.location.hostname) {
    event.respondWith(fetch(req));
    return;
  }

  const cacheFirst = async () => {
    let response = await caches.match(req);
    if (response) {
      return response;
    }

    if (req.mode === 'navigate' && url.pathname !== '/' && ROUTES.indexOf(url.pathname) !== -1) {
      const cache = await caches.open(CACHENAME);
      response = await cache.match('/');
      if (response) {
        // Remove link header
        const newHeaders = new Headers(response.headers);
        newHeaders.delete('Link');

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }
      return fetch(req);
    }

    response = await fetch(req);

    if (response.ok && response.type === 'basic' && WHITELIST.some(exp => exp.test(url.pathname))) {
      const cache = await caches.open(CACHENAME);
      cache.put(req, response.clone());
    }

    return response;
  };

  event.respondWith(cacheFirst());
});
