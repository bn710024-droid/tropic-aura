"use strict";
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "public/png/prod-melon.png");
const OUT = path.join(__dirname, "public/png/prod-melon.png");

async function run() {
  const img = sharp(SRC);
  const meta = await img.metadata();
  const { width, height } = meta;
  console.log(`Input: ${width} × ${height}`);

  // Ensure RGBA
  const raw = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = raw.data;
  const channels = 4;

  // Fade alpha from fadeStart% height to 0 at bottom
  const fadeStart = 0.62; // bottom fade begins at 62% of image height
  const fadeEnd = 0.98;   // fully transparent at 98%

  for (let y = 0; y < height; y++) {
    const fy = y / height;
    let multiplier = 1;
    if (fy >= fadeStart) {
      multiplier = 1 - Math.min(1, (fy - fadeStart) / (fadeEnd - fadeStart));
      // smooth ease-in
      multiplier = multiplier * multiplier;
    }
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      pixels[idx + 3] = Math.round(pixels[idx + 3] * multiplier);
    }
  }

  await sharp(pixels, {
    raw: { width, height, channels },
  })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  console.log("Done →", OUT);
}

run().catch(console.error);
