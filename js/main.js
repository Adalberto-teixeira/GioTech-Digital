/**
 * GioTech Digital — main.js
 * Comportements globaux : en-tête au scroll, dock mobile, apparitions au scroll.
 * Aucune dépendance externe — JavaScript natif, léger et performant.
 */

(function () {
  "use strict";

  /* ---------- Header : fond au scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Apparitions au scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Cartes de templates : jouent leur animation d'entrée seulement au scroll (pas toutes au chargement) ---------- */
  const cardEls = document.querySelectorAll(".template-card");
  if (cardEls.length && "IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    cardEls.forEach((el) => cardObserver.observe(el));
  } else {
    cardEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Lien actif (nav desktop + dock mobile) selon la section visible ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinkGroups = [
    document.querySelectorAll(".main-nav a[href^='#']"),
    document.querySelectorAll(".mobile-dock a[href^='#']"),
  ];

  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinkGroups.forEach((group) => {
            group.forEach((link) => {
              const match = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("is-active", match);
            });
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Marquee : dupliquer le contenu pour une boucle infinie fluide ---------- */
  document.querySelectorAll(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Filtres de catégories (pills) — home + catalogue ---------- */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const grid = document.querySelector(group.dataset.filterGroup);
    const empty = group.dataset.emptyTarget ? document.querySelector(group.dataset.emptyTarget) : null;
    if (!grid) return;
    const cards = grid.querySelectorAll("[data-category]");

    group.querySelectorAll(".pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        group.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");
        const filter = pill.dataset.filter;
        let visible = 0;
        cards.forEach((card) => {
          const cats = (card.dataset.category || "").split(" ");
          const show = filter === "tous" || cats.includes(filter);
          card.style.display = show ? "" : "none";
          if (show) visible++;
        });
        if (empty) empty.style.display = visible === 0 ? "block" : "none";
      });
    });
  });

  /* ---------- Menu déroulant mobile : relaie le choix vers les pastilles existantes (aucune logique dupliquée) ---------- */
  const mobileCategorySelect = document.getElementById("mobile-category-select");
  if (mobileCategorySelect) {
    mobileCategorySelect.addEventListener("change", () => {
      const target = mobileCategorySelect.dataset.mirrors;
      const group = document.querySelector(`[data-filter-group="${target}"]`);
      const pill = group?.querySelector(`.pill[data-filter="${mobileCategorySelect.value}"]`);
      if (pill) pill.click();
    });
  }

  /* ---------- Année courante dans le footer ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Micro-interactions premium : uniquement souris + sans réduction de mouvement ---------- */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canHover && !reduceMotion) {
    /* ----- Boutons magnétiques : suivent légèrement le curseur ----- */
    document.querySelectorAll(".btn-primary, .btn-outline, .btn-accent, .btn-gradient, .btn-ghost").forEach((btn) => {
      const strength = 0.28;
      const maxShift = 7;
      let raf = null;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const shiftX = Math.max(-maxShift, Math.min(maxShift, x * strength));
        const shiftY = Math.max(-maxShift, Math.min(maxShift, y * strength));
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        });
      });

      btn.addEventListener("mouseleave", () => {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
        btn.style.transform = "";
        setTimeout(() => { btn.style.transition = ""; }, 400);
      });
    });

    /* ----- Inclinaison 3D légère au survol : cartes de catégories, valeurs, fonctionnalités ----- */
    const tiltSelector = ".category-card, .value-card, .feature-card, .why-card, .step-card";
    document.querySelectorAll(tiltSelector).forEach((card) => {
      let raf = null;
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = px * 6;
        const rotateX = py * -6;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });
      });

      card.addEventListener("mouseleave", () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = "";
        setTimeout(() => { card.style.transition = ""; }, 500);
      });
    });
  }

  /* ---------- Bandeau d'information (stockage local) ---------- */
  if (!localStorage.getItem("giotech-cookie-notice-dismissed")) {
    const banner = document.createElement("div");
    banner.className = "cookie-notice";
    banner.innerHTML =
      '<p>Ce site n\'utilise pas de cookies publicitaires. Les outils gratuits (CV, lettre, devis, signature) sauvegardent votre progression uniquement dans votre navigateur — rien n\'est envoyé à nos serveurs. <a href="confidentialite.html">En savoir plus</a></p>' +
      '<button type="button" class="cookie-notice-close">J\'ai compris</button>';
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("is-shown"));
    banner.querySelector(".cookie-notice-close").addEventListener("click", () => {
      banner.classList.remove("is-shown");
      setTimeout(() => banner.remove(), 400);
      localStorage.setItem("giotech-cookie-notice-dismissed", "1");
    });
  }

  /* ---------- Hero cinématique : parallaxe des cartes flottantes au mouvement de la souris ---------- */
  const heroSection = document.querySelector(".hero");
  const mockups = document.querySelectorAll(".mockup-card");
  if (canHover && !reduceMotion && heroSection && mockups.length) {
    const depths = [18, 30, 42];
    let rafHero = null;

    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (rafHero) cancelAnimationFrame(rafHero);
      rafHero = requestAnimationFrame(() => {
        mockups.forEach((card, i) => {
          const depth = depths[i] || 24;
          const baseRotate = getComputedStyle(card).getPropertyValue("--r") || "0deg";
          card.style.transform = `translate(${px * depth}px, ${py * depth}px) rotate(${baseRotate})`;
        });
      });
    });

    heroSection.addEventListener("mouseleave", () => {
      if (rafHero) cancelAnimationFrame(rafHero);
      mockups.forEach((card) => {
        card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = "";
        setTimeout(() => { card.style.transition = ""; }, 600);
      });
    });
  }
})();

