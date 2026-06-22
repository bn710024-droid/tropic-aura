"use strict";
const sharp = require("sharp");
const path  = require("path");

// Source portrait 512x679, fond gris uniforme ~(186,192,196)
const SRC = "C:/Users/HP/Downloads/prod-citron jaune2.png.jpeg";
const OUT = path.join(__dirname, "public/png/prod-citron-jaune.png");

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  // Supprimer le badge HD (x:430-490, y:8-30) → peindre en gris fond
  const bgGrey = [185, 191, 197];
  for (let y = 0; y < 80; y++) {
    for (let x = 420; x < width; x++) {
      if (x >= width || y >= height) continue;
      const idx = (y * width + x) * channels;
      px[idx] = bgGrey[0]; px[idx+1] = bgGrey[1]; px[idx+2] = bgGrey[2];
    }
  }

  const N = width * height;
  const fruitMask = new Uint8Array(N);

  const sat = (r, g, b) => {
    const mn = Math.min(r,g,b), mx = Math.max(r,g,b);
    return mx > 0 ? (mx - mn) / mx : 0;
  };

  // ─── Étape 1 : Graines ─────────────────────────────────────────────────────
  // Jaune citron = haute saturation (sat > 0.28)
  const SEED_SAT = 0.28;
  for (let i = 0; i < N; i++) {
    const idx = i * channels;
    if (sat(px[idx], px[idx+1], px[idx+2]) > SEED_SAT)
      fruitMask[i] = 1;
  }
  console.log("Graines:", fruitMask.reduce((s,v)=>s+v, 0));

  // ─── Étape 2 : Expansion ───────────────────────────────────────────────────
  // Inclut bord de peau et chair pâle adjacents au fruit
  const EXPAND_SAT = 0.12;
  const queue = []; let head = 0;
  for (let i = 0; i < N; i++) { if (fruitMask[i]) queue.push(i); }
  while (head < queue.length) {
    const i = queue[head++];
    const x = i%width, y = Math.floor(i/width);
    for (const [dy,dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny=y+dy, nx=x+dx;
      if (ny<0||ny>=height||nx<0||nx>=width) continue;
      const ni=ny*width+nx;
      if (fruitMask[ni]) continue;
      const idx=ni*channels;
      if (sat(px[idx],px[idx+1],px[idx+2]) > EXPAND_SAT) {
        fruitMask[ni]=1; queue.push(ni);
      }
    }
  }
  console.log("Après expansion:", fruitMask.reduce((s,v)=>s+v, 0));

  // ─── Étape 3 : Bouche-trous ────────────────────────────────────────────────
  const bgReach = new Uint8Array(N);
  const bgQ = []; let bgHead = 0;
  const seedBg = (x,y) => {
    const i=y*width+x;
    if (fruitMask[i]||bgReach[i]) return;
    bgReach[i]=1; bgQ.push(i);
  };
  for (let x=0;x<width;x++) { seedBg(x,0); seedBg(x,height-1); }
  for (let y=0;y<height;y++) { seedBg(0,y); seedBg(width-1,y); }
  while (bgHead < bgQ.length) {
    const i=bgQ[bgHead++];
    const x=i%width, y=Math.floor(i/width);
    for (const [dy,dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny=y+dy, nx=x+dx;
      if (ny<0||ny>=height||nx<0||nx>=width) continue;
      const ni=ny*width+nx;
      if (!fruitMask[ni]&&!bgReach[ni]) { bgReach[ni]=1; bgQ.push(ni); }
    }
  }

  // ─── Étape 4 : Alpha ───────────────────────────────────────────────────────
  for (let i=0;i<N;i++) {
    px[i*channels+3] = (fruitMask[i]||!bgReach[i]) ? 255 : 0;
  }

  // Efface chirurgicalement les pixels quasi-blancs dans le bas (sat<0.15, lum>190)
  // puis fade doux 78%→90% pour le reste
  for (let y=0;y<height;y++) {
    const fy = y/height;
    for (let x=0;x<width;x++) {
      const idx=(y*width+x)*channels;
      if (px[idx+3] === 0) continue;
      const r=px[idx],g=px[idx+1],b=px[idx+2];
      const lum=(r+g+b)/3;
      const s=sat(r,g,b);
      // Supprime pixels blancs/gris pâles dans le bas de l'image
      if (fy > 0.70 && s < 0.15 && lum > 190) {
        px[idx+3]=0; continue;
      }
      // Fade doux 78%→90%
      if (fy >= 0.90) { px[idx+3]=0; continue; }
      if (fy >= 0.78) {
        const mult = 1 - (fy - 0.78) / (0.90 - 0.78);
        px[idx+3]=Math.round(px[idx+3]*mult);
      }
    }
  }

  let op=0,tr=0,sm=0;
  for (let i=0;i<N;i++) { const a=px[i*channels+3]; if(a<5)tr++; else if(a>250)op++; else sm++; }
  console.log(`opaque:${op} transparent:${tr} semi:${sm}`);

  await sharp(px, { raw:{ width, height, channels } })
    .png({ compressionLevel:9 })
    .toFile(OUT);
  console.log("Done →", OUT);
}
run().catch(console.error);
