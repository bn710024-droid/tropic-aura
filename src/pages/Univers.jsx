import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  NOTRE UNIVERS — même mécanique que Home / À Propos :
//  bg-layer fixe + interpolation couleur en RAF + fade-in contenu
//  5 sections, une couleur par section.
//  (textes provisoires — à remplacer)
// ============================================================

const SECTIONS = [
  {
    id:    "qualite",
    bg:    "#FFB703",
    side:  "left",
    label: "01 — QUALITÉ",
    title: "L'excellence n'est jamais accidentelle.",
    paras: [
      "Chaque produit destiné aux marchés internationaux doit répondre à des exigences élevées de sélection, de préparation et de conformité.",
      "Tropic-Aura s'engage à promouvoir une approche fondée sur la rigueur, la constance et l'amélioration continue afin de répondre aux attentes des acheteurs les plus exigeants.",
    ],
  },
  {
    id:    "transparence",
    bg:    "#219EBC",
    side:  "right",
    label: "02 — TRANSPARENCE",
    title: "La confiance commence par la clarté.",
    paras: [
      "Les partenariats durables reposent sur une communication ouverte et des informations fiables.",
      "Nous privilégions des échanges transparents entre tous les acteurs de la chaîne afin de faciliter la prise de décision et de renforcer la confiance à long terme.",
    ],
  },
  {
    id:    "responsabilite",
    bg:    "#2A9D8F",
    side:  "left",
    label: "03 — RESPONSABILITÉ",
    title: "Créer de la valeur à chaque étape.",
    paras: [
      "Le développement du commerce tropical doit bénéficier à l'ensemble de l'écosystème.",
      "Nous croyons à des relations équilibrées qui favorisent la création de valeur pour les producteurs, les partenaires logistiques, les distributeurs et les acheteurs internationaux.",
    ],
  },
  {
    id:    "fiabilite",
    bg:    "#E76F51",
    side:  "right",
    label: "04 — FIABILITÉ",
    title: "Tenir nos engagements.",
    paras: [
      "Dans le commerce international, la crédibilité se construit par les actions.",
      "Notre priorité est de développer des relations professionnelles fondées sur la cohérence, la préparation et le respect des engagements pris auprès de nos partenaires.",
    ],
  },
  {
    id:    "impact",
    bg:    "#6A4C93",
    side:  "left",
    label: "05 — IMPACT",
    title: "Construire davantage qu'un commerce.",
    paras: [
      "Nous souhaitons contribuer à l'émergence d'un secteur tropical africain plus structuré, plus visible et davantage reconnu sur les marchés internationaux.",
      "Chaque partenariat, chaque projet et chaque collaboration participe à cette ambition collective.",
    ],
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

// ============================================================
export default function Univers() {
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
      // ── couleur de fond interpolée ──
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

    // ── fade-in des paragraphes au scroll (GSAP ScrollTrigger) ──
    // chaque <p> : opacity 0→1 sur 0.8s, décalage 0.2s entre paragraphes.
    lenis.on("scroll", ScrollTrigger.update);
    const triggers = [];
    contentRefs.current.forEach((content) => {
      if (!content) return;
      const paras = content.querySelectorAll("p");
      if (!paras.length) return;
      gsap.set(paras, { opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: content,
        start: "top 80%",
        once: true,
        onEnter: () => gsap.to(paras, {
          opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
        }),
      });
      triggers.push(st);
    });
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", ScrollTrigger.update);
      triggers.forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  const scrollTo = (i) =>
    lenisRef.current?.scrollTo(i * window.innerHeight, { duration: 1.2 });

  return (
    <>
      {/* ── Header fantôme transparent ── */}
      <header className="ghost" style={{ zIndex: 200 }}>
        <span className="ghost__logo">TROPICAURA</span>
      </header>

      {/* ── Fond interpolé + couche de profondeur ── */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

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
