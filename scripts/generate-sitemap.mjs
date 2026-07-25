// ============================================================
//  generate-sitemap.mjs — génère public/sitemap.xml au build.
//
//  Source unique de vérité : src/seo/routesRegistry.js (le même
//  fichier qui alimente le router et les breadcrumbs) — aucune
//  duplication de la liste d'URLs.
//
//  BILINGUE : chaque page qui existe aussi en anglais (voir
//  TRANSLATED_PAGES dans src/i18n/routing.js) produit DEUX entrées
//  — une par langue — et chaque entrée déclare ses alternantes
//  xhtml:link. C'est la forme recommandée par Google pour un site
//  multilingue : sans ces alternantes dans le sitemap, les deux
//  versions peuvent être vues comme du contenu dupliqué plutôt
//  que comme deux traductions de la même page.
//
//  Lancé automatiquement via le hook "prebuild" (package.json),
//  donc systématiquement à jour avant chaque `npm run build`.
// ============================================================

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ROUTES } from "../src/seo/routesRegistry.js";
import { SITE_URL } from "../src/seo/siteConfig.js";
import { ROUTES as I18N_ROUTES, TRANSLATED_PAGES } from "../src/i18n/routing.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().slice(0, 10);

// Index inverse : chemin français → couple { fr, en } quand la page est
// réellement traduite. Les fiches produit (/produits/:slug) ne figurent pas
// telles quelles dans la table i18n : leur équivalent anglais se déduit du
// préfixe de la page « products ».
const frToPair = new Map();
for (const key of TRANSLATED_PAGES) {
  const pair = I18N_ROUTES[key];
  if (pair?.fr && pair?.en) frToPair.set(pair.fr, pair);
}

const productsPair = I18N_ROUTES.products;
function alternatesFor(frPath) {
  const direct = frToPair.get(frPath);
  if (direct) return direct;
  // Fiche produit : /produits/<slug> → /en/products/<slug>
  if (frPath.startsWith(`${productsPair.fr}/`)) {
    const slug = frPath.slice(productsPair.fr.length + 1);
    return { fr: frPath, en: `${productsPair.en}/${slug}` };
  }
  return null;
}

function entry(loc, r, alt) {
  const links = alt
    ? `
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}${alt.fr}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${alt.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${alt.fr}"/>`
    : "";
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>${links}
  </url>`;
}

const entries = [];
for (const r of ROUTES) {
  const alt = alternatesFor(r.path);
  entries.push(entry(r.path, r, alt));
  // La version anglaise reprend changefreq/priority de son équivalent français :
  // même contenu, même fraîcheur, même importance relative dans le site.
  if (alt) entries.push(entry(alt.en, r, alt));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

writeFileSync(outFile, xml, "utf-8");
const enCount = entries.length - ROUTES.length;
console.log(`[sitemap] ${entries.length} URLs (${ROUTES.length} fr + ${enCount} en) écrites dans public/sitemap.xml`);
