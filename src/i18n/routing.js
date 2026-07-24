// ============================================================
//  routing.js — correspondance des chemins entre FR et EN.
//
//  Les URLs françaises restent EXACTEMENT celles déjà indexées par
//  Google (/produits, /partenariats…) : les changer casserait le
//  référencement acquis. L'anglais vit sous /en/ avec ses propres
//  slugs, lisibles par un acheteur international (/en/products).
//
//  Cette table est la source unique utilisée pour :
//    - le sélecteur de langue (aller sur l'équivalent, pas l'accueil),
//    - les balises hreflang réciproques de SEOHead,
//    - la construction des liens internes selon la langue active.
// ============================================================
import { DEFAULT_LANG, SUPPORTED_LANGS } from "./index";

// Clé de page → chemin dans chaque langue. Toute page traduite doit
// figurer ici ; une page absente n'est simplement pas proposée en EN
// (le sélecteur se désactive), ce qui évite un lien mort.
export const ROUTES = {
  home: { fr: "/", en: "/en" },
  about: { fr: "/about", en: "/en/about" },
  products: { fr: "/produits", en: "/en/products" },
  availability: { fr: "/disponibilite", en: "/en/availability" },
  partnerships: { fr: "/partenariats", en: "/en/partnerships" },
  insights: { fr: "/insights", en: "/en/insights" },
  insightSenegal: {
    fr: "/insights/senegal-origine-strategique",
    en: "/en/insights/senegal-strategic-origin",
  },
  insightSupplier: {
    fr: "/insights/fournisseur-stable-opportuniste",
    en: "/en/insights/reliable-vs-opportunistic-supplier",
  },
  contact: { fr: "/contact", en: "/en/contact" },
  privacy: { fr: "/politique-confidentialite", en: "/en/privacy" },
};

// Pages réellement disponibles en anglais aujourd'hui. Tant qu'une page
// n'est pas traduite, on ne déclare NI hreflang="en" NI de lien vers elle :
// annoncer une version qui n'existe pas génère des erreurs Search Console
// et envoie l'utilisateur sur une page dans la mauvaise langue.
export const TRANSLATED_PAGES = ["home", "products"];

/** Langue portée par un chemin : /en ou /en/... → "en", sinon "fr". */
export function langFromPath(pathname) {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : DEFAULT_LANG;
}

/** Clé de page correspondant à un chemin (null si inconnue). */
export function pageKeyFromPath(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  for (const [key, paths] of Object.entries(ROUTES)) {
    if (paths.fr === clean || paths.en === clean) return key;
  }
  return null;
}

/**
 * Chemin d'une page dans une langue donnée, pour construire un LIEN.
 *
 * Repli volontaire vers le français quand la page n'est pas encore traduite :
 * pendant le déploiement progressif de l'anglais, un lien vers /en/products
 * (route inexistante) donnerait un 404. Renvoyer /produits sert une page
 * réelle — contenu français, mais navigable. À mesure que des pages entrent
 * dans TRANSLATED_PAGES, leurs liens basculent automatiquement sur /en/…
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
 * Équivalent d'un chemin dans l'autre langue — null si la page n'existe
 * pas encore dans la langue cible (le sélecteur doit alors se désactiver
 * plutôt que de produire un lien mort).
 */
export function alternatePath(pathname, targetLang) {
  if (!SUPPORTED_LANGS.includes(targetLang)) return null;
  const key = pageKeyFromPath(pathname);
  if (!key) return null;
  if (targetLang !== DEFAULT_LANG && !TRANSLATED_PAGES.includes(key)) return null;
  return pathFor(key, targetLang);
}
