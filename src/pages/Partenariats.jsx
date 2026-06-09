import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    id: "fondations", num: "01", surtitre: "FONDATIONS",
    title: "Des fondations construites sur la confiance.",
    paragraphs: [
      "Chaque partenariat durable repose sur des fondations solides.",
      "Chez Tropicaura, nous sommes convaincus que le commerce international repose avant tout sur la confiance, la transparence et une vision commune du long terme.",
      "Nous construisons des relations capables de grandir, d'évoluer et de créer de la valeur sur le long terme.",
    ],
  },
  {
    id: "reseau", num: "02", surtitre: "RÉSEAU",
    title: "Un réseau qui dépasse les frontières.",
    paragraphs: [
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés.",
      "Tropicaura connecte producteurs, stations de conditionnement, partenaires logistiques et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème. Chaque partenariat ouvre de nouvelles opportunités.",
    ],
  },
  {
    id: "terroirs", num: "03", surtitre: "TERROIRS",
    title: "Révéler le potentiel des terroirs tropicaux.",
    paragraphs: [
      "Certaines des opportunités agricoles les plus prometteuses au monde se trouvent dans les régions tropicales africaines.",
      "Tropicaura souhaite contribuer à un avenir où ces territoires seront reconnus pour leur richesse, leur professionnalisme et leur aptitude à répondre aux standards les plus exigeants.",
      "Notre ambition : transformer le potentiel en opportunités concrètes.",
    ],
  },
  {
    id: "avenir", num: "04", surtitre: "AVENIR",
    title: "Construire l'avenir ensemble.",
    paragraphs: [
      "L'avenir du commerce tropical sera porté par des partenariats solides, une vision partagée et une collaboration durable.",
      "Tropicaura construit un écosystème dans lequel chaque acteur contribue à une réussite collective.",
      "Parce que les ambitions les plus importantes ne se construisent jamais seules.",
    ],
  },
  {
    id: "cta", num: "05", surtitre: "REJOINDRE LE RÉSEAU",
    title: "Rejoignez un réseau qui façonne l'avenir du commerce tropical.",
    paragraphs: [
      "Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropicaura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité et de création de valeur.",
    ],
    centered: true, hasButton: true,
  },
];

/* ── Blur : 0 par défaut, pic en transition ±22% d'une section ── */
const MAX_BLUR = 6, WINDOW = 0.22, N = SECTIONS.length;
function calcBlur(scroll, vh) {
  if (vh <= 0) return 0;
  const pos = scroll / vh;
  const b   = Math.round(pos);
  if (b <= 0 || b >= N) return 0;
  const d = Math.abs(pos - b);
  if (d >= WINDOW) return 0;
  return Math.cos((d / WINDOW) * (Math.PI / 2)) * MAX_BLUR;
}

