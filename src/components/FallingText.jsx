import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ============================================================
//  FALLING TEXT — phrases courtes colorées qui tombent en boucle.
//  Ambiance décorative derrière le contenu (z-index 0, au-dessus
//  du fond, sous .scene qui est en z-index 1).
//
//  • 1 phrase toutes les `interval` ms (défaut 3 s)
//  • chute en `fall` s (défaut 4 s), fondu d'entrée puis fondu en bas
//  • opacité 70 %, font-weight 600, 18 px
//  • couleur tirée au hasard dans `colors`
//
//  Props : phrases (string[]), colors (string[]), interval, fall
// ============================================================

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

      const el = document.createElement("div");
      el.textContent = phrases[pi % phrases.length];
      pi++;

      const color = colors[(Math.random() * colors.length) | 0];
      const left  = 10 + Math.random() * 72;       // 10%–82%
      const drift = (Math.random() - 0.5) * 50;    // dérive horizontale ±25 px

      el.style.cssText =
        `position:absolute; top:-60px; left:${left}%;` +
        `color:${color}; opacity:0;` +
        `font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; font-size:18px;` +
        `letter-spacing:.01em; white-space:nowrap; pointer-events:none;` +
        `will-change:transform,opacity;`;
      layer.appendChild(el);

      const tl = gsap.timeline({ onComplete: () => el.remove() });
      tl.to(el, { opacity: 0.7, duration: 0.7, ease: "power1.out" }, 0);
      tl.to(el, {
        y: window.innerHeight + 120,
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
