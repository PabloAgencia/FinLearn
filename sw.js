/* ══════════════════════════════════════════════════════════════════
   FinLearn — Service Worker v2.0
   Estrategia: Network First para HTML/JS/CSS (siempre buscar nueva
   versión), Cache First para fuentes y assets binarios.
   ══════════════════════════════════════════════════════════════════ */

const CACHE_NAME  = 'finlearn-v2.2.0';
const OFFLINE_URL = 'index.html';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isAnthropic = url.hostname.includes('anthropic.com');
  const isAppFile   = url.origin === self.location.origin &&
                      (url.pathname.endsWith('.js')   ||
                       url.pathname.endsWith('.css')  ||
                       url.pathname.endsWith('.html') ||
                       url.pathname === '/' ||
                       event.request.mode === 'navigate');
  const isFont      = url.hostname.includes('fonts.googleapis.com') ||
                      url.hostname.includes('fonts.gstatic.com');

  // APIs externas → siempre red, sin cache
  if (isAnthropic) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }),
          { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  // Archivos de la app (HTML/JS/CSS) → Network First
  if (isAppFile) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(event.request).then(c =>
          c || (event.request.mode === 'navigate'
            ? caches.match(OFFLINE_URL)
            : new Response('', { status: 408 }))
        )
      )
    );
    return;
  }

  // Fuentes y todo lo demás → Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => new Response('', { status: 408 }));
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', event => {
  let data = { title: '🔥 FinLearn', body: 'Tu racha te espera. ¡1 minuto es suficiente!', tag: 'streak' };
  if (event.data) {
    try { data = { ...data, ...JSON.parse(event.data.text()) }; } catch(e) {}
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    './icons/icon-192.png',
      badge:   './icons/icon-96.png',
      tag:     data.tag || 'finlearn',
      vibrate: [100, 50, 100],
      data:    { url: data.url || './' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(self.location.origin) && 'focus' in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
