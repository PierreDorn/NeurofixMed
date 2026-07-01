/* NeuroFix Med — Service Worker de notificações
 * Registrado pelo NotificationsBootstrap. Mantém-se leve:
 * - exibe notificações enviadas via postMessage
 * - lida com click → foca/abre a aba
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Permite que a página dispare notificações através do SW (mantém vivo em background curto)
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'show-notification') return;
  const { title, options } = data;
  event.waitUntil(self.registration.showNotification(title, options || {}));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/agenda';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      if (client.url.includes(url)) { client.focus(); return; }
    }
    if (self.clients.openWindow) await self.clients.openWindow(url);
  })());
});