/* GioTech catalogue search + Premium/Free filters */
(() => {
  const grid=document.querySelector('#catalog-grid');
  if(!grid) return;
  const search=document.querySelector('#template-search');
  const licenseBtns=[...document.querySelectorAll('[data-license]')];
  const count=document.querySelector('#template-count');
  let license='all';

  // Dictionnaire de synonymes : permet à la recherche de comprendre les termes
  // proches (BTP ↔ bâtiment ↔ construction) sans que le visiteur tape le mot exact.
  const SYNONYMS={
    'btp':['bâtiment','batiment','construction','travaux','chantier','rénovation','renovation'],
    'construction':['btp','bâtiment','batiment','travaux','chantier','maçon','macon'],
    'bâtiment':['btp','construction','travaux','chantier'],
    'batiment':['btp','construction','travaux','chantier'],
    'rénovation':['renovation','travaux','btp','construction'],
    'renovation':['rénovation','travaux','btp','construction'],
    'restaurant':['resto','restauration','cuisine','food','gastronomie'],
    'resto':['restaurant','restauration','cuisine'],
    'boutique':['e-commerce','ecommerce','shop','commerce','vente','magasin'],
    'e-commerce':['boutique','ecommerce','shop','commerce','vente en ligne'],
    'ecommerce':['boutique','e-commerce','shop','commerce'],
    'commerce':['boutique','e-commerce','ecommerce','shop','vente'],
    'cv':['resume','curriculum','candidature','recrutement'],
    'immobilier':['immo','agence immobilière','logement','appartement','maison','bien'],
    'immo':['immobilier','logement','appartement'],
    'avocat':['juridique','droit','legal','légal','cabinet'],
    'juridique':['avocat','droit','legal','légal'],
    'coiffeur':['beauté','beaute','salon','coiffure','esthétique','esthetique'],
    'beaute':['coiffeur','beauté','salon','esthétique','esthetique','ongulaire','nail'],
    'beauté':['coiffeur','beaute','salon','esthétique','esthetique','ongulaire','nail'],
    'sport':['fitness','coach','athlétisme','athletisme','course','running','entraînement','entrainement'],
    'running':['course','sport','marathon','athlétisme','athletisme'],
    'hotel':['hébergement','hebergement','séjour','sejour','logement','resort'],
    'hôtel':['hebergement','hébergement','séjour','sejour','logement','resort'],
    'mariage':['wedding','noces'],
    'formation':['cours','academy','école','ecole','apprentissage','elearning','e-learning'],
    'blog':['magazine','journal','article','actualités','actualites','presse'],
    'mobile':['app','application','smartphone','téléphone','telephone'],
    'gratuit':['free','libre','offert'],
    'facture':['devis','invoice','comptabilité','comptabilite'],
    'devis':['facture','invoice','estimation'],
    'portfolio':['créatif','creatif','artiste','galerie'],
    'ia':['intelligence artificielle','ai','robot'],
    'association':['associatif','ong','solidaire','caritatif'],
    'associatif':['association','ong','solidaire','caritatif'],
  };
  function expandTerms(q){
    const terms=new Set([q]);
    Object.keys(SYNONYMS).forEach(key=>{
      if(key.includes(q)||q.includes(key)){
        terms.add(key);
        SYNONYMS[key].forEach(s=>terms.add(s));
      }
    });
    return [...terms];
  }

  const apply=()=>{
    const q=(search?.value||'').trim().toLowerCase();
    const terms=q?expandTerms(q):[];
    let n=0;
    grid.querySelectorAll('.template-card').forEach(card=>{
      const text=(card.dataset.search||card.textContent||'').toLowerCase();
      const type=card.dataset.type||'premium';
      const okText=!q||terms.some(t=>text.includes(t));
      const okType=license==='all'||type===license;
      const categoryVisible=!card.dataset.filterHidden;
      const show=okText&&okType&&categoryVisible;
      card.classList.toggle('is-hidden',!show);
      if(show)n++;
    });
    if(count) count.textContent=n;
  };
  search?.addEventListener('input',apply);
  licenseBtns.forEach(btn=>btn.addEventListener('click',()=>{
    license=btn.dataset.license;
    licenseBtns.forEach(b=>b.classList.toggle('active',b===btn));
    apply();
  }));
  // Observe class/style changes caused by existing category filter and refresh count.
  new MutationObserver(()=>apply()).observe(grid,{subtree:true,attributes:true,attributeFilter:['style']});
  apply();
})();

