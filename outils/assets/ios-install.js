/**
 * Bandeau d'installation spécifique iOS/Safari.
 *
 * Safari sur iOS ne déclenche jamais "beforeinstallprompt" — il n'existe
 * aucune installation automatique possible. La seule solution est
 * d'expliquer le geste manuel : Partager → « Sur l'écran d'accueil ».
 * Ce script détecte ce cas précis et affiche un bandeau discret, une
 * seule fois (mémorisé via localStorage), uniquement si l'app n'est pas
 * déjà installée.
 */
(function () {
  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }
  function isInStandaloneMode() {
    return (
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches
    );
  }

  if (!isIos() || isInStandaloneMode()) return;
  if (localStorage.getItem("giotools-ios-install-dismissed")) return;

  var banner = document.createElement("div");
  banner.className = "ios-install-banner";
  banner.innerHTML =
    '<div class="ios-install-icon">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>' +
    "</div>" +
    '<p>Installez GioTools : appuyez sur <strong>Partager</strong> puis <strong>« Sur l\'écran d\'accueil »</strong>.</p>' +
    '<button type="button" class="ios-install-close" aria-label="Fermer">✕</button>';

  document.body.appendChild(banner);
  requestAnimationFrame(function () {
    banner.classList.add("is-shown");
    // Le header (fixe, tout en haut) ne doit pas être caché derrière le bandeau :
    // on le pousse vers le bas exactement de la hauteur du bandeau.
    var bannerHeight = banner.getBoundingClientRect().height;
    var header = document.querySelector(".toolsuite-header, .site-header");
    if (header) {
      header.style.top = bannerHeight + "px";
      header.style.transition = "top 0.35s ease";
    }
    document.body.style.setProperty("--ios-banner-offset", bannerHeight + "px");
    document.body.classList.add("has-ios-banner");
  });

  function closeBanner() {
    banner.classList.remove("is-shown");
    var header = document.querySelector(".toolsuite-header, .site-header");
    if (header) header.style.top = "0px";
    document.body.classList.remove("has-ios-banner");
    setTimeout(function () {
      banner.remove();
    }, 300);
    localStorage.setItem("giotools-ios-install-dismissed", "1");
  }

  banner.querySelector(".ios-install-close").addEventListener("click", closeBanner);
})();
