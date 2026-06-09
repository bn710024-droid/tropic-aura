import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Contenu des 5 sections ─── */
const SECTIONS = [
  {
    id:       "fondations",
    num:      "01",
    surtitre: "FONDATIONS",
    title:    "Des fondations construites sur la confiance.",
    paragraphs: [
      "Chaque partenariat durable repose sur des fondations solides.",
      "Chez Tropicaura, nous sommes convaincus que le commerce international ne se résume pas à l'échange de produits. Il repose avant tout sur la confiance, la transparence et une vision commune du long terme.",
      "Notre rôle consiste à créer des connexions durables entre les régions tropicales les plus prometteuses et les marchés internationaux les plus exigeants.",
      "Nous ne recherchons pas des opportunités ponctuelles. Nous construisons des relations capables de grandir, d'évoluer et de créer de la valeur sur le long terme.",
    ],
  },
  {
    id:       "reseau",
    num:      "02",
    surtitre: "RÉSEAU",
    title:    "Un réseau qui dépasse les frontières.",
    paragraphs: [
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés.",
      "Tropicaura développe progressivement des relations stratégiques à travers les principales régions tropicales d'Afrique, en connectant producteurs, stations de conditionnement, partenaires logistiques, distributeurs et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème. Chaque partenariat ouvre de nouvelles opportunités.",
      "Ensemble, nous construisons les bases d'une croissance durable et mutuellement bénéfique.",
    ],
  },
  {
    id:       "terroirs",
    num:      "03",
    surtitre: "TERROIRS",
    title:    "Révéler le potentiel des terroirs tropicaux.",
    paragraphs: [
      "Certaines des opportunités agricoles les plus prometteuses au monde se trouvent dans les régions tropicales africaines.",
      "Pourtant, une grande partie de cette valeur reste encore insuffisamment reconnue sur les marchés internationaux.",
      "Tropicaura souhaite contribuer à un avenir où ces territoires seront reconnus non seulement pour leur richesse naturelle, mais également pour leur professionnalisme, leur capacité d'innovation et leur aptitude à répondre aux standards les plus exigeants du commerce mondial.",
      "Notre ambition est simple : transformer le potentiel en opportunités concrètes et créer de la valeur durable pour l'ensemble des acteurs de la chaîne.",
    ],
  },
  {
    id:       "avenir",
    num:      "04",
    surtitre: "AVENIR",
    title:    "Construire l'avenir ensemble.",
    paragraphs: [
      "Nous croyons que l'avenir du commerce tropical sera porté par des partenariats solides, une vision partagée et une collaboration durable.",
      "Tropicaura construit un écosystème dans lequel chaque acteur contribue à une réussite collective.",
      "Nous ne voulons pas simplement développer des relations commerciales. Nous souhaitons bâtir des alliances stratégiques capables d'accompagner la prochaine génération du commerce agricole international.",
      "Parce que les ambitions les plus importantes ne se construisent jamais seules.",
    ],
  },
  {
    id:        "cta",
    num:       "05",
    surtitre:  "REJOINDRE LE RÉSEAU",
    title:     "Rejoignez un réseau qui façonne l'avenir du commerce tropical.",
    paragraphs: [
      "Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropicaura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité, de confiance et de création de valeur durable.",
    ],
    centered:  true,
    hasButton: true,
  },
];

/* ─────────────────────────────────────────────────────────────────
   Formule du blur :
   • pos = scroll / vh  (position en sections, ex. 1.78 = 78% ds section 2)
   • nearestBoundary = arrondi entier (frontière entre sections)
   • dist = distance à cette frontière (0 = exactement sur la frontière)
   • Fenêtre W = ±22% d'une hauteur de section → blur uniquement pendant la transition
   • blurPx = cos(dist/W × π/2) × MAX_BLUR  (0 loin de la frontière, max dessus)
   • Boundaries 0 et N ignorées (début et fin de page = pas de blur)
───────────────────────────────────────────────────────────────── */
const MAX_BLUR = 6;
const WINDOW   = 0.22;
const N        = SECTIONS.length;

function calcBlur(scroll, vh) {
  if (vh <= 0) return 0;
  const pos      = scroll / vh;
  const boundary = Math.round(pos);
  if (boundary <= 0 || boundary >= N) return 0;   // pas de blur en début/fin
  const dist = Math.abs(pos - boundary);
  if (dist >= WINDOW) return 0;                    // hors fenêtre de transition
  return Math.cos((dist / WINDOW) * (Math.PI / 2)) * MAX_BLUR;
}

