"use strict";
const sharp = require("sharp");
const path  = require("path");

const SRC = "C:/Users/HP/Downloads/prod-citron jaune2.png.jpeg";
const OUT = path.join(__dirname, "public/png/prod-citron-jaune.png");

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  // ─── Étape 0 : Supprimer badge HD et surface blanche du bas ────────────────
  const bgGrey = [185, 191, 197];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r=px[idx], g=px[idx+1], b=px[idx+2];
      const mn=Math.min(r,g,b), mx=Math.max(r,g,b);
      const s = mx > 0 ? (mx - mn) / mx : 0;
      const lum = (r + g + b) / 3;
      // Badge HD : coin supérieur droit
      const isBadge = (y < 80 && x >= 420);
      // Surface blanche/crème du bas de la composition (sat<0.22, lum>185, y>60%)
      const isWhiteBase = (y > height * 0.60 && s < 0.22 && lum > 185);
      if (isBadge || isWhiteBase) {
        px[idx]=bgGrey[0]; px[idx+1]=bgGrey[1]; px[idx+2]=bgGrey[2];
      }
    }
  }

  const N = width * height;
  const fruitMask = new Uint8Array(N);

  const sat = (r, g, b) => {
    const mn = Math.min(r,g,b), mx = Math.max(r,g,b);
    return mx > 0 ? (mx - mn) / mx : 0;
  };

  // ─── Étape 1 : Graines (jaune citron vif) ─────────────────────────────────
  const SEED_SAT = 0.28;
  for (let i = 0; i < N; i++) {
    const idx = i * channels;
    if (sat(px[idx], px[idx+1], px[idx+2]) > SEED_SAT)
      fruitMask[i] = 1;
  }
  console.log("Graines:", fruitMask.reduce((s,v)=>s+v, 0));

  // ─── Étape 2 : Expansion BFS ───────────────────────────────────────────────
  const EXPAND_SAT = 0.12;
  const queue = []; let head = 0;
  for (let i = 0; i < N; i++) { if (fruitMask[i]) queue.push(i); }
  while (head < queue.length) {
    const i = queue[head++];
    const x = i % width, y = Math.floor(i / width);
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

  // ─── Étape 3 : Flood depuis les bords ──────────────────────────────────────
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
  // Hole-fill uniquement si coloré (sat>0.12) ou sombre (lum<160)
  // → exclut surface blanche/crème enfermée sous les citrons
  for (let i=0;i<N;i++) {
    const idx=i*channels;
    const r=px[idx], g=px[idx+1], b=px[idx+2];
    const s=sat(r,g,b);
    const lum=(r+g+b)/3;
    if (fruitMask[i]) {
      px[idx+3]=255;
    } else if (bgReach[i]) {
      px[idx+3]=0;
    } else {
      // Région enfermée : ne remplir que si colorée ou sombre (pas surface blanche)
      px[idx+3] = (s > 0.12 || lum < 160) ? 255 : 0;
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
