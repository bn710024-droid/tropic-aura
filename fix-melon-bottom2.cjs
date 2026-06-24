"use strict";
const sharp = require("sharp");
const path  = require("path");

const FILE = path.join(__dirname, "public/png/prod-melon.png");

async function run() {
  const raw = await sharp(FILE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("prod-melon.png:", width, "x", height);

  // Coupe douce : fade 82%→90%, coupe nette à 90%
  const fadeStart = 0.82;
  const hardCut   = 0.90;

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
    .toFile(FILE);
  console.log("Done");
}
run().catch(console.error);
