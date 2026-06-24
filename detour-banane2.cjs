"use strict";
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/HP/Downloads/prod-banana2.png.jpeg";
const OUT = path.join(__dirname, "public/png/prod-banane.png");

async function samplePatch(pixels, width, channels, x0, y0, n) {
  let r=0,g=0,b=0,count=0;
  for(let dy=0;dy<n;dy++) for(let dx=0;dx<n;dx++){
    const idx=((y0+dy)*width+(x0+dx))*channels;
    r+=pixels[idx]; g+=pixels[idx+1]; b+=pixels[idx+2]; count++;
  }
  return [r/count, g/count, b/count];
}

function colorDist(r1,g1,b1,r2,g2,b2){
  return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);
}

async function run() {
  const meta = await sharp(SRC).metadata();
  console.log("Input:", meta.width, "x", meta.height, meta.space);

  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const pixels = raw.data;

  // Sample 4 coins 16×16
  const n = 16;
  const corners = await Promise.all([
    samplePatch(pixels, width, channels, 0, 0, n),
    samplePatch(pixels, width, channels, width-n, 0, n),
    samplePatch(pixels, width, channels, 0, height-n, n),
    samplePatch(pixels, width, channels, width-n, height-n, n),
  ]);
  const bg = corners.reduce((a,c)=>[a[0]+c[0]/4,a[1]+c[1]/4,a[2]+c[2]/4],[0,0,0]);
  console.log("BG color:", bg.map(v=>Math.round(v)));

  // Fond blanc → t0 légèrement plus haut pour protéger la chair crème
  const t0 = 34;
  const t1 = 98;

  for(let i=0; i<width*height; i++){
    const idx = i*channels;
    const d = colorDist(pixels[idx],pixels[idx+1],pixels[idx+2],bg[0],bg[1],bg[2]);
    let a;
    if(d < t0) a = 0;
    else if(d > t1) a = pixels[idx+3];
    else a = Math.round(pixels[idx+3] * (d-t0)/(t1-t0));
    pixels[idx+3] = a;
  }

  // Erosion 1px (anti-halo)
  const alpha = new Uint8Array(width*height);
  for(let i=0;i<width*height;i++) alpha[i]=pixels[i*channels+3];
  const eroded = new Uint8Array(width*height);
  for(let y=0;y<height;y++) for(let x=0;x<width;x++){
    let mn=255;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
      const ny=y+dy,nx=x+dx;
      if(ny>=0&&ny<height&&nx>=0&&nx<width) mn=Math.min(mn,alpha[ny*width+nx]);
    }
    eroded[y*width+x]=mn;
  }
  for(let i=0;i<width*height;i++) pixels[i*channels+3]=eroded[i];

  await sharp(pixels, { raw:{width,height,channels} })
    .png({ compressionLevel:9 })
    .toFile(OUT);
  console.log("Done →", OUT);
}

run().catch(console.error);
