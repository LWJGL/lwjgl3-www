//@ts-check
/// <reference lib="webworker" />

const CACHE_PREFIX = 'lwjgl-static-';
const CACHE_NAME = CACHE_PREFIX + 'VERSION';
const WHITELIST_RE = [/\.(js|css|json|jpg|png|gif|svg|ico)$/];
const manifest = {};

function getDepsForRoute(pathname) {
  const routes = manifest.routes;

  if (pathname === '/') {
    return routes.home;
  } else {
    const parts = pathname.split('/');
    if (routes[parts[1]] !== undefined) {
      return routes[parts[1]];
    }
  }

  return null;
}

async function cacheFirstStrategy(event, req, url) {
  const cache = await caches.open(CACHE_NAME);

  // If response already in cache, serve it directly
  let response = await cache.match(req);
  if (response) {
    return response;
  }

  // Handle navigation preload
  response = await event.preloadResponse;
  if (response) {
    return response;
  }

  // All routes should serve '/' HTML.
  if (req.mode === 'navigate' && url.pathname !== '/' && manifest.routes[url.pathname] !== undefined) {
    response = await cache.match('/');
    if (response) {
      // Delete home's Link header
      const headers = new Headers(response.headers);
      headers.delete('Link');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
  }

  // Fetch & cache
  response = await fetch(req);

  if (response.ok && response.type === 'basic' && WHITELIST_RE.some(exp => exp.test(url.pathname))) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, response.clone());
  }

  return response;
}

async function install() {
  const files = ['/', `/js/${manifest.assets[manifest.entry]}`, `/css/${manifest.assets.css}`, '/manifest.webmanifest'];

  // Append route dependencies
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (let i = 0; i < clients.length; i += 1) {
    let client = clients[i];
    if (!client.url) {
      break;
    }
    let deps = getDepsForRoute(new URL(client.url).pathname);
    if (deps !== null) {
      files.push.apply(files, deps.map(id => `/js/${manifest.assets[id]}`));
    }
  }

  const cache = await caches.open(CACHE_NAME);
  return await cache.addAll(files);
}

self.addEventListener('install', event => event.waitUntil(install()));

async function activate() {
  // Enable navigation preloads, if supported
  // https://developers.google.com/web/updates/2017/02/navigation-preload
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }

  // Delete old caches
  const keys = await caches.keys();
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key !== CACHE_NAME && key.indexOf(CACHE_PREFIX) === 0) {
      await caches.delete(key);
    }
  }
}

self.addEventListener('activate', event => event.waitUntil(activate()));

function onMessage(event) {
  switch (event.data.action) {
    case 'skipWaiting':
      self.skipWaiting();
      break;
  }
}

self.addEventListener('message', onMessage);

function onFetch(event) {
  const url = new URL(event.request.url);
  const req = event.request;
  event.respondWith(
    req.method !== 'GET' || url.hostname !== self.location.hostname ? fetch(req) : cacheFirstStrategy(event, req, url)
  );
}

self.addEventListener('fetch', onFetch);
