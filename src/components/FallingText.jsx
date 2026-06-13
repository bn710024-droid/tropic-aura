import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ============================================================
//  FALLING TEXT — phrases courtes dans des « chips » SVG qui
//  tombent en boucle. Ambiance décorative derrière le contenu
//  (z-index 0, au-dessus du fond, sous .scene en z-index 1).
//
//  Chaque phrase est posée dans une capsule en verre dépoli :
//  bordure colorée, fond teinté translucide, glyphe SVG en tête.
//
//  • 1 chip toutes les `interval` ms (défaut 3 s)
//  • chute en `fall` s (défaut 4 s), fondu d'entrée puis fondu en bas
//  • opacité 70 %, texte font-weight 600 / 18 px
//  • couleur + glyphe + forme tirés au hasard
//
//  Props : phrases (string[]), colors (string[]), interval, fall
// ============================================================

// hex (#RRGGBB) → "r,g,b"
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

// Glyphes SVG (fill = currentColor → prend la couleur du chip)
const GLYPHS = [
  // étincelle / 4 branches
  '<path d="M12 2l2.1 6.4 6.4 2.1-6.4 2.1L12 19l-2.1-6.4L3.5 10.5l6.4-2.1z" fill="currentColor"/>',
  // feuille
  '<path d="M5 19C5 11 11 5.5 19 5c0 8-6 13.5-14 14z" fill="currentColor"/><path d="M7 17C10 13 13 11 17 9" stroke="rgba(255,255,255,.35)" stroke-width="1" fill="none"/>',
  // losange
  '<path d="M12 3l6 9-6 9-6-9z" fill="currentColor"/>',
  // point
  '<circle cx="12" cy="12" r="5.5" fill="currentColor"/>',
];

export default function FallingText({
  phrases,
  colors,
  interval = 3000,
  fall = 4,
}) {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !phrases?.length) return;

    let alive = true;
    let pi = 0;                       // index séquentiel → boucle sur les phrases
    const timers = [];

    const spawn = () => {
      if (!alive) return;

      const phrase = phrases[pi % phrases.length];
      pi++;

      const color = colors[(Math.random() * colors.length) | 0];
      const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      const c     = rgb(color);
      const pill  = Math.random() < 0.5;            // capsule ou tag arrondi
      const left  = 8 + Math.random() * 72;         // 8%–80%
      const drift = (Math.random() - 0.5) * 50;     // dérive horizontale ±25 px

      const el = document.createElement("div");
      el.style.cssText =
        `position:absolute; top:-72px; left:${left}%; opacity:0;` +
        `display:inline-flex; align-items:center; gap:9px;` +
        `padding:9px 17px; white-space:nowrap; pointer-events:none;` +
        `border-radius:${pill ? "999px" : "12px"};` +
        `border:1px solid rgba(${c},0.55);` +
        `background:rgba(${c},0.10);` +
        `box-shadow:0 8px 30px rgba(0,0,0,0.16), inset 0 0 0 1px rgba(255,255,255,0.04);` +
        `backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px);` +
        `will-change:transform,opacity;`;
      el.innerHTML =
        `<span style="display:inline-flex; color:${color}">` +
          `<svg width="15" height="15" viewBox="0 0 24 24" style="display:block">${glyph}</svg>` +
        `</span>` +
        `<span style="font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; ` +
          `font-size:18px; letter-spacing:.01em; color:${color}">${phrase}</span>`;
      layer.appendChild(el);

      const tl = gsap.timeline({ onComplete: () => el.remove() });
      tl.to(el, { opacity: 0.7, duration: 0.7, ease: "power1.out" }, 0);
      tl.to(el, {
        y: window.innerHeight + 140,
        x: drift,
        duration: fall,
        ease: "none",
      }, 0);
      tl.to(el, { opacity: 0, duration: 1.0, ease: "power1.in" }, fall - 1.0);
    };

    const loop = () => {
      if (!alive) return;
      spawn();
      timers.push(setTimeout(loop, interval));
    };

    timers.push(setTimeout(loop, 600));            // léger délai initial

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      gsap.killTweensOf(layer.querySelectorAll("div"));
      layer.innerHTML = "";
    };
  }, [phrases, colors, interval, fall]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
