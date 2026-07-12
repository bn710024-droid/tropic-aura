import { useEffect, useRef } from "react";
import Lenis from "lenis";
import ExportRouteMap from "../components/ExportRouteMap";
import AboutMobileSection from "./about/AboutMobileSection";
import { GOLD, BLACK, IVORY, FOREST, SAGE, STONE, IVORY_TEXT, FOREST_TEXT, SECTIONS } from "./about/aboutTheme";
import { buildMotionCSS, buildKenBurnsCSS } from "../motion";

// ============================================================
//  À PROPOS — "Notre Vision" — récit éditorial continu
//  Sections 01-06 complètes. 01 (forêt) et 02 (ivoire) sont VALIDÉES et
//  n'ont pas été retouchées, à une exception près : un fondu de SORTIE a été
//  ajouté à la 02 (elle n'en avait pas besoin tant qu'aucune section ne la
//  suivait). Sections 03-06 : textes courts, placeholders premium en attente
//  des visuels définitifs (port de Dakar pour la 05 notamment).
//
//  Principe inchangé : tout est fonction PURE du scroll, aucune transition
//  CSS sur les éléments animés (sauf le mount-fade de la section 01, basé sur
//  le temps réel — cf. mountEase). Chaque section médiane (02 à 05) a une
//  fenêtre d'ENTRÉE (depuis la précédente) et une fenêtre de SORTIE (vers la
//  suivante) qui se chevauchent largement → jamais de coupure. La dernière
//  section (06) n'a qu'une entrée ; sa sortie vers le noir est déjà gérée par
//  le fondu interne du Footer (transparent → #09120A sur ses premiers 48vh).
// ============================================================

export const PAGE_ENTRY_COLOR = { desktop: "#122A1E", mobile: "#122A1E" };

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const fadeRise = (scroll, start, span, rise) => {
  const t = easeInOutCubic(clamp01((scroll - start) / span));
  return { t, y: Math.round((1 - t) * rise) };
};
const fadeOutMult = (scroll, start, span) =>
  1 - easeInOutCubic(clamp01((scroll - start) / span));

