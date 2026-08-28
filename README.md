# GioTech Digital — Site officiel

Site vitrine de l'agence GioTech Digital : présentation de l'agence, catalogue de templates HTML/CSS/JS, portfolio de projets et espace de démonstration.

Construit en **HTML5 / CSS3 / JavaScript natif**, sans framework lourd, pour rester rapide et facilement hébergeable sur **Cloudflare Pages**.

## Structure du projet

```
giotech-digital/
│
├── index.html            # Page d'accueil (terminée)
├── contact.html           # Page de contact dédiée (terminée) — devis + WhatsApp
├── templates.html         # Catalogue complet (terminé) — 14 catégories, filtres fonctionnels
├── projets.html            # Portfolio de projets réels (terminé)
│
├── demo/
│   ├── structura/           # BTP / construction — palette chantier (crème, anthracite, orange)
│   ├── savoria/              # Restaurant — palette sombre élégante, serif Fraunces
│   ├── foncia-lite/          # Immobilier — marine + or, barre de recherche
│   ├── atelier/               # Portfolio créatif — minimaliste, typographie massive, accent lime
│   ├── encre/                 # Application de réservation (studio de tatouage) — vraie app cliquable dans le téléphone, animée avec GSAP
│   │   ├── index.html
│   │   └── style.css
│   ├── pristine/               # Services de nettoyage — palette fraîche bleu ciel/menthe, animations et compteurs
│   │   ├── index.html
│   │   └── style.css
│   ├── aurora/                 # Hôtel & réservation — palette vert profond/or, recherche de séjour, animé avec GSAP
│   │   ├── index.html
│   │   └── style.css
│   ├── nextech/                # Technologie / SaaS — fond sombre, particules animées en canvas natif, animé avec GSAP
│   │   ├── index.html
│   │   └── style.css
│   ├── cortex/                  # Portfolio personnel style IA — conversation cliquable, GSAP SplitText + ScrambleText + TextPlugin
│   │   ├── index.html
│   │   └── style.css
│   ├── horizon/                 # Entreprise / conseil — indigo + ambre, sobre et institutionnel
│   │   ├── index.html
│   │   └── style.css
│   ├── festiva/                 # Festival / événementiel — dégradés magenta/violet/jaune, compte à rebours réel, programme cliquable
│   │   ├── index.html
│   │   └── style.css
│   ├── elan-solidaire/          # Association / ONG — terracotta + crème, calculateur d'impact de don interactif
│   │   ├── index.html
│   │   └── style.css
│   ├── les-deux-oui/            # Mariage — rose poudré + sauge, compte à rebours réel, RSVP fonctionnel
│   │   ├── index.html
│   │   └── style.css
│   ├── voltra/                   # Commerce / électronique — panier fonctionnel, rendus de produits réalistes (téléphones, PC, composants)
│   │   ├── index.html
│   │   └── style.css
│   └── landing-express/          # Pages spécialisées — 404, "bientôt en ligne", merci, maintenance, sélecteur d'onglets interactif
│       ├── index.html
│       └── style.css
│       ├── index.html
│       └── style.css
│
├── css/
│   ├── style.css           # Design tokens (couleurs, typographies) + styles de base
│   ├── components.css      # Composants réutilisables (cartes, formulaires, badges)
│   └── responsive.css      # Media queries (tablette / mobile) + dock mobile
│
├── js/
│   └── main.js              # Header au scroll, dock mobile, apparitions au scroll
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/               # Logo GioTech Digital
│
├── robots.txt
├── sitemap.xml
└── README.md
```

## Identité visuelle — site principal

| Rôle | Valeur |
|---|---|
| Fond | `#FFFFFF` / alt `#F4F6F8` |
| Accent cyan (texte) | `#0891A8` |
| Accent cyan (décoratif) | `#17D3EE` |
| Accent bleu | `#3E6FEA` |
| Texte | `#10151F` |
| Texte secondaire | `#545D6C` |
| Titres | Space Grotesk |
| Texte courant | Inter |
| Libellés / mono | JetBrains Mono |

Chaque démo (dans `/demo/`) a sa **propre identité visuelle**, volontairement différente du site principal — pour se sentir comme un vrai site client, pas comme une sous-page agence. Structura utilise par exemple une palette chantier (crème, anthracite, orange) et Barlow Condensed en titre.

## Avancement

