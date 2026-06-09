import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ─── Content ───────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    id:"fondations", num:"01", surtitre:"FONDATIONS",
    title:"Des fondations construites sur la confiance.",
    paragraphs:[
      "Chaque partenariat durable repose sur des fondations solides. Chez Tropicaura, nous sommes convaincus que le commerce international repose avant tout sur la confiance, la transparence et une vision commune du long terme.",
      "Nous construisons des relations capables de grandir, d'évoluer et de créer de la valeur sur le long terme.",
    ], side:"left",
  },
  {
    id:"reseau", num:"02", surtitre:"RÉSEAU",
    title:"Un réseau qui dépasse les frontières.",
    paragraphs:[
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés. Tropicaura connecte producteurs, logistiques et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème et ouvre de nouvelles opportunités.",
    ], side:"right",
  },
  {
    id:"terroirs", num:"03", surtitre:"TERROIRS",
    title:"Révéler le potentiel des terroirs tropicaux.",
    paragraphs:[
      "Certaines des opportunités agricoles les plus prometteuses au monde se trouvent dans les régions tropicales africaines — encore insuffisamment reconnues sur les marchés internationaux.",
      "Notre ambition : transformer ce potentiel en opportunités concrètes et créer de la valeur durable pour l'ensemble de la chaîne.",
    ], side:"left",
  },
  {
    id:"avenir", num:"04", surtitre:"AVENIR",
    title:"Construire l'avenir ensemble.",
    paragraphs:[
      "L'avenir du commerce tropical sera porté par des partenariats solides et une vision partagée. Tropicaura construit un écosystème où chaque acteur contribue à une réussite collective.",
      "Parce que les ambitions les plus importantes ne se construisent jamais seules.",
    ], side:"right",
  },
  {
    id:"cta", num:"05", surtitre:"REJOINDRE LE RÉSEAU",
    title:"Rejoignez un réseau qui façonne l'avenir du commerce tropical.",
    paragraphs:[
      "Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropicaura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité et de création de valeur.",
    ], side:"center", hasButton:true,
  },
];

const N = SECTIONS.length;

/* ─── SVG Network (viewBox 0 0 100 56, normalized 16:9) ─────────────────────
   segIdx → scroll progress band:
     0 = 0.00–0.20  (S1 Fondations)
     1 = 0.20–0.40  (S2 Réseau)
     2 = 0.40–0.60  (S3 Terroirs)
     3 = 0.60–0.80  (S4 Avenir)
     4 = 0.80–1.00  (S5 CTA)
   ─────────────────────────────────────────────────────────────────────────── */
const CRACKS = [
  /* S1 — tronc diagonal principal, haut-droite → centre-gauche */
  { id:"c1",  d:"M 73,2  C 66,10 58,19 50,28  C 44,33 38,40 33,48", segIdx:0 },

  /* S2 — continue + première branche droite */
  { id:"c2a", d:"M 33,48 C 27,51 21,53 15,55", segIdx:1 },
  { id:"c2b", d:"M 50,28 C 58,32 66,37 75,43", segIdx:1 },

  /* S3 — réseau icônes */
  { id:"c3a", d:"M 75,43 C 77,35 78,26 77,16",  segIdx:2 }, /* → ✈ (77,14) */
  { id:"c3b", d:"M 50,28 C 50,35 50,41 50,47",  segIdx:2 }, /* → 📦 (50,49) */
  { id:"c3c", d:"M 75,43 C 82,42 87,42 92,42",  segIdx:2 }, /* → 👥 (94,42) */
  { id:"c3d", d:"M 33,48 C 35,50 37,51 39,53",  segIdx:2 }, /* → 🤝 (40,54) */
  { id:"c3e", d:"M 75,43 C 76,46 78,49 79,52",  segIdx:2 }, /* → 🏭 (80,54) */

  /* S4 — expansion gauche */
  { id:"c4a", d:"M 15,55 C 15,51 15,47 16,43",  segIdx:3 }, /* → 🚢 (16,41) */
  { id:"c4b", d:"M 33,48 C 32,50 32,53 32,56",  segIdx:3 }, /* → 🚚 (32,58) — hors viewport sur phones, OK desktop */
  { id:"c4c", d:"M 15,55 C 11,53  8,51  6,49",  segIdx:3 }, /* → ✈₂ (5,48) */
  { id:"c4d", d:"M 33,48 C 37,50 41,52 44,54",  segIdx:3 }, /* → 🌐 (45,55) */

  /* S5 — constellation */
  { id:"c5a", d:"M 50,28 C 56,34 62,38 68,44",  segIdx:4 },
  { id:"c5b", d:"M 50,28 C 44,34 38,38 30,44",  segIdx:4 },
  { id:"c5c", d:"M 50,28 C 52,20 55,13 57,6",   segIdx:4 },
  { id:"c5d", d:"M 68,44 C 73,46 78,48 83,50",  segIdx:4 },
  { id:"c5e", d:"M 30,44 C 25,46 20,48 15,50",  segIdx:4 },
  { id:"c5f", d:"M 50,28 C 57,26 63,24 70,22",  segIdx:4 },
  { id:"c5g", d:"M 50,28 C 43,26 36,24 28,22",  segIdx:4 },
];

