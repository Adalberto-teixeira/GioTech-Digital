/**
 * Service worker — GioTech Outils (PWA)
 *
 * IMPORTANT : ce service worker ne s'occupe QUE des pages sous /outils
 * (outils.html + outils/*). Le reste du site (accueil, catalogue, démos…)
 * n'est jamais intercepté ni mis en cache — il continue de fonctionner
 * exactement comme avant, sans aucun effet de ce fichier.
 */

const CACHE_NAME = "giotech-outils-v2";

const APP_SHELL = [
  "/outils",
  "/outils/cv/",
  "/outils/cv/assets/css/style.css",
  "/outils/cv/assets/js/main.js",
  "/outils/lettre-motivation/",
  "/outils/lettre-motivation/assets/css/style.css",
  "/outils/lettre-motivation/assets/js/main.js",
  "/outils/devis-factures/",
  "/outils/devis-factures/assets/css/style.css",
  "/outils/devis-factures/assets/js/main.js",
  "/outils/signature-email/",
  "/outils/signature-email/assets/css/style.css",
  "/outils/signature-email/assets/js/main.js",
  "/outils/qr-code/",
  "/outils/qr-code/assets/css/style.css",
  "/outils/qr-code/assets/js/main.js",
  "/manifest.json",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // On tente de tout pré-charger, mais une seule ressource manquante
      // (ex. connexion coupée pendant l'installation) ne doit pas bloquer
      // l'installation entière.
      Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

function isOutilsRequest(url) {
  const path = new URL(url).pathname;
  return path === "/outils" || path === "/outils.html" || path === "/outils/" || path.startsWith("/outils/");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // On ne touche à rien d'autre que les pages/ressources des Outils :
  // ni le reste du site, ni les requêtes vers d'autres domaines (CDN
  // GSAP, html2canvas, jsPDF, Google Fonts…) qui doivent toujours
  // passer normalement par le réseau.
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin || !isOutilsRequest(req.url)) {
    return;
  }

  // Réseau d'abord (pour ne jamais servir une version périmée d'un outil
  // tant que la connexion fonctionne), avec repli sur le cache hors-ligne.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("/outils")))
  );
});
