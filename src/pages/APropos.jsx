import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  À PROPOS — RAF + bg interpolé · 0 fruit · alternance gauche/droite
// ============================================================

const SECTIONS = [
  {
    id:    "conviction",
    bg:    "#F7ECD9",
    label: "01 · Conviction",
    title: "Pourquoi Tropicaura existe",
    desc:  "Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Tropicaura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants.",
    side:  "left",
  },
  {
    id:    "mission",
    bg:    "#E5EEE6",
    label: "02 · Mission",
    title: "Ce que nous faisons aujourd'hui",
    desc:  "Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux pour créer davantage de valeur à l'origine et bâtir un commerce plus équitable.",
    side:  "right",
  },
  {
    id:    "vision",
    bg:    "#EFE4D7",
    label: "03 · Vision",
    title: "Là où nous voulons aller",
    desc:  "Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance et de représenter l'excellence des régions tropicales sur la scène internationale.",
    side:  "left",
  },
  {
    id:    "avenir",
    bg:    "#E2D1AF",
    label: "04 · Avenir",
    title: "Ce que nous construisons",
    desc:  "Nous imaginons un futur où les produits tropicaux africains seront recherchés pour leur excellence et leurs standards d'innovation. L'avenir ne se construit pas seul — il se construit ensemble.",
    side:  "right",
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

// ============================================================
export default function APropos() {
  const bgRef    = useRef(null);
  const lenisRef = useRef(null);

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
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const last = SECTIONS.length - 1;

    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      // fond interpolé entre les 4 couleurs
      const prog = scroll / H;
      const i  = Math.min(last, Math.floor(prog));
      const ft = Math.min(1, Math.max(0, prog - i));
      const a  = COLORS[i];
      const b  = COLORS[Math.min(last, i + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(a[0],b[0],ft)},${lerp(a[1],b[1],ft)},${lerp(a[2],b[2],ft)})`;
      }
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
        background: "transparent",
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
            background: "rgba(0,0,0,0.07)",
            border: "2px solid rgba(0,0,0,0.18)",
            borderRadius: 100, padding: "5px 18px", cursor: "pointer",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ── Fond interpolé + profondeur ── */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

      {/* ── Sections ── */}
      {SECTIONS.map((s, i) => {
        const isRight = s.side === "right";
        return (
          <section
            key={s.id}
            data-index={i}
            className="scene"
            style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}
          >
            <div
              className="scene__content"
              style={{
                paddingLeft:  isRight ? 16                        : "clamp(20px,7vw,96px)",
                paddingRight: isRight ? "clamp(20px,7vw,96px)"   : 16,
                textAlign: "left",
              }}
            >
              <span style={{
                display: "block",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: ".22em", textTransform: "uppercase",
                color: "rgba(0,0,0,0.40)", marginBottom: 14,
              }}>
                {s.label}
              </span>
              <h1 className="scene__title" style={{ color: "#1A1A1A", textShadow: "none" }}>
                {s.title}
              </h1>
              <p className="scene__desc" style={{ color: "#3A3A3A", textShadow: "none" }}>
                {s.desc}
              </p>
            </div>

            {/* Hint scroll — section 1 uniquement */}
            {i === 0 && (
              <div className="scene__hint scene__hint--dark">
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
