import { useEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";

/* ─── Content ───────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    id:"fondations", num:"01", surtitre:"FONDATIONS",
    title:"Des fondations construites sur la confiance.",
    paragraphs:[
      "Chaque partenariat durable repose sur des fondations solides.",
      "Chez Tropic-Aura, nous croyons que le commerce international ne se résume pas à l'échange de produits. Il repose avant tout sur la confiance, la transparence et une vision commune du long terme.",
      "Nous ne recherchons pas des opportunités ponctuelles. Nous construisons des relations capables de grandir, d'évoluer et de créer de la valeur sur le long terme.",
    ], side:"left",
  },
  {
    id:"reseau", num:"02", surtitre:"RÉSEAU",
    title:"Un réseau qui dépasse les frontières.",
    paragraphs:[
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés.",
      "Tropic-Aura développe des relations stratégiques à travers les principales régions tropicales d'Afrique, en connectant producteurs, stations de conditionnement, partenaires logistiques, distributeurs et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème. Chaque partenariat ouvre de nouvelles opportunités.",
    ], side:"right",
  },
  {
    id:"terroirs", num:"03", surtitre:"TERROIRS",
    title:"Révéler le potentiel des terroirs tropicaux.",
    paragraphs:[
      "Certaines des opportunités agricoles les plus prometteuses au monde se trouvent dans les régions tropicales africaines.",
      "Tropic-Aura contribue à un avenir où ces territoires sont reconnus pour leur richesse naturelle, leur professionnalisme, leur capacité d'innovation et leur aptitude à répondre aux standards les plus exigeants du commerce mondial.",
      "Notre ambition est simple : transformer le potentiel en opportunités concrètes et créer de la valeur durable pour l'ensemble des acteurs de la chaîne.",
    ], side:"left",
  },
  {
    id:"avenir", num:"04", surtitre:"AVENIR",
    title:"Construire l'avenir ensemble.",
    paragraphs:[
      "Nous croyons que l'avenir du commerce tropical sera porté par des partenariats solides, une vision partagée et une collaboration durable.",
      "Tropic-Aura construit un écosystème dans lequel chaque acteur contribue à une réussite collective.",
      "Nous ne voulons pas simplement développer des relations commerciales. Nous souhaitons bâtir des alliances stratégiques capables d'accompagner la prochaine génération du commerce agricole international.",
    ], side:"right",
  },
  {
    id:"cta", num:"05", surtitre:"REJOINDRE LE RÉSEAU",
    title:"Rejoignez un réseau qui façonne l'avenir du commerce tropical.",
    paragraphs:[
      "Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropic-Aura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité et de création de valeur.",
    ], side:"left", hasButton:true,
  },
];

const N = SECTIONS.length;

/* ─── Crack paths (SVG viewBox 0 0 100 56) ─────────────────────────────── */
const CRACKS = [
  { id:"c1",  sw:0.10, segIdx:0, d:"M 74,1 C 72,5 70,9 68,13 L 66,17 C 63,21 61,25 59,29 L 57,33 C 54,37 51,41 47,45 L 45,48 C 43,51 40,53 38,55" },
  { id:"c1b", sw:0.04, segIdx:0, d:"M 66,17 C 68,19 70,20 71,22" },
  { id:"c1c", sw:0.04, segIdx:0, d:"M 47,45 C 45,46 44,47 45,49" },
  { id:"c2a", sw:0.08, segIdx:1, d:"M 38,55 C 33,54 28,53 23,51 L 19,49 C 15,47 12,45 10,43" },
  { id:"c2b", sw:0.08, segIdx:1, d:"M 59,29 C 63,31 66,34 69,38 L 71,42 C 72,45 73,47 75,50" },
  { id:"c2c", sw:0.04, segIdx:1, d:"M 23,51 C 21,49 20,47 21,45" },
  { id:"c2d", sw:0.04, segIdx:1, d:"M 10,43 C 8,41 7,39 8,37" },
  { id:"c3a", sw:0.07, segIdx:2, d:"M 75,50 C 76,45 77,39 77,32 L 77,26 C 77,21 76,17 76,14" },
  { id:"c3b", sw:0.07, segIdx:2, d:"M 57,33 C 56,37 55,42 54,46 L 53,49 L 53,51" },
  { id:"c3c", sw:0.07, segIdx:2, d:"M 75,50 C 79,49 83,47 87,45 L 90,43" },
  { id:"c3d", sw:0.06, segIdx:2, d:"M 38,55 C 39,54 40,53 40,52" },
  { id:"c3e", sw:0.06, segIdx:2, d:"M 75,50 C 77,52 79,54 81,55" },
  { id:"c3f", sw:0.04, segIdx:2, d:"M 77,32 C 79,31 81,29 82,27" },
  { id:"c4a", sw:0.07, segIdx:3, d:"M 10,43 C 11,39 12,35 13,31 L 14,28 L 15,26" },
  { id:"c4b", sw:0.06, segIdx:3, d:"M 38,55 C 36,55 34,55 32,54" },
  { id:"c4c", sw:0.06, segIdx:3, d:"M 10,43 C 7,42 5,40 5,38" },
  { id:"c4d", sw:0.06, segIdx:3, d:"M 45,48 C 46,51 46,54 46,55" },
  { id:"c4e", sw:0.04, segIdx:3, d:"M 15,26 C 13,24 12,22 13,20" },
  { id:"c5a", sw:0.06, segIdx:4, d:"M 50,30 C 53,34 57,38 61,42 L 64,45 C 66,47 68,49 70,51" },
  { id:"c5b", sw:0.06, segIdx:4, d:"M 50,30 C 47,34 43,38 39,42 L 36,45 C 34,47 32,49 30,51" },
  { id:"c5c", sw:0.06, segIdx:4, d:"M 50,30 C 51,25 53,18 54,12 L 55,8 C 56,5 57,2 58,1" },
  { id:"c5d", sw:0.05, segIdx:4, d:"M 70,51 C 73,52 76,53 79,54 L 81,55" },
  { id:"c5e", sw:0.05, segIdx:4, d:"M 30,51 C 27,52 24,53 21,54 L 19,55" },
  { id:"c5f", sw:0.05, segIdx:4, d:"M 50,30 C 56,29 62,27 67,25 L 70,23" },
  { id:"c5g", sw:0.05, segIdx:4, d:"M 50,30 C 44,29 38,27 33,25 L 30,23" },
];

const ICON_NODES = [
  { id:"n-plane1", cx:76, cy:14, icon:"plane",     segIdx:2 },
  { id:"n-box",    cx:53, cy:51, icon:"box",        segIdx:2 },
  { id:"n-people", cx:90, cy:43, icon:"people",     segIdx:2 },
  { id:"n-shake",  cx:40, cy:52, icon:"handshake",  segIdx:2 },
  { id:"n-build",  cx:81, cy:55, icon:"building",   segIdx:2 },
  { id:"n-ship",   cx:15, cy:26, icon:"ship",       segIdx:3 },
  { id:"n-truck",  cx:32, cy:54, icon:"truck",      segIdx:3 },
  { id:"n-plane2", cx: 5, cy:38, icon:"plane",      segIdx:3 },
  { id:"n-globe",  cx:46, cy:55, icon:"globe",      segIdx:3 },
];

/* ─── Render a glowing crack on 2D canvas ───────────────────────────────
   Multi-pass : outer glow → inner glow → bright core
   progress 0→1 : reveal from start point
   fade     0→1 : overall section opacity
   ─────────────────────────────────────────────────────────────────────── */
function drawCrack(ctx, pts, progress, fade, sw, W, H, bright) {
  if (!pts || pts.length < 2 || fade <= 0 || progress <= 0) return;

  const n = Math.max(2, Math.floor(progress * (pts.length - 1)) + 1);
  const slice = pts.slice(0, Math.min(n, pts.length));
  if (slice.length < 2) return;

  const px = slice.map(p => ({ x: (p.x / 100) * W, y: (p.y / 56) * H }));
  const w  = sw * (W / 100);  // stroke width in pixels
  const b  = bright ? 1.5 : 1.0;

  const trace = () => {
    ctx.beginPath();
    ctx.moveTo(px[0].x, px[0].y);
    for (let i = 1; i < px.length; i++) ctx.lineTo(px[i].x, px[i].y);
  };

  /* Pass 1 — wide diffuse outer glow */
  ctx.save();
  ctx.globalAlpha = fade * 0.18 * b;
  ctx.strokeStyle  = "#B86B08";
  ctx.lineWidth    = w * 7;
  ctx.lineCap      = "round";
  ctx.lineJoin     = "round";
  ctx.shadowColor  = "#C8780A";
  ctx.shadowBlur   = w * 14;
  trace(); ctx.stroke();
  ctx.restore();

  /* Pass 2 — warm inner glow */
  ctx.save();
  ctx.globalAlpha = fade * 0.55 * b;
  ctx.strokeStyle  = "#D4AF37";
  ctx.lineWidth    = w * 3;
  ctx.lineCap      = "round";
  ctx.lineJoin     = "round";
  ctx.shadowColor  = "#E8C04A";
  ctx.shadowBlur   = w * 6;
  trace(); ctx.stroke();
  ctx.restore();

  /* Pass 3 — bright gold/white core */
  ctx.save();
  ctx.globalAlpha = fade * Math.min(1, b);
  ctx.strokeStyle  = "#FFF4A0";
  ctx.lineWidth    = w * 0.9;
  ctx.lineCap      = "round";
  ctx.lineJoin     = "round";
  ctx.shadowColor  = "#FFFDE0";
  ctx.shadowBlur   = w * 2.5;
  trace(); ctx.stroke();
  ctx.restore();
}

/* ─── SVG icon paths ─────────────────────────────────────────────────────── */
function IconPaths({ icon }) {
  const p = { stroke:"#D4AF37", strokeWidth:1.1, fill:"none", strokeLinecap:"round", strokeLinejoin:"round" };
  switch (icon) {
    case "plane":     return <g {...p}><path d="M 0,-8 L 8,3 L 0,1 L -8,3 Z"/><line x1="0" y1="1" x2="0" y2="8"/><line x1="-4" y1="4" x2="4" y2="4"/></g>;
    case "box":       return <g {...p}><rect x="-7" y="-7" width="14" height="14" rx="1"/><line x1="-7" y1="0" x2="7" y2="0"/><line x1="0" y1="-7" x2="0" y2="7"/></g>;
    case "people":    return <g {...p}><circle cx="-4" cy="-5" r="3"/><circle cx="4" cy="-5" r="3"/><path d="M -9,5 C -9,0 0,-1 0,3 C 0,-1 9,0 9,5"/></g>;
    case "handshake": return <g {...p}><path d="M -8,-1 C -5,-4 -1,-4 0,-2 C 1,-4 5,-4 8,-1"/><path d="M -8,-1 L -8,5 C -5,8 5,8 8,5 L 8,-1"/></g>;
    case "building":  return <g {...p}><rect x="-7" y="-3" width="14" height="10" rx="0.5"/><rect x="-3" y="-8" width="6" height="5"/><line x1="-4" y1="3" x2="-4" y2="7"/><line x1="0" y1="3" x2="0" y2="7"/><line x1="4" y1="3" x2="4" y2="7"/></g>;
    case "ship":      return <g {...p}><line x1="0" y1="-8" x2="0" y2="0"/><path d="M -8,2 C -7,0 7,0 8,2 C 8,6 -8,6 -8,2 Z"/><path d="M -5,6 C -3,9 3,9 5,6"/></g>;
    case "truck":     return <g {...p}><rect x="-9" y="-3" width="11" height="7" rx="0.5"/><path d="M 2,-3 L 9,-3 L 9,4 L 2,4"/><path d="M 4,-3 L 4,-7 L 2,-7 L 2,-3"/><circle cx="-5" cy="6" r="2"/><circle cx="6" cy="6" r="2"/></g>;
    case "globe":     return <g {...p}><circle cx="0" cy="0" r="8"/><path d="M 0,-8 C 2,-4 2,4 0,8 M 0,-8 C -2,-4 -2,4 0,8"/><line x1="-8" y1="0" x2="8" y2="0"/></g>;
    default: return null;
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Partenariats() {
  const canvasRef   = useRef(null);
  const imgRef      = useRef(null);
  const sectionRefs = useRef([]);
  const nodeRefs    = useRef({});
  const cracksData  = useRef({});  // { [id]: [{x,y}] }
  const segState    = useRef(Array.from({ length: N }, () => ({ progress: 0, fade: 0 })));
  const hoveredSeg  = useRef(-1);
  const stopRef     = useRef(false);

  /* Hover handlers — brighten crack glow */
  const onSegEnter = (idx) => { hoveredSeg.current = idx; };
  const onSegLeave = ()    => { hoveredSeg.current = -1;  };

  useEffect(() => {
    stopRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    /* ── Resize ── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Sample SVG paths → arrays of {x,y} points ──
       Uses a hidden off-screen SVG to call getPointAtLength
       so we get accurate points for any cubic bezier / line mix.
       ─────────────────────────────────────────────────────── */
    const NS  = "http://www.w3.org/2000/svg";
    const tmp = document.createElementNS(NS, "svg");
    tmp.setAttribute("viewBox", "0 0 100 56");
    tmp.style.cssText = "position:absolute;visibility:hidden;width:1px;height:1px;overflow:hidden;top:-1px;left:-1px";
    document.body.appendChild(tmp);

    CRACKS.forEach(c => {
      const el = document.createElementNS(NS, "path");
      el.setAttribute("d", c.d);
      tmp.appendChild(el);
      const L  = el.getTotalLength();
      const n  = Math.max(60, Math.ceil(L * 6));
      cracksData.current[c.id] = Array.from({ length: n + 1 }, (_, i) => {
        const pt = el.getPointAtLength((i / n) * L);
        return { x: pt.x, y: pt.y };
      });
      tmp.removeChild(el);
    });
    document.body.removeChild(tmp);

    /* ── Lenis smooth scroll + texture parallax ── */
    const lenis = new Lenis({ duration:1.2, easing:t=>1-Math.pow(1-t,3), smoothWheel:true });
    const lenisLoop = (t) => {
      if (stopRef.current) return;
      lenis.raf(t);
      const s    = lenis.animatedScroll ?? window.scrollY ?? 0;
      const prog = Math.min(1, Math.max(0, s / ((N - 1) * (window.innerHeight || 900))));
      if (imgRef.current) imgRef.current.style.objectPosition = `center ${(prog * prog * 85).toFixed(1)}%`;
      requestAnimationFrame(lenisLoop);
    };
    requestAnimationFrame(lenisLoop);

    /* ── Init icons hidden ── */
    ICON_NODES.forEach(n => {
      const el = nodeRefs.current[n.id];
      if (el) el.style.opacity = "0";
    });

    /* ── Canvas render loop ── */
    const render = () => {
      if (stopRef.current) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* Dormant fissures — stone crack texture, always subtle */
      CRACKS.forEach(c => {
        const pts  = cracksData.current[c.id];
        if (!pts || pts.length < 2) return;
        const pixW = c.sw * (W / 100);
        ctx.save();
        ctx.globalAlpha = 0.11;
        ctx.strokeStyle = "#4A3008";
        ctx.lineWidth   = pixW;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.beginPath();
        ctx.moveTo((pts[0].x / 100) * W, (pts[0].y / 56) * H);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo((pts[i].x / 100) * W, (pts[i].y / 56) * H);
        }
        ctx.stroke();
        ctx.restore();
      });

      /* Animated gold cracks — per section */
      CRACKS.forEach(c => {
        const state = segState.current[c.segIdx];
        if (state.fade <= 0.01) return;
        drawCrack(
          ctx,
          cracksData.current[c.id],
          state.progress,
          state.fade,
          c.sw, W, H,
          hoveredSeg.current === c.segIdx,
        );
      });

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    /* ── IntersectionObserver : section enter → animate, exit → fade + reset ── */
    const observers = sectionRefs.current.map((el, idx) => {
      if (!el) return null;
      const icons = ICON_NODES.filter(n => n.segIdx === idx);
      const state = segState.current[idx];

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          /* Enter : cracks émergent organiquement */
          gsap.killTweensOf(state);
          gsap.to(state, { fade: 1, duration: 0.55, ease: "power2.out" });
          gsap.to(state, { progress: 1, duration: 2.5, ease: "power1.inOut", delay: 0.1 });
          icons.forEach((n, ni) => {
            const ico = nodeRefs.current[n.id];
            if (ico) gsap.to(ico, { opacity: 1, duration: 0.7, delay: 1.8 + ni * 0.15, ease: "power2.out" });
          });
        } else {
          /* Exit : fade out, puis reset progress pour la prochaine entrée */
          gsap.killTweensOf(state);
          gsap.to(state, {
            fade: 0, duration: 0.75, ease: "power2.in",
            onComplete: () => { state.progress = 0; },
          });
          icons.forEach(n => {
            const ico = nodeRefs.current[n.id];
            if (ico) gsap.to(ico, { opacity: 0, duration: 0.35, ease: "power2.in" });
          });
        }
      }, { threshold: 0.35 });

      obs.observe(el);
      return obs;
    });

    return () => {
      stopRef.current = true;
      lenis.destroy();
      window.removeEventListener("resize", resize);
      observers.forEach(o => o?.disconnect());
    };
  }, []);

  return (
    <div style={{ background:"#080808", overflowX:"hidden" }}>

      <style>{`
        .pill-cta {
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:11px;
          letter-spacing:.18em; text-transform:uppercase; color:#C9912B;
          background:transparent; border:1.5px solid rgba(201,145,43,0.50);
          border-radius:100px; padding:13px 38px; cursor:pointer;
          position:relative; overflow:hidden;
          transition:color .40s ease, border-color .40s ease;
        }
        .pill-cta::before,.pill-cta::after {
          content:''; position:absolute; top:0; height:100%; width:51%;
          background:rgba(212,175,55,0.18);
          transition:transform 1.1s cubic-bezier(0.65,0,0.35,1); z-index:0;
        }
        .pill-cta::before { left:0;  transform:scaleX(0); transform-origin:left center; }
        .pill-cta::after  { right:0; transform:scaleX(0); transform-origin:right center; }
        .pill-cta span    { position:relative; z-index:1; }
        .pill-cta:hover::before,.pill-cta:hover::after { transform:scaleX(1); }
        .pill-cta:hover   { border-color:rgba(212,175,55,0.85); color:#F4EFE4; }
        .pill-cta .arr    { margin-left:10px; display:inline-block; transition:transform .35s ease; }
        .pill-cta:hover .arr { transform:translateX(5px); }
      `}</style>

      {/* ── Texture de fond — parallax objectPosition ── */}
      <img
        ref={imgRef}
        src="/png/texture-pierre.png"
        alt=""
        style={{
          position:"fixed", inset:0, zIndex:0,
          width:"100vw", height:"100vh",
          objectFit:"cover", objectPosition:"center 0%",
        }}
      />

      {/* ── Canvas — fissures dorées multi-passes ── */}
      <canvas
        ref={canvasRef}
        style={{ position:"fixed", inset:0, zIndex:1, pointerEvents:"none" }}
      />

      {/* ── SVG — icônes aux nœuds ── */}
      <svg
        viewBox="0 0 100 56"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position:"fixed", inset:0, zIndex:2,
          width:"100vw", height:"100vh",
          pointerEvents:"none",
        }}
      >
        <defs>
          <filter id="iglow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.0" result="b"/>
            <feColorMatrix in="b" type="matrix"
              values="1.2 0.7 0 0 0.1  0.8 0.6 0 0 0  0 0 0 0 0  0 0 0 0.8 0" result="gb"/>
            <feMerge><feMergeNode in="gb"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {ICON_NODES.map(n => (
          <g
            key={n.id}
            ref={el => { nodeRefs.current[n.id] = el; }}
            transform={`translate(${n.cx},${n.cy})`}
            filter="url(#iglow)"
            style={{ pointerEvents:"all", cursor:"pointer" }}
            onMouseEnter={() => onSegEnter(n.segIdx)}
            onMouseLeave={onSegLeave}
          >
            <circle r="2.4" fill="rgba(6,6,6,0.90)" stroke="#D4AF37" strokeWidth="0.07"/>
            <g transform="scale(0.14)"><IconPaths icon={n.icon}/></g>
          </g>
        ))}
      </svg>

      {/* ── Header ── */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200, height:66,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 clamp(20px,5vw,48px)", pointerEvents:"none",
      }}>
        <a href="/" style={{
          pointerEvents:"auto", fontFamily:"'Plus Jakarta Sans',sans-serif",
          fontWeight:800, fontSize:18, letterSpacing:".04em",
          color:"#F4EFE4", textDecoration:"none",
          textShadow:"0 1px 12px rgba(0,0,0,.9)",
        }}>TROPICAURA</a>
        <a href="/" style={{ pointerEvents:"auto", textDecoration:"none" }}>
          <span style={{
            display:"inline-block", fontFamily:"'Plus Jakarta Sans',sans-serif",
            fontWeight:700, fontSize:12, letterSpacing:".12em",
            textTransform:"uppercase", color:"#F4EFE4",
            background:"rgba(0,0,0,.4)", border:"1.5px solid rgba(255,255,255,.28)",
            borderRadius:100, padding:"9px 20px", cursor:"pointer",
          }}>← Accueil</span>
        </a>
      </header>

      {/* ── 500vh scroll container ── */}
      <div style={{ height:`${N*100}vh`, position:"relative", zIndex:3 }}>
        {SECTIONS.map((s, idx) => {
          const isLeft   = s.side === "left";
          const isRight  = s.side === "right";
          return (
            <section
              key={s.id}
              ref={el => { sectionRefs.current[idx] = el; }}
              style={{
                height:"100vh", position:"relative", background:"transparent",
                display:"flex", alignItems:"center",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                paddingLeft:  isLeft  ? "6vw" : "4vw",
                paddingRight: isRight ? "6vw" : "4vw",
              }}
            >
              {/* Numéro */}
              <div style={{
                position:"absolute", top:"clamp(24px,3vh,40px)",
                [isLeft ? "left" : "right"]: "clamp(16px,2.5vw,32px)",
                display:"flex", alignItems:"center", gap:10,
              }}>
                <span style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontSize:"clamp(9px,0.6vw,11px)", fontWeight:700,
                  letterSpacing:".22em", color:"rgba(212,175,55,0.40)",
                }}>{s.num}</span>
                <div style={{ width:1, height:28, background:"rgba(212,175,55,0.22)" }}/>
              </div>

              {/* Bloc texte — survol déclenche le glow ── */}
              <div
                style={{ maxWidth:"min(400px,40vw)", cursor:"default" }}
                onMouseEnter={() => onSegEnter(idx)}
                onMouseLeave={onSegLeave}
              >
                <span style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontSize:"clamp(8px,0.58vw,10px)", fontWeight:700,
                  letterSpacing:".32em", textTransform:"uppercase",
                  color:"#D4AF37", marginBottom:12, display:"block",
                }}>{s.num} — {s.surtitre}</span>

                <div style={{ width:32, height:1, background:"rgba(212,175,55,0.5)", marginBottom:16 }}/>

                <h2 style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800,
                  fontSize:"clamp(20px,2.2vw,36px)",
                  lineHeight:1.08, letterSpacing:"-.03em",
                  color:"#FFFFFF", marginBottom:20,
                  textShadow:"0 2px 28px rgba(0,0,0,1), 0 0 50px rgba(0,0,0,0.9)",
                }}>{s.title}</h2>

                {s.paragraphs.map((p, pi) => (
                  <p key={pi} style={{
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    fontSize:"clamp(10px,0.80vw,12px)", lineHeight:1.85, fontWeight:400,
                    color:"rgba(255,255,255,0.58)",
                    marginBottom: pi < s.paragraphs.length - 1 ? 10 : 0,
                    textShadow:"0 1px 12px rgba(0,0,0,0.98)",
                  }}>{p}</p>
                ))}

                {s.hasButton && (
                  <div style={{ marginTop:32 }}>
                    <a href="/contact" style={{ textDecoration:"none" }}>
                      <button className="pill-cta">
                        <span>Devenir partenaire <span className="arr">→</span></span>
                      </button>
                    </a>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
