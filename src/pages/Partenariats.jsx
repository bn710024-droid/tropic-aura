import { useEffect, useRef } from "react";
import Lenis from "lenis";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { SECTIONS, GOLD } from "./partenariats/partnershipTheme";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { langFromPath, pathFor } from "../i18n/routing";
import { useLocalizedSections } from "../i18n/useSections";
import PartnershipTimeline from "../components/PartnershipTimeline";
import PartnershipMobileSection from "./partenariats/PartnershipMobileSection";
import ConclusionConstellation from "./partenariats/ConclusionConstellation";
import { ICONS } from "./partenariats/icons";
import { buildMotionCSS, buildKenBurnsCSS, buildGlowPulseCSS } from "../motion";
import useIsDesktopViewport from "../lib/useIsDesktopViewport";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";

// ============================================================
//  PARTENARIATS — refonte 5 scènes (Hero / Vision / Parcours /
//  Photo / Conclusion). Moteur desktop INCHANGÉ (crossfade + reveal
//  au scroll piloté par rAF, cf. historique du fichier) : seul le
//  contenu de chaque scène change. L'arbre mobile réutilise
//  exactement la philosophie de la page À Propos (Motion System,
//  flux natif continu, jamais de position:sticky).
// ============================================================

const N = SECTIONS.length;

// Couleur d'entrée pour le voile de morph du CTA (cf. src/lib/destinationColors.js) —
// la première scène (hero) est un fond noir plein.
export const PAGE_ENTRY_COLOR = { desktop: "#0B0F0A", mobile: "#0B0F0A" };

