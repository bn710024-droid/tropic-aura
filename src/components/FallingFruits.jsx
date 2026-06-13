import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ============================================================
//  FALLING FRUITS — pluie de fruits détourés, boucle infinie.
//  Ambiance décorative derrière le texte (z-index 0, au-dessus
//  du fond mais sous .scene qui est en z-index 1).
//
//  • 1 fruit toutes les 2–3 s
//  • départ horizontal aléatoire (left 20%–80%)
//  • chute 3–4 s (GSAP)
//  • opacité 60–70 %, fondu d'entrée puis fondu de sortie
//  • mélange aléatoire des fruits à chaque spawn
// ============================================================

const FRUITS = [
  "/png/mangue.png",
  "/png/ananas.png",
  "/png/papaye.png",
  "/png/orange.png",
];

export default function FallingFruits() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    let alive = true;
    const timers = [];

    const spawn = () => {
      if (!alive) return;

      const img = document.createElement("img");
      img.src = FRUITS[(Math.random() * FRUITS.length) | 0];
      img.alt = "";
      img.setAttribute("aria-hidden", "true");

      const size  = 55 + Math.random() * 70;          // 55–125 px
      const left  = 20 + Math.random() * 60;          // 20%–80%
      const peak  = 0.6 + Math.random() * 0.1;        // opacité 0.60–0.70
      const dur   = 3 + Math.random();                // chute 3–4 s
      const drift = (Math.random() - 0.5) * 60;       // dérive horizontale ±30 px
      const rot   = (Math.random() - 0.5) * 50;       // rotation douce ±25°

      img.style.cssText =
        `position:absolute; top:-160px; left:${left}%; width:${size}px; height:auto;` +
        `opacity:0; pointer-events:none; will-change:transform,opacity;` +
        `filter:drop-shadow(0 12px 26px rgba(0,0,0,0.22));`;
      layer.appendChild(img);

      const tl = gsap.timeline({ onComplete: () => img.remove() });
      tl.to(img, { opacity: peak, duration: 0.7, ease: "power1.out" }, 0);
      tl.to(img, {
        y: window.innerHeight + 240,
        x: drift,
        rotation: rot,
        duration: dur,
        ease: "none",
      }, 0);
      tl.to(img, { opacity: 0, duration: 1.0, ease: "power1.in" }, dur - 1.0);
    };

    const loop = () => {
      if (!alive) return;
      spawn();
      const next = 2000 + Math.random() * 1000;       // 2–3 s
      timers.push(setTimeout(loop, next));
    };

    timers.push(setTimeout(loop, 500));               // léger délai initial

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      gsap.killTweensOf(layer.querySelectorAll("img"));
      layer.innerHTML = "";
    };
  }, []);

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
