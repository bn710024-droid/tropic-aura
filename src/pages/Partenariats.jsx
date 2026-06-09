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
      "Chaque partenariat durable repose sur des fondations solides. Chez Tropicaura, nous sommes convaincus que le commerce international repose avant tout sur la confiance, la transparence et une vision commune du long terme.",
      "Nous construisons des relations capables de grandir, d'évoluer et de créer de la valeur sur le long terme.",
    ],
    side: "left",
  },
  {
    id: "reseau", num: "02", surtitre: "RÉSEAU",
    title: "Un réseau qui dépasse les frontières.",
    paragraphs: [
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés. Tropicaura connecte producteurs, logistiques et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème et ouvre de nouvelles opportunités.",
    ],
    side: "right",
  },
  {
    id: "terroirs", num: "03", surtitre: "TERROIRS",
    title: "Révéler le potentiel des terroirs tropicaux.",
    paragraphs: [
      "Certaines des opportunités agricoles les plus prometteuses au monde se trouvent dans les régions tropicales africaines — encore insuffisamment reconnues sur les marchés internationaux.",
      "Notre ambition : transformer ce potentiel en opportunités concrètes et créer de la valeur durable pour l'ensemble de la chaîne.",
    ],
    side: "left",
  },
  {
    id: "avenir", num: "04", surtitre: "AVENIR",
    title: "Construire l'avenir ensemble.",
    paragraphs: [
      "L'avenir du commerce tropical sera porté par des partenariats solides et une vision partagée. Tropicaura construit un écosystème où chaque acteur contribue à une réussite collective.",
      "Parce que les ambitions les plus importantes ne se construisent jamais seules.",
    ],
    side: "right",
  },
  {
    id: "cta", num: "05", surtitre: "REJOINDRE LE RÉSEAU",
    title: "Rejoignez un réseau qui façonne l'avenir du commerce tropical.",
    paragraphs: [
      "Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropicaura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité et de création de valeur.",
    ],
    side: "center",
    hasButton: true,
  },
];

const N = SECTIONS.length;

