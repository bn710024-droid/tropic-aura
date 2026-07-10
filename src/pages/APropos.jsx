import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  À PROPOS — "Notre Vision" — récit éditorial continu
//  Sections 01 (Notre Vision, forêt) et 02 (Aujourd'hui, ivoire) UNIQUEMENT.
//  03-06 suivront la même logique une fois validées.
//
//  Principe : tout est fonction PURE du scroll (comme le reste du site,
//  aucune transition CSS sur les éléments animés — seul le fade d'apparition
//  au montage de la section 01 utilise une durée réelle, cf. mountEase).
//  La transition 01→02 n'est jamais une coupure : la couleur de fond glisse
//  en continu (même mécanisme bg-layer que Home), le texte/la photo de 01
//  s'effacent pendant que 02 apparaît, sur une fenêtre de scroll large.
// ============================================================

export const PAGE_ENTRY_COLOR = { desktop: "#122A1E", mobile: "#122A1E" };

const GOLD = "#C9A84C";

const SECTIONS = [
  {
    id: "vision", num: "01", kicker: "NOTRE VISION", bg: "#122A1E", dark: true,
    title: "Construire davantage qu'une entreprise d'export.",
    desc: "Notre ambition est de créer une chaîne de valeur durable reliant les producteurs africains aux marchés internationaux.",
    hint: "Défiler pour découvrir",
    photoLabel: "Photo champ / verger",
  },
  {
    id: "aujourdhui", num: "02", kicker: "AUJOURD'HUI", bg: "#F2E9D8", dark: false,
    title: "Nous construisons un réseau fiable.",
    desc: "Chaque jour, nos équipes et partenaires travaillent pour garantir la qualité, la traçabilité et la fiabilité de nos mangues d'exportation.",
    checklist: [
      "Réseau de producteurs",
      "Préparation export",
      "Contrôle qualité",
      "Documentation export",
      "Logistique internationale",
    ],
    photoLabel: "Photo conditionnement / équipe",
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// ============================================================
export default function APropos() {
  const bgRef      = useRef(null);
  const logoRef    = useRef(null);
  const dotRefs    = useRef([]);
  const lenisRef   = useRef(null);

  // Section 01
  const s1TextRef  = useRef(null);
  const s1PhotoRef = useRef(null);
  const s1HintRef  = useRef(null);
  // Section 02
  const s2TitleRef = useRef(null);
  const s2DescRef  = useRef(null);
  const s2ItemRefs = useRef([]);
  const s2PhotoRef = useRef(null);

  useEffect(() => {
    // Lenis DESKTOP UNIQUEMENT — même règle que le reste du site (sur mobile
    // il fait "sauter" au retour vers le haut) → scroll natif iOS sur mobile.
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    const lenis = isDesktop ? new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    }) : null;
    lenisRef.current = lenis;

    let rafId;
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const last = SECTIONS.length - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const t0 = performance.now();

    const update = (scroll, H, elapsed) => {
      // ── Fond : glisse en continu de la forêt vers l'ivoire sur [0, H] ──
      const prog = scroll / H;
      const ci = Math.min(last, Math.floor(prog));
      const ft = Math.min(1, Math.max(0, prog - ci));
      const ca = COLORS[ci];
      const cb = COLORS[Math.min(last, ci + 1)];
      const bgR = lerp(ca[0], cb[0], ft), bgG = lerp(ca[1], cb[1], ft), bgB = lerp(ca[2], cb[2], ft);
      if (bgRef.current) bgRef.current.style.backgroundColor = `rgb(${bgR},${bgG},${bgB})`;

      // Luminance approximative du fond courant → logo & dots s'adaptent
      // (blanc chaud sur fond sombre, forêt profonde sur fond ivoire).
      const luminance = (0.299 * bgR + 0.587 * bgG + 0.114 * bgB) / 255;
      const onDark = luminance < 0.5;
      if (logoRef.current) logoRef.current.style.color = onDark ? "#F2E9D8" : "#17301F";

      // ── Montée douce au chargement (section 01 uniquement, une fois) ──
      const mountEase = easeOutCubic(clamp01(elapsed / 900));

      // ── SECTION 01 — dérive lente au scroll + sortie vers la transition ──
      const s1DriftY = -Math.min(110, scroll * 0.16);
      const s1FadeT = easeInOutCubic(clamp01((scroll - 0.45 * H) / (0.65 * H)));
      const s1TextOpacity = (1 - s1FadeT) * mountEase;
      if (s1TextRef.current) {
        s1TextRef.current.style.opacity = s1TextOpacity.toFixed(3);
        s1TextRef.current.style.transform =
          `translateY(${Math.round(s1DriftY + (1 - mountEase) * 26)}px)`;
      }

      const s1PhotoParallaxY = Math.min(50, scroll * 0.05);
      const s1PhotoScale = 1 + Math.min(0.035, prog * 0.035);
      const s1SlideT = easeInOutCubic(clamp01((scroll - 0.5 * H) / (0.7 * H)));
      const s1PhotoOpacity = (1 - s1SlideT) * mountEase;
      const s1PhotoX = -s1SlideT * 60;
      if (s1PhotoRef.current) {
        s1PhotoRef.current.style.opacity = s1PhotoOpacity.toFixed(3);
        s1PhotoRef.current.style.transform =
          `translate3d(${s1PhotoX.toFixed(1)}px, ${s1PhotoParallaxY.toFixed(1)}px, 0) scale(${s1PhotoScale.toFixed(3)})`;
      }

      // Indice de scroll : s'efface dès les premiers pixels de défilement.
      if (s1HintRef.current) {
        const hintOpacity = (1 - clamp01(scroll / (0.14 * H))) * mountEase;
        s1HintRef.current.style.opacity = hintOpacity.toFixed(3);
      }

      // ── SECTION 02 — apparition douce, décalée (titre → texte → liste) ──
      const s2Base = 0.6 * H;
      const s2Span = 0.6 * H;
      const s2TitleT = easeInOutCubic(clamp01((scroll - s2Base) / s2Span));
      if (s2TitleRef.current) {
        s2TitleRef.current.style.opacity = s2TitleT.toFixed(3);
        s2TitleRef.current.style.transform = `translateY(${Math.round((1 - s2TitleT) * 26)}px)`;
      }
      const s2DescT = easeInOutCubic(clamp01((scroll - (s2Base + 0.08 * H)) / s2Span));
      if (s2DescRef.current) {
        s2DescRef.current.style.opacity = s2DescT.toFixed(3);
        s2DescRef.current.style.transform = `translateY(${Math.round((1 - s2DescT) * 22)}px)`;
      }
      s2ItemRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = s2Base + 0.16 * H + i * 0.05 * H;
        const t = easeInOutCubic(clamp01((scroll - start) / (0.4 * H)));
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translateY(${Math.round((1 - t) * 14)}px)`;
      });
      const s2PhotoT = easeInOutCubic(clamp01((scroll - (s2Base + 0.1 * H)) / (0.55 * H)));
      if (s2PhotoRef.current) {
        s2PhotoRef.current.style.opacity = s2PhotoT.toFixed(3);
        s2PhotoRef.current.style.transform = `scale(${(1.06 - 0.06 * s2PhotoT).toFixed(3)})`;
      }

      // ── Puces de navigation — couleur adaptée au fond actif ──
      const active = Math.min(last, Math.max(0, Math.round(scroll / H)));
      const activeDark = SECTIONS[active].dark;
      const dotOn = activeDark ? "rgba(242,233,216,0.95)" : "rgba(23,48,31,0.72)";
      const dotOff = activeDark ? "rgba(242,233,216,0.32)" : "rgba(23,48,31,0.28)";
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width = on ? "9px" : "6px";
        dot.style.height = on ? "9px" : "6px";
        dot.style.background = on ? dotOn : dotOff;
      });
    };

    const readScroll = () => {
      if (lenis) {
        const s = lenis.animatedScroll;
        return Number.isFinite(s) ? s : (window.scrollY || 0);
      }
      return window.scrollY || 0;
    };

    const raf = (time) => {
      if (lenis) lenis.raf(time);
      const scroll = readScroll();
      const elapsed = time - t0;
      if (Math.abs(scroll - lastScroll) > 0.04 || elapsed < 950) {
        lastScroll = scroll;
        update(scroll, window.innerHeight || 1, elapsed);
      }
      rafId = requestAnimationFrame(raf);
    };

    // Filet de sécurité mobile (pas de Lenis) : rAF throttlé par iOS pendant
    // un geste tactile actif — un vrai 'scroll' natif ne l'est pas.
    const onNativeScroll = () => {
      if (lenis) return;
      const scroll = window.scrollY || 0;
      update(scroll, window.innerHeight || 1, 9999);
      lastScroll = scroll;
    };
    if (!lenis) window.addEventListener("scroll", onNativeScroll, { passive: true });

    update(0, window.innerHeight || 1, 0);
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onNativeScroll);
      if (lenis) lenis.destroy();
    };
  }, []);

  const scrollTo = (i) =>
    lenisRef.current
      ? lenisRef.current.scrollTo(i * window.innerHeight, { duration: 1.2 })
      : window.scrollTo({ top: i * window.innerHeight, behavior: "smooth" });

  return (
    <>
      <style>{`
        .vision-chapter { position: relative; height: 100vh; width: 100%; display: flex; align-items: stretch; overflow: visible; }
        .vision-text-col { width: 46%; min-width: 340px; display: flex; flex-direction: column; justify-content: center; padding: 0 clamp(28px, 6vw, 96px); box-sizing: border-box; }
        .vision-photo-col { flex: 1; display: flex; align-items: center; justify-content: center; padding: clamp(24px, 5vw, 64px) clamp(28px, 5vw, 72px) clamp(28px, 5vw, 72px) 0; box-sizing: border-box; }
        .vision-photo-frame { position: relative; width: 100%; height: 78vh; max-height: 760px; border-radius: 2px; overflow: hidden; will-change: transform, opacity; }
        .vision-num { font-family: 'Fraunces', serif; font-weight: 500; font-size: 15px; letter-spacing: .04em; color: ${GOLD}; }
        .vision-kicker { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; }
        .vision-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(30px, 3.1vw, 46px); line-height: 1.14; letter-spacing: -.01em; margin: 18px 0 20px; }
        .vision-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(14px, 1.05vw, 16px); line-height: 1.75; font-weight: 400; max-width: 420px; }
        .vision-line { width: 34px; height: 1px; margin: 22px 0; }
        .vision-checklist { list-style: none; margin: 28px 0 0; padding: 0; display: flex; flex-direction: column; gap: 13px; }
        .vision-checklist li { display: flex; align-items: baseline; gap: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 500; }
        .vision-check { color: ${GOLD}; font-size: 13px; }
        .vision-hint { position: absolute; left: clamp(28px, 6vw, 96px); bottom: 48px; display: flex; align-items: center; gap: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; }
        .vision-hint-arrow { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; border: 1px solid ${GOLD}; color: ${GOLD}; font-size: 12px; }
        @media (max-width: 900px) {
          .vision-chapter { flex-direction: column; height: auto; min-height: 100vh; }
          .vision-text-col { width: 100%; min-width: 0; padding: 120px 24px 32px; }
          .vision-photo-col { width: 100%; padding: 0 24px 56px; }
          .vision-photo-frame { height: 46vh; }
        }
      `}</style>

      {/* ── Header fantôme transparent ── */}
      <header className="ghost" style={{ zIndex: 200 }}>
        <span className="ghost__logo" ref={logoRef}>Tropicaura</span>
      </header>

      {/* ── Fond interpolé (forêt → ivoire, continu) ── */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />

      {/* ── Puces de navigation ── */}
      <nav className="dots-nav" style={{
        position: "fixed", right: "clamp(14px,2vw,28px)", top: "50%",
        transform: "translateY(-50%)", zIndex: 150,
        display: "flex", flexDirection: "column", gap: 12, pointerEvents: "auto",
      }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => (dotRefs.current[i] = el)}
            onClick={() => scrollTo(i)}
            title={s.title}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(242,233,216,0.32)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width .25s, height .25s, background .25s",
              display: "block",
            }}
          />
        ))}
      </nav>

      {/* ══ SECTION 01 — NOTRE VISION (forêt) ══ */}
      <section className="vision-chapter">
        <div className="vision-text-col" ref={s1TextRef} style={{ opacity: 0 }}>
          <span className="vision-num">{SECTIONS[0].num}</span>
          <span className="vision-kicker" style={{ color: "rgba(242,233,216,0.68)", marginTop: 6, display: "block" }}>
            {SECTIONS[0].kicker}
          </span>
          <h1 className="vision-title" style={{ color: "#F2E9D8" }}>{SECTIONS[0].title}</h1>
          <p className="vision-desc" style={{ color: "rgba(242,233,216,0.82)" }}>{SECTIONS[0].desc}</p>
        </div>
        <div className="vision-photo-col">
          <div
            className="vision-photo-frame"
            ref={s1PhotoRef}
            style={{
              opacity: 0,
              background: "linear-gradient(155deg, #1D3F2C 0%, #0E2015 100%)",
              border: `1px solid rgba(201,168,76,0.35)`,
            }}
          >
            <PlaceholderLabel text={SECTIONS[0].photoLabel} gold={GOLD} light />
          </div>
        </div>
        <div className="vision-hint" ref={s1HintRef} style={{ opacity: 0, color: "rgba(242,233,216,0.75)" }}>
          <span className="vision-hint-arrow">↓</span>
          {SECTIONS[0].hint}
        </div>
      </section>

      {/* ══ SECTION 02 — AUJOURD'HUI (ivoire) ══ */}
      <section className="vision-chapter">
        <div className="vision-text-col">
          <span className="vision-num">{SECTIONS[1].num}</span>
          <span className="vision-kicker" style={{ color: "rgba(23,48,31,0.62)", marginTop: 6, display: "block" }}>
            {SECTIONS[1].kicker}
          </span>
          <h1 className="vision-title" ref={s2TitleRef} style={{ color: "#17301F", opacity: 0 }}>
            {SECTIONS[1].title}
          </h1>
          <div className="vision-line" style={{ background: GOLD }} />
          <p className="vision-desc" ref={s2DescRef} style={{ color: "rgba(23,48,31,0.82)", opacity: 0 }}>
            {SECTIONS[1].desc}
          </p>
          <ul className="vision-checklist" style={{ color: "#17301F" }}>
            {SECTIONS[1].checklist.map((item, i) => (
              <li key={item} ref={(el) => (s2ItemRefs.current[i] = el)} style={{ opacity: 0 }}>
                <span className="vision-check">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="vision-photo-col">
          <div
            className="vision-photo-frame"
            ref={s2PhotoRef}
            style={{
              opacity: 0,
              background: "linear-gradient(155deg, #E4D6B6 0%, #C9B489 100%)",
              border: `1px solid rgba(23,48,31,0.18)`,
            }}
          >
            <PlaceholderLabel text={SECTIONS[1].photoLabel} gold={GOLD} light={false} />
          </div>
        </div>
      </section>
    </>
  );
}

// Placeholder "premium" : cadre discret + repères d'angle + libellé —
// pas un simple bloc gris. À remplacer par la vraie photo (même conteneur).
function PlaceholderLabel({ text, gold, light }) {
  const corner = { position: "absolute", width: 18, height: 18, borderColor: gold };
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ ...corner, top: 14, left: 14, borderTop: "1px solid", borderLeft: "1px solid" }} />
      <span style={{ ...corner, top: 14, right: 14, borderTop: "1px solid", borderRight: "1px solid" }} />
      <span style={{ ...corner, bottom: 14, left: 14, borderBottom: "1px solid", borderLeft: "1px solid" }} />
      <span style={{ ...corner, bottom: 14, right: 14, borderBottom: "1px solid", borderRight: "1px solid" }} />
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 11, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase",
        color: light ? "rgba(242,233,216,0.55)" : "rgba(23,48,31,0.50)",
      }}>
        {text}
      </span>
    </div>
  );
}
