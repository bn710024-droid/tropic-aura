// ============================================================
//  generate-favicons.mjs — génère l'ensemble des favicons/icônes
//  PWA à partir du logo réel de la marque (public/logo-mark.png),
//  PAS du favicon.svg existant qui est un placeholder générique
//  hors-charte (violet, sans rapport avec la palette Tropicaura).
//
//  Lancé via le hook "prebuild" — régénère les fichiers à chaque
//  build pour rester synchronisé si le logo change.
// ============================================================

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "../public/logo-mark.png");
const OUT = (name) => resolve(__dirname, "../public", name);

// Fond sombre de marque (identique à celui utilisé pour le logo dans
// le Footer et les sections dark du site) — évite un carré transparent
// rendu noir par défaut sur les anciens iOS pour apple-touch-icon.
const BRAND_DARK = { r: 11, g: 15, b: 10, alpha: 1 };

const TARGETS = [
  { name: "favicon-16x16.png", size: 16, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  { name: "favicon-32x32.png", size: 32, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  // 48x48 : taille de référence exigée par Google pour afficher un favicon
  // dans les résultats de recherche. Sa documentation demande un carré
  // MULTIPLE DE 48 ; sans aucun fichier conforme, Search retombe sur l'icône
  // de globe générique — ce qui était le cas ici (seuls 16 et 32 étaient
  // déclarés). Fond de marque plutôt que transparent : sur la ligne de
  // résultat, Google pose l'icône sur un cercle blanc, où un logo doré
  // détouré devenait illisible.
  { name: "favicon-48x48.png", size: 48, background: BRAND_DARK },
  { name: "apple-touch-icon.png", size: 180, background: BRAND_DARK },
  { name: "android-chrome-192x192.png", size: 192, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  { name: "android-chrome-512x512.png", size: 512, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  { name: "mstile-150x150.png", size: 150, background: BRAND_DARK },
];

async function run() {
  for (const t of TARGETS) {
    await sharp(SRC)
      .resize(t.size, t.size, { fit: "contain", background: t.background })
      .flatten(t.background.alpha === 0 ? false : { background: t.background })
      .png()
      .toFile(OUT(t.name));
    console.log(`[favicons] ${t.name} (${t.size}x${t.size})`);
  }

  // favicon.ico multi-résolution (16/32) — la plupart des navigateurs
  // modernes utilisent le PNG/SVG via <link>, mais .ico reste le
  // fallback historique attendu par certains agrégateurs et IE/anciens
  // Windows. sharp ne produit pas de .ico nativement : on réutilise le
  // PNG 32x32 sous ce nom, accepté par tous les navigateurs actuels.
  await sharp(SRC)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(OUT("favicon.ico"));
  console.log("[favicons] favicon.ico (32x32 PNG, compatible navigateurs modernes)");
}

run().catch((err) => {
  console.error("[favicons] échec de génération :", err);
  process.exit(1);
});