export default function Partenariats() {
  const imgRef = useRef(null);

  useEffect(() => {
    /* Fond du body transparent sur cette page (sinon le fond vert du CSS global perce) */
    const prevBg = document.body.style.background;
    document.body.style.background = "transparent";

    /* ── Lenis smooth scroll ── */
    const lenis = new Lenis({
      duration:     1.2,
      easing:       (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel:  true,
    });
    gsap.ticker.lagSmoothing(0);

    const tick = (t) => {
      lenis.raf(t * 1000);

      /* Blur cinématique : 0 par défaut, monte uniquement en transition */
      const scroll  = lenis.animatedScroll ?? window.scrollY ?? 0;
      const vh      = window.innerHeight || 900;
      const blurPx  = calcBlur(scroll, vh);
      const scale   = 1.02 + blurPx * 0.001;          // anti-bords blancs au blur max

      if (imgRef.current) {
        imgRef.current.style.filter    = `blur(${blurPx.toFixed(2)}px)`;
        imgRef.current.style.transform = `scale(${scale.toFixed(4)})`;
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.body.style.background = prevBg;
    };
  }, []);

  /* ── Styles ── */
  const surStyle = {
    fontFamily:    "'Plus Jakarta Sans',sans-serif",
    fontSize:       10,
    fontWeight:     700,
    letterSpacing: ".28em",
    textTransform: "uppercase",
    color:         "#C9912B",
    marginBottom:   18,
    display:       "block",
  };
  const h2Style = {
    fontFamily:    "'Plus Jakarta Sans',sans-serif",
    fontWeight:     800,
    fontSize:      "clamp(22px,2.6vw,44px)",
    lineHeight:     1.06,
    letterSpacing: "-.03em",
    color:         "#FFFFFF",
    marginBottom:   22,
  };
  const pStyle = {
    fontFamily:  "'Plus Jakarta Sans',sans-serif",
    fontSize:    "clamp(13px,1.2vw,15.5px)",
    lineHeight:   1.9,
    fontWeight:   400,
    color:       "rgba(255,255,255,0.80)",
    marginBottom: 11,
  };

  return (
    /* Fond explicitement noir — l'image fixe recouvre tout, mais
       si elle tarde à charger on voit noir plutôt qu'un fond coloré */
    <div style={{ background: "#000", overflowX: "hidden" }}>

      {/* ══ IMAGE FIXE — visible en permanence, z-index 0 ══ */}
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
          objectPosition:  "center",
          zIndex:           0,
          willChange:      "filter, transform",
          transformOrigin: "center",
          /* blur = 0 par défaut, modifié uniquement en transition par le ticker */
          filter:          "blur(0px)",
          transform:       "scale(1.02)",
        }}
      />

      {/* ══ HEADER ══ */}
      <header style={{
        position:       "fixed",
        top: 0, left: 0, right: 0,
        zIndex:          200,
        height:          66,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0 clamp(20px,5vw,48px)",
        pointerEvents:  "none",
      }}>
        <a href="/" style={{
          pointerEvents:  "auto",
          fontFamily:    "'Plus Jakarta Sans',sans-serif",
          fontWeight:     800,
          fontSize:       18,
          letterSpacing: ".04em",
          color:         "#F4EFE4",
          textDecoration: "none",
          textShadow:    "0 1px 10px rgba(0,0,0,0.6)",
        }}>
          TROPICAURA
        </a>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display:        "inline-block",
            fontFamily:    "'Plus Jakarta Sans',sans-serif",
            fontWeight:     700,
            fontSize:       12,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color:         "#F4EFE4",
            background:    "rgba(0,0,0,0.32)",
            border:        "1.5px solid rgba(255,255,255,0.32)",
            borderRadius:   100,
            padding:       "9px 20px",
            cursor:        "pointer",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ══ SCROLL CONTAINER — 500vh, transparent, par-dessus l'image fixe ══ */}
      <div style={{ height: `${N * 100}vh`, position: "relative", zIndex: 1 }}>

        {SECTIONS.map((s, i) => (
          <section
            key={s.id}
            style={{
              /* Section transparente : on voit l'image à travers */
              position:       "relative",
              height:         "100vh",
              background:     "transparent",
              display:        "flex",
              alignItems:     "center",
              justifyContent: s.centered ? "center" : "flex-start",
              paddingLeft:    s.centered ? 0 : "7vw",
              paddingRight:   "7vw",
            }}
          >
            {/* Bloc texte : fond semi-transparent uniquement derrière les mots */}
            <div style={{
              background:   "rgba(0,0,0,0.30)",
              borderRadius:  8,
              padding:      "clamp(22px,2.8vw,38px) clamp(26px,3.2vw,46px)",
              maxWidth:      s.centered ? 600 : 520,
              textAlign:     s.centered ? "center" : "left",
            }}>

              <span style={surStyle}>{s.num} . {s.surtitre}</span>

              <h2 style={h2Style}>{s.title}</h2>

              {s.paragraphs.map((p, pi) => (
                <p key={pi} style={{ ...pStyle, marginBottom: pi < s.paragraphs.length - 1 ? 11 : 0 }}>
                  {p}
                </p>
              ))}

              {s.hasButton && (
                <div style={{ marginTop: 32 }}>
                  <a href="/contact" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        fontFamily:    "'Plus Jakarta Sans',sans-serif",
                        fontWeight:     700,
                        fontSize:       12,
                        letterSpacing: ".18em",
                        textTransform: "uppercase",
                        color:         "#C9912B",
                        background:    "transparent",
                        border:        "1.5px solid rgba(201,145,43,0.55)",
                        borderRadius:   100,
                        padding:       "15px 46px",
                        cursor:        "pointer",
                        transition:    "border-color 0.4s ease, color 0.4s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#C9912B";
                        e.currentTarget.style.color       = "#F4EFE4";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(201,145,43,0.55)";
                        e.currentTarget.style.color       = "#C9912B";
                      }}
                    >
                      Devenir partenaire
                    </button>
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
