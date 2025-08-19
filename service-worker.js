/* Rüya Atlası SW – tek tanım, tek kayıt */
const SW_VERSION = 'v9';                // <<< sadece burayı artırırsın
const CACHE_NAME = `ruya-atlasi-${SW_VERSION}`;
const CORE_ASSETS = [
  '/',               // GitHub Pages root scope için
  '/mandala/',       // repo adı (senin yayındaki alt yol)
  '/mandala/index.html',
  '/mandala/atlas.html',
  '/mandala/content/sembol-dizini.html',
  '/mandala/content/zaman-cizelgesi.html',
  '/mandala/assets/css/style.css',
  '/mandala/manifest.json',
  '/mandala/offline.html',
  '/mandala/assets/data/dreams.json',
  '/mandala/assets/data/imagination.json'
];

// Install: çekirdek dosyaları önbelleğe al
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

// Activate: eski cache’leri temizle
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('ruya-atlasi-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// Fetch: JSON ve HTML’ye network-first; statik varlıklara cache-first
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // sadece kendi alanın
  if (url.origin !== self.location.origin) return;

  const isPage = req.destination === 'document' || req.headers.get('accept')?.includes('text/html');
  const isData = url.pathname.endsWith('.json');
  const isStatic = ['style', 'script', 'image', 'font'].includes(req.destination);

  if (isPage || isData) {
    // network-first
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || caches.match('/mandala/offline.html');
      }
    })());
    return;
  }

  if (isStatic) {
    // cache-first
    e.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, fresh.clone());
      return fresh;
    })());
  }
});
