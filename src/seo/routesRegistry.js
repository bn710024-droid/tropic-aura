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

/**
 * changefreq/priority suivent les recommandations standard sitemap.xml :
 * - homepage : priority 1.0
 * - pages piliers (produits, à propos, partenariats, contact) : 0.8
 * - pages produit individuelles : 0.7
 * - articles de blog : 0.6
 */
export const ROUTES = [
  { path: "/", label: "Accueil", changefreq: "weekly", priority: 1.0 },
  { path: "/produits", label: "Produits", changefreq: "weekly", priority: 0.9 },
  ...PRODUCTS.map((p) => ({
    path: `/produits/${p.slug}`,
    label: p.name,
    changefreq: "monthly",
    priority: 0.7,
    parent: "/produits",
  })),
  { path: "/about", label: "À Propos", changefreq: "monthly", priority: 0.8 },
  { path: "/partenariats", label: "Partenariats", changefreq: "monthly", priority: 0.8 },
  { path: "/insights", label: "Insights", changefreq: "weekly", priority: 0.7 },
  {
    path: "/insights/senegal-origine-strategique",
    label: "Pourquoi le Sénégal devient une origine stratégique",
    changefreq: "yearly",
    priority: 0.6,
    parent: "/insights",
  },
  {
    path: "/insights/fournisseur-stable-opportuniste",
    label: "Fournisseur stable ou opportuniste ?",
    changefreq: "yearly",
    priority: 0.6,
    parent: "/insights",
  },
  { path: "/contact", label: "Contact", changefreq: "monthly", priority: 0.8 },
];

/** Retrouve l'entrée de registre pour un chemin donné. */
export function getRoute(path) {
  return ROUTES.find((r) => r.path === path);
}

/**
 * Construit la chaîne de breadcrumbs (du plus général au plus précis)
 * pour un chemin donné, en remontant les relations `parent`.
 */
export function buildBreadcrumbTrail(path) {
  const trail = [{ path: "/", label: "Accueil" }];
  const route = getRoute(path);
  if (!route || route.path === "/") return trail;

  if (route.parent) {
    const parentRoute = getRoute(route.parent);
    if (parentRoute) trail.push({ path: parentRoute.path, label: parentRoute.label });
  }
  trail.push({ path: route.path, label: route.label });
  return trail;
}
