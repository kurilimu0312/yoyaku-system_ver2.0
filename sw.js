const CACHE_NAME = 'cloudpro-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// アプリケーションをスマホに一時キャッシュする処理
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// スマホ画面に出た通知をタップした時、自動で管理画面を開く処理
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
            break;
          }
        }
        return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