export default function Partenariats() {
  const imgRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "transparent";

    const lenis = new Lenis({
      duration: 1.2,
      easing: t => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    gsap.ticker.lagSmoothing(0);

    const tick = (t) => {
      lenis.raf(t * 1000);

      /* Image glisse doucement : arbre en haut → lumière en bas */
      const scroll      = lenis.animatedScroll ?? window.scrollY ?? 0;
      const vh          = window.innerHeight || 900;
      const totalScroll = (N - 1) * vh;
      const progress    = Math.min(1, Math.max(0, scroll / totalScroll));
      /* Ease quadratique : mouvement lent sur section 1 (arbre visible),
         accélère vers la fin → vortex lumineux pleinement visible sur section 5 */
      const eased = progress * progress;
      const yPos  = 0 + 90 * eased;            // 0% (arbre) → 90% (vortex)

      if (imgRef.current) {
        imgRef.current.style.objectPosition = `center ${yPos.toFixed(1)}%`;
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

      {/* ══ IMAGE fixe, nette, glisse au scroll ══ */}
      <img
        ref={imgRef}
        src="/png/partenaire.png"
        alt=""
        style={{
          position:        "fixed",
          inset:            0,
          width:           "100vw",
          height:          "100vh",
          objectFit:       "cover",
          objectPosition:  "center 0%",
          zIndex:           0,
          willChange:      "object-position",
        }}
      />

      {/* ══ HEADER ══ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 200, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)", pointerEvents: "none",
      }}>
        <a href="/" style={{
          pointerEvents: "auto",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 18, letterSpacing: ".04em",
          color: "#F4EFE4", textDecoration: "none",
          textShadow: "0 1px 12px rgba(0,0,0,.8)",
        }}>TROPICAURA</a>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 12, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#F4EFE4",
            background: "rgba(0,0,0,.38)",
            border: "1.5px solid rgba(255,255,255,.28)",
            borderRadius: 100, padding: "9px 20px", cursor: "pointer",
          }}>← Accueil</span>
        </a>
      </header>

      {/* ══ 500vh de scroll — sections transparentes ══ */}
      <div style={{ height: `${N * 100}vh`, position: "relative", zIndex: 1 }}>
        {SECTIONS.map((s) => {
          const isLeft   = s.side === "left";
          const isRight  = s.side === "right";
          const isCenter = s.side === "center";

          return (
            <section key={s.id} style={{
              position:       "relative",
              height:         "100vh",
              background:     "transparent",
              display:        "flex",
              alignItems:     "center",
              justifyContent: isCenter ? "center"
                            : isLeft   ? "flex-start"
                            :            "flex-end",
              paddingLeft:  isLeft   ? "7vw" : isCenter ? "4vw" : "4vw",
              paddingRight: isRight  ? "7vw" : isCenter ? "4vw" : "4vw",
            }}>

              {/* Bloc texte */}
              <div style={{
                background:   "rgba(0, 0, 0, 0.52)",
                borderRadius:  8,
                borderLeft:   isLeft || isCenter
                  ? "2px solid rgba(201,145,43,0.55)"
                  : "none",
                borderRight:  isRight
                  ? "2px solid rgba(201,145,43,0.55)"
                  : "none",
                padding:      "26px 30px",
                maxWidth:     isCenter ? 560 : 380,
                textAlign:    isCenter ? "center" : "left",
              }}>

                {/* Surtitre doré */}
                <span style={{
                  fontFamily:    "'Plus Jakarta Sans',sans-serif",
                  fontSize:       9,
                  fontWeight:     700,
                  letterSpacing: ".30em",
                  textTransform: "uppercase",
                  color:         "#C9912B",
                  marginBottom:   14,
                  display:       "block",
                }}>
                  {s.num} . {s.surtitre}
                </span>

                {/* Titre */}
                <h2 style={{
                  fontFamily:    "'Plus Jakarta Sans',sans-serif",
                  fontWeight:     800,
                  fontSize:      isCenter
                    ? "clamp(20px,2.2vw,36px)"
                    : "clamp(17px,1.7vw,28px)",
                  lineHeight:     1.1,
                  letterSpacing: "-.03em",
                  color:         "#FFFFFF",
                  marginBottom:   16,
                }}>{s.title}</h2>

                {/* Paragraphes */}
                {s.paragraphs.map((p, pi) => (
                  <p key={pi} style={{
                    fontFamily:  "'Plus Jakarta Sans',sans-serif",
                    fontSize:    "clamp(12px,1vw,13.5px)",
                    lineHeight:   1.85,
                    fontWeight:   400,
                    color:       "rgba(255,255,255,0.70)",
                    marginBottom: pi < s.paragraphs.length - 1 ? 10 : 0,
                  }}>{p}</p>
                ))}

                {/* Bouton section 5 */}
                {s.hasButton && (
                  <div style={{ marginTop: 26 }}>
                    <a href="/contact" style={{ textDecoration: "none" }}>
                      <button
                        style={{
                          fontFamily:    "'Plus Jakarta Sans',sans-serif",
                          fontWeight:     700,
                          fontSize:       11,
                          letterSpacing: ".18em",
                          textTransform: "uppercase",
                          color:         "#C9912B",
                          background:    "transparent",
                          border:        "1.5px solid rgba(201,145,43,0.50)",
                          borderRadius:   100,
                          padding:       "13px 38px",
                          cursor:        "pointer",
                          transition:    "border-color .4s, color .4s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "#C9912B";
                          e.currentTarget.style.color       = "#F4EFE4";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "rgba(201,145,43,0.50)";
                          e.currentTarget.style.color       = "#C9912B";
                        }}
                      >Devenir partenaire</button>
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