- [x] **Étape 1** — Structure générale du projet + design de la page d'accueil (thème clair, orienté templates &amp; démos)
- [x] **15 démos fonctionnelles + 2 "bientôt disponible"** : Structura, Savoria, Foncia Lite, Atelier, Encre, Pristine, Aurora, NexTech, Cortex, Horizon, Festiva, Élan Solidaire, Les Deux Oui, Voltra, Landing Express — et en préparation : Le Mag (Blog), Académie (Formation)
- [x] **`contact.html`** — formulaire de devis + coordonnées réelles (email, téléphone, WhatsApp, réseaux sociaux)
- [x] **`templates.html`** — catalogue complet, 19 catégories, filtres fonctionnels, 15 templates réels + 2 "bientôt disponible"
- [x] **8 démos mises en avant sur la page d'accueil** (Structura, Savoria, Foncia Lite, Aurora, Voltra, Cortex, NexTech, Encre)
- [x] **`demos.html`** — page dédiée aux 15 démos réelles et cliquables, distincte du catalogue de templates, avec explication claire de la différence entre les deux
- [x] **Landing Express étendu à 13 pages** — 404, bientôt en ligne, merci, maintenance, link-in-bio, landing entreprise, événement, page produit, menu digital, contact pro, CV simple, artiste, mariage — toutes dans un seul fichier interactif à onglets
- [x] **Premier template 100% gratuit et téléchargeable** — Landing Express est disponible en `.zip` (12 Ko, `assets/downloads/landing-express-gratuit.zip`), sans alourdir le chargement du site puisqu'il n'est récupéré qu'au clic. Visible dans la catégorie "Templates gratuits" sur la page d'accueil et badgé "Gratuit" dans le catalogue
- [x] **Panier e-commerce fonctionnel** — démo Voltra : ajout/suppression/quantités, sous-total en temps réel, tiroir latéral animé, rendus de produits réalistes en SVG (aucune photo, pour rester 100% original et sans risque de droits)
- [x] **Application mobile réellement interactive** — démo Encre : onglets cliquables, sélection de créneau, confirmation de réservation, portfolio — tout fonctionne à la souris/au tactile, aucune vidéo
- [x] **Portfolio style IA entièrement cliquable** — démo Cortex : conversation par chips, réponses "tapées" en direct (GSAP TextPlugin), titre révélé lettre par lettre (SplitText), séquence de démarrage façon terminal (ScrambleTextPlugin)
- [x] **Animations GSAP** — [GSAP](https://gsap.com) (+ ScrollTrigger, SplitText, ScrambleTextPlugin, TextPlugin — tous gratuits depuis le rachat par Webflow) via CDN sur toutes les démos ; repli léger en CSS/JS natif si la librairie ne charge pas
- [x] **Fond de particules animées** — démo NexTech, en canvas natif (aucune librairie), effet "constellation"
- [x] **`projets.html`** — portfolio de projets réels : Gio Smart Services et Adalberto.fr (en ligne, cliquables), Mr Pronto et Marina Bay (en développement, honnêtement indiqués)
- [x] **`apropos.html`** — page dédiée avec parcours réel (2021—2026), valeurs, stack technique
- [x] **`mentions-legales.html`** &amp; **`confidentialite.html`** — pages légales réelles (informations manquantes comme le SIRET clairement indiquées "à compléter", jamais inventées)
- [x] **Rodapé unifié** sur les 8 pages principales, avec icônes animées (email, téléphone, WhatsApp, localisation)
- [x] **20 templates no catálogo, 6 gratuitos para download** (.zip) — Landing Express, Nexus Journal, Nova AI Institute, Martigues Running Festival, Nova Personal Portfolio, Lumea Clean
- [x] **Pré-visualizações em iframe ao vivo** — cada cartão mostra o site real em miniatura (não um ícone abstrato), com barra de navegador falsa e URL fictício; `loading="lazy"` para não pesar no carregamento
- [x] **Bug corrigido**: a grelha de cartões ficava presa em `opacity:0` em mobile quando muito alta (o limite de 15% do IntersectionObserver nunca era atingido) — corrigido globalmente no `main.js`
- [ ] Préparation GitHub + déploiement Cloudflare Pages

## Note sur les templates fournis par le client

Le client a fourni plusieurs templates ThemeForest achetés (nettoyage, réservation d'hôtel, portfolio, app mobile, etc.) comme inspiration. Pour rester dans les règles de licence (pas de réutilisation de code commercial), seuls les **noms de produits ont été utilisés comme référence de genre** — tout le code des démos GioTech (Structura, Savoria, Foncia Lite, Atelier, Encre, Pristine, Aurora, NexTech, Cortex, Horizon, Festiva, Élan Solidaire, Les Deux Oui, Voltra, Landing Express) est écrit intégralement à partir de zéro.

## Vérité des informations affichées

Toutes les statistiques du site (nombre de templates, de démos, de projets) sont calculées à partir du contenu réel du projet — jamais inventées. `projets.html` ne présente que des projets réellement livrés (Gio Smart Services, Adalberto.fr) et indique honnêtement les projets en cours (Mr Pronto, Marina Bay) sans lien ni promesse tant qu'ils ne sont pas en ligne.

## Prochaine piste : internationalisation (FR/EN/PT)

Faisabilité technique confirmée : un sélecteur de langue en JavaScript (sans duplication de pages) est la solution la plus légère pour un site statique comme celui-ci. Le travail principal serait la traduction du contenu des 5 pages principales (les démos resteraient en français, car elles représentent des exemples de commerces locaux). Non commencé — à faire sur demande.

## Coordonnées

- Email : contact@giotech-digital.fr
- Téléphone / WhatsApp : 07 53 91 15 02
- Localisation : Martigues, France
- LinkedIn, Instagram, GitHub : voir le pied de page du site

## Développement local

Aucune dépendance à installer. Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur local :

```bash
npx serve .
# ou
python3 -m http.server 8080
```

## Déploiement (Cloudflare Pages)

1. Pousser le projet sur un dépôt GitHub.
2. Sur Cloudflare Pages : **Créer un projet** → **Connecter à Git**.
3. Build command : *(aucune — site statique)*.
4. Dossier de sortie (build output directory) : `/`.
