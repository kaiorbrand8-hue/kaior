// Minimal service worker: registered only to satisfy PWA installability
// (Chrome requires an active fetch handler for the install prompt). It does
// not cache anything, so it can never serve stale cart/order/product data.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
