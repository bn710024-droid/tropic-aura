// ============================================================
//  generate-sitemap.mjs — génère public/sitemap.xml au build.
//
//  Source unique de vérité : src/seo/routesRegistry.js (le même
//  fichier qui alimente le router et les breadcrumbs) — aucune
//  duplication de la liste d'URLs.
//
//  Lancé automatiquement via le hook "prebuild" (package.json),
//  donc systématiquement à jour avant chaque `npm run build`.
// ============================================================

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ROUTES } from "../src/seo/routesRegistry.js";
import { SITE_URL } from "../src/seo/siteConfig.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().slice(0, 10);

const urlEntries = ROUTES.map(
  (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(outFile, xml, "utf-8");
console.log(`[sitemap] ${ROUTES.length} URLs écrites dans public/sitemap.xml`);
