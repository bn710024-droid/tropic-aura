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
import { langFromPath, pathFor, alternatePath } from "../i18n/routing.js";

/**
 * changefreq/priority suivent les recommandations standard sitemap.xml :
 * - homepage : priority 1.0
 * - pages piliers (produits, à propos, partenariats, contact) : 0.8
 * - pages produit individuelles : 0.7
 * - articles de blog : 0.6
 *
 * `label`/`labelEn` : cette table reste indexée en français (les chemins
 * `path` sont les URLs FR, seule langue déjà indexée par Google — voir
 * i18n/routing.js) ; `labelEn` fournit juste le libellé à afficher quand
 * buildBreadcrumbTrail() est appelé depuis une page /en/*.
 */
export const ROUTES = [
  { path: "/", label: "Accueil", labelEn: "Home", changefreq: "weekly", priority: 1.0 },
  { path: "/produits", label: "Produits", labelEn: "Products", changefreq: "weekly", priority: 0.9 },
  ...PRODUCTS.map((p) => ({
    path: `/produits/${p.slug}`,
    label: p.name,
    labelEn: p.englishName,
    changefreq: "monthly",
    priority: 0.7,
    parent: "/produits",
  })),
  { path: "/disponibilite", label: "Disponibilité", labelEn: "Availability", changefreq: "monthly", priority: 0.7, parent: "/produits" },
  { path: "/politique-confidentialite", label: "Politique de confidentialité", labelEn: "Privacy Policy", changefreq: "yearly", priority: 0.3 },
  { path: "/about", label: "À Propos", labelEn: "About", changefreq: "monthly", priority: 0.8 },
  { path: "/partenariats", label: "Partenariats", labelEn: "Partnerships", changefreq: "monthly", priority: 0.8 },
  { path: "/qualite-conformite", label: "Qualité & Conformité", labelEn: "Quality & Compliance", changefreq: "monthly", priority: 0.8 },
  { path: "/logistique-export", label: "Logistique & Export", labelEn: "Logistics & Export Process", changefreq: "monthly", priority: 0.8 },
  { path: "/insights", label: "Insights", labelEn: "Insights", changefreq: "weekly", priority: 0.7 },
  {
    path: "/insights/senegal-origine-strategique",
    label: "Le Sénégal, origine stratégique pour les fruits tropicaux",
    labelEn: "Senegal, a strategic origin for tropical fruit",
    changefreq: "yearly",
    priority: 0.6,
    parent: "/insights",
  },
  {
    path: "/insights/fournisseur-stable-opportuniste",
    label: "Fournisseur stable ou opportuniste en Afrique de l'Ouest ?",
    labelEn: "Reliable vs. opportunistic supplier in West Africa",
    changefreq: "yearly",
    priority: 0.6,
    parent: "/insights",
  },
  { path: "/contact", label: "Contact", labelEn: "Contact", changefreq: "monthly", priority: 0.8 },
];

/** Retrouve l'entrée de registre pour un chemin donné (toujours en FR). */
export function getRoute(path) {
  return ROUTES.find((r) => r.path === path);
}

/**
 * Construit la chaîne de breadcrumbs (du plus général au plus précis)
 * pour un chemin donné, en remontant les relations `parent`.
 *
 * `path` peut être FR ou EN (/en/...) : cette table interne reste
 * indexée en FR (voir ROUTES ci-dessus), donc on retombe sur son
 * équivalent FR pour la recherche, puis on retraduit chaque élément du
 * fil (chemin + libellé) dans la langue d'origine avant de le renvoyer.
 * Avant ce correctif, un chemin /en/... ne correspondait à aucune entrée
 * et le fil retombait toujours sur le seul "Accueil" en français.
 */
export function buildBreadcrumbTrail(path) {
  const lang = langFromPath(path);
  const frPath = lang === "en" ? (alternatePath(path, "fr") ?? path) : path;

  const homePath = pathFor("home", lang);
  const homeLabel = lang === "en" ? "Home" : "Accueil";
  const trail = [{ path: homePath, label: homeLabel }];

  const route = getRoute(frPath);
  if (!route || route.path === "/") return trail;

  const toLangItem = (r) => ({
    path: lang === "en" ? (alternatePath(r.path, "en") ?? r.path) : r.path,
    label: lang === "en" ? (r.labelEn ?? r.label) : r.label,
  });

  if (route.parent) {
    const parentRoute = getRoute(route.parent);
    if (parentRoute) trail.push(toLangItem(parentRoute));
  }
  trail.push(toLangItem(route));
  return trail;
}
