import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ============================================================
//  FALLING TEXT — phrases courtes dans des « chips » SVG qui
//  tombent en boucle. Ambiance décorative derrière le contenu
//  (z-index 0, au-dessus du fond, sous .scene en z-index 1).
//
//  Chaque phrase est posée dans une capsule en verre sombre :
//  texte blanc lisible sur tout fond, bordure + glyphe colorés.
//
//  Interaction : quand la souris passe à proximité d'un chip,
//  il scintille (gerbe d'étincelles SVG + halo qui pulse). Les
//  chips étant derrière le contenu, on détecte la PROXIMITÉ du
//  curseur (mousemove global) plutôt qu'un :hover classique.
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
  '<path d="M12 2l2.1 6.4 6.4 2.1-6.4 2.1L12 19l-2.1-6.4L3.5 10.5l6.4-2.1z" fill="currentColor"/>',
  '<path d="M5 19C5 11 11 5.5 19 5c0 8-6 13.5-14 14z" fill="currentColor"/><path d="M7 17C10 13 13 11 17 9" stroke="rgba(255,255,255,.35)" stroke-width="1" fill="none"/>',
  '<path d="M12 3l6 9-6 9-6-9z" fill="currentColor"/>',
  '<circle cx="12" cy="12" r="5.5" fill="currentColor"/>',
];

// Étincelle (4 branches) pour les gerbes
const SPARK = '<path d="M12 0l2.4 8.2L22 12l-7.6 3.8L12 24l-2.4-8.2L2 12l7.6-3.8z" fill="currentColor"/>';

const HOVER_RADIUS = 85; // px : distance curseur → centre du chip

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
    let pi = 0;
    const timers = [];
    const chips = new Set();             // chips actifs (pour la proximité souris)

    // ── gerbe d'étincelles à (cx, cy) ──
    const burst = (cx, cy, color) => {
      const n = 7;
      for (let k = 0; k < n; k++) {
        const s = document.createElement("div");
        const ang  = Math.random() * Math.PI * 2;
        const dist = 16 + Math.random() * 38;
        const size = 8 + Math.random() * 9;
        s.style.cssText =
          `position:absolute; left:${cx}px; top:${cy}px;` +
          `width:${size}px; height:${size}px; color:${color};` +
          `pointer-events:none; will-change:transform,opacity;` +
          `transform:translate(-50%,-50%) scale(0); opacity:0;` +
          `filter:drop-shadow(0 0 5px ${color});`;
        s.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 24 24" style="display:block">${SPARK}</svg>`;
        layer.appendChild(s);

        const tx = Math.cos(ang) * dist;
        const ty = Math.sin(ang) * dist - 10;
        gsap.timeline({ onComplete: () => s.remove() })
          .to(s, { scale: 1, opacity: 1, duration: 0.18, ease: "power2.out" }, 0)
          .to(s, { x: tx, y: ty, rotation: (Math.random() - 0.5) * 200, duration: 0.65, ease: "power2.out" }, 0)
          .to(s, { scale: 0, opacity: 0, duration: 0.42, ease: "power2.in" }, 0.25);
      }
    };

    // ── déclenche le scintillement d'un chip (avec cooldown) ──
    const scintillate = (el) => {
      if (el._cool) return;
      el._cool = true;
      timers.push(setTimeout(() => { el._cool = false; }, 950));

      const r = el.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, el._color);

      // halo qui pulse + léger gonflement
      gsap.to(el, {
        boxShadow: `0 10px 34px rgba(0,0,0,0.30), 0 0 38px rgba(${el._c},0.85), inset 0 0 0 1px rgba(255,255,255,0.12)`,
        duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out",
      });
      gsap.to(el, { scale: 1.14, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" });
    };

    // ── souris : proximité (throttlé via rAF) ──
    let mx = -9999, my = -9999, queued = false;
    const scan = () => {
      queued = false;
      chips.forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        if (dx * dx + dy * dy < HOVER_RADIUS * HOVER_RADIUS) scintillate(el);
      });
    };
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(scan); }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── spawn d'un chip ──
    const spawn = () => {
      if (!alive) return;

      const phrase = phrases[pi % phrases.length];
      pi++;

      const color = colors[(Math.random() * colors.length) | 0];
      const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      const c     = rgb(color);
      const pill  = Math.random() < 0.5;
      const left  = 8 + Math.random() * 72;
      const drift = (Math.random() - 0.5) * 50;

      const el = document.createElement("div");
      el._color = color;
      el._c     = c;
      el.style.cssText =
        `position:absolute; top:-72px; left:${left}%; opacity:0;` +
        `display:inline-flex; align-items:center; gap:10px;` +
        `padding:11px 20px; white-space:nowrap; pointer-events:none;` +
        `border-radius:${pill ? "999px" : "12px"};` +
        `border:1.5px solid rgba(${c},0.95);` +
        `background:rgba(14,14,16,0.72);` +
        `box-shadow:0 10px 34px rgba(0,0,0,0.30), 0 0 22px rgba(${c},0.35), inset 0 0 0 1px rgba(255,255,255,0.06);` +
        `backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);` +
        `will-change:transform,opacity;`;
      el.innerHTML =
        `<span style="display:inline-flex; color:${color}">` +
          `<svg width="17" height="17" viewBox="0 0 24 24" style="display:block">${glyph}</svg>` +
        `</span>` +
        `<span style="font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; ` +
          `font-size:20px; letter-spacing:.01em; color:#FFFFFF; ` +
          `text-shadow:0 1px 8px rgba(0,0,0,0.4)">${phrase}</span>`;
      layer.appendChild(el);
      chips.add(el);

      gsap.timeline({ onComplete: () => { chips.delete(el); el.remove(); } })
        .to(el, { opacity: 0.95, duration: 0.6, ease: "power1.out" }, 0)
        .to(el, { y: window.innerHeight + 140, x: drift, duration: fall, ease: "none" }, 0)
        .to(el, { opacity: 0, duration: 1.0, ease: "power1.in" }, fall - 1.0);
    };

    const loop = () => {
      if (!alive) return;
      spawn();
      timers.push(setTimeout(loop, interval));
    };
    timers.push(setTimeout(loop, 600));

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      window.removeEventListener("mousemove", onMove);
      gsap.killTweensOf(layer.querySelectorAll("div"));
      layer.innerHTML = "";
      chips.clear();
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
