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

/* ─── SVG Crack Network ──────────────────────────────────────────────────────
   viewBox 0 0 100 56  (16:9 normalisé)
   segIdx 0→S1  1→S2  2→S3  3→S4  4→S5   (chaque segment = 20% du scroll)
   sw = strokeWidth en unités SVG
   ─────────────────────────────────────────────────────────────────────────── */
const CRACKS = [
  /* ── S1 : tronc diagonal principal, organique ── */
  { id:"c1",  sw:0.12, segIdx:0,
    d:"M 76,2 C 73,5 70,8 67,12 L 65,15 C 62,18 59,22 56,26 L 54,29 C 51,33 47,37 44,41 L 42,44 C 40,47 38,50 36,53" },
  { id:"c1b", sw:0.05, segIdx:0,
    d:"M 65,15 C 67,17 69,18 70,20" },
  { id:"c1c", sw:0.05, segIdx:0,
    d:"M 44,41 C 42,42 41,44 42,46" },

  /* ── S2 : continuation gauche + branche droite ── */
  { id:"c2a", sw:0.09, segIdx:1,
    d:"M 36,53 C 32,54 28,54 24,53 L 21,52 C 18,52 15,53 13,55" },
  { id:"c2b", sw:0.09, segIdx:1,
    d:"M 56,26 C 60,28 63,31 67,35 L 69,38 C 71,41 73,43 75,46" },
  { id:"c2c", sw:0.04, segIdx:1,
    d:"M 24,53 C 23,51 22,50 23,48" },

  /* ── S3 : réseau icônes ── */
  { id:"c3a", sw:0.08, segIdx:2,
    d:"M 75,46 C 77,41 78,35 78,28 L 78,22 C 78,18 77,16 77,14" },
  { id:"c3b", sw:0.08, segIdx:2,
    d:"M 54,29 C 53,34 52,40 51,45 L 50,48 L 50,49" },
  { id:"c3c", sw:0.08, segIdx:2,
    d:"M 75,46 C 80,45 85,44 88,43 L 90,42" },
  { id:"c3d", sw:0.07, segIdx:2,
    d:"M 36,53 C 37,53 37,52 38,52" },
  { id:"c3e", sw:0.07, segIdx:2,
    d:"M 75,46 C 77,49 79,51 80,53 L 81,54" },
  { id:"c3f", sw:0.04, segIdx:2,
    d:"M 78,28 C 80,27 82,26 83,24" },

  /* ── S4 : expansion gauche ── */
  { id:"c4a", sw:0.08, segIdx:3,
    d:"M 13,55 C 13,51 14,47 14,44 L 15,42 L 16,41" },
  { id:"c4b", sw:0.07, segIdx:3,
    d:"M 36,53 C 35,54 34,54 32,54" },
  { id:"c4c", sw:0.07, segIdx:3,
    d:"M 13,55 C 10,54 8,51 7,49 L 7,48" },
  { id:"c4d", sw:0.07, segIdx:3,
    d:"M 42,44 C 43,47 44,50 44,53 L 44,54" },
  { id:"c4e", sw:0.04, segIdx:3,
    d:"M 16,41 C 14,39 13,37 14,35" },

  /* ── S5 : constellation ── */
  { id:"c5a", sw:0.07, segIdx:4,
    d:"M 50,28 C 53,32 57,36 60,40 L 63,43 C 65,46 67,48 69,50" },
  { id:"c5b", sw:0.07, segIdx:4,
    d:"M 50,28 C 47,32 43,36 40,40 L 37,43 C 35,46 33,48 31,50" },
  { id:"c5c", sw:0.07, segIdx:4,
    d:"M 50,28 C 51,23 53,17 54,12 L 55,8 C 56,5 57,3 58,2" },
  { id:"c5d", sw:0.05, segIdx:4,
    d:"M 69,50 C 72,51 75,52 78,53 L 80,54" },
  { id:"c5e", sw:0.05, segIdx:4,
    d:"M 31,50 C 28,51 25,52 22,53 L 20,54" },
  { id:"c5f", sw:0.05, segIdx:4,
    d:"M 50,28 C 56,27 62,25 68,23 L 71,22" },
  { id:"c5g", sw:0.05, segIdx:4,
    d:"M 50,28 C 44,27 38,25 32,23 L 29,22" },
];

