"use strict";
const sharp = require("sharp");
const path  = require("path");

const SRC = "C:/Users/HP/Downloads/prod-melons2.png.jpeg";
const OUT = path.join(__dirname, "public/png/prod-melon.png");

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  const N = width * height;
  const fruitMask = new Uint8Array(N);

  const sat = (r, g, b) => {
    const mn = Math.min(r,g,b), mx = Math.max(r,g,b);
    return mx > 0 ? (mx - mn) / mx : 0;
  };

  // Graines : orange vif / vert melon (sat très élevée)
  const SEED_SAT = 0.35;
  for (let i = 0; i < N; i++) {
    const idx = i * channels;
    if (sat(px[idx], px[idx+1], px[idx+2]) > SEED_SAT)
      fruitMask[i] = 1;
  }

  // Expansion : seuil plus haut pour exclure les éclaboussures d'eau blanche
  const EXPAND_SAT = 0.18;
  const queue = [];
  let head = 0;
  for (let i = 0; i < N; i++) { if (fruitMask[i]) queue.push(i); }
  while (head < queue.length) {
    const i = queue[head++];
    const x = i % width, y = Math.floor(i / width);
    for (const [dy, dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny = y+dy, nx = x+dx;
      if (ny<0||ny>=height||nx<0||nx>=width) continue;
      const ni = ny*width+nx;
      if (fruitMask[ni]) continue;
      const idx = ni * channels;
      if (sat(px[idx], px[idx+1], px[idx+2]) > EXPAND_SAT) {
        fruitMask[ni] = 1; queue.push(ni);
      }
    }
  }

  // Bouche-trous
  const bgReach = new Uint8Array(N);
  const bgQ = [];
  let bgHead = 0;
  const seedBg = (x, y) => {
    const i = y*width+x;
    if (fruitMask[i]||bgReach[i]) return;
    bgReach[i]=1; bgQ.push(i);
  };
  for (let x=0;x<width;x++) { seedBg(x,0); seedBg(x,height-1); }
  for (let y=0;y<height;y++) { seedBg(0,y); seedBg(width-1,y); }
  while (bgHead < bgQ.length) {
    const i = bgQ[bgHead++];
    const x=i%width, y=Math.floor(i/width);
    for (const [dy,dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny=y+dy, nx=x+dx;
      if (ny<0||ny>=height||nx<0||nx>=width) continue;
      const ni=ny*width+nx;
      if (!fruitMask[ni]&&!bgReach[ni]) { bgReach[ni]=1; bgQ.push(ni); }
    }
  }

  for (let i=0;i<N;i++) {
    px[i*channels+3] = (fruitMask[i]||!bgReach[i]) ? 255 : 0;
  }

  // Coupe bas : fade 74%→82%
  for (let y=0;y<height;y++) {
    const fy = y/height;
    let mult = 1;
    if (fy >= 0.82) mult = 0;
    else if (fy >= 0.74) mult = 1 - (fy - 0.74) / (0.82 - 0.74);
    if (mult < 1) {
      for (let x=0;x<width;x++) {
        const idx=(y*width+x)*channels;
        px[idx+3]=Math.round(px[idx+3]*mult);
      }
    }
  }

  await sharp(px, { raw:{ width, height, channels } })
    .png({ compressionLevel:9 })
    .toFile(OUT);
  console.log("Done");
}
run().catch(console.error);
