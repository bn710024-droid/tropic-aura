"use strict";
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/HP/Downloads/prod-melons2.png.jpeg";
const OUT = path.join(__dirname, "public/png/prod-melon.png");

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  // Clé de désaturation : retire les pixels gris/neutres (bas. saturation)
  // et garde les pixels colorés (orange/vert = haute saturation)
  const t0sat = 0.10; // fully transparent below this saturation
  const t1sat = 0.28; // fully opaque above this saturation

  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const r = px[idx] / 255, g = px[idx+1] / 255, b = px[idx+2] / 255;
    const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
    const sat = mx > 0 ? (mx - mn) / mx : 0;

    let a;
    if (sat < t0sat) a = 0;
    else if (sat > t1sat) a = px[idx+3];
    else a = Math.round(px[idx+3] * (sat - t0sat) / (t1sat - t0sat));
    px[idx+3] = a;
  }

  // Erosion 1px anti-halo
  const a0 = new Uint8Array(width*height);
  for (let i=0;i<width*height;i++) a0[i]=px[i*channels+3];
  const ae = new Uint8Array(width*height);
  for (let y=0;y<height;y++) for(let x=0;x<width;x++){
    let mn=255;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
      const ny=y+dy,nx=x+dx;
      if(ny>=0&&ny<height&&nx>=0&&nx<width) mn=Math.min(mn,a0[ny*width+nx]);
    }
    ae[y*width+x]=mn;
  }
  for(let i=0;i<width*height;i++) px[i*channels+3]=ae[i];

  // Fondu doux uniquement sur les 10% du bas
  for(let y=0;y<height;y++){
    const fy=y/height;
    if(fy>=0.90){
      const mult=1-((fy-0.90)/0.10);
      for(let x=0;x<width;x++){
        const idx=(y*width+x)*channels;
        px[idx+3]=Math.round(px[idx+3]*mult);
      }
    }
  }

  await sharp(px, { raw:{width,height,channels} }).png({ compressionLevel:9 }).toFile(OUT);
  console.log("Done →", OUT);
}
run().catch(console.error);
