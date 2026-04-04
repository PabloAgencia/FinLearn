/* ══════════════════════════════════════════════════════════════════
   FinLearn — Service Worker v1.0
   Estrategia: Cache First para assets estáticos, Network First para API
   ══════════════════════════════════════════════════════════════════ */

const CACHE_NAME    = 'finlearn-v1.11.0';
const OFFLINE_URL   = 'index.html';

// Assets que se cachean en la instalación
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './app-data.js',
  './app-state.js',
  './app-ui.js',
  './app-game.js',
  './app-tools.js',
  './app-extras.js',
  './app.css',
  './app-extra.css',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap',
];

// ── INSTALL: precachear todos los assets ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar caches viejos ──────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: Cache First para assets, Network First para API ────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Peticiones a APIs externas (Anthropic, etc.) → siempre red
  if (url.hostname.includes('anthropic.com') ||
      url.hostname.includes('googleapis.com') && url.pathname.includes('fonts') === false) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Google Fonts → cache con fallback
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return response;
        }).catch(() => cached || new Response('', { status: 408 }))
      )
    );
    return;
  }

  // Todo lo demás (assets locales) → Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Solo cachear respuestas válidas
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return response;
      }).catch(() => {
        // Si es navegación y estamos offline → servir index.html cacheado
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        return new Response('', { status: 408 });
      });
    })
  );
});

// ── MESSAGE: forzar actualización desde la app ───────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
