// ============================================================
//  generate-sitemap.mjs — génère public/sitemap.xml au build.
//
//  Source unique de vérité : src/seo/routesRegistry.js (le même
//  fichier qui alimente le router et les breadcrumbs) — aucune
//  duplication de la liste d'URLs.
//
//  TRILINGUE : chaque page qui existe aussi en anglais et/ou en
//  néerlandais (voir TRANSLATED_PAGES dans src/i18n/routing.js)
//  produit une entrée par langue disponible, et chaque entrée
//  déclare ses alternantes xhtml:link. C'est la forme recommandée
//  par Google pour un site multilingue : sans ces alternantes dans
//  le sitemap, les différentes versions peuvent être vues comme du
//  contenu dupliqué plutôt que comme des traductions de la même page.
//
//  Lancé automatiquement via le hook "prebuild" (package.json),
//  donc systématiquement à jour avant chaque `npm run build`.
// ============================================================

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ROUTES } from "../src/seo/routesRegistry.js";
import { SITE_URL } from "../src/seo/siteConfig.js";
import { ROUTES as I18N_ROUTES, TRANSLATED_PAGES, SUPPORTED_LANGS, DEFAULT_LANG } from "../src/i18n/routing.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().slice(0, 10);
const OTHER_LANGS = SUPPORTED_LANGS.filter((l) => l !== DEFAULT_LANG);

// Index inverse : chemin français → objet { fr, en, nl, ... } quand la page
// est réellement traduite dans au moins une autre langue. Les fiches produit
// (/produits/:slug) ne figurent pas telles quelles dans la table i18n : leur
// équivalent dans chaque langue se déduit du préfixe de la page « products ».
const frToPair = new Map();
for (const key of TRANSLATED_PAGES) {
  const pair = I18N_ROUTES[key];
  if (pair?.[DEFAULT_LANG]) frToPair.set(pair[DEFAULT_LANG], pair);
}

const productsPair = I18N_ROUTES.products;
function alternatesFor(frPath) {
  const direct = frToPair.get(frPath);
  if (direct) return direct;
  // Fiche produit : /produits/<slug> → /en/products/<slug>, /nl/producten/<slug>...
  if (frPath.startsWith(`${productsPair[DEFAULT_LANG]}/`)) {
    const slug = frPath.slice(productsPair[DEFAULT_LANG].length + 1);
    const pair = { [DEFAULT_LANG]: frPath };
    for (const lang of OTHER_LANGS) pair[lang] = `${productsPair[lang]}/${slug}`;
    return pair;
  }
  return null;
}

function entry(loc, r, alt) {
  let links = "";
  if (alt) {
    for (const lang of SUPPORTED_LANGS) {
      if (alt[lang]) links += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${alt[lang]}"/>`;
    }
    links += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${alt[DEFAULT_LANG]}"/>`;
  }
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>${links}
  </url>`;
}

const entries = [];
let otherLangCount = 0;
for (const r of ROUTES) {
  const alt = alternatesFor(r.path);
  entries.push(entry(r.path, r, alt));
  // Chaque version traduite reprend changefreq/priority de son équivalent
  // français : même contenu, même fraîcheur, même importance relative.
  if (alt) {
    for (const lang of OTHER_LANGS) {
      if (alt[lang]) {
        entries.push(entry(alt[lang], r, alt));
        otherLangCount++;
      }
    }
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

writeFileSync(outFile, xml, "utf-8");
console.log(`[sitemap] ${entries.length} URLs (${ROUTES.length} ${DEFAULT_LANG} + ${otherLangCount} autres langues) écrites dans public/sitemap.xml`);