export default function Partenariats() {
  const imgRef = useRef(null);

  useEffect(() => {
    /* Fond body transparent */
    const prev = document.body.style.background;
    document.body.style.background = "transparent";

    const lenis = new Lenis({ duration: 1.2, easing: t => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    gsap.ticker.lagSmoothing(0);

    const tick = (t) => {
      lenis.raf(t * 1000);

      const scroll      = lenis.animatedScroll ?? window.scrollY ?? 0;
      const vh          = window.innerHeight || 900;
      const totalScroll = (N - 1) * vh;                              // 400vh max

      /* ── Image glisse : arbre (5%) → lumière (90%) ── */
      const progress = Math.min(1, Math.max(0, scroll / totalScroll));
      const yPos     = 5 + 85 * progress;                            // 5% → 90%

      /* ── Blur uniquement en transition ── */
      const blurPx = calcBlur(scroll, vh);
      const scale  = 1.02 + blurPx * 0.001;

      if (imgRef.current) {
        imgRef.current.style.objectPosition = `center ${yPos.toFixed(1)}%`;
        imgRef.current.style.filter         = `blur(${blurPx.toFixed(2)}px)`;
        imgRef.current.style.transform      = `scale(${scale.toFixed(4)})`;
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(st => st.kill());
      document.body.style.background = prev;
    };
  }, []);

  return (
    <div style={{ background: "#000", overflowX: "hidden" }}>

      {/* ── IMAGE fixe, glisse au scroll ── */}
      <img
        ref={imgRef}
        src="/png/partenaire.png"
        alt=""
        style={{
          position: "fixed", inset: 0,
          width: "100vw", height: "100vh",
          objectFit: "cover", objectPosition: "center 5%",
          zIndex: 0,
          willChange: "filter, transform, object-position",
          transformOrigin: "center",
          transform: "scale(1.02)",
          filter: "blur(0px)",
        }}
      />

      {/* ── HEADER ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 66, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
      }}>
        <a href="/" style={{
          pointerEvents: "auto", fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 18, letterSpacing: ".04em",
          color: "#F4EFE4", textDecoration: "none",
          textShadow: "0 1px 10px rgba(0,0,0,.7)",
        }}>TROPICAURA</a>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-block", fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 12, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#F4EFE4",
            background: "rgba(0,0,0,.35)", border: "1.5px solid rgba(255,255,255,.28)",
            borderRadius: 100, padding: "9px 20px", cursor: "pointer",
          }}>← Accueil</span>
        </a>
      </header>

      {/* ── SCROLL CONTAINER 500vh ── */}
      <div style={{ height: `${N * 100}vh`, position: "relative", zIndex: 1 }}>
        {SECTIONS.map((s) => (
          <section key={s.id} style={{
            position: "relative", height: "100vh",
            background: "transparent",
            display: "flex",
            /* sections 1-4 : texte bas-gauche | section 5 : centré */
            alignItems:     s.centered ? "center"    : "flex-end",
            justifyContent: s.centered ? "center"    : "flex-start",
            paddingLeft:    s.centered ? 0            : "7vw",
            paddingBottom:  s.centered ? 0            : "8vh",
          }}>

            {/* Bloc texte — fond visible, côté gauche seulement */}
            <div style={{
              background:   "rgba(0,0,0,0.48)",
              borderRadius:  8,
              borderLeft:   "2px solid rgba(201,145,43,0.55)",
              padding:      "22px 28px 22px 26px",
              maxWidth:      s.centered ? 580 : 400,
              textAlign:     s.centered ? "center" : "left",
              backdropFilter: "blur(1px)",
            }}>
              <span style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: ".28em",
                textTransform: "uppercase", color: "#C9912B",
                marginBottom: 12, display: "block",
              }}>
                {s.num} . {s.surtitre}
              </span>

              <h2 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800,
                fontSize: s.centered ? "clamp(20px,2.4vw,38px)" : "clamp(18px,1.9vw,30px)",
                lineHeight: 1.1, letterSpacing: "-.03em",
                color: "#FFFFFF", marginBottom: 16,
              }}>{s.title}</h2>

              {s.paragraphs.map((p, pi) => (
                <p key={pi} style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(12px,1.05vw,14px)",
                  lineHeight: 1.85, fontWeight: 400,
                  color: "rgba(255,255,255,0.72)",
                  marginBottom: pi < s.paragraphs.length - 1 ? 10 : 0,
                }}>{p}</p>
              ))}

              {s.hasButton && (
                <div style={{ marginTop: 28 }}>
                  <a href="/contact" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontWeight: 700, fontSize: 11,
                        letterSpacing: ".18em", textTransform: "uppercase",
                        color: "#C9912B", background: "transparent",
                        border: "1.5px solid rgba(201,145,43,0.50)",
                        borderRadius: 100, padding: "13px 38px",
                        cursor: "pointer",
                        transition: "border-color .4s, color .4s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor="#C9912B"; e.currentTarget.style.color="#F4EFE4"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(201,145,43,0.50)"; e.currentTarget.style.color="#C9912B"; }}
                    >Devenir partenaire</button>
                  </a>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
