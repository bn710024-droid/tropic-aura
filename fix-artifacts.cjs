"use strict";
const sharp = require("sharp");
const path = require("path");
const PNG_DIR = path.join(__dirname, "public/png");

async function hardCrop(filename, keepRatio) {
  const src = path.join(PNG_DIR, filename);
  const raw = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const pixels = raw.data;
  const keepRows = Math.floor(height * keepRatio);
  console.log(`${filename}: ${width}x${height}, hard crop at ${keepRows}px (${Math.round(keepRatio*100)}%)`);

  // Everything below keepRows → alpha 0, tiny 3% fade above
  const fadeZone = Math.floor(height * 0.03);
  for (let y = 0; y < height; y++) {
    let mult;
    if (y >= keepRows) {
      mult = 0;
    } else if (y >= keepRows - fadeZone) {
      // tiny soft fade over last 3%
      mult = (keepRows - y) / fadeZone;
    } else {
      mult = 1;
    }
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      pixels[idx + 3] = Math.round(pixels[idx + 3] * mult);
    }
  }

  await sharp(pixels, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(src);
  console.log("  → done");
}

async function run() {
  // Garder 48% de l'image — dome + 3 tranches propres, reflet totalement absent
  await hardCrop("prod-pasteque.png", 0.48);
}

run().catch(console.error);
