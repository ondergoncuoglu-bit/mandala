/* ====== RÜYA ATLASI — SERVICE WORKER ======
   Basit + güvenli önbellekleme, offline fallback, sürümleme
   -------------------------------------------- */
const CACHE_VERSION = 'v3';
const STATIC_CACHE = `ruya-static-${CACHE_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css',
  './content/bolum-1.html',
  './assets/icons/mandala-icon.svg',    // varsa
  './assets/icons/book-icon.svg',        // varsa
  './offline.html'
];

// 1) Kurulum: gerekli dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(ASSETS))
  );
  // Yeni SW’nin beklemeden aktif olmasını istersen:
  self.skipWaiting();
});

// 2) Aktivasyon: eski cache’leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys
        .filter((k) => k.startsWith('ruya-static-') && k !== STATIC_CACHE)
        .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 3) Fetch: önce ağ, olmazsa cache; son çare offline.html
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Yalnızca GET isteklerini ele al
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Başarılıysa kopyasını dinamik olarak cache’e koy (same-origin ise)
        const copy = res.clone();
        if (new URL(req.url).origin === self.location.origin) {
          caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(async () => {
        // Ağ yoksa: önce cache, o da yoksa offline.html
        const cached = await caches.match(req, { ignoreSearch: true });
        return cached || caches.match('./offline.html');
      })
  );
});

// 4) İsteğe bağlı: mesajla cache versiyonunu yenilemek için
self.addEventListener('message', (event) => {
  if (event.data === 'force-update') {
    self.skipWaiting();
  }
});
