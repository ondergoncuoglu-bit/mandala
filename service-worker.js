self.addEventListener('install', e => {
  e.waitUntil(caches.open('v1').then(c => c.addAll([
    './index.html',
    './manifest.json',
    './assets/css/style.css',
    './content/bolum-1.html'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
