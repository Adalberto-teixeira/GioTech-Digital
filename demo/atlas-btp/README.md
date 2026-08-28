# ATLAS BTP — HTML / CSS / JavaScript

Version 100% front-end, sans React, sans Next.js, sans Tailwind.

## Fichiers
- index.html
- assets/css/style.css
- assets/js/main.js

## Librairies CDN
- GSAP
- ScrollTrigger
- Lenis

## Fonctionnalités
- Header responsive
- Menu mobile
- Hero parallax multi-couches
- Smooth scroll Lenis
- Reveals GSAP
- Images parallax
- Marquee
- Compteurs animés
- Services
- Projets
- Méthode
- Témoignage
- Formulaire de devis démo
- Footer
- Responsive mobile/tablette/desktop
- prefers-reduced-motion

## Utilisation
Ouvrir simplement `index.html`.

Pour un déploiement réel, envoyer tous les fichiers vers GitHub Pages, Cloudflare Pages, Vercel ou n'importe quel hébergement statique.

Créé comme template de démonstration GioTech Digital.


## Optimisation V2

Pour améliorer la fluidité du scroll :
- parallax fortement allégé
- Lenis désactivé sur téléphone
- parallax images désactivé sur tablette/mobile
- `scrub` plus léger
- moins de filtres/backdrop-blur sur mobile
- `content-visibility` pour les sections hors écran
- `will-change` uniquement sur les éléments réellement animés
- animations reveal plus courtes
- ScrollTrigger configuré pour limiter les callbacks
