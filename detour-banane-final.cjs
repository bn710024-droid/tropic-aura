"use strict";
const sharp = require("sharp");
const path  = require("path");

const SRC = "C:/Users/HP/Downloads/prod-BABAN jaune.png";
const OUT = path.join(__dirname, "public/png/prod-banane.png");

function dist(r1,g1,b1,r2,g2,b2){
  return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);
}

async function run() {
  // Lecture fraîche de la source originale
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height, "ch:", channels);

  const N = width * height;
  const fruitMask = new Uint8Array(N); // 1 = fruit à garder

  // ─── Étape 1 : Graines fruit ────────────────────────────────────────────────
  // Pixels suffisamment éloignés du blanc → définitivement fruit (jaune/crème foncé)
  const SEED_T = 85;
  for (let i = 0; i < N; i++) {
    const idx = i * channels;
    if (dist(px[idx], px[idx+1], px[idx+2], 255, 255, 255) > SEED_T)
      fruitMask[i] = 1;
  }
  console.log("Graines fruit:", fruitMask.reduce((s,v)=>s+v, 0));

  // ─── Étape 2 : Expansion depuis les graines ─────────────────────────────────
  // On étend le masque fruit vers les pixels pas trop blancs qui touchent le fruit
  // → capture la chair crème et le bord de peau sans sauter dans le fond blanc
  const EXPAND_T = 42;
  const queue = [];
  let head = 0;
  for (let i = 0; i < N; i++) { if (fruitMask[i]) queue.push(i); }

  while (head < queue.length) {
    const i = queue[head++];
    const x = i % width, y = Math.floor(i / width);
    for (const [dy, dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny = y+dy, nx = x+dx;
      if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue;
      const ni = ny * width + nx;
      if (fruitMask[ni]) continue;
      const idx = ni * channels;
      if (dist(px[idx], px[idx+1], px[idx+2], 255, 255, 255) > EXPAND_T) {
        fruitMask[ni] = 1;
        queue.push(ni);
      }
    }
  }
  console.log("Après expansion:", fruitMask.reduce((s,v)=>s+v, 0));

  // ─── Étape 3 : Bouche-trous ─────────────────────────────────────────────────
  // Flood depuis TOUS les bords à travers les pixels NON-fruit.
  // Tout pixel non-fruit NON-atteignable depuis un bord = trou intérieur → fruit.
  const bgReach = new Uint8Array(N);
  const bgQ = [];
  let bgHead = 0;
  const seedBg = (x, y) => {
    const i = y * width + x;
    if (fruitMask[i] || bgReach[i]) return;
    bgReach[i] = 1; bgQ.push(i);
  };
  for (let x = 0; x < width; x++) { seedBg(x, 0); seedBg(x, height-1); }
  for (let y = 0; y < height; y++) { seedBg(0, y); seedBg(width-1, y); }
  while (bgHead < bgQ.length) {
    const i = bgQ[bgHead++];
    const x = i % width, y = Math.floor(i / width);
    for (const [dy,dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny=y+dy, nx=x+dx;
      if (ny<0||ny>=height||nx<0||nx>=width) continue;
      const ni = ny*width+nx;
      if (!fruitMask[ni] && !bgReach[ni]) { bgReach[ni]=1; bgQ.push(ni); }
    }
  }

  // ─── Étape 4 : Appliquer alpha ──────────────────────────────────────────────
  // Fruit si fruitMask=1 OU si pixel non atteignable depuis bord (trou fermé)
  for (let i = 0; i < N; i++) {
    px[i * channels + 3] = (fruitMask[i] || !bgReach[i]) ? 255 : 0;
  }

  // Stats
  let op=0, tr=0;
  for (let i=0;i<N;i++) { if(px[i*channels+3]>0) op++; else tr++; }
  console.log(`Alpha → opaque: ${op} | transparent: ${tr}`);

  await sharp(px, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  console.log("Done →", OUT);
}
run().catch(console.error);