function SceneContent({ s, lang, t, isDesktopViewport }) {
  switch (s.type) {
    case "hero": {
      // Arbre mobile monté en permanence à côté de celui-ci (CSS pur) —
      // seul l'arbre réellement visible doit porter le <h1> de la page
      // (voir PartnershipMobileSection + useIsDesktopViewport).
      const HeroTitleTag = isDesktopViewport ? "h1" : "div";
      return (
        <>
          <HeroTitleTag className="pw-hero-title">{s.title}</HeroTitleTag>
          <p className="pw-hero-subtitle">{s.subtitle}</p>
          <div className="pw-hero-hint">
            <span>{t("partnerships.scrollHint")}</span>
            <i className="pw-hero-hint-line" />
            <span className="pw-hero-hint-arrow">↓</span>
          </div>
        </>
      );
    }
    case "vision":
      return (
        <>
          <span className="pw-kicker">{s.kicker}</span>
          <div className="pw-vision-grid">
            <p className="pw-statement">{s.statement}</p>
            <div className="pw-vision-actions">
              {s.actions.map((a, i) => {
                const Icon = ICONS[a.icon];
                return (
                  <div key={i} className="pw-action">
                    <span className="pw-action-icon"><Icon /></span>
                    <div>
                      <p className="pw-action-title">{a.title}</p>
                      <p className="pw-action-text">{a.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
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
    case "photo": {
      const Icon = ICONS[s.icon];
      return (
        <div className="pw-photo-row">
          <div className="pw-photo-textcol">
            <h2 className="pw-photo-title">{s.title}</h2>
            <i className="pw-photo-divider" />
            {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="pw-photo-framecol">
            <div className="pw-photo-frame">
              <img src={s.photo} alt={s.photoAlt} className="pw-photo-frame-img ms-ken-burns" />
            </div>
          </div>
        </div>
      );
    }
    case "conclusion":
      return (
        <>
          {s.paragraphs.map((p, i) => <p key={i} className="pw-conclusion-text">{p}</p>)}
          <a href={pathFor("contact", lang)} className="pw-button ms-glow">
            {s.button} <span>→</span>
          </a>
        </>
      );
    default:
      return null;
  }
}

export default function Partenariats() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  // Structure (couleurs, photos, type de scène) depuis le thème ; textes via i18n.
  const SECTIONS_T = useLocalizedSections(SECTIONS, "partnerships.sections");
  // Les arbres desktop et mobile sont tous deux montés en permanence
  // (CSS pur) — seul celui réellement visible doit porter le <h1>.
  const isDesktopViewport = useIsDesktopViewport();
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

  // Saut direct vers une section via ?section=<id> (déclenché par les
  // sous-liens du menu, ex. /partenariats?section=conclusion). Desktop
  // utilise le moteur interne (scrollTo par index) ; mobile cible
  // directement la scène DOM correspondante (flux naturel).
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("section");
    if (!target) return;
    const isDesktopNow = window.matchMedia("(min-width: 769px)").matches;
    const t = setTimeout(() => {
      if (isDesktopNow) {
        const idx = SECTIONS.findIndex((s) => s.id === target);
        if (idx >= 0) scrollTo(idx);
      } else {
        document.getElementById(`partner-${target}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const partnershipsDescription = t("partnerships.seo.description");
  const partnershipsPath = pathFor("partnerships", lang);
  const partnershipsTrail = buildBreadcrumbTrail(partnershipsPath);

  return (
    <>
      <SEOHead
        title={t("partnerships.seo.title")}
        description={partnershipsDescription}
        path={partnershipsPath}
        keywords={lang === "en"
          ? ["import export partnership", "become fruit distributor", "reliable Africa supplier", "Senegal trade partner"]
          : ["partenariat import export", "devenir distributeur fruits", "fournisseur fiable Afrique", "partenaire commercial Sénégal"]}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: partnershipsPath, title: t("nav.partnerships"), description: partnershipsDescription, breadcrumb: true }),
          breadcrumbListSchema(partnershipsTrail, partnershipsPath),
        ]}
      />
      <style>{`
        /* Images décoratives : pas de pointer-events → le navigateur (Edge) ne
           colle plus son bouton "Recherche visuelle" au survol. */
        .pw-photo-bg, .pw-photo-frame-img, .pm-hero-photo, .pm-photo-frame-img { pointer-events: none; }
        .partenariats-mobile-tree { display: none; }
        @media (max-width: 900px) {
          .partenariats-desktop-tree { display: none; }
          .partenariats-mobile-tree { display: block; }
        }

        .pw-photo-bg { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; object-fit: cover; display: block; animation: pwKenBurns 9000ms cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes pwKenBurns { from { transform: scale(1.06); } to { transform: scale(1); } }
        .pw-photo-overlay { position: absolute; inset: 0; z-index: 3; background: linear-gradient(180deg, rgba(11,15,10,0.15) 0%, rgba(11,15,10,0.55) 72%, rgba(11,15,10,0.82) 100%); pointer-events: none; }

        .pw-content { max-width: 620px; color: #F2E9D8; }

        .scene[data-type="hero"] { justify-content: flex-start; align-items: flex-end; }
        .scene[data-type="hero"] .pw-content { max-width: 640px; padding: 0 clamp(24px,7vw,96px) clamp(72px,11vh,150px); }

        .scene[data-type="vision"] { justify-content: center; }
        .scene[data-type="vision"] .pw-content { max-width: 1180px; width: 100%; padding: 0 clamp(24px,6vw,80px); }

        .scene[data-type="photo"] { justify-content: center; }
        .scene[data-type="photo"] .pw-content { max-width: 1180px; width: 100%; padding: 0 clamp(24px,6vw,80px); }
        .pw-photo-row { display: flex; gap: clamp(48px,6vw,100px); align-items: center; text-align: left; }
        .pw-photo-textcol { flex: 1; }
        .pw-photo-framecol { flex: 1.15; }
        .pw-photo-frame { position: relative; width: 100%; height: 64vh; max-height: 620px; border-radius: 2px; overflow: hidden; border: 1px solid rgba(201,168,76,0.20); }
        .pw-photo-frame-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        @media (max-width: 1080px) {
          .pw-photo-row { flex-direction: column-reverse; gap: 36px; }
          .pw-photo-frame { height: 46vh; }
        }

        .scene[data-type="timeline"], .scene[data-type="conclusion"] { justify-content: center; }
        .scene[data-type="timeline"] .pw-content, .scene[data-type="conclusion"] .pw-content { text-align: center; width: 100%; max-width: 900px; padding: 0 clamp(24px,6vw,80px); }
        .scene[data-type="timeline"] .pw-content { max-width: 1160px; }
        .scene[data-type="conclusion"] .pw-content { max-width: 700px; }

        .pw-hero-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(32px, 4.4vw, 62px); line-height: 1.12; letter-spacing: -.01em; margin: 0 0 20px; color: #F2E9D8; }
        .pw-hero-subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(14px, 1.15vw, 17px); line-height: 1.7; color: rgba(242,233,216,0.78); max-width: 480px; margin: 0; }
        .pw-hero-hint { display: flex; align-items: center; gap: 14px; margin-top: 40px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: rgba(242,233,216,0.65); }
        .pw-hero-hint-line { display: block; width: 40px; height: 1px; background: rgba(242,233,216,0.4); }
        .pw-hero-hint-arrow { color: ${GOLD}; animation: hintBounce 1.9s ease-in-out infinite; }

        .pw-kicker { display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 30px; }

        .pw-vision-grid { display: flex; gap: clamp(48px,6vw,100px); align-items: flex-start; text-align: left; }
        .pw-statement { flex: 1.05; font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(24px, 2.6vw, 38px); line-height: 1.38; letter-spacing: -.01em; color: #F2E9D8; margin: 0; }
        .pw-vision-actions { flex: 1; display: flex; flex-direction: column; }
        .pw-action { display: flex; gap: 18px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid rgba(201,168,76,0.14); }
        .pw-action:first-child { padding-top: 4px; }
        .pw-action:last-child { border-bottom: none; }
        .pw-action-icon { flex: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.4); display: flex; align-items: center; justify-content: center; color: ${GOLD}; }
        .pw-action-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: 17px; color: #F2E9D8; margin: 0 0 6px; }
        .pw-action-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; line-height: 1.62; color: rgba(242,233,216,0.60); margin: 0; }

        .pw-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(24px, 2.6vw, 40px); line-height: 1.18; color: #F2E9D8; margin: 0 0 44px; }
        .pw-timeline-wrap { width: 100%; }

        .pw-photo-icon { display: inline-flex; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.5); align-items: center; justify-content: center; color: ${GOLD}; margin-bottom: 22px; }
        .pw-photo-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(22px, 2.3vw, 32px); line-height: 1.32; color: #F2E9D8; margin: 0 0 18px; }
        .pw-photo-divider { display: block; width: 34px; height: 1px; background: ${GOLD}; margin: 0 0 18px; }
        .pw-photo-textcol p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(14px, 1.15vw, 17px); line-height: 1.7; color: rgba(242,233,216,0.72); margin: 0 0 8px; }

        .pw-conclusion-text { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(20px, 2.2vw, 32px); line-height: 1.42; color: #F2E9D8; margin: 0 auto 16px; max-width: 640px; }
        .pw-button { display: inline-flex; align-items: center; gap: 10px; margin-top: 30px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #0B0F0A; background: ${GOLD}; border-radius: 100px; padding: 15px 36px; text-decoration: none; }

        @media (max-width: 1080px) {
          .pw-vision-grid { flex-direction: column; gap: 40px; }
        }

        /* ── Arbre mobile : mêmes classes Motion System que la page À Propos ── */
        .pm-hero { position: relative; min-height: 100vh; display: flex; align-items: flex-end; overflow: hidden; }
        .pm-hero-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .pm-hero-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(11,15,10,0.10) 0%, rgba(11,15,10,0.55) 70%, rgba(11,15,10,0.86) 100%); pointer-events: none; }
        .pm-hero-text { position: relative; z-index: 2; padding: 24px 24px 72px; box-sizing: border-box; }
        .pm-hero-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(28px, 8vw, 40px); line-height: 1.16; color: #F2E9D8; margin: 0 0 14px; }
        .pm-hero-subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14.5px; line-height: 1.65; color: rgba(242,233,216,0.80); margin: 0; }
        .pm-hero-hint { display: flex; align-items: center; gap: 10px; margin-top: 26px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(242,233,216,0.65); }
        .pm-hero-hint-arrow { color: ${GOLD}; animation: hintBounce 1.9s ease-in-out infinite; }
        .pm-photo-icon { display: inline-flex; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.5); align-items: center; justify-content: center; color: ${GOLD}; margin-bottom: 16px; }
        .pm-photo-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(21px, 6vw, 26px); line-height: 1.3; color: #F2E9D8; margin: 0 0 14px; }
        .pm-photo-paragraphs p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; line-height: 1.68; color: rgba(242,233,216,0.72); margin: 0 0 8px; }
        .pm-photo-frame { position: relative; width: 100%; height: 42vh; border-radius: 2px; overflow: hidden; border: 1px solid rgba(201,168,76,0.20); margin-top: 24px; }
        .pm-photo-frame-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        .pm-section { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 108px 24px 48px; box-sizing: border-box; overflow: hidden; }
        .pm-bg { position: absolute; inset: 0; z-index: 0; }
        .pm-inner { position: relative; z-index: 2; width: 100%; }
        .pm-inner--center { text-align: center; }
        .pm-kicker { display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 18px; }
        .pm-statement { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(21px, 6.4vw, 27px); line-height: 1.38; color: #F2E9D8; margin: 0; }
        .pm-vision-actions { display: flex; flex-direction: column; margin-top: 30px; }
        .pm-action { display: flex; gap: 14px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid rgba(201,168,76,0.14); }
        .pm-action:first-child { padding-top: 0; }
        .pm-action:last-child { border-bottom: none; }
        .pm-action-icon { flex: none; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.4); display: flex; align-items: center; justify-content: center; color: ${GOLD}; }
        .pm-action-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: 15px; color: #F2E9D8; margin: 0 0 5px; }
        .pm-action-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12.5px; line-height: 1.6; color: rgba(242,233,216,0.60); margin: 0; }
        .pm-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(21px, 6.4vw, 27px); line-height: 1.28; color: #F2E9D8; margin: 0 0 34px; }
        .pm-timeline-wrap { width: 100%; }

        .pm-conclusion-text { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(19px, 5.6vw, 24px); line-height: 1.4; color: #F2E9D8; margin: 0 auto 14px; max-width: 440px; }
        .pm-button { display: inline-flex; align-items: center; gap: 8px; margin-top: 26px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: #0B0F0A; background: ${GOLD}; border-radius: 100px; padding: 14px 32px; text-decoration: none; }

        ${buildMotionCSS()}
        ${buildKenBurnsCSS()}
        ${buildGlowPulseCSS("ms-glow")}
      `}</style>

      {/* Top bar avec logo + menu */}
      <TopBar />
      <img src="/logo-mark.png" alt="Tropicaura — Partenariats B2B durables pour l'export" width={512} height={512} style={{ display: "none" }} />
      <Breadcrumbs trail={partnershipsTrail} />

      <div className="partenariats-desktop-tree">
        <style>{`
          @keyframes dotPulse { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
        `}</style>

        {SECTIONS_T.map((s, i) => (
          <div
            key={s.id + "-bg"}
            ref={(el) => (bgRefs.current[i] = el)}
            className="bg-layer"
            style={{ background: s.bg, opacity: i === 0 ? 1 : 0 }}
          />
        ))}
        <div className="bg-depth" />

        <nav className="dots-nav" aria-label="Navigation par section" style={{ position:"fixed", right:"clamp(14px,2vw,28px)", top:"50%", transform:"translateY(-50%)", zIndex:150, display:"flex", flexDirection:"column", gap:12, pointerEvents:"auto" }}>
          {SECTIONS_T.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => (dotRefs.current[i] = el)}
              onClick={() => scrollTo(i)}
              title={s.title || s.kicker}
              aria-label={`Aller à la section ${s.title || s.kicker}`}
              style={{ width:6, height:6, borderRadius:"50%", background:"rgba(242,233,216,0.30)", border:"none", cursor:"pointer", padding:0, transition:"width .25s, height .25s, background .25s, box-shadow .25s", display:"block", animation:"dotPulse 1.8s ease-in-out infinite", animationDelay:`${i * 0.18}s` }}
            />
          ))}
        </nav>

        {SECTIONS_T.map((s, i) => (
          <section key={s.id} data-index={i} className="scene" data-type={s.type}>
            {s.type === "hero" && (
              <>
                <img src={s.photo} alt={s.photoAlt} className="pw-photo-bg" />
                <div className="pw-photo-overlay" />
              </>
            )}
            {s.type === "conclusion" && <ConclusionConstellation />}
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="scene__content pw-content"
              style={{
                opacity:      i === 0 ? 1 : 0,
                transform:    i === 0 ? "translateY(0)" : "translateY(24px)",
              }}
            >
              <SceneContent s={s} lang={lang} t={t} isDesktopViewport={isDesktopViewport} />
            </div>
          </section>
        ))}
      </div>

      <div className="partenariats-mobile-tree">
        {SECTIONS_T.map((s, i) => (
          <PartnershipMobileSection key={s.id} section={s} exitDirection={i % 2 === 0 ? "left" : "right"} isDesktopViewport={isDesktopViewport} />
        ))}
      </div>
    </>
  );
}
