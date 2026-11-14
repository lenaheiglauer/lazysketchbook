// Service Worker: speichert alle Dateien auf dem Handy, damit die App offline läuft.
// Wenn du words.js änderst: VERSION hochzählen (v2, v3, ...), damit das Handy die neue Liste lädt.
const VERSION = "v6";
const FILES = [
  "./",
  "index.html",
  "words.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "fonts/caveat-latin.woff2",
  "fonts/caveat-latin-ext.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
