import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { SECTIONS, GOLD } from "./partenariats/partnershipTheme";
import PartnershipTimeline from "../components/PartnershipTimeline";
import PartnershipMobileSection from "./partenariats/PartnershipMobileSection";
import { buildMotionCSS, buildKenBurnsCSS, buildGlowPulseCSS } from "../motion";

// ============================================================
//  PARTENARIATS — refonte 5 scènes (Hero / Vision / Parcours /
//  Photo / Conclusion). Moteur desktop INCHANGÉ (crossfade + reveal
//  au scroll piloté par rAF, cf. historique du fichier) : seul le
//  contenu de chaque scène change. L'arbre mobile réutilise
//  exactement la philosophie de la page À Propos (Motion System,
//  flux natif continu, jamais de position:sticky).
// ============================================================

const N = SECTIONS.length;
const LAYOUT = { hero: "center", vision: "left", timeline: "center", photo: "photo", conclusion: "center" };

// Couleur d'entrée pour le voile de morph du CTA (cf. src/lib/destinationColors.js) —
// la première scène (hero) est un fond noir plein.
export const PAGE_ENTRY_COLOR = { desktop: "#0B0F0A", mobile: "#0B0F0A" };

function SceneContent({ s }) {
  switch (s.type) {
    case "hero":
      return (
        <>
          <h1 className="pw-hero-title">{s.title}</h1>
          <p className="pw-hero-subtitle">{s.subtitle}</p>
        </>
      );
    case "vision":
      return (
        <>
          <span className="pw-kicker">{s.kicker}</span>
          <div className="pw-statements">
            {s.statements.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="pw-paragraphs">
            {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </>
      );
    case "timeline":
      return (
        <>
          <span className="pw-kicker">{s.kicker}</span>
          <h2 className="pw-title">{s.title}</h2>
          <div className="pw-timeline-wrap">
            <PartnershipTimeline />
          </div>
        </>
      );
    case "photo":
      return (
        <div className="pw-photo-text">
          {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      );
    case "conclusion":
      return (
        <>
          {s.paragraphs.map((p, i) => <p key={i} className="pw-conclusion-text">{p}</p>)}
          <a href={s.buttonHref} className="pw-button ms-glow">
            {s.button} <span>→</span>
          </a>
        </>
      );
    default:
      return null;
  }
}

export default function Partenariats() {
  const bgRefs      = useRef([]);
  const contentRefs = useRef([]);
  const dotRefs     = useRef([]);
  const revealed    = useRef(new Set());
  const lenisRef    = useRef(null);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const lenis = isDesktop ? new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    }) : null;
    lenisRef.current = lenis;

    let rafId;
    const easeOut  = (t) => 1 - (1 - t) * (1 - t);
    const last     = N - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      const prog = scroll / H;
      const ci   = Math.min(last, Math.floor(prog));
      const ft   = Math.min(1, Math.max(0, prog - ci));

      bgRefs.current.forEach((el, j) => {
        if (!el) return;
        const opacity = j <= ci ? 1 : j === ci + 1 ? ft : 0;
        el.style.opacity = opacity.toFixed(3);
      });

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
        } else {
          el.style.opacity   = e.toFixed(3);
          el.style.transform = `translateY(${Math.round(24 * (1 - e))}px)`;
        }
      });

      const active   = Math.min(last, Math.max(0, Math.round(scroll / H)));
      const dotRefs$ = dotRefs.current;
      dotRefs$.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width      = on ? "9px" : "6px";
        dot.style.height     = on ? "9px" : "6px";
        dot.style.background = on ? "rgba(242,233,216,0.90)" : "rgba(242,233,216,0.30)";
        dot.style.boxShadow  = on ? "0 0 0 2px rgba(0,0,0,0.15)" : "none";
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
      if (Math.abs(scroll - lastScroll) > 0.04) {
        lastScroll = scroll;
        update(scroll, window.innerHeight || 1);
      }
      rafId = requestAnimationFrame(raf);
    };

    const onNativeScroll = () => {
      if (lenis) return;
      const scroll = window.scrollY || 0;
      if (Math.abs(scroll - lastScroll) > 0.04) { lastScroll = scroll; update(scroll, window.innerHeight || 1); }
    };
    if (!lenis) window.addEventListener('scroll', onNativeScroll, { passive: true });

    update(0, window.innerHeight || 1);
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener('scroll', onNativeScroll);
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
        .partenariats-mobile-tree { display: none; }
        @media (max-width: 900px) {
          .partenariats-desktop-tree { display: none; }
          .partenariats-mobile-tree { display: block; }
        }

        .pw-photo-bg { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; object-fit: cover; display: block; animation: pwKenBurns 9000ms cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes pwKenBurns { from { transform: scale(1.06); } to { transform: scale(1); } }
        .pw-photo-overlay { position: absolute; inset: 0; z-index: 3; background: linear-gradient(180deg, rgba(11,15,10,0.15) 0%, rgba(11,15,10,0.55) 72%, rgba(11,15,10,0.82) 100%); pointer-events: none; }

        .pw-content { max-width: 620px; color: #F2E9D8; }
        .scene[data-layout="center"] { justify-content: center; }
        .scene[data-layout="center"] .pw-content { text-align: center; max-width: 760px; padding-left: 0; padding-right: 0; align-items: center; }
        .scene[data-layout="left"] .pw-content { padding-left: clamp(24px,7vw,96px); }
        .scene[data-layout="photo"] { align-items: flex-end; }
        .scene[data-layout="photo"] .pw-content { max-width: 580px; padding-left: clamp(24px,7vw,96px); padding-bottom: clamp(56px,8vh,120px); }

        .pw-hero-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(32px, 4.4vw, 66px); line-height: 1.12; letter-spacing: -.01em; margin: 0 0 20px; color: #F2E9D8; }
        .pw-hero-subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(14px, 1.15vw, 17px); line-height: 1.7; color: rgba(242,233,216,0.78); max-width: 560px; margin: 0 auto; }

        .pw-kicker { display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 22px; }
        .pw-statements p { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(22px, 2.4vw, 34px); line-height: 1.32; letter-spacing: -.01em; color: #F2E9D8; margin: 0 0 14px; }
        .pw-paragraphs { margin-top: 22px; display: flex; flex-direction: column; gap: 12px; }
        .pw-paragraphs p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(13px, 1.05vw, 15.5px); line-height: 1.78; color: rgba(242,233,216,0.72); margin: 0; max-width: 460px; }

        .pw-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(24px, 2.6vw, 40px); line-height: 1.18; color: #F2E9D8; margin: 0 0 44px; }
        .pw-timeline-wrap { width: min(880px, 84vw); }

        .pw-photo-text p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(14px, 1.15vw, 17px); line-height: 1.7; color: #F2E9D8; margin: 0 0 8px; }

        .pw-conclusion-text { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(20px, 2.2vw, 32px); line-height: 1.42; color: #F2E9D8; margin: 0 auto 16px; max-width: 640px; }
        .pw-button { display: inline-flex; align-items: center; gap: 10px; margin-top: 30px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #0B0F0A; background: ${GOLD}; border-radius: 100px; padding: 15px 36px; text-decoration: none; }

        /* ── Arbre mobile : mêmes classes Motion System que la page À Propos ── */
        .pm-hero, .pm-photo-section { position: relative; min-height: 100vh; display: flex; align-items: flex-end; overflow: hidden; }
        .pm-hero-photo, .pm-photo-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .pm-hero-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(11,15,10,0.10) 0%, rgba(11,15,10,0.55) 70%, rgba(11,15,10,0.86) 100%); pointer-events: none; }
        .pm-hero-text, .pm-photo-text { position: relative; z-index: 2; padding: 24px 24px 72px; box-sizing: border-box; }
        .pm-hero-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(28px, 8vw, 40px); line-height: 1.16; color: #F2E9D8; margin: 0 0 14px; }
        .pm-hero-subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14.5px; line-height: 1.65; color: rgba(242,233,216,0.80); margin: 0; }
        .pm-photo-text p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14.5px; line-height: 1.65; color: #F2E9D8; margin: 0 0 8px; }

        .pm-section { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 108px 24px 48px; box-sizing: border-box; overflow: hidden; }
        .pm-bg { position: absolute; inset: 0; z-index: 0; }
        .pm-inner { position: relative; z-index: 2; width: 100%; }
        .pm-inner--center { text-align: center; }
        .pm-kicker { display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 18px; }
        .pm-statements p { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(21px, 6.4vw, 27px); line-height: 1.32; color: #F2E9D8; margin: 0 0 12px; }
        .pm-paragraphs { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
        .pm-paragraphs p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; line-height: 1.72; color: rgba(242,233,216,0.72); margin: 0; }
        .pm-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(21px, 6.4vw, 27px); line-height: 1.28; color: #F2E9D8; margin: 0 0 34px; }
        .pm-timeline-wrap { width: 100%; }

        .pm-conclusion-text { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(19px, 5.6vw, 24px); line-height: 1.4; color: #F2E9D8; margin: 0 auto 14px; max-width: 440px; }
        .pm-button { display: inline-flex; align-items: center; gap: 8px; margin-top: 26px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: #0B0F0A; background: ${GOLD}; border-radius: 100px; padding: 14px 32px; text-decoration: none; }

        ${buildMotionCSS()}
        ${buildKenBurnsCSS()}
        ${buildGlowPulseCSS("ms-glow")}
      `}</style>

      {/* ── Header transparent (logo seul) ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
        background: "transparent",
      }}>
        <a href="/" style={{ pointerEvents:"auto", textDecoration:"none" }}>
          <span className="ghost__logo">Tropicaura</span>
        </a>
      </header>

      <div className="partenariats-desktop-tree">
        <style>{`
          @keyframes dotPulse { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
        `}</style>

        {SECTIONS.map((s, i) => (
          <div
            key={s.id + "-bg"}
            ref={(el) => (bgRefs.current[i] = el)}
            className="bg-layer"
            style={{ background: s.bg, opacity: i === 0 ? 1 : 0 }}
          />
        ))}
        <div className="bg-depth" />

        <nav className="dots-nav" style={{ position:"fixed", right:"clamp(14px,2vw,28px)", top:"50%", transform:"translateY(-50%)", zIndex:150, display:"flex", flexDirection:"column", gap:12, pointerEvents:"auto" }}>
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => (dotRefs.current[i] = el)}
              onClick={() => scrollTo(i)}
              title={s.title || s.kicker}
              style={{ width:6, height:6, borderRadius:"50%", background:"rgba(242,233,216,0.30)", border:"none", cursor:"pointer", padding:0, transition:"width .25s, height .25s, background .25s, box-shadow .25s", display:"block", animation:"dotPulse 1.8s ease-in-out infinite", animationDelay:`${i * 0.18}s` }}
            />
          ))}
        </nav>

        {SECTIONS.map((s, i) => (
          <section key={s.id} data-index={i} className="scene" data-layout={LAYOUT[s.type]}>
            {(s.type === "hero" || s.type === "photo") && (
              <>
                <img src={s.photo} alt={s.photoAlt} className="pw-photo-bg" />
                <div className="pw-photo-overlay" />
              </>
            )}
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="scene__content pw-content"
              style={{
                opacity:      i === 0 ? 1 : 0,
                transform:    i === 0 ? "translateY(0)" : "translateY(24px)",
              }}
            >
              <SceneContent s={s} />
            </div>

            {i === 0 && (
              <div className="scene__hint">
                <i /><span>Défilez vers le bas</span>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="partenariats-mobile-tree">
        {SECTIONS.map((s, i) => (
          <PartnershipMobileSection key={s.id} section={s} exitDirection={i % 2 === 0 ? "left" : "right"} />
        ))}
      </div>
    </>
  );
}
