// Service Worker: speichert alle Dateien auf dem Handy, damit die App offline läuft.
// Strategie: MIT Internet immer die neueste Version laden (und speichern),
//            OHNE Internet die gespeicherte Version nutzen.
// Nach Änderungen VERSION hochzählen (und in index.html APP_VERSION gleich setzen).
const VERSION = "v8";
const FILES = [
  "./",
  "index.html",
  "words.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) =>
      // cache: "reload" -> am Browser-Cache vorbei direkt frisch von GitHub holen
      c.addAll(FILES.map((f) => new Request(f, { cache: "reload" })))
    )
  );
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
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
