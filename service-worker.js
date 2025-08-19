/* RÜYA ATLASI SW v5 - GitHub Pages alt dizin uyumlu */
const CACHE_VERSION = 'v5';
const STATIC_CACHE = `ruya-static-${CACHE_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css',
  './content/bolum-1.html',
  './content/bolum-2.html',
  './content/bolum-3.html',
  './content/sembol-dizini.html',
  './content/zaman-cizelgesi.html',
  './offline.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(STATIC_CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('ruya-static-') && k !== STATIC_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      if (new URL(req.url).origin === self.location.origin) {
        caches.open(STATIC_CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      return cached || caches.match('./offline.html');
    })
  );
});
const CACHE_VERSION='v6';
const STATIC_CACHE=`ruya-static-${CACHE_VERSION}`;
const ASSETS=[
  './','./index.html','./manifest.json','./assets/css/style.css',
  './content/ruyalar.html','./content/aktif-imgelem.html',
  './content/sembol-dizini.html','./content/zaman-cizelgesi.html',
  './assets/data/dreams.json','./assets/data/imagination.json','./offline.html'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ruya-static-')&&k!==STATIC_CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(res=>{
      const copy=res.clone();
      if(new URL(e.request.url).origin===self.location.origin){
        caches.open(STATIC_CACHE).then(c=>c.put(e.request,copy));
      }
      return res;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./offline.html')))
  );
});
