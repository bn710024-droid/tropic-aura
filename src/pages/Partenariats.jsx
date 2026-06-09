import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Données des 4 sections + position image progressive ─── */
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
    textLeft: true,
    imgFrom:  "8%",   // arbre + ciel au sommet de l'image
    imgTo:    "26%",
  },
  {
    id:       "reseau",
    num:      "02",
    surtitre: "RÉSEAU",
    title:    "Un réseau qui dépasse les frontières.",
    paragraphs: [
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés.",
      "Tropicaura développe progressivement des relations stratégiques à travers les principales régions tropicales d'Afrique, en connectant producteurs, stations de conditionnement, partenaires logistiques, distributeurs et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème. Chaque partenariat ouvre de nouvelles opportunités.",
      "Ensemble, nous construisons les bases d'une croissance durable et mutuellement bénéfique.",
    ],
    textLeft: false,
    imgFrom:  "24%",  // premières ramifications, icônes hautes
    imgTo:    "44%",
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
      "Notre ambition est simple : transformer le potentiel en opportunités concrètes et créer de la valeur durable pour l'ensemble des acteurs de la chaîne.",
    ],
    textLeft: true,
    imgFrom:  "42%",  // réseau de racines doré, milieu
    imgTo:    "62%",
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
    textLeft: false,
    imgFrom:  "60%",  // racines profondes, avion, globe
    imgTo:    "80%",
  },
];

export default function Partenariats() {
  const wrappers   = useRef([]);
  const textCols   = useRef([]);
  const imgCols    = useRef([]);
  const ctaContent = useRef(null);

  useEffect(() => {
    /* ── Lenis smooth scroll ── */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /* ── Textes : slide + fade in au scroll ── */
    textCols.current.forEach((el, i) => {
      if (!el) return;
      const xFrom = SECTIONS[i].textLeft ? -30 : 30;
      gsap.fromTo(
        el,
        { opacity: 0, x: xFrom },
        {
          opacity: 1, x: 0,
          duration: 1.0, ease: "power2.out",
          scrollTrigger: {
            trigger: wrappers.current[i],
            start: "top 72%",
            once: true,
          },
        }
      );
    });

    /* ── Images : parallaxe progressive, révèle l'image du haut vers le bas ── */
    imgCols.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { backgroundPositionY: SECTIONS[i].imgFrom },
        {
          backgroundPositionY: SECTIONS[i].imgTo,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end:   "bottom top",
            scrub: 1.8,
          },
        }
      );
    });

    /* ── CTA final ── */
    if (ctaContent.current) {
      gsap.fromTo(
        ctaContent.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0,
          duration: 1.2, ease: "power2.out",
          scrollTrigger: {
            trigger: ctaContent.current,
            start: "top 76%",
            once: true,
          },
        }
      );
    }

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* ── Styles réutilisables ── */
  const sur = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 10, fontWeight: 700, letterSpacing: ".28em",
    textTransform: "uppercase", color: "#C9912B",
    marginBottom: 22, display: "block",
  };
  const h2Style = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontWeight: 800, fontSize: "clamp(24px,2.5vw,44px)",
    lineHeight: 1.08, letterSpacing: "-.03em",
    color: "#F4EFE4", marginBottom: 32, maxWidth: 460,
  };
  const pStyle = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: "clamp(13px,1.2vw,15.5px)",
    lineHeight: 1.9, fontWeight: 400,
    color: "rgba(244,239,228,0.60)",
    marginBottom: 14,
  };

  return (
    <div style={{ background: "#0A0E0B", overflowX: "hidden" }}>

      {/* ── Header ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 66, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
      }}>
        <a href="/" style={{
          pointerEvents: "auto",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 18, letterSpacing: ".04em",
          color: "#F4EFE4", textDecoration: "none",
        }}>
          TROPICAURA
        </a>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 12, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#F4EFE4",
            background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            borderRadius: 100, padding: "9px 20px", cursor: "pointer",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ════════════════════ SECTIONS 1 – 4 ════════════════════ */}
      {SECTIONS.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => (wrappers.current[i] = el)}
          style={{
            display: "flex",
            flexDirection: s.textLeft ? "row" : "row-reverse",
            minHeight: "100vh",
          }}
        >
          {/* ── Colonne texte ── */}
          <div
            ref={(el) => (textCols.current[i] = el)}
            style={{
              width: "50%",
              display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "100px clamp(28px,5.5vw,80px) 60px",
              opacity: 0,
            }}
          >
            <span style={sur}>
              {s.num} . {s.surtitre}
            </span>
            <h2 style={h2Style}>{s.title}</h2>
            <div style={{ maxWidth: 440 }}>
              {s.paragraphs.map((p, pi) => (
                <p key={pi} style={pStyle}>{p}</p>
              ))}
            </div>
          </div>

          {/* ── Colonne image ── */}
          <div
            ref={(el) => (imgCols.current[i] = el)}
            style={{
              width: "50%",
              minHeight: "100vh",
              flexShrink: 0,
              backgroundImage: "url('/png/partenaire.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: `center ${s.imgFrom}`,
            }}
          />
        </div>
      ))}

      {/* ════════════════════ SECTION 5 — APPEL À L'ACTION ════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundImage: "url('/png/partenaire.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 82%",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}>

        {/* Voile sombre — laisse briller les connexions lumineuses */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,14,11,0.80) 0%, rgba(10,14,11,0.46) 50%, rgba(10,14,11,0.84) 100%)",
        }} />

        <div
          ref={ctaContent}
          style={{
            position: "relative", zIndex: 2,
            textAlign: "center", maxWidth: 660,
            padding: "0 clamp(24px,6vw,80px)",
            opacity: 0,
          }}
        >
          <span style={{ ...sur, display: "block", textAlign: "center", marginBottom: 24 }}>
            05 . REJOINDRE LE RÉSEAU
          </span>

          <h2 style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 800, fontSize: "clamp(26px,3.2vw,52px)",
            lineHeight: 1.06, letterSpacing: "-.03em",
            color: "#F4EFE4", marginBottom: 28,
          }}>
            Rejoignez un réseau qui façonne l'avenir du commerce tropical.
          </h2>

          <p style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "clamp(13px,1.3vw,16px)",
            lineHeight: 1.85, fontWeight: 400,
            color: "rgba(244,239,228,0.60)",
            maxWidth: 520, margin: "0 auto 48px",
          }}>
            Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropicaura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité, de confiance et de création de valeur durable.
          </p>

          <CTAButton />
        </div>
      </section>

    </div>
  );
}

/* ── Bouton CTA minimaliste ── */
function CTAButton() {
  return (
    <a href="/contact" style={{ textDecoration: "none" }}>
      <button
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 700, fontSize: 12,
          letterSpacing: ".18em", textTransform: "uppercase",
          color: "#F4EFE4",
          background: "transparent",
          border: "1.5px solid rgba(244,239,228,0.32)",
          borderRadius: 100,
          padding: "17px 46px",
          cursor: "pointer",
          transition: "border-color 0.45s ease, color 0.45s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#C9912B";
          e.currentTarget.style.color       = "#C9912B";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(244,239,228,0.32)";
          e.currentTarget.style.color       = "#F4EFE4";
        }}
      >
        Devenir partenaire
      </button>
    </a>
  );
}
