import { useEffect, useRef } from "react";
import Lenis from "lenis";

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

const IMAGES = [
  "/png/texture-s1.jpg",
  "/png/texture-s2.jpg",
  "/png/texture-s3.jpg",
  "/png/texture-s4.jpg",
  "/png/texture-s5.jpg",
];

const N = SECTIONS.length;

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Partenariats() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const prevBg = document.body.style.background;
    document.body.style.background = "#080808";

    /* ── Lenis smooth scroll ── */
    const lenis = new Lenis({ duration:1.2, easing:t=>1-Math.pow(1-t,3), smoothWheel:true });
    let stopped = false;
    const rafCb = (time) => {
      if (stopped) return;
      lenis.raf(time);
      requestAnimationFrame(rafCb);
    };
    requestAnimationFrame(rafCb);

    /* ── IntersectionObserver : fade texte à l'entrée/sortie de chaque section ── */
    const observers = sectionRefs.current.map((el) => {
      if (!el) return null;
      const textEl = el.querySelector(".section-text");
      if (!textEl) return null;

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          textEl.style.opacity    = "1";
          textEl.style.transform  = "translateY(0px)";
        } else {
          textEl.style.opacity    = "0";
          textEl.style.transform  = "translateY(28px)";
        }
      }, { threshold: 0.3 });

      obs.observe(el);
      return obs;
    });

    return () => {
      stopped = true;
      lenis.destroy();
      observers.forEach(o => o?.disconnect());
      document.body.style.background = prevBg;
    };
  }, []);

  return (
    <div style={{ background:"#080808" }}>

      <style>{`
        .section-text {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.85s cubic-bezier(0.4,0,0.2,1),
                      transform 0.85s cubic-bezier(0.4,0,0.2,1);
        }
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

      {/* ── Sections ── */}
      {SECTIONS.map((s, idx) => {
        const isLeft   = s.side === "left";
        const isRight  = s.side === "right";
        const isCenter = s.side === "center";
        return (
          <section
            key={s.id}
            ref={el => { sectionRefs.current[idx] = el; }}
            style={{
              position:"relative", height:"100vh", overflow:"hidden",
              display:"flex", alignItems:"center",
              justifyContent: isCenter ? "center" : isLeft ? "flex-start" : "flex-end",
              paddingLeft:  isLeft   ? "7vw" : "4vw",
              paddingRight: isRight  ? "7vw" : "4vw",
            }}
          >
            {/* Image de fond propre à cette section */}
            <img
              src={IMAGES[idx]}
              alt=""
              style={{
                position:"absolute", inset:0,
                width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center",
                zIndex:0,
              }}
            />

            {/* Voile sombre pour lisibilité du texte */}
            <div style={{
              position:"absolute", inset:0, zIndex:1,
              background:"rgba(0,0,0,0.35)",
            }}/>

            {/* Numéro de section */}
            <div style={{
              position:"absolute", zIndex:3,
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

            {/* Texte — fade in/out via IntersectionObserver */}
            <div
              className="section-text"
              style={{
                position:"relative", zIndex:2,
                maxWidth: isCenter ? 580 : 360,
                textAlign: isCenter ? "center" : "left",
              }}
            >
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

              {s.paragraphs.map((p, pi) => (
                <p key={pi} style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontSize:"clamp(11px,0.9vw,13px)", lineHeight:1.9, fontWeight:400,
                  color:"rgba(255,255,255,0.62)",
                  marginBottom: pi < s.paragraphs.length - 1 ? 10 : 0,
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
  );
}
