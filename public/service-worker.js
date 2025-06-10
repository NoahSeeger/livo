self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // You can add caching strategies here for offline support
  // For now, this just passes through network requests.
  event.respondWith(fetch(event.request));
});
