/* Héritage Musulman — Service Worker
   Strategy:
   - HTML / navigations : network-first (toujours dernière version, fallback cache hors-ligne)
   - Static (js/css/img/svg/avif/mp4) : stale-while-revalidate
   - questions.json : stale-while-revalidate
   - API (/api/*) : jamais mis en cache (réseau direct)
*/
const VERSION = "v1.0.0";
const SHELL_CACHE = "hm-shell-" + VERSION;
const ASSET_CACHE = "hm-assets-" + VERSION;

// Coquille minimale pré-cachée pour le mode hors-ligne
const SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/uploads/logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return /\.(?:js|css|png|jpg|jpeg|webp|avif|svg|gif|woff2?|ttf|mp4|mp3|ico)$/i.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Ne touche pas aux autres origines (CDN React/Babel, API Quran, Stripe, Firebase...)
  if (url.origin !== self.location.origin) return;

  // API : toujours réseau, jamais cache
  if (url.pathname.startsWith("/api/")) return;

  // Navigations / HTML : network-first
  const isHTML =
    req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((m) => m || caches.match("/index.html"))
        )
    );
    return;
  }

  // questions.json + static : stale-while-revalidate
  if (isStaticAsset(url) || url.pathname === "/questions.json") {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req)
            .then((res) => {
              if (res && res.status === 200) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }
});

/* ── Push notifications ── */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Héritage Musulman", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Héritage Musulman";
  const options = {
    body: data.body || "",
    icon: "/uploads/logo.png",
    badge: "/uploads/logo.png",
    data: { url: data.url || "/" },
    vibrate: [80, 40, 80],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(target) && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
