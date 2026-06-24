"use strict";
const sharp = require("sharp");
const path = require("path");

async function run() {
  const src = path.join(__dirname, "public/png/prod-banane.png");
  const raw = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log(`prod-banane.png: ${width}x${height}`);

  // Coupe nette à 83% — tout ce qui est en dessous = alpha 0
  // Fondu très court 80%→83% pour adoucir le bord de coupe
  const fadeStart = 0.80;
  const hardCut   = 0.83;

  for (let y = 0; y < height; y++) {
    const fy = y / height;
    let mult = 1;
    if (fy >= hardCut) {
      mult = 0;
    } else if (fy >= fadeStart) {
      mult = 1 - (fy - fadeStart) / (hardCut - fadeStart);
    }
    if (mult < 1) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        px[idx + 3] = Math.round(px[idx + 3] * mult);
      }
    }
  }

  await sharp(px, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(src);
  console.log("  → done");
}
run().catch(console.error);
