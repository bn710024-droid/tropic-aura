"use strict";
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/HP/Downloads/prod-BABAN jaune.png";
const OUT = path.join(__dirname, "public/png/prod-banane.png");

function dist(r1,g1,b1,r2,g2,b2){ return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2); }

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  // Flood-fill depuis les bords : identifie uniquement les pixels de fond
  // connectés aux bords — ne touche pas la chair claire à l'intérieur du fruit
  const floodT = 62; // pixels à distance < 62 du blanc pur = fond potentiel
  const bgMask = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  const queue = [];
  let head = 0;

  const seed = (x, y) => {
    const i = y * width + x;
    if (visited[i]) return;
    visited[i] = 1;
    const idx = i * channels;
    const d = dist(px[idx], px[idx+1], px[idx+2], 255, 255, 255);
    if (d < floodT) { bgMask[i] = 1; queue.push(i); }
  };

  for (let x = 0; x < width; x++) { seed(x, 0); seed(x, height-1); }
  for (let y = 0; y < height; y++) { seed(0, y); seed(width-1, y); }

  while (head < queue.length) {
    const i = queue[head++];
    const x = i % width, y = Math.floor(i / width);
    for (const [dy, dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny = y + dy, nx = x + dx;
      if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
        const ni = ny * width + nx;
        if (!visited[ni]) {
          visited[ni] = 1;
          const idx = ni * channels;
          const d = dist(px[idx], px[idx+1], px[idx+2], 255, 255, 255);
          if (d < floodT) { bgMask[ni] = 1; queue.push(ni); }
        }
      }
    }
  }

  console.log(`Fond détecté : ${bgMask.reduce((s,v)=>s+v,0)} px sur ${width*height}`);

  // Appliquer le masque : fond → alpha 0, fruit → alpha 255
  for (let i = 0; i < width * height; i++) {
    px[i * channels + 3] = bgMask[i] ? 0 : 255;
  }

  // Erosion 1px anti-halo
  const a0 = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) a0[i] = px[i * channels + 3];
  const ae = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let mn = 255;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const ny = y + dy, nx = x + dx;
      if (ny >= 0 && ny < height && nx >= 0 && nx < width) mn = Math.min(mn, a0[ny * width + nx]);
    }
    ae[y * width + x] = mn;
  }
  for (let i = 0; i < width * height; i++) px[i * channels + 3] = ae[i];

  await sharp(px, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  console.log("Done →", OUT);
}
run().catch(console.error);