/* Endpoints des chemins → positions des icônes */
const ICON_NODES = [
  { id:"n-plane1", cx:77, cy:14, icon:"plane",     segIdx:2 },
  { id:"n-box",    cx:50, cy:49, icon:"box",        segIdx:2 },
  { id:"n-people", cx:90, cy:42, icon:"people",     segIdx:2 },
  { id:"n-shake",  cx:38, cy:52, icon:"handshake",  segIdx:2 },
  { id:"n-build",  cx:81, cy:54, icon:"building",   segIdx:2 },
  { id:"n-ship",   cx:16, cy:41, icon:"ship",       segIdx:3 },
  { id:"n-truck",  cx:32, cy:54, icon:"truck",      segIdx:3 },
  { id:"n-plane2", cx: 7, cy:48, icon:"plane",      segIdx:3 },
  { id:"n-globe",  cx:44, cy:54, icon:"globe",      segIdx:3 },
];

/* ─── Icon paths (local ±10 units, rendu via scale 0.12) ────────────────── */
function IconPaths({ icon }) {
  const p = { stroke:"#D4AF37", strokeWidth:1.2, fill:"none", strokeLinecap:"round", strokeLinejoin:"round" };
  switch (icon) {
    case "plane":
      return <g {...p}>
        <path d="M 0,-8 L 8,3 L 0,1 L -8,3 Z"/>
        <line x1="0" y1="1" x2="0" y2="8"/>
        <line x1="-4" y1="4" x2="4" y2="4"/>
      </g>;
    case "box":
      return <g {...p}>
        <rect x="-7" y="-7" width="14" height="14" rx="1"/>
        <line x1="-7" y1="0" x2="7" y2="0"/>
        <line x1="0" y1="-7" x2="0" y2="7"/>
      </g>;
    case "people":
      return <g {...p}>
        <circle cx="-4" cy="-5" r="3"/>
        <circle cx="4"  cy="-5" r="3"/>
        <path d="M -9,5 C -9,0 0,-1 0,3 C 0,-1 9,0 9,5"/>
      </g>;
    case "handshake":
      return <g {...p}>
        <path d="M -8,-1 C -5,-4 -1,-4 0,-2 C 1,-4 5,-4 8,-1"/>
        <path d="M -8,-1 L -8,5 C -5,8 5,8 8,5 L 8,-1"/>
      </g>;
    case "building":
      return <g {...p}>
        <rect x="-7" y="-3" width="14" height="10" rx="0.5"/>
        <rect x="-3" y="-8" width="6" height="5"/>
        <line x1="-4" y1="3" x2="-4" y2="7"/>
        <line x1="0"  y1="3" x2="0"  y2="7"/>
        <line x1="4"  y1="3" x2="4"  y2="7"/>
      </g>;
    case "ship":
      return <g {...p}>
        <line x1="0" y1="-8" x2="0" y2="0"/>
        <path d="M -8,2 C -7,0 7,0 8,2 C 8,6 -8,6 -8,2 Z"/>
        <path d="M -5,6 C -3,9 3,9 5,6"/>
      </g>;
    case "truck":
      return <g {...p}>
        <rect x="-9" y="-3" width="11" height="7" rx="0.5"/>
        <path d="M 2,-3 L 9,-3 L 9,4 L 2,4"/>
        <path d="M 4,-3 L 4,-7 L 2,-7 L 2,-3"/>
        <circle cx="-5" cy="6" r="2"/>
        <circle cx="6"  cy="6" r="2"/>
      </g>;
    case "globe":
      return <g {...p}>
        <circle cx="0" cy="0" r="8"/>
        <path d="M 0,-8 C 2,-4 2,4 0,8 M 0,-8 C -2,-4 -2,4 0,8"/>
        <line x1="-8" y1="0" x2="8" y2="0"/>
      </g>;
    default: return null;
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Partenariats() {
  const imgRef   = useRef(null);
  const pathRefs = useRef({});
  const nodeRefs = useRef({});

  useEffect(() => {
    const prevBg = document.body.style.background;
    document.body.style.background = "transparent";

    /* ── Lenis + ScrollTrigger sync ── */
    const lenis = new Lenis({ duration:1.2, easing:t=>1-Math.pow(1-t,3), smoothWheel:true });
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (t) => {
      lenis.raf(t * 1000);

      /* Parallax texture : objectPosition glisse de 0% à 85% */
      const scroll      = lenis.animatedScroll ?? window.scrollY ?? 0;
      const totalScroll = (N - 1) * (window.innerHeight || 900);
      const prog        = Math.min(1, Math.max(0, scroll / totalScroll));
      const yPos        = prog * prog * 85; // ease quadratique
      if (imgRef.current) {
        imgRef.current.style.objectPosition = `center ${yPos.toFixed(1)}%`;
      }
    };
    gsap.ticker.add(tick);

    /* ── Init crack paths ── */
    const lengths = {};
    CRACKS.forEach(c => {
      const el = pathRefs.current[c.id];
      if (!el) return;
      const L = el.getTotalLength();
      lengths[c.id] = L;
      el.setAttribute("stroke-dasharray",  L);
      el.setAttribute("stroke-dashoffset", L);
    });

    /* ── Init icons invisible ── */
    ICON_NODES.forEach(n => {
      const el = nodeRefs.current[n.id];
      if (el) el.style.opacity = "0";
    });

    /* ── ScrollTrigger : anime dashoffset + icons ── */
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
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
          /* apparaît à mi-segment */
          const triggerP = n.segIdx * 0.2 + 0.08;
          const localP   = Math.min(1, Math.max(0, (progress - triggerP) / 0.06));
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

      {/* ── Texture de fond avec parallax objectPosition ── */}
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

      {/* ── SVG Kintsugi : fissures organiques + icônes ── */}
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
          {/* Glow subtil : halo chaud amber + cœur doré */}
          <filter id="kglow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.45" result="b1"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.15" result="b2"/>
            <feColorMatrix in="b1" type="matrix"
              values="1.1 0.5 0 0 0.04  0.7 0.4 0 0 0  0 0 0 0 0  0 0 0 0.8 0"
              result="amber"/>
            <feMerge>
              <feMergeNode in="amber"/>
              <feMergeNode in="b2"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="iglow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur"/>
            <feColorMatrix in="blur" type="matrix"
              values="1.3 0.8 0 0 0.1  0.9 0.6 0 0 0  0 0 0 0 0  0 0 0 0.85 0"
              result="gb"/>
            <feMerge>
              <feMergeNode in="gb"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Fissures dormantes — toujours visibles en filigrane */}
        {CRACKS.map(c => (
          <path key={c.id + "-d"} d={c.d} fill="none"
            stroke="#C8913A" strokeWidth={c.sw * 1.2}
            strokeLinecap="round" strokeOpacity={0.18}/>
        ))}

        {/* Fissures animées — or vif au scroll */}
        {CRACKS.map(c => (
          <path
            key={c.id}
            ref={el => { pathRefs.current[c.id] = el; }}
            d={c.d}
            fill="none"
            stroke="#E8C04A"
            strokeWidth={c.sw}
            strokeLinecap="round"
            filter="url(#kglow)"
          />
        ))}

        {/* Icônes supply-chain */}
        {ICON_NODES.map(n => (
          <g
            key={n.id}
            ref={el => { nodeRefs.current[n.id] = el; }}
            transform={`translate(${n.cx},${n.cy})`}
            filter="url(#iglow)"
            style={{ transition:"opacity 0.5s ease" }}
          >
            <circle r="1.8" fill="rgba(8,8,8,0.80)" stroke="#D4AF37" strokeWidth="0.07"/>
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

              {/* Numéro de section */}
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

              {/* Texte direct sur texture */}
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
                  textShadow:"0 2px 24px rgba(0,0,0,0.98), 0 0 60px rgba(0,0,0,0.85)",
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
