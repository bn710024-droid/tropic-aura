import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  À PROPOS — calqué sur le modèle de référence
//  Titres larges · 2-3 §§ · nav dots · overlay directionnel
// ============================================================

const SECTIONS = [
  {
    id:    "conviction",
    img:   "/about/about-conviction.png",
    label: "01 — NOTRE CONVICTION",
    title: "Notre conviction",
    paras: [
      "Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Pourtant, leur potentiel reste encore insuffisamment valorisé sur les marchés internationaux.",
      "Tropic-Aura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants.",
      "Nous invitons nos partenaires à participer à cette nouvelle dynamique : construire des connexions durables, révéler la véritable valeur des origines africaines et contribuer à une chaîne d'approvisionnement plus équitable, plus moderne et plus performante.",
    ],
    side: "left",
  },
  {
    id:    "mission",
    img:   "/about/about-mission.png",
    label: "02 — NOTRE MISSION",
    title: "Notre mission",
    paras: [
      "Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux afin de faciliter l'accès à des produits tropicaux de qualité tout en créant davantage de valeur à l'origine.",
      "Chaque collaboration représente une opportunité de bâtir ensemble un commerce plus efficace, plus transparent et plus bénéfique pour l'ensemble des acteurs de la chaîne de valeur.",
    ],
    side: "right",
  },
  {
    id:    "vision",
    img:   "/about/about-vision.png",
    label: "03 — NOTRE VISION",
    title: "Notre vision",
    paras: [
      "Nous ne voulons pas simplement exporter des fruits.",
      "Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance, de créer de la valeur et de représenter l'excellence des régions tropicales sur la scène internationale.",
      "Nous recherchons des partenaires qui partagent cette ambition : faire émerger une nouvelle référence du commerce international fondée sur la qualité, l'innovation et une vision à long terme.",
    ],
    side: "left",
  },
  {
    id:    "avenir",
    img:   "/about/about-avenir.png",
    label: "04 — NOTRE AVENIR",
    title: "Notre avenir",
    paras: [
      "Nous imaginons un futur où les produits tropicaux africains seront recherchés non seulement pour leur qualité naturelle, mais aussi pour les standards d'excellence, de professionnalisme et d'innovation qui les accompagnent.",
      "Tropic-Aura entend contribuer à cette transformation aux côtés de producteurs, d'acheteurs et d'acteurs engagés qui souhaitent participer à l'émergence d'une Afrique plus visible, plus compétitive et plus influente sur les marchés mondiaux.",
    ],
    quote: "L'avenir ne se construit pas seul. Il se construit ensemble.",
    side: "left",
  },
];

