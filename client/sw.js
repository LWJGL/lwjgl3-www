var CACHEPREFIX = 'lwjgl-static-';
var CACHENAME = CACHEPREFIX + 'VERSION';
var FILES = [];
var ROUTES = [];
var WHITELIST = [/^\/(img|svg)\//];

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

  // network first, fall back to cache if we are offline
  if (ROUTES.indexOf(req.pathname) !== -1) {
    event.respondWith(
      fetch(event.request).catch(function() {
        if (req.pathname !== '/') {
          // Always use homepage cache for all other pages (since we have client-side routing)
          return caches.match(
            new Request('/', {
              method: event.request.method,
              headers: event.request.headers,
            })
          );
        }

        return caches.match(event.request);
      })
    );
    return;
  }

  // cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(event.request).then(function(response) {
        var shouldCache =
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
