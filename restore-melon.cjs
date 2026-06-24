"use strict";
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/HP/Downloads/prod-melons2.png.jpeg";
const OUT = path.join(__dirname, "public/png/prod-melon.png");

async function samplePatch(px, w, ch, x0, y0, n) {
  let r=0,g=0,b=0,c=0;
  for(let dy=0;dy<n;dy++) for(let dx=0;dx<n;dx++){
    const i=((y0+dy)*w+(x0+dx))*ch;
    r+=px[i];g+=px[i+1];b+=px[i+2];c++;
  }
  return [r/c,g/c,b/c];
}
function dist(r1,g1,b1,r2,g2,b2){ return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2); }

async function run() {
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = raw.info;
  const px = raw.data;
  console.log("Source:", width, "x", height);

  // Moyenne des 4 coins (fond gris variable)
  const corners = await Promise.all([
    samplePatch(px,width,channels,0,0,16),
    samplePatch(px,width,channels,width-16,0,16),
    samplePatch(px,width,channels,0,height-16,16),
    samplePatch(px,width,channels,width-16,height-16,16),
  ]);
  const bg = corners.reduce((a,c)=>[a[0]+c[0]/4,a[1]+c[1]/4,a[2]+c[2]/4],[0,0,0]);
  console.log("BG:", bg.map(v=>Math.round(v)));

  // Chroma-key fond gris
  const t0=22, t1=80;
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

  // Fondu DOUX uniquement sur les 12% du bas (86%→100%) pour adoucir les éclats
  for(let y=0;y<height;y++){
    const fy=y/height;
    if(fy>=0.86){
      const t=(fy-0.86)/(1-0.86);
      const mult=1-t*t; // ease-in doux
      for(let x=0;x<width;x++){
        const idx=(y*width+x)*channels;
        px[idx+3]=Math.round(px[idx+3]*mult);
      }
    }
  }

  await sharp(px,{raw:{width,height,channels}}).png({compressionLevel:9}).toFile(OUT);
  console.log("Done →", OUT);
}
run().catch(console.error);
