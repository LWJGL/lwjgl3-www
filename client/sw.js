const CACHEPREFIX = 'lwjgl-static-';
const CACHENAME = CACHEPREFIX + 'VERSION';
const FILES = [];
const ROUTES = [];
const WHITELIST = [/^\/(js|css|img|svg)\//];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHENAME).then(function(cache) {
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
  const url = new URL(event.request.url);
  let req = event.request;

  if (req.method !== 'GET' || url.hostname.indexOf('.lwjgl.') === -1) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    caches.match(req).then(function(response) {
      if (response) {
        return response;
      }

      if (req.mode === 'navigate' && url.pathname !== '/' && ROUTES.indexOf(url.pathname) !== -1) {
        return caches
          .open(CACHENAME)
          .then(function(cache) {
            return cache.match('/');
          })
          .then(function(result) {
            if (result === undefined) {
              return fetch(req);
            }
            return result;
          });
      }

      return fetch(req).then(function(response) {
        const shouldCache =
          response.ok &&
          response.type === 'basic' &&
          WHITELIST.some(function(exp) {
            return exp.test(url.pathname);
          });

        if (shouldCache) {
          return caches.open(CACHENAME).then(function(cache) {
            cache.put(req, response.clone());
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
