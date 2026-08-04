// ============================================================
//  generate-blurred-fruits.mjs — pré-génère les fruits FLOUS des
//  calques mobiles de l'accueil (voir src/data/mobileFruits.js,
//  source unique du manifeste + rationale complet).
//
//  Un flou cuit dans le PNG remplace filter:blur() au rendu → les
//  WebView WebKit limitées (Google/GSA iOS) n'ont plus rien à
//  rasteriser, donc plus de halo carré possible, ni au premier
//  chargement ni après navigation.
//
//  Usage :  node scripts/generate-blurred-fruits.mjs
//  Sortie :  public/png/m/blurred/<nom>-s<taille>-b<flou>.webp
//  À relancer (puis commit) après tout changement de size/blur
//  dans le manifeste.
// ============================================================
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRUITS_MID, FRUITS_SOFT, BLUR_PAD_RATIO, blurredFruitSrc } from "../src/data/mobileFruits.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "png", "m", "blurred");

// Rendu 2× : les tailles CSS (size/blur/pad) sont doublées pour rester
// nettes sur écrans Retina — le navigateur redescend à la taille CSS.
const SCALE = 2;

const jobs = new Map(); // outName -> fruit (dédup : mêmes src/size/blur)
for (const f of [...FRUITS_MID, ...FRUITS_SOFT]) {
  if (!f.blur) continue;
  jobs.set(blurredFruitSrc(f), f);
}

await mkdir(OUT_DIR, { recursive: true });

for (const [outSrc, f] of jobs) {
  const srcPath = path.join(ROOT, "public", f.src);
  const outPath = path.join(ROOT, "public", outSrc);
  const pad = f.blur * BLUR_PAD_RATIO * SCALE;

  // 1. resize à la taille d'affichage (2×), 2. marge transparente qui
  // accueillera la diffusion du flou, 3. flou gaussien (CSS blur(Npx)
  // ≈ écart-type N px → N × SCALE à cette résolution).
  const resized = await sharp(srcPath)
    .resize({ width: f.size * SCALE })
    .png()
    .toBuffer();

  await sharp(resized)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(f.blur * SCALE)
    .webp({ quality: 82 })
    .toFile(outPath);

  console.log(`ok  ${outSrc}`);
}

console.log(`\n${jobs.size} images générées dans public/png/m/blurred/`);