const ICON_NODES = [
  { id:"n-plane1", cx:77, cy:14, icon:"plane",     segIdx:2 },
  { id:"n-box",    cx:50, cy:49, icon:"box",        segIdx:2 },
  { id:"n-people", cx:94, cy:42, icon:"people",     segIdx:2 },
  { id:"n-shake",  cx:40, cy:54, icon:"handshake",  segIdx:2 },
  { id:"n-build",  cx:80, cy:54, icon:"building",   segIdx:2 },
  { id:"n-ship",   cx:16, cy:41, icon:"ship",       segIdx:3 },
  { id:"n-truck",  cx:32, cy:58, icon:"truck",      segIdx:3 },
  { id:"n-plane2", cx: 5, cy:48, icon:"plane",      segIdx:3 },
  { id:"n-globe",  cx:45, cy:55, icon:"globe",      segIdx:3 },
];

/* ─── Icon path data (local ±10 units, rendered via scale 0.12) ─────────── */
function IconPaths({ icon }) {
  const props = { stroke:"#D4AF37", strokeWidth:1.2, fill:"none", strokeLinecap:"round", strokeLinejoin:"round" };
  switch (icon) {
    case "plane":
      return <g {...props}>
        <path d="M 0,-8 L 8,3 L 0,1 L -8,3 Z"/>
        <line x1="0" y1="1" x2="0" y2="8"/>
        <line x1="-4" y1="4" x2="4" y2="4"/>
      </g>;
    case "box":
      return <g {...props}>
        <rect x="-7" y="-7" width="14" height="14" rx="1"/>
        <line x1="-7" y1="0" x2="7" y2="0"/>
        <line x1="0" y1="-7" x2="0" y2="7"/>
      </g>;
    case "people":
      return <g {...props}>
        <circle cx="-4" cy="-5" r="3"/>
        <circle cx="4"  cy="-5" r="3"/>
        <path d="M -9,5 C -9,0 0,-1 0,3 C 0,-1 9,0 9,5"/>
      </g>;
    case "handshake":
      return <g {...props}>
        <path d="M -8,-1 C -5,-4 -1,-4 0,-2 C 1,-4 5,-4 8,-1"/>
        <path d="M -8,-1 L -8,5 C -5,8 5,8 8,5 L 8,-1"/>
      </g>;
    case "building":
      return <g {...props}>
        <rect x="-7" y="-3" width="14" height="10" rx="0.5"/>
        <rect x="-3" y="-8" width="6" height="5"/>
        <line x1="-4" y1="3" x2="-4" y2="7"/>
        <line x1="0"  y1="3" x2="0"  y2="7"/>
        <line x1="4"  y1="3" x2="4"  y2="7"/>
      </g>;
    case "ship":
      return <g {...props}>
        <line x1="0" y1="-8" x2="0" y2="0"/>
        <path d="M -8,2 C -7,0 7,0 8,2 C 8,6 -8,6 -8,2 Z"/>
        <path d="M -5,6 C -3,9 3,9 5,6"/>
      </g>;
    case "truck":
      return <g {...props}>
        <rect x="-9" y="-3" width="11" height="7" rx="0.5"/>
        <path d="M 2,-3 L 9,-3 L 9,4 L 2,4"/>
        <path d="M 4,-3 L 4,-7 L 2,-7 L 2,-3"/>
        <circle cx="-5" cy="6" r="2"/>
        <circle cx="6"  cy="6" r="2"/>
      </g>;
    case "globe":
      return <g {...props}>
        <circle cx="0" cy="0" r="8"/>
        <path d="M 0,-8 C 2,-4 2,4 0,8 M 0,-8 C -2,-4 -2,4 0,8"/>
        <line x1="-8" y1="0" x2="8" y2="0"/>
      </g>;
    default: return null;
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Partenariats() {
  const pathRefs = useRef({});
  const nodeRefs = useRef({});

  useEffect(() => {
    const prevBg = document.body.style.background;
    document.body.style.background = "transparent";

    /* Lenis */
    const lenis = new Lenis({ duration:1.2, easing:t=>1-Math.pow(1-t,3), smoothWheel:true });
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = t => lenis.raf(t * 1000);
    gsap.ticker.add(tick);

    /* Measure + init crack paths */
    const lengths = {};
    CRACKS.forEach(c => {
      const el = pathRefs.current[c.id];
      if (!el) return;
      const L = el.getTotalLength();
      lengths[c.id] = L;
      el.setAttribute("stroke-dasharray",  L);
      el.setAttribute("stroke-dashoffset", L);
    });

    /* Init icons invisible */
    ICON_NODES.forEach(n => {
      const el = nodeRefs.current[n.id];
      if (el) el.style.opacity = "0";
    });

    /* Main scroll animation */
    const st = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.4,
      onUpdate: ({ progress }) => {
        CRACKS.forEach(c => {
          const el = pathRefs.current[c.id];
          if (!el || lengths[c.id] == null) return;
          const localP = Math.min(1, Math.max(0, (progress - c.segIdx * 0.2) / 0.2));
          el.setAttribute("stroke-dashoffset", lengths[c.id] * (1 - localP));
        });
        ICON_NODES.forEach(n => {
          const el = nodeRefs.current[n.id];
          if (!el) return;
          /* appear in the last 15% of its segment */
          const triggerP = n.segIdx * 0.2 + 0.17;
          const localP   = Math.min(1, Math.max(0, (progress - triggerP) / 0.03));
          el.style.opacity = localP;
        });
      },
    });

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(s => s.kill());
      document.body.style.background = prevBg;
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
          transition: color .40s ease, border-color .40s ease;
        }
        .pill-cta::before, .pill-cta::after {
          content:''; position:absolute; top:0; height:100%; width:51%;
          background:rgba(212,175,55,0.18);
          transition:transform 1.1s cubic-bezier(0.65,0,0.35,1); z-index:0;
        }
        .pill-cta::before { left:0;  transform:scaleX(0); transform-origin:left center; }
        .pill-cta::after  { right:0; transform:scaleX(0); transform-origin:right center; }
        .pill-cta span    { position:relative; z-index:1; }
        .pill-cta:hover::before, .pill-cta:hover::after { transform:scaleX(1); }
        .pill-cta:hover   { border-color:rgba(212,175,55,0.85); color:#F4EFE4; }
      `}</style>

      {/* ── Stone texture background ── */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        backgroundImage:"url('/png/texture-pierre.png')",
        backgroundSize:"cover", backgroundPosition:"center",
        backgroundColor:"#080808",
      }}/>

      {/* ── SVG Kintsugi overlay (fixed, viewBox 16:9) ── */}
      <svg
        viewBox="0 0 100 56"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position:"fixed", inset:0,
          width:"100vw", height:"100vh",
          zIndex:1, pointerEvents:"none",
        }}
      >
        <defs>
          <filter id="kglow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="iglow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.0" result="blur"/>
            <feColorMatrix in="blur" type="matrix"
              values="1.3 0.8 0 0 0.1  0.9 0.6 0 0 0  0 0 0 0 0  0 0 0 0.85 0"
              result="gb"/>
            <feMerge>
              <feMergeNode in="gb"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Crack paths */}
        {CRACKS.map(c => (
          <path
            key={c.id}
            ref={el => { pathRefs.current[c.id] = el; }}
            d={c.d}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.18"
            strokeLinecap="round"
            filter="url(#kglow)"
          />
        ))}

        {/* Icon nodes */}
        {ICON_NODES.map(n => (
          <g
            key={n.id}
            ref={el => { nodeRefs.current[n.id] = el; }}
            transform={`translate(${n.cx},${n.cy})`}
            filter="url(#iglow)"
            style={{ transition:"opacity 0.5s ease" }}
          >
            <circle r="1.8" fill="rgba(8,8,8,0.78)" stroke="#D4AF37" strokeWidth="0.07"/>
            <g transform="scale(0.12)">
              <IconPaths icon={n.icon}/>
            </g>
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
      <div style={{ height:`${N*100}vh`, position:"relative", zIndex:2 }}>
        {SECTIONS.map(s => {
          const isLeft   = s.side === "left";
          const isRight  = s.side === "right";
          const isCenter = s.side === "center";
          return (
            <section key={s.id} style={{
              height:"100vh", position:"relative", background:"transparent",
              display:"flex", alignItems:"center",
              justifyContent: isCenter ? "center" : isLeft ? "flex-start" : "flex-end",
              paddingLeft:  isLeft   ? "7vw" : "4vw",
              paddingRight: isRight  ? "7vw" : "4vw",
            }}>

              {/* Section number */}
              <div style={{
                position:"absolute",
                [isRight ? "left" : "right"]: "clamp(10px,2vw,22px)",
                top:"50%", transform:"translateY(-50%)",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              }}>
                <div style={{ width:1, height:40, background:"rgba(212,175,55,0.3)" }}/>
                <span style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontSize:9, fontWeight:700, letterSpacing:".2em",
                  color:"rgba(212,175,55,0.45)", writingMode:"vertical-rl",
                }}>{s.num}</span>
                <div style={{
                  width:4, height:4, borderRadius:"50%",
                  background:"rgba(212,175,55,0.5)",
                  boxShadow:"0 0 6px rgba(212,175,55,0.6)",
                }}/>
              </div>

              {/* Text — direct on texture, no rgba box */}
              <div style={{ maxWidth: isCenter ? 580 : 360, textAlign: isCenter ? "center" : "left" }}>
                <span style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontSize:9, fontWeight:700, letterSpacing:".30em",
                  textTransform:"uppercase", color:"#D4AF37",
                  marginBottom:14, display:"block",
                }}>{s.num} . {s.surtitre}</span>

                <div style={{
                  width:28, height:1, background:"rgba(212,175,55,0.45)",
                  marginBottom:18,
                  marginLeft: isCenter ? "auto" : 0,
                  marginRight: isCenter ? "auto" : 0,
                }}/>

                <h2 style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800,
                  fontSize: isCenter ? "clamp(22px,2.4vw,40px)" : "clamp(18px,2vw,32px)",
                  lineHeight:1.1, letterSpacing:"-.03em", color:"#FFFFFF", marginBottom:18,
                  textShadow:"0 2px 24px rgba(0,0,0,0.98), 0 0 60px rgba(0,0,0,0.9)",
                }}>{s.title}</h2>

                {s.paragraphs.map((p,pi) => (
                  <p key={pi} style={{
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    fontSize:"clamp(11px,0.9vw,13px)", lineHeight:1.9, fontWeight:400,
                    color:"rgba(255,255,255,0.62)",
                    marginBottom: pi < s.paragraphs.length-1 ? 10 : 0,
                    textShadow:"0 1px 10px rgba(0,0,0,0.95)",
                  }}>{p}</p>
                ))}

                {s.hasButton && (
                  <div style={{ marginTop:28 }}>
                    <a href="/contact" style={{ textDecoration:"none" }}>
                      <button className="pill-cta"><span>Devenir partenaire</span></button>
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