// ============================================================
export default function APropos() {
  const contentRefs = useRef([]);
  const dotRefs     = useRef([]);
  const revealed    = useRef(new Set());
  const lenisRef    = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId;
    const easeOut = (t) => 1 - (1 - t) * (1 - t);
    const last    = SECTIONS.length - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      // ── fade-in contenu (révèle une fois) ──
      SECTIONS.forEach((_, i) => {
        const el = contentRefs.current[i];
        if (!el) return;
        if (revealed.current.has(i)) return;

        const enter    = i === 0 ? -H * 0.5 : i * H - H * 0.08;
        const progress = Math.min(1, Math.max(0, (scroll - enter) / (H * 0.28)));
        const e        = easeOut(progress);
        el.style.opacity   = e.toFixed(3);
        el.style.transform = `translateY(${(28 * (1 - e)).toFixed(1)}px)`;
        if (e >= 0.999) revealed.current.add(i);
      });

      // ── nav dots : active = section visible ──
      const active = Math.min(last, Math.max(0, Math.round(scroll / H)));
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const on = i === active;
        dot.style.width      = on ? "9px"  : "6px";
        dot.style.height     = on ? "9px"  : "6px";
        dot.style.background = on ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.32)";
        dot.style.boxShadow  = on ? "0 0 0 2px rgba(255,255,255,0.18)" : "none";
      });
    };

    const readScroll = () => {
      const s = lenis.animatedScroll;
      return Number.isFinite(s) ? s : (window.scrollY || 0);
    };

    const raf = (time) => {
      lenis.raf(time);
      const scroll = readScroll();
      if (Math.abs(scroll - lastScroll) > 0.04) {
        lastScroll = scroll;
        update(scroll, window.innerHeight || 1);
      }
      rafId = requestAnimationFrame(raf);
    };

    update(0, window.innerHeight || 1);
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, []);

  const scrollTo = (i) => {
    lenisRef.current?.scrollTo(i * window.innerHeight, { duration: 1.2 });
  };

  return (
    <>
      {/* ── Header ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 200, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none", background: "transparent",
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 19, letterSpacing: ".04em",
          color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}>
          TROPICAURA
        </span>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-flex", alignItems: "center",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 13, letterSpacing: ".10em",
            textTransform: "uppercase", color: "#fff",
            background: "rgba(255,255,255,0.14)",
            border: "2px solid rgba(255,255,255,0.38)",
            borderRadius: 100, padding: "5px 18px", cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ── Navigation dots ── */}
      <nav style={{
        position: "fixed",
        right: "clamp(14px,2vw,28px)",
        top: "50%", transform: "translateY(-50%)",
        zIndex: 150,
        display: "flex", flexDirection: "column", gap: 12,
        pointerEvents: "auto",
      }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => (dotRefs.current[i] = el)}
            onClick={() => scrollTo(i)}
            title={s.title}
            style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.32)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width .25s, height .25s, background .25s, box-shadow .25s",
              display: "block",
            }}
          />
        ))}
      </nav>

      {/* ── Sections ── */}
      {SECTIONS.map((s, i) => {
        const isRight = s.side === "right";
        return (
          <section
            key={s.id}
            data-index={i}
            className="scene"
            style={{
              backgroundImage:      `url(${s.img})`,
              backgroundSize:       "cover",
              backgroundPosition:   "center",
              backgroundAttachment: "fixed",
              justifyContent: isRight ? "flex-end" : "flex-start",
            }}
          >
            {/* Overlay directionnel */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, zIndex: 2,
              background: isRight
                ? "linear-gradient(to left,  rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.08) 55%)"
                : "linear-gradient(to right, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.08) 55%)",
              pointerEvents: "none",
            }} />

            {/* Contenu */}
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="scene__content"
              style={{
                paddingLeft:  isRight ? 16                      : "clamp(24px,7vw,96px)",
                paddingRight: isRight ? "clamp(24px,7vw,96px)" : 16,
                maxWidth: "min(480px, 46vw)",
                textAlign: "left",
                opacity:   i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0)" : "translateY(28px)",
              }}
            >
              {/* Surtitre */}
              <span style={{
                display: "block",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 10, fontWeight: 700,
                letterSpacing: ".24em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.58)", marginBottom: 14,
              }}>
                {s.label}
              </span>

              {/* Titre — grand comme le modèle */}
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(46px, 5.6vw, 72px)",
                lineHeight: 1.04,
                letterSpacing: "-.03em",
                color: "#fff",
                textShadow: "0 6px 40px rgba(0,0,0,0.28)",
                margin: "0 0 18px",
              }}>
                {s.title}
              </h1>

              {/* Trait doré */}
              <div style={{
                width: 38, height: 3,
                background: "#D4A017",
                borderRadius: 2,
                margin: "0 0 26px",
              }} />

              {/* Paragraphes */}
              {s.paras.map((p, j) => (
                <p key={j} style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(14px, 1.3vw, 16px)",
                  lineHeight: 1.72,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.88)",
                  textShadow: "0 1px 10px rgba(0,0,0,0.25)",
                  margin: j < s.paras.length - 1 ? "0 0 14px" : "0",
                }}>
                  {p}
                </p>
              ))}

              {/* Citation finale (S4) */}
              {s.quote && (
                <p style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(14px, 1.3vw, 16px)",
                  lineHeight: 1.72,
                  fontWeight: 700,
                  color: "#fff",
                  textShadow: "0 1px 10px rgba(0,0,0,0.25)",
                  margin: "14px 0 0",
                }}>
                  {s.quote}
                </p>
              )}
            </div>

            {/* Hint scroll — section 0 */}
            {i === 0 && (
              <div className="scene__hint">
                <i />
                <span>Défilez vers le bas</span>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
