import { useEffect, useRef, useState } from "react";
import { MIN_READ_MS } from "./motionTokens";

// Motion System Tropicaura — déclencheur de scène (mobile "page turn").
//
// Règle d'architecture : ne JAMAIS verrouiller le scroll natif. Ce hook
// ne fait qu'observer la position de la section via IntersectionObserver
// (piloté par le scroll, jamais l'inverse) et expose une phase que le
// composant traduit en classes CSS à durée fixe (voir motionTokens.js).
// Un swipe rapide qui saute une section déclenche "entering" puis
// "exiting" très vite l'un après l'autre — c'est voulu : on ne bloque
// jamais un visiteur pressé.
//
// Phases : "idle" (jamais vue) → "entering" (la scène joue son entrée,
// une seule fois) → "reading" (repos, Ken Burns continue en fond) →
// "exiting" (la scène joue sa sortie, une seule fois) → "idle".
export function useSceneTrigger(ref, { rootMargin = "-12% 0px -12% 0px" } = {}) {
  const [phase, setPhase] = useState("idle");
  const enteredAtRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let wasIntersecting = false;
    let exitTimer = null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasIntersecting) {
          wasIntersecting = true;
          if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
          enteredAtRef.current = performance.now();
          setPhase("entering");
        } else if (!entry.isIntersecting && wasIntersecting) {
          wasIntersecting = false;
          const elapsed = performance.now() - enteredAtRef.current;
          // Filet anti-flash : un swipe très rapide ne doit pas jouer la
          // sortie avant que l'entrée ait eu le temps d'être perçue.
          const remaining = MIN_READ_MS - elapsed;
          if (remaining > 0) {
            exitTimer = setTimeout(() => { exitTimer = null; setPhase("exiting"); }, remaining);
          } else {
            setPhase("exiting");
          }
        }
      },
      { rootMargin, threshold: 0 }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [ref, rootMargin]);

  return phase;
}
