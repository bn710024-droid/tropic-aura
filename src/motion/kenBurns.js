import { KEN_BURNS_SCALE_FROM, KEN_BURNS_SCALE_TO, KEN_BURNS_DURATION_MS } from "./motionTokens";
import { CSS_EASE_OUT } from "./easing";

// Motion System Tropicaura — Ken Burns discret pour les photos.
// Zoom lent, presque imperceptible, qui se pose une seule fois (pas de
// va-et-vient en boucle) — la photo respire, elle ne distrait jamais.
// S'applique sur l'élément <img> ou le calque qui la contient ; le cadre
// parent doit avoir overflow:hidden (déjà le cas de .vision-photo-frame).
export function buildKenBurnsCSS() {
  return `
    @keyframes ms-ken-burns {
      from { transform: scale(${KEN_BURNS_SCALE_FROM}); }
      to   { transform: scale(${KEN_BURNS_SCALE_TO}); }
    }
    .ms-ken-burns {
      animation: ms-ken-burns ${KEN_BURNS_DURATION_MS}ms ${CSS_EASE_OUT} forwards;
      animation-play-state: paused;
    }
    .motion-scene[data-phase="entering"] .ms-ken-burns,
    .motion-scene[data-phase="reading"] .ms-ken-burns {
      animation-play-state: running;
    }
  `;
}
