"use strict";
const sharp = require("sharp");
const path  = require("path");

const SRC = "C:/Users/HP/Downloads/prod-pastepng.png";
const OUT = path.join(__dirname, "public/png/prod-pasteque.png");

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  const bgWhite = [254, 254, 254];

  const sat = (r, g, b) => {
    const mn = Math.min(r,g,b), mx = Math.max(r,g,b);
    return mx > 0 ? (mx - mn) / mx : 0;
  };

  // ─── Étape 0 : Pre-paint ombre + sol blanc ────────────────────────────────
  // Dans le bas (y > 82%), peindre les pixels très peu saturés en blanc pur
  // → efface l'ombre légère sur fond blanc avant le détourage
  const PREPAINT_Y = Math.floor(height * 0.82);
  for (let y = PREPAINT_Y; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r=px[idx], g=px[idx+1], b=px[idx+2];
      if (sat(r,g,b) < 0.20) {
        px[idx]=bgWhite[0]; px[idx+1]=bgWhite[1]; px[idx+2]=bgWhite[2];
      }
    }
  }
  console.log("Pre-paint ombre done");

  const N = width * height;
  const fruitMask = new Uint8Array(N);

  // ─── Étape 1 : Graines ────────────────────────────────────────────────────
  // Pastèque : peau verte vif + chair rouge (sat très élevée)
  const SEED_SAT = 0.35;
  for (let i = 0; i < N; i++) {
    const idx = i * channels;
    if (sat(px[idx], px[idx+1], px[idx+2]) > SEED_SAT)
      fruitMask[i] = 1;
  }
  console.log("Graines:", fruitMask.reduce((s,v)=>s+v,0));

  // ─── Étape 2 : Expansion BFS ──────────────────────────────────────────────
  const EXPAND_SAT = 0.15;
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
  console.log("Après expansion:", fruitMask.reduce((s,v)=>s+v,0));

  // ─── Étape 3 : Flood depuis les bords ─────────────────────────────────────
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

  // ─── Étape 4 : Alpha ──────────────────────────────────────────────────────
  for (let i=0;i<N;i++) {
    px[i*channels+3] = (fruitMask[i] || !bgReach[i]) ? 255 : 0;
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
