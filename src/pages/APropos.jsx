import { useEffect, useRef } from "react";
import Lenis from "lenis";
import FallingFruits from "../components/FallingFruits";

// ============================================================
//  À PROPOS — même mécanique que Home :
//  bg-layer fixe + interpolation couleur en RAF + fade-in contenu
// ============================================================

const SECTIONS = [
  {
    id:    "conviction",
    bg:    "#C08B10",
    side:  "left",
    label: "01 — NOTRE CONVICTION",
    title: "Notre conviction",
    paras: [
      "Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Pourtant, leur potentiel reste encore insuffisamment valorisé sur les marchés internationaux.",
      "Tropic-Aura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants.",
      "Nous invitons nos partenaires à participer à cette nouvelle dynamique : construire des connexions durables, révéler la véritable valeur des origines africaines et contribuer à une chaîne d'approvisionnement plus équitable, plus moderne et plus performante.",
    ],
  },
  {
    id:    "mission",
    bg:    "#4E8F6A",
    side:  "right",
    label: "02 — NOTRE MISSION",
    title: "Notre mission",
    paras: [
      "Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux afin de faciliter l'accès à des produits tropicaux de qualité tout en créant davantage de valeur à l'origine.",
      "Chaque collaboration représente une opportunité de bâtir ensemble un commerce plus efficace, plus transparent et plus bénéfique pour l'ensemble des acteurs de la chaîne de valeur.",
    ],
  },
  {
    id:    "vision",
    bg:    "#8272BC",
    side:  "left",
    label: "03 — NOTRE VISION",
    title: "Notre vision",
    paras: [
      "Nous ne voulons pas simplement exporter des fruits.",
      "Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance, de créer de la valeur et de représenter l'excellence des régions tropicales sur la scène internationale.",
      "Nous recherchons des partenaires qui partagent cette ambition : faire émerger une nouvelle référence du commerce international fondée sur la qualité, l'innovation et une vision à long terme.",
    ],
  },
  {
    id:    "avenir",
    bg:    "#1B434E",
    side:  "right",
    label: "04 — NOTRE AVENIR",
    title: "Notre avenir",
    paras: [
      "Nous imaginons un futur où les produits tropicaux africains seront recherchés non seulement pour leur qualité naturelle, mais aussi pour les standards d'excellence, de professionnalisme et d'innovation qui les accompagnent.",
      "Tropic-Aura entend contribuer à cette transformation aux côtés de producteurs, d'acheteurs et d'acteurs engagés qui souhaitent participer à l'émergence d'une Afrique plus visible, plus compétitive et plus influente sur les marchés mondiaux.",
    ],
    quote: "L'avenir ne se construit pas seul. Il se construit ensemble.",
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

// ============================================================
export default function APropos() {
  const bgRef       = useRef(null);
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
    const lerp     = (a, b, t) => Math.round(a + (b - a) * t);
    const easeOut  = (t) => 1 - (1 - t) * (1 - t);
    const last     = SECTIONS.length - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      // ── couleur de fond interpolée (identique Home) ──
      const prog = scroll / H;
      const ci   = Math.min(last, Math.floor(prog));
      const ft   = Math.min(1, Math.max(0, prog - ci));
      const ca   = COLORS[ci];
      const cb   = COLORS[Math.min(last, ci + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(ca[0],cb[0],ft)},${lerp(ca[1],cb[1],ft)},${lerp(ca[2],cb[2],ft)})`;
      }

      // ── fade-in contenu (révèle une fois) ──
      // Fenêtre qui se termine avant le centrage → la dernière section
      // (non dépassable au scroll) se révèle bien à 100 %.
      SECTIONS.forEach((_, j) => {
        const el = contentRefs.current[j];
        if (!el || revealed.current.has(j)) return;
        const enter    = j * H - H * 0.60;
        const progress = Math.min(1, Math.max(0, (scroll - enter) / (H * 0.42)));
        const e        = easeOut(progress);
        if (e >= 0.999) {
          el.style.opacity   = "1";
          el.style.transform = "none";
          revealed.current.add(j);
          return;
        }
        el.style.opacity   = e.toFixed(3);
        el.style.transform = `translateY(${Math.round(28 * (1 - e))}px)`;
      });

      // ── nav dots ──
      const active = Math.min(last, Math.max(0, Math.round(scroll / H)));
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width      = on ? "9px" : "6px";
        dot.style.height     = on ? "9px" : "6px";
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

  const scrollTo = (i) =>
    lenisRef.current?.scrollTo(i * window.innerHeight, { duration: 1.2 });

  return (
    <>
      {/* ── Header fantôme transparent (comme Home) ── */}
      <header className="ghost" style={{ zIndex: 200 }}>
        <span className="ghost__logo">TROPICAURA</span>
      </header>

      {/* ── Fond interpolé + couche de profondeur ── */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

      {/* ── Pluie de fruits décorative (derrière le texte) ── */}
      <FallingFruits />

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

      {/* ── Sections ── */}
      {SECTIONS.map((s, i) => {
        const isRight = s.side === "right";
        return (
        <section key={s.id} data-index={i} className="scene" style={{
          justifyContent: isRight ? "flex-end" : "flex-start",
        }}>
          <div
            ref={(el) => (contentRefs.current[i] = el)}
            className="scene__content"
            style={{
              opacity:      i === 0 ? 1 : 0,
              transform:    i === 0 ? "translateY(0)" : "translateY(28px)",
              paddingLeft:  isRight ? 16 : "clamp(24px,7vw,96px)",
              paddingRight: isRight ? "clamp(24px,7vw,96px)" : 16,
            }}
          >
            <span style={{
              display: "block",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: ".24em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.62)", marginBottom: 14,
            }}>
              {s.label}
            </span>

            <h1 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 3.6vw, 52px)",
              lineHeight: 1.08, letterSpacing: "-.03em",
              color: "#fff",
              textShadow: "0 4px 32px rgba(0,0,0,0.28)",
              margin: "0 0 14px",
            }}>
              {s.title}
            </h1>

            <div style={{
              width: 34, height: 3, background: "rgba(255,255,255,0.55)",
              borderRadius: 2, margin: "0 0 18px",
            }} />

            {s.paras.map((p, j) => (
              <p key={j} style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: "clamp(14px, 1.3vw, 16px)",
                lineHeight: 1.72, fontWeight: 400,
                color: "rgba(255,255,255,0.88)",
                textShadow: "0 1px 8px rgba(0,0,0,0.22)",
                margin: j < s.paras.length - 1 ? "0 0 12px" : "0",
              }}>
                {p}
              </p>
            ))}

            {s.quote && (
              <p style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: "clamp(14px, 1.3vw, 16px)",
                lineHeight: 1.72, fontWeight: 700,
                color: "#fff",
                textShadow: "0 1px 8px rgba(0,0,0,0.28)",
                margin: "16px 0 0",
              }}>
                {s.quote}
              </p>
            )}
          </div>

          {i === 0 && (
            <div className="scene__hint">
              <i /><span>Défilez vers le bas</span>
            </div>
          )}
        </section>
        );
      })}
    </>
  );
}
