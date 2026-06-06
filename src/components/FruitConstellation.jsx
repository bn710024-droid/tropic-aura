import { useEffect, useRef } from "react";
import { FRUIT_SETS, SLOTS, rnd } from "../data/fruits";

// ============================================================
//  <FruitConstellation />
//  Le moteur de cascade décalée + parallaxe.
//
//  Props :
//   - theme  : clé de FRUIT_SETS ("hero", "master", "mango"...)
//   - count  : nombre de fruits à éparpiller
//   - active : true => joue l'animation d'entrée (cascade)
//   - light  : true => opacité réduite (fond clair, ex. section À propos)
//
//  REMPLACEMENT PNG :
//   Pour utiliser tes vraies images, remplace dans le useEffect
//   `el.innerHTML = gen(size)` par :
//   `el.innerHTML = '<img src="/assets/'+nomFichier+'" width="'+size+'" />'`
// ============================================================
export default function FruitConstellation({ theme = "hero", count = 9, active = false, light = false }) {
  const layerRef = useRef(null);
  const builtRef = useRef(false);

  // 1. Construction des fruits (une seule fois)
  useEffect(() => {
    if (builtRef.current || !layerRef.current) return;
    const set = FRUIT_SETS[theme] || FRUIT_SETS.hero;
    const layer = layerRef.current;

    for (let i = 0; i < count; i++) {
      const slot = SLOTS[i % SLOTS.length];
      const gen = set[i % set.length];
      const size = slot.s + rnd(-15, 15);

      const el = document.createElement("div");
      el.className = "ta-fruit";
      el.innerHTML = gen(size);
      el.style.left = slot.x + rnd(-3, 3) + "%";
      el.style.top = slot.y + rnd(-3, 3) + "%";
      el.style.zIndex = slot.z;
      if (slot.b > 0) el.style.filter = `blur(${slot.b}px)`;
      el.dataset.depth = slot.z === 3 ? 2.2 : 1;
      el.dataset.delay = (i * 0.09).toFixed(2);
      layer.appendChild(el);
    }
    builtRef.current = true;
  }, [theme, count]);

  // 2. Animation d'entrée quand la section devient active
  useEffect(() => {
    if (!active || !layerRef.current) return;
    const children = [...layerRef.current.children];
    children.forEach((el) => {
      const delay = parseFloat(el.dataset.delay);
      el.style.transition = "none";
      el.style.transform = `translateY(-120px) rotate(${rnd(-25, 25)}deg) scale(.8)`;
      el.style.opacity = "0";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.style.transition =
            `transform 1.1s cubic-bezier(.16,1,.3,1) ${delay}s, opacity .7s ease ${delay}s`;
          el.style.transform = `translateY(0) rotate(${rnd(-12, 12)}deg) scale(1)`;
          el.style.opacity = light ? "0.85" : "1";
        })
      );
    });
  }, [active, light]);

  // 3. Parallaxe à la souris
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const parent = layer.closest(".ta-section") || layer.parentElement;
    function onMove(e) {
      const r = parent.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      [...layer.children].forEach((el) => {
        const dp = parseFloat(el.dataset.depth);
        el.style.marginLeft = mx * dp * 18 + "px";
        el.style.marginTop = my * dp * 10 + "px";
      });
    }
    parent.addEventListener("mousemove", onMove);
    return () => parent.removeEventListener("mousemove", onMove);
  }, []);

  return <div className="ta-layer" ref={layerRef} aria-hidden="true" />;
}
