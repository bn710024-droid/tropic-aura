import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DATA = [
  {
    bg: "#FBFAF6",
    align: "left",
    label: "01 · CONVICTION",
    labelColor: "#4A7A52",
    title: "Pourquoi Tropicaura existe",
    paras: [
      "Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Pourtant, leur potentiel reste encore insuffisamment valorisé sur les marchés internationaux.",
      "Tropicaura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants.",
      "Nous invitons nos partenaires à participer à cette nouvelle dynamique : construire des connexions durables, révéler la véritable valeur des origines africaines et contribuer à une chaîne d'approvisionnement plus équitable, plus moderne et plus performante.",
    ],
  },
  {
    bg: "#F2F5F1",
    align: "right",
    label: "02 · MISSION",
    labelColor: "#2E5A3C",
    title: "Ce que nous faisons aujourd'hui",
    paras: [
      "Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux afin de faciliter l'accès à des produits tropicaux de qualité tout en créant davantage de valeur à l'origine.",
      "Chaque collaboration représente une opportunité de bâtir ensemble un commerce plus efficace, plus transparent et plus bénéfique pour l'ensemble des acteurs de la chaîne de valeur.",
    ],
  },
  {
    bg: "#F6F1E8",
    align: "left",
    label: "03 · VISION",
    labelColor: "#6B5022",
    title: "Là où nous voulons aller",
    paras: [
      "Nous ne voulons pas simplement exporter des fruits. Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance, de créer de la valeur et de représenter l'excellence des régions tropicales sur la scène internationale.",
      "Nous recherchons des partenaires qui partagent cette ambition : faire émerger une nouvelle référence du commerce international, fondée sur la qualité, l'innovation et une vision à long terme.",
    ],
  },
  {
    bg: "#F8F6F2",
    align: "right",
    label: "04 · AVENIR",
    labelColor: "#5A4A30",
    title: "Ce que nous construisons",
    paras: [
      "Nous imaginons un futur où les produits tropicaux africains seront recherchés non seulement pour leur qualité naturelle, mais aussi pour les standards d'excellence, de professionnalisme et d'innovation qui les accompagnent.",
      "Tropicaura entend contribuer à cette transformation aux côtés de producteurs, d'acheteurs et d'acteurs engagés qui souhaitent participer à l'émergence d'une Afrique plus visible, plus compétitive et plus influente sur les marchés mondiaux.",
    ],
    quote: "L'avenir ne se construit pas seul. Il se construit ensemble.",
  },
];

export default function APropos() {
  const blocks = useRef([]);

  useEffect(() => {
    /* ── Smooth scroll ── */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /* ── Fade-in subtil par section ── */
    blocks.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div style={{ background: "#F5F2ED", overflowX: "hidden" }}>

      {/* ── Header ── */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        height: 66,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px, 5vw, 48px)",
        background: "rgba(251,250,246,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        pointerEvents: "none",
      }}>
        <a href="/" style={{
          pointerEvents: "auto",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: ".04em",
          color: "#1A1A1A",
          textDecoration: "none",
        }}>
          TROPICAURA
        </a>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#1A1A1A",
            background: "rgba(0,0,0,0.04)",
            border: "1.5px solid rgba(0,0,0,0.10)",
            borderRadius: 100,
            padding: "9px 22px",
            cursor: "pointer",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ── Sections ── */}
      {DATA.map((s, i) => {
        const Tag = i === 0 ? "h1" : "h2";
        return (
          <section
            key={i}
            style={{
              minHeight: "100vh",
              background: s.bg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: `${i === 0 ? 110 : 90}px clamp(32px, 9vw, 140px)`,
              boxSizing: "border-box",
            }}
          >
            <div
              ref={(el) => (blocks.current[i] = el)}
              style={{
                width: "100%",
                maxWidth: 540,
                marginLeft: s.align === "right" ? "auto" : 0,
              }}
            >
              {/* Label */}
              <span style={{
                display: "block",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: s.labelColor,
                marginBottom: 20,
              }}>
                {s.label}
              </span>

              {/* Titre */}
              <Tag style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(30px,4.2vw,58px)",
                lineHeight: 1.05,
                letterSpacing: "-.025em",
                color: "#1A1A1A",
                margin: "0 0 34px",
              }}>
                {s.title}
              </Tag>

              {/* Corps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {s.paras.map((p, j) => (
                  <p key={j} style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(14px,1.35vw,17px)",
                    lineHeight: 1.82,
                    fontWeight: 400,
                    color: "#4A4A4A",
                    margin: 0,
                  }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Citation — section 4 uniquement */}
              {s.quote && (
                <p style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: "clamp(17px,1.8vw,23px)",
                  lineHeight: 1.5,
                  letterSpacing: "-.01em",
                  color: "#1A1A1A",
                  margin: "44px 0 0",
                  paddingLeft: 22,
                  borderLeft: "2px solid rgba(0,0,0,0.13)",
                }}>
                  "{s.quote}"
                </p>
              )}
            </div>
          </section>
        );
      })}

    </div>
  );
}