// Marketplace query parameter -> catalogue search
function applyMarketplaceQuery() {
  const field = document.querySelector('#template-search');
  const q = new URLSearchParams(location.search).get('q');
  if (!field || !q) return;

  field.value = q;
  field.dispatchEvent(new Event('input', { bubbles: true }));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyMarketplaceQuery, { once: true });
} else {
  applyMarketplaceQuery();
}

// Some browsers restore form values after DOMContentLoaded. Reapply the URL state
// on pageshow so the visible query always matches the filtered catalogue.
window.addEventListener('pageshow', () => {
  applyMarketplaceQuery();
  window.setTimeout(applyMarketplaceQuery, 200);
});

/* ---------- Aperçus en direct : mise à l'échelle dynamique (couvre toujours toute la zone, quelle que soit la taille de la carte) ---------- */
(() => {
  const NATIVE_W = 1280, NATIVE_H = 860;

  function fitLivePreviews() {
    document.querySelectorAll('.live-preview-shell').forEach((shell) => {
      const frame = shell.querySelector('.template-live-frame');
      if (!frame) return;
      const chromeEl = shell.querySelector('.preview-chrome');
      const chromeH = chromeEl ? chromeEl.offsetHeight : 26;
      const availW = shell.clientWidth;
      const availH = shell.clientHeight - chromeH;
      if (availW <= 0 || availH <= 0) return;
      const scale = Math.max(availW / NATIVE_W, availH / NATIVE_H);
      shell.style.setProperty('--live-scale', scale.toFixed(4));
      frame.style.top = chromeH + 'px';
    });
  }

  window.addEventListener('load', fitLivePreviews);
  window.addEventListener('resize', fitLivePreviews);
  document.addEventListener('DOMContentLoaded', fitLivePreviews);

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => fitLivePreviews());
    document.querySelectorAll('.live-preview-shell').forEach((el) => ro.observe(el));
  }

  // Les filtres de catégorie/recherche peuvent révéler des cartes après coup :
  // on relance un calcul à chaque changement de mise en page du catalogue.
  const grid = document.querySelector('#catalog-grid, .template-scroller');
  if (grid && window.MutationObserver) {
    new MutationObserver(() => fitLivePreviews()).observe(grid, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }
})();