// ============================================================
export default function APropos() {
  const bgRef      = useRef(null);
  const logoRef    = useRef(null);
  const dotRefs    = useRef([]);
  const lenisRef   = useRef(null);

  // Section 01 (inchangée)
  const s1TextRef  = useRef(null);
  const s1PhotoRef = useRef(null);      // cadre (bordure) — clip-path + translate SEULEMENT, jamais de scale
  const s1PhotoInnerRef = useRef(null); // image à l'intérieur — porte le zoom, le cadre ne bouge pas
  const s1HintRef  = useRef(null);
  // Section 02 (inchangée + fondu de sortie ajouté plus bas)
  const s2TitleRef = useRef(null);
  const s2DescRef  = useRef(null);
  const s2ItemRefs = useRef([]);
  const s2PhotoRef = useRef(null);
  const s2PhotoInnerRef = useRef(null);
  // Sections 03-06 (génériques, k = 0..3 ↔ SECTIONS[k+2])
  const sTitleRefs = useRef([]);
  const sDescRefs  = useRef([]);
  const sPhotoRefs = useRef([]);
  const sPhotoInnerRefs = useRef([]);

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
      // ── Unité de section : desktop = section épinglée (sticky) + palier fixe
      // avant de céder la place à la suivante → la photo a le temps d'être vue
      // posée, nette, dans son cadre, sans pour autant allonger trop le scroll.
      // Sur mobile, wrapper non épinglé (voir CSS) → unité inchangée (H),
      // aucune régression sur le calage déjà validé du rendu mobile.
      const SU = isDesktop ? 1.5 * H : H;
      const DWELL = SU - H; // durée du palier fixe (0 sur mobile)
      const wrapTop = (i) => i * SU;
      const entranceStart = (i) => wrapTop(i) - H;
      const dwellEnd = (i) => wrapTop(i) + DWELL;

      // ── Fond : glisse en continu forêt → ivoire → sauge → pierre → noir → ivoire ──
      const prog = scroll / SU;
      const ci = Math.min(last, Math.floor(prog));
      const localInSU = scroll - ci * SU;
      const ft = isDesktop
        ? clamp01((localInSU - DWELL) / H) // couleur stable pendant le palier fixe, fondu pendant la sortie
        : clamp01((prog - ci - 0.45) / 0.55); // mobile : le fond ne bascule qu'à partir de 45% du scroll de la
          // section (même seuil que exitMultBase pour le texte) — avant ce
          // correctif le fond commençait à glisser dès le début de la
          // section pendant que le texte restait plein opacité, ce qui
          // rendait le texte ivoire quasi invisible sur un fond déjà
          // redevenu clair (contraste écrasé, notamment noir → ivoire).
      const ca = COLORS[ci];
      const cb = COLORS[Math.min(last, ci + 1)];
      const bgR = lerp(ca[0], cb[0], ft), bgG = lerp(ca[1], cb[1], ft), bgB = lerp(ca[2], cb[2], ft);
      if (bgRef.current) bgRef.current.style.backgroundColor = `rgb(${bgR},${bgG},${bgB})`;

      // Luminance approximative du fond courant → logo & dots s'adaptent.
      const luminance = (0.299 * bgR + 0.587 * bgG + 0.114 * bgB) / 255;
      const onDark = luminance < 0.5;
      if (logoRef.current) logoRef.current.style.color = onDark ? IVORY : "#17301F";

      // ── Montée douce au chargement (section 01 uniquement, une fois) ──
      const mountEase = easeOutCubic(clamp01(elapsed / 900));

      // ── SECTION 01 — dérive lente au scroll + sortie vers la transition ──
      // Desktop : la sortie démarre seulement à la fin du palier fixe (dwellEnd)
      // → la section reste posée, immobile, tout le temps du palier.
      const s1DriftY = -Math.min(110, scroll * 0.16);
      const s1ExitBase = isDesktop ? dwellEnd(0) + 0.05 * H : 0.45 * H;
      const s1ExitSpan = isDesktop ? 0.43 * H : 0.47 * H;
      const s1FadeT = easeInOutCubic(clamp01((scroll - s1ExitBase) / s1ExitSpan));
      const s1TextOpacity = (1 - s1FadeT) * mountEase;
      if (s1TextRef.current) {
        s1TextRef.current.style.opacity = s1TextOpacity.toFixed(3);
        s1TextRef.current.style.transform =
          `translateY(${Math.round(s1DriftY + (1 - mountEase) * 26)}px)`;
      }
      const s1PhotoParallaxY = Math.min(50, scroll * 0.05);
      const s1PhotoScale = 1 + Math.min(0.035, (scroll / H) * 0.035);
      const s1PhotoExitBase = isDesktop ? dwellEnd(0) + 0.1 * H : 0.5 * H;
      const s1PhotoExitSpan = isDesktop ? 0.47 * H : 0.5 * H;
      const s1SlideT = easeInOutCubic(clamp01((scroll - s1PhotoExitBase) / s1PhotoExitSpan));
      const s1PhotoReveal = (1 - s1SlideT) * mountEase;
      const s1PhotoX = -s1SlideT * 60;
      if (s1PhotoRef.current) {
        // Rideau qui monte (clip-path), pas un fondu d'opacité : la partie
        // visible de la photo reste toujours nette — un fondu classique
        // donne un effet "brumeux/délavé" sur une photographie.
        s1PhotoRef.current.style.clipPath = `inset(${((1 - s1PhotoReveal) * 100).toFixed(1)}% 0 0 0)`;
        // Cadre (bordure) : SEULEMENT une translation — jamais de scale ici,
        // sinon la bordure elle-même grossit et déborde de sa marge.
        s1PhotoRef.current.style.transform =
          `translate3d(${s1PhotoX.toFixed(1)}px, ${s1PhotoParallaxY.toFixed(1)}px, 0)`;
      }
      if (s1PhotoInnerRef.current) {
        // Zoom : appliqué UNIQUEMENT à l'image, à l'intérieur du cadre fixe
        // (le overflow:hidden du cadre découpe proprement l'excédent).
        s1PhotoInnerRef.current.style.transform = `scale(${s1PhotoScale.toFixed(3)})`;
      }
      if (s1HintRef.current) {
        const hintOpacity = (1 - clamp01(scroll / (0.14 * H))) * mountEase;
        s1HintRef.current.style.opacity = hintOpacity.toFixed(3);
      }

      // ── SECTION 02 — entrée + sortie ──
      // Desktop : ancrée sur le palier fixe de la section 02 (voir SU/dwellEnd
      // plus haut) → le texte et la photo ont le temps de se poser à l'écran
      // avant que la sortie ne commence. Mobile : formules d'origine.
      const s2Base = isDesktop ? entranceStart(1) : 0.6 * H;
      const s2Span = isDesktop ? 0.36 * H : 0.43 * H;
      const s2TitleOffset = isDesktop ? 0.15 * H : 0;
      const s2DescOffset = isDesktop ? 0.23 * H : 0.08 * H;
      const s2ChecklistOffset = isDesktop ? 0.38 * H : 0.16 * H;
      const s2ChecklistStagger = isDesktop ? 0.036 * H : 0.025 * H;
      const s2ChecklistSpan = isDesktop ? 0.22 * H : 0.2 * H;
      const s2PhotoOffset = isDesktop ? 0.3 * H : 0.1 * H;
      const s2PhotoSpan = isDesktop ? 0.43 * H : 0.4 * H;
      const s2ExitStart = isDesktop ? dwellEnd(1) + 0.05 * H : 1.45 * H;
      const s2ExitSpan = isDesktop ? 0.43 * H : 0.47 * H;
      const s2ExitPhotoStart = isDesktop ? dwellEnd(1) + 0.1 * H : 1.5 * H;
      const s2ExitPhotoSpan = isDesktop ? 0.47 * H : 0.5 * H;
      const s2Exit = fadeOutMult(scroll, s2ExitStart, s2ExitSpan);
      const s2ExitPhoto = fadeOutMult(scroll, s2ExitPhotoStart, s2ExitPhotoSpan);

      const s2TitleT = easeInOutCubic(clamp01((scroll - (s2Base + s2TitleOffset)) / s2Span));
      if (s2TitleRef.current) {
        s2TitleRef.current.style.opacity = (s2TitleT * s2Exit).toFixed(3);
        s2TitleRef.current.style.transform = `translateY(${Math.round((1 - s2TitleT) * 26)}px)`;
      }
      const s2DescT = easeInOutCubic(clamp01((scroll - (s2Base + s2DescOffset)) / s2Span));
      if (s2DescRef.current) {
        s2DescRef.current.style.opacity = (s2DescT * s2Exit).toFixed(3);
        s2DescRef.current.style.transform = `translateY(${Math.round((1 - s2DescT) * 22)}px)`;
      }
      s2ItemRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = s2Base + s2ChecklistOffset + i * s2ChecklistStagger;
        const t = easeInOutCubic(clamp01((scroll - start) / s2ChecklistSpan));
        el.style.opacity = (t * s2Exit).toFixed(3);
        el.style.transform = `translateY(${Math.round((1 - t) * 14)}px)`;
      });
      const s2PhotoT = easeInOutCubic(clamp01((scroll - (s2Base + s2PhotoOffset)) / s2PhotoSpan));
      const s2PhotoReveal = s2PhotoT * s2ExitPhoto;
      if (s2PhotoRef.current) {
        // Rideau qui monte (clip-path) — voir commentaire section 01.
        s2PhotoRef.current.style.clipPath = `inset(${((1 - s2PhotoReveal) * 100).toFixed(1)}% 0 0 0)`;
        // Cadre : translation seule, jamais de scale (voir commentaire section 01).
        s2PhotoRef.current.style.transform = `translateX(${Math.round(-(1 - s2ExitPhoto) * 60)}px)`;
      }
      if (s2PhotoInnerRef.current) {
        s2PhotoInnerRef.current.style.transform = `scale(${(1.06 - 0.06 * s2PhotoT).toFixed(3)})`;
      }

      // ── SECTIONS 03-06 — même langage visuel, généralisé ──
      // Desktop : chaque section a désormais un vrai palier fixe (dwellEnd) où
      // elle reste posée, immobile, avant de céder la place à la suivante.
      // Mobile : formules d'origine, strictement inchangées.
      for (let k = 0; k < SECTIONS.length - 2; k++) {
        const i = k + 2; // index réel dans SECTIONS (2..dernier)
        // Section trop loin du scroll actuel (déjà réglée à son état final
        // depuis longtemps, ou pas encore concernée) : on saute tout son
        // calcul, y compris le clipPath (coûteux, force un repaint) — ses
        // styles restent tels qu'ils ont été laissés la dernière fois
        // qu'elle était proche, ce qui est déjà son état stable (ouvert,
        // fermé, ou invisible). Économise l'essentiel du travail par frame
        // fait jusqu'ici pour des sections hors champ.
        if (Math.abs(scroll - wrapTop(i)) > 2 * SU) continue;
        const isLast = i === last;
        const s = SECTIONS[i];
        const rise = s.calm ? 18 : 26; // section 06 : montée plus douce ("impression de conclusion")
        const eStart = isDesktop ? entranceStart(i) : (i - 0.4) * H;
        const entranceSpan = s.calm ? 0.5 * H : 0.43 * H;

        const exitMultBase = isDesktop ? dwellEnd(i) + 0.05 * H : (i + 0.45) * H;
        const exitPhotoBase = isDesktop ? dwellEnd(i) + 0.1 * H : (i + 0.5) * H;
        const exitMult = isLast ? 1 : fadeOutMult(scroll, exitMultBase, 0.47 * H);
        const exitPhotoMult = isLast ? 1 : fadeOutMult(scroll, exitPhotoBase, 0.5 * H);

        const titleOffset = isDesktop ? 0.15 * H : 0;
        const descOffset = isDesktop ? 0.23 * H : 0.08 * H;
        const titleR = fadeRise(scroll, eStart + titleOffset, entranceSpan, rise);
        if (sTitleRefs.current[k]) {
          sTitleRefs.current[k].style.opacity = (titleR.t * exitMult).toFixed(3);
          sTitleRefs.current[k].style.transform = `translateY(${titleR.y}px)`;
        }
        const descR = fadeRise(scroll, eStart + descOffset, entranceSpan, rise - 4);
        if (sDescRefs.current[k]) {
          sDescRefs.current[k].style.opacity = (descR.t * exitMult).toFixed(3);
          sDescRefs.current[k].style.transform = `translateY(${descR.y}px)`;
        }

        // Photo : entrée en zoom doux (comme 01/02) + dérive/échelle pendant le
        // séjour dans la section + glissement de sortie (comme 01).
        const localScroll = scroll - wrapTop(i);
        const localProg = clamp01(localScroll / H);
        const photoScaleMax = s.calm ? 0.02 : 0.035;
        const photoOffset = isDesktop ? 0.3 * H : 0.1 * H;
        const photoSpan = isDesktop ? 0.43 * H : 0.4 * H;
        const photoT = easeInOutCubic(clamp01((scroll - (eStart + photoOffset)) / photoSpan));
        const photoParallaxY = Math.min(40, Math.max(0, localScroll * 0.04));
        const photoX = isLast ? 0 : -(1 - exitPhotoMult) * 50;
        if (sPhotoRefs.current[k]) {
          // Rideau qui monte (clip-path) — voir commentaire section 01.
          const photoReveal = photoT * exitPhotoMult;
          sPhotoRefs.current[k].style.clipPath = `inset(${((1 - photoReveal) * 100).toFixed(1)}% 0 0 0)`;
          // Cadre : translation seule, jamais de scale (voir commentaire section 01).
          sPhotoRefs.current[k].style.transform =
            `translate3d(${photoX.toFixed(1)}px, ${photoParallaxY.toFixed(1)}px, 0)`;
        }
        if (sPhotoInnerRefs.current[k]) {
          sPhotoInnerRefs.current[k].style.transform = `scale(${(1 + photoScaleMax * localProg).toFixed(3)})`;
        }
      }

      // ── Puces de navigation — couleur adaptée au fond actif ──
      const active = Math.min(last, Math.max(0, Math.round(scroll / SU)));
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
      // Le palier "elapsed < 950" ne sert qu'au fondu de montée de la
      // section 01 au chargement (mountEase, indépendant du scroll) — les
      // autres pages (Accueil, Produits) n'ont pas ce besoin et se
      // contentent du seul throttle par delta de scroll, d'où leur
      // fluidité de référence. On restreint donc ce palier au cas réel où
      // il sert (on est encore au tout début de la page), au lieu de
      // forcer un recalcul complet à chaque frame pendant 950ms peu
      // importe où se trouve le visiteur.
      const mountWindow = elapsed < 950 && scroll < (window.innerHeight || 1);
      if (Math.abs(scroll - lastScroll) > 0.04 || mountWindow) {
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

  const scrollTo = (i) => {
    const isDesktopNow = window.matchMedia("(min-width: 769px)").matches;
    const su = (isDesktopNow ? 2 : 1) * window.innerHeight;
    return lenisRef.current
      ? lenisRef.current.scrollTo(i * su, { duration: 1.2 })
      : window.scrollTo({ top: i * su, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .vision-chapter-wrap { position: relative; height: 150vh; }
        .vision-chapter { position: sticky; top: 0; height: 100vh; width: 100%; display: flex; align-items: stretch; overflow: visible; }
        .vision-text-col { width: 46%; min-width: 340px; display: flex; flex-direction: column; justify-content: center; padding: 0 clamp(28px, 6vw, 96px); box-sizing: border-box; }
        .vision-photo-col { flex: 1; display: flex; align-items: center; justify-content: center; padding: clamp(24px, 5vw, 64px) clamp(28px, 5vw, 72px) clamp(28px, 5vw, 72px) 0; box-sizing: border-box; }
        .vision-photo-frame { position: relative; width: 100%; height: 78vh; max-height: 760px; border-radius: 2px; overflow: hidden; will-change: transform, clip-path; }
        .vision-photo-inner { position: absolute; inset: 0; width: 100%; height: 100%; will-change: transform; }
        .vision-photo-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
        .vision-photo-wash { position: absolute; inset: 0; pointer-events: none; }
        .vision-num { font-family: 'Fraunces', serif; font-weight: 500; font-size: 15px; letter-spacing: .04em; color: ${GOLD}; }
        .vision-kicker { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; }
        .vision-title { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(30px, 3.1vw, 46px); line-height: 1.14; letter-spacing: -.01em; margin: 18px 0 20px; }
        .vision-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(14px, 1.05vw, 16px); line-height: 1.75; font-weight: 400; max-width: 420px; }
        .vision-desc-group { display: flex; flex-direction: column; gap: 16px; }
        /* ── Paragraphe fondateur mis en avant (voir descHighlight dans aboutTheme.js) ── */
        .vision-desc--gold {
          font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500;
          font-size: clamp(16px, 1.3vw, 19px); line-height: 1.5; color: ${GOLD} !important;
        }
        .vision-line { width: 34px; height: 1px; margin: 22px 0; }
        /* ── Scène-citation : respiration typographique seule à l'écran ── */
        .vision-chapter--quote { justify-content: center; align-items: center; padding: 0 clamp(28px, 8vw, 160px); box-sizing: border-box; }
        .vision-quote {
          font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500;
          font-size: clamp(28px, 4vw, 56px); line-height: 1.28; letter-spacing: -.01em;
          text-align: center; max-width: 1000px;
        }
        .vision-quote::before { content: "\\201C"; }
        .vision-quote::after { content: "\\201D"; }
        .vision-checklist { list-style: none; margin: 28px 0 0; padding: 0; display: flex; flex-direction: column; gap: 13px; }
        .vision-checklist li { display: flex; align-items: baseline; gap: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 500; }
        .vision-check { color: ${GOLD}; font-size: 13px; }
        .vision-hint { position: absolute; left: clamp(28px, 6vw, 96px); bottom: 48px; display: flex; align-items: center; gap: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; }
        .vision-hint-arrow { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; border: 1px solid ${GOLD}; color: ${GOLD}; font-size: 12px; }
        .vision-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .vision-placeholder-corner { position: absolute; width: 18px; height: 18px; border-color: ${GOLD}; }
        .vision-placeholder-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; }

        /* ── Bascule desktop / mobile : deux arbres distincts, jamais mélangés ── */
        .about-mobile-tree { display: none; }
        @media (max-width: 900px) {
          .about-desktop-tree { display: none; }
          .about-mobile-tree { display: block; }
        }

        /* ── Scènes mobiles : flux natif continu, jamais de position:sticky
           (un scroll qui "accroche" donne l'impression d'un bug, pas d'un
           site premium). Chaque section se révèle simplement au passage du
           rideau quand elle entre dans le viewport ; en sortie, seule la
           photo glisse légèrement de côté (voir --ms-exit-x). ── */
        .ms-about {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 108px 24px 48px; box-sizing: border-box; overflow: hidden;
        }
        .ms-about-inner { position: relative; z-index: 2; }
        .ms-about-bg { position: absolute; inset: 0; z-index: 0; }
        .ms-about-photo { margin-top: 26px; position: relative; z-index: 2; }
        .ms-about-photo .vision-photo-frame { height: 42vh; will-change: auto; }
        .ms-about--quote { align-items: center; text-align: center; padding: 0 28px; }
        .ms-about--quote .vision-quote { position: relative; z-index: 2; font-size: clamp(24px, 7vw, 34px); }
        ${buildMotionCSS()}
        ${buildKenBurnsCSS()}
      `}</style>

      {/* ── Header fantôme transparent ── */}
      <header className="ghost" style={{ zIndex: 200 }}>
        <span className="ghost__logo" ref={logoRef}>Tropicaura</span>
      </header>

      {/* ── Fond interpolé (forêt → ivoire → sauge → pierre → noir → ivoire) ── */}
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
            title={s.title || s.quote}
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

      {/* ══ Arbre desktop — moteur scroll continu existant, inchangé ══ */}
      <div className="about-desktop-tree">
      {/* ══ SECTION 01 — NOTRE VISION (forêt) ══ */}
      <div className="vision-chapter-wrap">
      <section className="vision-chapter">
        <div className="vision-text-col" ref={s1TextRef} style={{ opacity: 0 }}>
          <span className="vision-num">{SECTIONS[0].num}</span>
          <span className="vision-kicker" style={{ color: "rgba(242,233,216,0.68)", marginTop: 6, display: "block" }}>
            {SECTIONS[0].kicker}
          </span>
          <h1 className="vision-title" style={{ color: IVORY }}>{SECTIONS[0].title}</h1>
          <div className="vision-desc-group">
            {SECTIONS[0].desc.map((p, i) => (
              <p
                key={i}
                className={`vision-desc${SECTIONS[0].descHighlight === i ? " vision-desc--gold" : ""}`}
                style={SECTIONS[0].descHighlight === i ? undefined : { color: IVORY_TEXT }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="vision-photo-col">
          <div
            className="vision-photo-frame"
            ref={s1PhotoRef}
            style={{ clipPath: "inset(100% 0 0 0)", border: `1px solid rgba(201,168,76,0.35)` }}
          >
            <div className="vision-photo-inner" ref={s1PhotoInnerRef} style={{ background: "#0E2015" }}>
              <img src="/images/about/vision-verger.jpg" alt="Verger de manguiers" className="vision-photo-img" style={{ objectFit: "contain" }} />
              <div className="vision-photo-wash" style={{
                background: "linear-gradient(155deg, rgba(18,42,30,0.12) 0%, rgba(14,32,21,0.22) 100%)",
              }} />
            </div>
          </div>
        </div>
        <div className="vision-hint" ref={s1HintRef} style={{ opacity: 0, color: "rgba(242,233,216,0.75)" }}>
          <span className="vision-hint-arrow">↓</span>
          {SECTIONS[0].hint}
        </div>
      </section>
      </div>

      {/* ══ SECTION 02 — AUJOURD'HUI (ivoire) ══ */}
      <div className="vision-chapter-wrap">
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
          <div className="vision-desc-group" ref={s2DescRef} style={{ opacity: 0 }}>
            {SECTIONS[1].desc.map((p, i) => (
              <p
                key={i}
                className={`vision-desc${SECTIONS[1].descHighlight === i ? " vision-desc--gold" : ""}`}
                style={SECTIONS[1].descHighlight === i ? undefined : { color: FOREST_TEXT }}
              >
                {p}
              </p>
            ))}
          </div>
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
            style={{ clipPath: "inset(100% 0 0 0)", border: `1px solid rgba(23,48,31,0.18)` }}
          >
            <div className="vision-photo-inner" ref={s2PhotoInnerRef}>
              <img src="/images/about/today-atelier.jpg" alt="Atelier de conditionnement" className="vision-photo-img" />
              <div className="vision-photo-wash" style={{
                background: "linear-gradient(155deg, rgba(242,233,216,0.04) 0%, rgba(23,48,31,0.12) 100%)",
              }} />
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* ══ SECTIONS 03+ — génériques (texte + photo), et scène-citation isolée ══ */}
      {SECTIONS.slice(2).map((s, k) => (
        <div className="vision-chapter-wrap" key={s.id}>
        {s.type === "quote" ? (
          /* ── Scène-citation : respiration typographique entre deux sections,
             pas de numéro/kicker/photo — juste la phrase, seule, en grand. ── */
          <section className="vision-chapter vision-chapter--quote">
            <p
              className="vision-quote"
              ref={(el) => (sDescRefs.current[k] = el)}
              style={{ color: IVORY, opacity: 0 }}
            >
              {s.quote}
            </p>
          </section>
        ) : (
        <section className="vision-chapter">
          <div className="vision-text-col">
            <span className="vision-num">{s.num}</span>
            <span className="vision-kicker" style={{ color: s.dark ? "rgba(242,233,216,0.68)" : "rgba(23,48,31,0.62)", marginTop: 6, display: "block" }}>
              {s.kicker}
            </span>
            <h1 className="vision-title" ref={(el) => (sTitleRefs.current[k] = el)} style={{ color: s.dark ? IVORY : "#17301F", opacity: 0 }}>
              {s.title}
            </h1>
            <div className="vision-line" style={{ background: GOLD }} />
            <div className="vision-desc-group" ref={(el) => (sDescRefs.current[k] = el)} style={{ opacity: 0 }}>
              {s.desc.map((p, pi) => (
                <p
                  key={pi}
                  className={`vision-desc${s.descHighlight === pi ? " vision-desc--gold" : ""}`}
                  style={s.descHighlight === pi ? undefined : { color: s.dark ? IVORY_TEXT : FOREST_TEXT }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="vision-photo-col">
            <div
              className="vision-photo-frame"
              ref={(el) => (sPhotoRefs.current[k] = el)}
              style={{
                clipPath: "inset(100% 0 0 0)",
                background: s.id === "ambition"
                  ? "linear-gradient(155deg, #E9E7E1 0%, #CDC9BF 100%)"
                  : s.dark
                    ? "linear-gradient(155deg, #17201B 0%, #0B0F0A 100%)"
                    : "linear-gradient(155deg, #EDE2CB 0%, #DCC9A0 100%)",
                border: s.dark ? "1px solid rgba(201,168,76,0.35)" : s.id === "ambition" ? "1px solid rgba(60,58,52,0.18)" : "1px solid rgba(23,48,31,0.18)",
              }}
            >
              <div className="vision-photo-inner" ref={(el) => (sPhotoInnerRefs.current[k] = el)}>
                {s.id === "avenir" ? (
                  <ExportRouteMap />
                ) : s.photo ? (
                  <img
                    src={s.photo}
                    alt={s.photoAlt}
                    className="vision-photo-img"
                    style={s.photoPosition ? { objectPosition: s.photoPosition } : undefined}
                  />
                ) : (
                  <div className="vision-placeholder">
                    <span className="vision-placeholder-corner" style={{ top: 14, left: 14, borderTop: "1px solid", borderLeft: "1px solid" }} />
                    <span className="vision-placeholder-corner" style={{ top: 14, right: 14, borderTop: "1px solid", borderRight: "1px solid" }} />
                    <span className="vision-placeholder-corner" style={{ bottom: 14, left: 14, borderBottom: "1px solid", borderLeft: "1px solid" }} />
                    <span className="vision-placeholder-corner" style={{ bottom: 14, right: 14, borderBottom: "1px solid", borderRight: "1px solid" }} />
                    <span className="vision-placeholder-label" style={{ color: s.dark ? "rgba(242,233,216,0.55)" : "rgba(23,48,31,0.50)" }}>
                      {s.photoLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        )}
        </div>
      ))}
      </div>

      {/* ══ Arbre mobile — scènes "page turn" (Motion System), aucun scroll verrouillé ══ */}
      <div className="about-mobile-tree">
        {SECTIONS.map((s) => (
          <AboutMobileSection key={s.id} section={s} />
        ))}
      </div>
    </>
  );
}
