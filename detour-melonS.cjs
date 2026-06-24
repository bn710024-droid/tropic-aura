"use strict";
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/HP/Downloads/prod-melonS.png";
const OUT = path.join(__dirname, "public/png/prod-melon.png");

function dist(r1,g1,b1,r2,g2,b2){ return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2); }

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  // Fond blanc (255,255,255)
  const bg = [255, 255, 255];
  const t0 = 34, t1 = 100;

  for(let i=0;i<width*height;i++){
    const idx=i*channels;
    const d=dist(px[idx],px[idx+1],px[idx+2],bg[0],bg[1],bg[2]);
    px[idx+3] = d<t0 ? 0 : d>t1 ? px[idx+3] : Math.round(px[idx+3]*(d-t0)/(t1-t0));
  }

  // Erosion 1px anti-halo
  const a0=new Uint8Array(width*height);
  for(let i=0;i<width*height;i++) a0[i]=px[i*channels+3];
  const ae=new Uint8Array(width*height);
  for(let y=0;y<height;y++) for(let x=0;x<width;x++){
    let mn=255;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
      const ny=y+dy,nx=x+dx;
      if(ny>=0&&ny<height&&nx>=0&&nx<width) mn=Math.min(mn,a0[ny*width+nx]);
    }
    ae[y*width+x]=mn;
  }
  for(let i=0;i<width*height;i++) px[i*channels+3]=ae[i];

  await sharp(px,{raw:{width,height,channels}}).png({compressionLevel:9}).toFile(OUT);
  console.log("Done →", OUT);
}
run().catch(console.error);
