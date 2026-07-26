// ============================================================
//  routing.js — correspondance des chemins entre FR, EN et NL.
//
//  Les URLs françaises restent EXACTEMENT celles déjà indexées par
//  Google (/produits, /partenariats…) : les changer casserait le
//  référencement acquis. L'anglais vit sous /en/ avec ses propres
//  slugs, lisibles par un acheteur international (/en/products).
//  Le néerlandais vit sous /nl/ selon le même principe, avec ses
//  propres slugs (/nl/producten) — même logique, une langue de plus.
//
//  Cette table est la source unique utilisée pour :
//    - le sélecteur de langue (aller sur l'équivalent, pas l'accueil),
//    - les balises hreflang réciproques de SEOHead,
//    - la construction des liens internes selon la langue active,
//    - la génération du sitemap trilingue (scripts/generate-sitemap.mjs).
//
//  Ce module ne dépend d'AUCUN autre : il est importé aussi bien par
//  l'application que par des scripts Node au build. C'est pourquoi
//  DEFAULT_LANG / SUPPORTED_LANGS sont définis ICI (et ré-exportés par
//  index.js) plutôt que l'inverse — importer index.js chargerait i18next
//  et les fichiers de traduction dans un contexte de build qui n'en a
//  aucun besoin.
// ============================================================
export const DEFAULT_LANG = "fr";
export const SUPPORTED_LANGS = ["fr", "en", "nl"];

// Clé de page → chemin dans chaque langue. Toute page traduite doit
// figurer ici ; une page absente dans une langue n'est simplement pas
// proposée dans cette langue (le sélecteur se désactive), ce qui évite
// un lien mort.
export const ROUTES = {
  home: { fr: "/", en: "/en", nl: "/nl" },
  about: { fr: "/about", en: "/en/about", nl: "/nl/over-ons" },
  products: { fr: "/produits", en: "/en/products", nl: "/nl/producten" },
  availability: { fr: "/disponibilite", en: "/en/availability", nl: "/nl/beschikbaarheid" },
  partnerships: { fr: "/partenariats", en: "/en/partnerships", nl: "/nl/partnerschappen" },
  insights: { fr: "/insights", en: "/en/insights", nl: "/nl/inzichten" },
  insightSenegal: {
    fr: "/insights/senegal-origine-strategique",
    en: "/en/insights/senegal-strategic-origin",
    nl: "/nl/inzichten/senegal-strategische-oorsprong",
  },
  insightSupplier: {
    fr: "/insights/fournisseur-stable-opportuniste",
    en: "/en/insights/reliable-vs-opportunistic-supplier",
    nl: "/nl/inzichten/betrouwbare-vs-opportunistische-leverancier",
  },
  contact: { fr: "/contact", en: "/en/contact", nl: "/nl/contact" },
  privacy: { fr: "/politique-confidentialite", en: "/en/privacy", nl: "/nl/privacybeleid" },
  quality: { fr: "/qualite-conformite", en: "/en/quality-compliance", nl: "/nl/kwaliteit-conformiteit" },
  logistics: { fr: "/logistique-export", en: "/en/logistics-export", nl: "/nl/logistiek-export" },
};

// Pages réellement disponibles hors FR aujourd'hui. Tant qu'une page
// n'est pas traduite, on ne déclare NI hreflang NI de lien vers elle :
// annoncer une version qui n'existe pas génère des erreurs Search Console
// et envoie l'utilisateur sur une page dans la mauvaise langue.
export const TRANSLATED_PAGES = ["home", "products", "contact", "availability", "about", "partnerships", "insights", "insightSenegal", "insightSupplier", "privacy", "quality", "logistics"];

/** Langue portée par un chemin : /en(/...) → "en", /nl(/...) → "nl", sinon fr. */
export function langFromPath(pathname) {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/nl" || pathname.startsWith("/nl/")) return "nl";
  return DEFAULT_LANG;
}

/** Clé de page correspondant à un chemin, dans n'importe quelle langue (null si inconnue). */
export function pageKeyFromPath(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  for (const [key, paths] of Object.entries(ROUTES)) {
    if (Object.values(paths).includes(clean)) return key;
  }
  return null;
}

/**
 * Chemin d'une page dans une langue donnée, pour construire un LIEN.
 *
 * Repli volontaire vers le français quand la page n'est pas encore traduite :
 * pendant un déploiement progressif, un lien vers /en/products ou /nl/producten
 * (route inexistante) donnerait un 404. Renvoyer /produits sert une page
 * réelle — contenu français, mais navigable. À mesure que des pages entrent
 * dans TRANSLATED_PAGES, leurs liens basculent automatiquement.
 *
 * Ne pas confondre avec alternatePath() (hreflang / sélecteur de langue), qui
 * renvoie null dans ce cas : on ne DÉCLARE jamais une version qui n'existe pas.
 */
export function pathFor(pageKey, lang) {
  const paths = ROUTES[pageKey];
  if (!paths) return null;
  if (lang !== DEFAULT_LANG && !TRANSLATED_PAGES.includes(pageKey)) {
    return paths[DEFAULT_LANG];
  }
  return paths[lang] ?? paths[DEFAULT_LANG];
}

/**
 * Équivalent d'un chemin dans une autre langue — null si la page n'existe
 * pas encore dans la langue cible (le sélecteur doit alors se désactiver
 * plutôt que de produire un lien mort).
 */
export function alternatePath(pathname, targetLang) {
  if (!SUPPORTED_LANGS.includes(targetLang)) return null;

  // Fiches produit : chemins paramétrés (/produits/<slug>), absents de la
  // table ci-dessus. Sans ce cas explicite, pageKeyFromPath renvoyait null et
  // le sélecteur de langue se désactivait sur les 12 fiches produit — soit
  // les pages les plus consultées par un acheteur. Boucle sur SUPPORTED_LANGS
  // pour détecter le préfixe quelle que soit la langue de départ (fr/en/nl).
  const products = ROUTES.products;
  for (const fromLang of SUPPORTED_LANGS) {
    const base = products[fromLang];
    if (pathname.startsWith(`${base}/`)) {
      const slug = pathname.slice(base.length + 1).replace(/\/$/, "");
      if (!slug || slug.includes("/")) break;
      if (targetLang !== DEFAULT_LANG && !TRANSLATED_PAGES.includes("products")) return null;
      return `${products[targetLang]}/${slug}`;
    }
  }

  const key = pageKeyFromPath(pathname);
  if (!key) return null;
  if (targetLang !== DEFAULT_LANG && !TRANSLATED_PAGES.includes(key)) return null;
  return pathFor(key, targetLang);
}
