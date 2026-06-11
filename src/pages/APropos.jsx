import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  À PROPOS — image bg cover + parallaxe fixed + fade-in RAF
//  Scroll mechanism inchangé (Lenis + rAF loop)
// ============================================================

const SECTIONS = [
  {
    id:    "conviction",
    img:   "/about/about-conviction.png",
    label: "01 · Notre conviction",
    title: "Notre conviction",
    desc:  "Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Tropicaura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants.",
    side:  "left",
  },
  {
    id:    "mission",
    img:   "/about/about-mission.png",
    label: "02 · Notre mission",
    title: "Notre mission",
    desc:  "Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux pour créer davantage de valeur à l'origine et bâtir un commerce plus équitable.",
    side:  "right",
  },
  {
    id:    "vision",
    img:   "/about/about-vision.png",
    label: "03 · Notre vision",
    title: "Notre vision",
    desc:  "Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance et de représenter l'excellence des régions tropicales sur la scène internationale.",
    side:  "left",
  },
  {
    id:    "avenir",
    img:   "/about/about-avenir.png",
    label: "04 · Notre avenir",
    title: "Notre avenir",
    desc:  "Nous imaginons un futur où les produits tropicaux africains seront recherchés pour leur excellence et leurs standards d'innovation. L'avenir ne se construit pas seul — il se construit ensemble.",
    side:  "right",
  },
];

// ============================================================
export default function APropos() {
  const contentRefs = useRef([]);
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
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      SECTIONS.forEach((_, i) => {
        const el = contentRefs.current[i];
        if (!el) return;

        // section 0 toujours visible, les autres révèlent une fois
        if (revealed.current.has(i)) return;

        // début de la fenêtre de fade-in
        const enter    = i === 0 ? -H * 0.5 : i * H - H * 0.1;
        const progress = Math.min(1, Math.max(0, (scroll - enter) / (H * 0.28)));
        const e        = easeOut(progress);

        el.style.opacity   = e.toFixed(3);
        el.style.transform = `translateY(${(28 * (1 - e)).toFixed(1)}px)`;

        if (e >= 0.999) revealed.current.add(i);
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

  return (
    <>
      {/* ── Header ── */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
        background: "transparent",
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
            {/* Overlay sombre — suit le côté du texte */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, zIndex: 2,
              background: isRight
                ? "linear-gradient(to left,  rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.10) 100%)"
                : "linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.10) 100%)",
              pointerEvents: "none",
            }} />

            {/* Contenu texte */}
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="scene__content"
              style={{
                paddingLeft:  isRight ? 16                      : "clamp(20px,7vw,96px)",
                paddingRight: isRight ? "clamp(20px,7vw,96px)" : 16,
                textAlign: "left",
                /* état initial — le RAF prend le relais dès la 1re frame */
                opacity:   i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0)" : "translateY(28px)",
              }}
            >
              {/* Surtitre */}
              <span style={{
                display: "block",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: ".22em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)", marginBottom: 12,
              }}>
                {s.label}
              </span>

              {/* Titre */}
              <h1 className="scene__title">{s.title}</h1>

              {/* Trait doré */}
              <div style={{
                width: 40, height: 3,
                background: "#D4A017",
                borderRadius: 2,
                margin: "0 0 24px",
              }} />

              {/* Description */}
              <p className="scene__desc">{s.desc}</p>
            </div>

            {/* Hint scroll — section 0 uniquement */}
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
