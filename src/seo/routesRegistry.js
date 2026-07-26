// ============================================================
//  routesRegistry.js — source unique de vérité pour toutes les
//  routes du site. Consommé par :
//    - App.jsx (react-router-dom <Routes>)
//    - scripts/generate-sitemap.mjs (sitemap.xml au build)
//    - Breadcrumbs.jsx (libellés de fil d'Ariane)
//
//  Objectif : éviter toute duplication de la liste des URLs entre
//  le router, le sitemap et les breadcrumbs (exigence "aucune
//  duplication" du brief SEO Enterprise).
// ============================================================

// Extension .js explicite requise : ce fichier est importé nativement
// par Node (scripts/generate-sitemap.mjs), qui n'infère pas l'extension
// comme le fait Vite côté navigateur.
import { PRODUCTS } from "../data/productsData.js";
import { langFromPath, pathFor, alternatePath, DEFAULT_LANG } from "../i18n/routing.js";

/**
 * changefreq/priority suivent les recommandations standard sitemap.xml :
 * - homepage : priority 1.0
 * - pages piliers (produits, à propos, partenariats, contact) : 0.8
 * - pages produit individuelles : 0.7
 * - articles de blog : 0.6
 *
 * `label`/`labelEn`/`labelNl` : cette table reste indexée en français (les
 * chemins `path` sont les URLs FR, seule langue déjà indexée par Google —
 * voir i18n/routing.js) ; `labelEn`/`labelNl` fournissent juste le libellé
 * à afficher quand buildBreadcrumbTrail() est appelé depuis une page
 * /en/* ou /nl/*.
 */
export const ROUTES = [
  { path: "/", label: "Accueil", labelEn: "Home", labelNl: "Home", changefreq: "weekly", priority: 1.0 },
  { path: "/produits", label: "Produits", labelEn: "Products", labelNl: "Producten", changefreq: "weekly", priority: 0.9 },
  ...PRODUCTS.map((p) => ({
    path: `/produits/${p.slug}`,
    label: p.name,
    labelEn: p.englishName,
    labelNl: p.dutchName,
    changefreq: "monthly",
    priority: 0.7,
    parent: "/produits",
  })),
  { path: "/disponibilite", label: "Disponibilité", labelEn: "Availability", labelNl: "Beschikbaarheid", changefreq: "monthly", priority: 0.7, parent: "/produits" },
  { path: "/politique-confidentialite", label: "Politique de confidentialité", labelEn: "Privacy Policy", labelNl: "Privacybeleid", changefreq: "yearly", priority: 0.3 },
  { path: "/about", label: "À Propos", labelEn: "About", labelNl: "Over ons", changefreq: "monthly", priority: 0.8 },
  { path: "/partenariats", label: "Partenariats", labelEn: "Partnerships", labelNl: "Partnerschappen", changefreq: "monthly", priority: 0.8 },
  { path: "/qualite-conformite", label: "Qualité & Conformité", labelEn: "Quality & Compliance", labelNl: "Kwaliteit & Conformiteit", changefreq: "monthly", priority: 0.8 },
  { path: "/logistique-export", label: "Logistique & Export", labelEn: "Logistics & Export Process", labelNl: "Logistiek & Exportproces", changefreq: "monthly", priority: 0.8 },
  { path: "/insights", label: "Insights", labelEn: "Insights", labelNl: "Inzichten", changefreq: "weekly", priority: 0.7 },
  {
    path: "/insights/senegal-origine-strategique",
    label: "Le Sénégal, origine stratégique pour les fruits tropicaux",
    labelEn: "Senegal, a strategic origin for tropical fruit",
    labelNl: "Senegal, een strategische oorsprong voor tropisch fruit",
    changefreq: "yearly",
    priority: 0.6,
    parent: "/insights",
  },
  {
    path: "/insights/fournisseur-stable-opportuniste",
    label: "Fournisseur stable ou opportuniste en Afrique de l'Ouest ?",
    labelEn: "Reliable vs. opportunistic supplier in West Africa",
    labelNl: "Betrouwbare of opportunistische leverancier in West-Afrika?",
    changefreq: "yearly",
    priority: 0.6,
    parent: "/insights",
  },
  { path: "/contact", label: "Contact", labelEn: "Contact", labelNl: "Contact", changefreq: "monthly", priority: 0.8 },
];

const LABEL_FIELD = { en: "labelEn", nl: "labelNl" };
const HOME_LABEL = { fr: "Accueil", en: "Home", nl: "Home" };

/** Retrouve l'entrée de registre pour un chemin donné (toujours en FR). */
export function getRoute(path) {
  return ROUTES.find((r) => r.path === path);
}

/**
 * Construit la chaîne de breadcrumbs (du plus général au plus précis)
 * pour un chemin donné, en remontant les relations `parent`.
 *
 * `path` peut être FR, EN (/en/...) ou NL (/nl/...) : cette table interne
 * reste indexée en FR (voir ROUTES ci-dessus), donc on retombe sur son
 * équivalent FR pour la recherche, puis on retraduit chaque élément du
 * fil (chemin + libellé) dans la langue d'origine avant de le renvoyer.
 */
export function buildBreadcrumbTrail(path) {
  const lang = langFromPath(path);
  const frPath = lang === DEFAULT_LANG ? path : (alternatePath(path, DEFAULT_LANG) ?? path);

  const homePath = pathFor("home", lang);
  const trail = [{ path: homePath, label: HOME_LABEL[lang] ?? HOME_LABEL[DEFAULT_LANG] }];

  const route = getRoute(frPath);
  if (!route || route.path === "/") return trail;

  const toLangItem = (r) => {
    if (lang === DEFAULT_LANG) return { path: r.path, label: r.label };
    const field = LABEL_FIELD[lang];
    return {
      path: alternatePath(r.path, lang) ?? r.path,
      label: r[field] ?? r.label,
    };
  };

  if (route.parent) {
    const parentRoute = getRoute(route.parent);
    if (parentRoute) trail.push(toLangItem(parentRoute));
  }
  trail.push(toLangItem(route));
  return trail;
}
