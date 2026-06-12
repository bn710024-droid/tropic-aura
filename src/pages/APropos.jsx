import { useEffect, useRef } from "react";
import Lenis from "lenis";
import KintsugiLayer from "../components/KintsugiLayer";

// ============================================================
//  À PROPOS — images bg cover (no fixed) + overlay 0.3 + RAF
// ============================================================

const SECTIONS = [
  {
    id:    "conviction",
    bg:    "#C08B10",           // ambre vif — identique à l'image
    img:   "/about/about-conviction.png",
    label: "01 — NOTRE CONVICTION",
    title: "Notre conviction",
    paras: [
      "Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Pourtant, leur potentiel reste encore insuffisamment valorisé sur les marchés internationaux.",
      "Tropic-Aura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants.",
      "Nous invitons nos partenaires à participer à cette nouvelle dynamique : construire des connexions durables, révéler la véritable valeur des origines africaines et contribuer à une chaîne d'approvisionnement plus équitable, plus moderne et plus performante.",
    ],
    side: "left",
    dark: false,
  },
  {
    id:    "mission",
    bg:    "#4E8F6A",           // sage vif — identique à l'image
    img:   "/about/about-mission.png",
    label: "02 — NOTRE MISSION",
    title: "Notre mission",
    paras: [
      "Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux afin de faciliter l'accès à des produits tropicaux de qualité tout en créant davantage de valeur à l'origine.",
      "Chaque collaboration représente une opportunité de bâtir ensemble un commerce plus efficace, plus transparent et plus bénéfique pour l'ensemble des acteurs de la chaîne de valeur.",
    ],
    side: "right",
    dark: false,
  },
  {
    id:    "vision",
    bg:    "#8272BC",           // lavande vif — identique à l'image
    img:   "/about/about-vision.png",
    label: "03 — NOTRE VISION",
    title: "Notre vision",
    paras: [
      "Nous ne voulons pas simplement exporter des fruits.",
      "Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance, de créer de la valeur et de représenter l'excellence des régions tropicales sur la scène internationale.",
      "Nous recherchons des partenaires qui partagent cette ambition : faire émerger une nouvelle référence du commerce international fondée sur la qualité, l'innovation et une vision à long terme.",
    ],
    side: "left",
    dark: false,
  },
  {
    id:    "avenir",
    bg:    "#1B434E",           // teal sombre — fond foncé
    img:   "/about/about-avenir.png",
    label: "04 — NOTRE AVENIR",
    title: "Notre avenir",
    paras: [
      "Nous imaginons un futur où les produits tropicaux africains seront recherchés non seulement pour leur qualité naturelle, mais aussi pour les standards d'excellence, de professionnalisme et d'innovation qui les accompagnent.",
      "Tropic-Aura entend contribuer à cette transformation aux côtés de producteurs, d'acheteurs et d'acteurs engagés qui souhaitent participer à l'émergence d'une Afrique plus visible, plus compétitive et plus influente sur les marchés mondiaux.",
    ],
    quote: "L'avenir ne se construit pas seul. Il se construit ensemble.",
    side: "right",
    dark: true,
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
    const easeOut  = (t) => 1 - (1 - t) * (1 - t);
    const last     = SECTIONS.length - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      // ── fade-in contenu (révèle une fois) ──
      SECTIONS.forEach((_, j) => {
        const el = contentRefs.current[j];
        if (!el || revealed.current.has(j)) return;
        const enter    = j === 0 ? -H * 0.5 : j * H - H * 0.08;
        const progress = Math.min(1, Math.max(0, (scroll - enter) / (H * 0.28)));
        const e        = easeOut(progress);
        el.style.opacity   = e.toFixed(3);
        el.style.transform = `translateY(${(28 * (1 - e)).toFixed(1)}px)`;
        if (e >= 0.999) revealed.current.add(j);
      });

      // ── nav dots — couleur selon section claire/sombre ──
      const active     = Math.min(last, Math.max(0, Math.round(scroll / H)));
      const darkSec    = SECTIONS[active]?.dark ?? true;
      const dotOn      = darkSec ? "rgba(255,255,255,0.95)"  : "rgba(26,26,26,0.85)";
      const dotOff     = darkSec ? "rgba(255,255,255,0.32)"  : "rgba(26,26,26,0.25)";
      const dotShadow  = darkSec ? "0 0 0 2px rgba(255,255,255,0.18)" : "0 0 0 2px rgba(0,0,0,0.08)";
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width      = on ? "9px" : "6px";
        dot.style.height     = on ? "9px" : "6px";
        dot.style.background = on ? dotOn  : dotOff;
        dot.style.boxShadow  = on ? dotShadow : "none";
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

  const scrollTo = (i) =>
    lenisRef.current?.scrollTo(i * window.innerHeight, { duration: 1.2 });

  return (
    <>
      {/* ── Header ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 200, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 19, letterSpacing: ".04em",
          color: "#1A1A1A",
        }}>
          TROPICAURA
        </span>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-flex", alignItems: "center",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 13, letterSpacing: ".10em",
            textTransform: "uppercase", color: "#1A1A1A",
            background: "rgba(0,0,0,0.06)",
            border: "1.5px solid rgba(0,0,0,0.18)",
            borderRadius: 100, padding: "5px 18px", cursor: "pointer",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ── Nav dots ── */}
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
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(255,255,255,0.32)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width .25s, height .25s, background .25s, box-shadow .25s",
              display: "block",
            }}
          />
        ))}
      </nav>

      {/* ── Sections + calque kintsugi ── */}
      <div style={{ position: "relative" }}>
        <KintsugiLayer />
      {SECTIONS.map((s, i) => {
        const isRight   = s.side === "right";
        const titleCol  = s.dark ? "#fff"                    : "#1A1A1A";
        const labelCol  = s.dark ? "rgba(255,255,255,0.58)" : "rgba(0,0,0,0.52)";
        const paraCol   = s.dark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.78)";
        const quoteShadow = s.dark ? "0 1px 8px rgba(0,0,0,0.30)" : "none";
        return (
          <section
            key={s.id}
            data-index={i}
            className="scene"
            style={{
              backgroundColor:    s.bg,
              backgroundImage:    `url(${s.img})`,
              backgroundSize:     "55% auto",
              backgroundPosition: isRight ? "left center" : "right center",
              backgroundRepeat:   "no-repeat",
              justifyContent: isRight ? "flex-end" : "flex-start",
              paddingTop: "80px",
              paddingBottom: "40px",
            }}
          >
            {/* Overlay uniquement sur sections sombres */}
            {s.dark && (
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, zIndex: 2,
                background: "rgba(0,0,0,0.22)",
                pointerEvents: "none",
              }} />
            )}

            {/* Contenu texte */}
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
              <span style={{
                display: "block",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 10, fontWeight: 700,
                letterSpacing: ".24em", textTransform: "uppercase",
                color: labelCol, marginBottom: 14,
              }}>
                {s.label}
              </span>

              <h1 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 3.6vw, 48px)",
                lineHeight: 1.08, letterSpacing: "-.03em",
                color: titleCol,
                margin: "0 0 14px",
              }}>
                {s.title}
              </h1>

              <div style={{
                width: 34, height: 3, background: "#D4A017",
                borderRadius: 2, margin: "0 0 18px",
              }} />

              {s.paras.map((p, j) => (
                <p key={j} style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(13px, 1.15vw, 15px)",
                  lineHeight: 1.68, fontWeight: 400,
                  color: paraCol,
                  margin: j < s.paras.length - 1 ? "0 0 10px" : "0",
                }}>
                  {p}
                </p>
              ))}

              {s.quote && (
                <p style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(14px, 1.3vw, 16px)",
                  lineHeight: 1.72, fontWeight: 700,
                  color: titleCol,
                  textShadow: quoteShadow,
                  margin: "14px 0 0",
                }}>
                  {s.quote}
                </p>
              )}
            </div>

            {i === 0 && (
              <div className={`scene__hint${!s.dark ? " scene__hint--dark" : ""}`}>
                <i /><span>Défilez vers le bas</span>
              </div>
            )}
          </section>
        );
      })}
      </div>
    </>
  );
}
