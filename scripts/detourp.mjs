import sharp from "sharp";
const src=process.env.TEMP+"/piment.jpeg";
const outTmp=process.env.TEMP+"/piment-cut.png";

const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const w=info.width,h=info.height,ch=info.channels;
const sat=(r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b);return mx===0?0:(mx-mn)/mx;};
const smooth=(v,lo,hi)=>{const t=Math.min(1,Math.max(0,(v-lo)/(hi-lo)));return t*t*(3-2*t);};

let alpha=new Float32Array(w*h);
for(let p=0;p<w*h;p++){const i=p*ch;alpha[p]=smooth(sat(data[i],data[i+1],data[i+2]),0.11,0.20);}

const med=(s)=>{const d=new Float32Array(w*h);const win=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){win.length=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;
      win.push((nx<0||ny<0||nx>=w||ny>=h)?0:s[ny*w+nx]);}
    win.sort((a,b)=>a-b);d[y*w+x]=win[4];}return d;};
alpha=med(med(alpha));

// composantes >= MIN
const MIN=200;const seen=new Uint8Array(w*h),keep=new Uint8Array(w*h),st=[];
for(let s=0;s<w*h;s++){if(seen[s]||alpha[s]<0.5)continue;
  st.length=0;st.push(s);seen[s]=1;const c=[s];
  while(st.length){const q=st.pop(),qx=q%w,qy=(q/w)|0;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
      const nx=qx+dx,ny=qy+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const n=ny*w+nx;
      if(!seen[n]&&alpha[n]>=0.5){seen[n]=1;st.push(n);c.push(n);}}}
  if(c.length>=MIN)for(const p of c)keep[p]=1;}
for(let p=0;p<w*h;p++) if(!keep[p]) alpha[p]=0;

// remplissage trous (reflets spéculaires clairs)
const bg=new Uint8Array(w*h),fq=[];
const pb=(p)=>{if(!bg[p]&&alpha[p]<0.5){bg[p]=1;fq.push(p);}};
for(let x=0;x<w;x++){pb(x);pb((h-1)*w+x);}
for(let y=0;y<h;y++){pb(y*w);pb(y*w+w-1);}
while(fq.length){const q=fq.pop(),qx=q%w,qy=(q/w)|0;
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=qx+dx,ny=qy+dy;
    if(nx<0||ny<0||nx>=w||ny>=h)continue;pb(ny*w+nx);}}
let filled=0;
for(let p=0;p<w*h;p++) if(alpha[p]<1&&!bg[p]){alpha[p]=1;filled++;}
console.log("trous bouchés:",filled);

// érosion 1px
const er=new Float32Array(w*h);
for(let y=0;y<h;y++)for(let x=0;x<w;x++){let m=alpha[y*w+x];
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;
    if(nx>=0&&ny>=0&&nx<w&&ny<h)m=Math.min(m,alpha[ny*w+nx]);}
  er[y*w+x]=m;}
alpha=er;

// un-matte contre ~240 (fond blanc légèrement gris)
const M=240,o=Buffer.alloc(w*h*4);
for(let p=0;p<w*h;p++){const i=p*ch,j=p*4;const a=alpha[p];
  if(a<=0){o[j+3]=0;continue;}
  let r=data[i],g=data[i+1],b=data[i+2];
  if(a<1){r=(r-(1-a)*M)/a;g=(g-(1-a)*M)/a;b=(b-(1-a)*M)/a;}
  o[j]=Math.max(0,Math.min(255,Math.round(r)));o[j+1]=Math.max(0,Math.min(255,Math.round(g)));
  o[j+2]=Math.max(0,Math.min(255,Math.round(b)));o[j+3]=Math.round(a*255);}

await sharp(o,{raw:{width:w,height:h,channels:4}}).png().trim({threshold:8}).toFile(outTmp);
// preview sur le vert de la section (#2E4A1C)
const G={r:0x2E,g:0x4A,b:0x1C};
const fr=await sharp(outTmp).resize(420).png().toBuffer();
await sharp({create:{width:480,height:480,channels:4,background:{...G,alpha:1}}})
  .composite([{input:fr,gravity:"center"}]).png().toFile(process.env.TEMP+"/piment-brown.png");
const m=await sharp(outTmp).metadata();console.log("cut:",m.width+"x"+m.height);
