const CACHEPREFIX = 'lwjgl-static-';
const CACHENAME = CACHEPREFIX + 'VERSION';
const FILES = [];
const ROUTES = [];
const WHITELIST = [/^\/(js|css|img|svg)\//];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHENAME).then(function(cache) {
      FILES.unshift(
        new Request('/', {
          method: 'GET',
          headers: {
            Accept: 'text/html',
          },
        })
      );
      return cache.addAll(FILES);
    })
  );
});

self.addEventListener('activate', function(event) {
  return event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(k) {
          if (k !== CACHENAME && k.indexOf(CACHEPREFIX) === 0) {
            return caches.delete(k);
          } else {
            return Promise.resolve();
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  const req = new URL(event.request.url);

  if (event.request.method === 'GET' && ROUTES.indexOf(req.pathname) !== -1 && req.pathname !== '/') {
    // Always use homepage cache for all other pages (since we have client-side routing)
    const rewriteReq = new Request('/', {
      method: event.request.method,
      headers: event.request.headers,
    });

    caches.match(rewriteReq).then(function(response) {
      return response || fetch(event.request);
    });
    return;
  }

  // ask cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(event.request).then(function(response) {
        const shouldCache =
          event.request.method === 'GET' &&
          response.ok &&
          response.type === 'basic' &&
          WHITELIST.some(function(exp) {
            return exp.test(req.pathname);
          });

        if (shouldCache) {
          return caches.open(CACHENAME).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        } else {
          return response;
        }
      });
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
