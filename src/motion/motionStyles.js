import { DURATION, STAGGER } from "./motionTokens";
import { CSS_EASE_IN_OUT, CSS_EASE_OUT } from "./easing";

// Motion System Tropicaura — feuille de style générée à partir des jetons
// de motionTokens.js (source unique de vérité pour le rythme). Consommée
// par MotionScene (voir MotionScene.jsx). Contrat de classes :
//
//   <section data-phase="idle|entering|reading|exiting">
//     <div class="ms-curtain" />
//     <div class="ms-layer ms-layer--bg">        fond / cadre photo
//     <h1   class="ms-layer ms-layer--title">     titre
//     <p    class="ms-layer ms-layer--text">      texte
//     <div  class="ms-layer ms-layer--image">     photo / carte
//     <div  class="ms-layer ms-layer--icon">      élément secondaire (numéro, puces...)
//
// Toutes les transitions sont sur transform/opacity/clip-path uniquement
// (jamais filter, box-shadow ou width/height animés) — voir la règle
// performance du Motion System.
export function buildMotionCSS() {
  const layer = (name, duration, delay, riseIn = 16, riseOut = 10) => `
    .motion-scene[data-phase="idle"] .ms-layer--${name} {
      opacity: 0;
      transform: translateY(${riseIn}px);
      transition: none;
    }
    .motion-scene[data-phase="entering"] .ms-layer--${name},
    .motion-scene[data-phase="reading"] .ms-layer--${name} {
      opacity: 1;
      transform: translateY(0);
      transition: opacity ${duration}ms ${CSS_EASE_OUT} ${delay}ms,
                  transform ${duration}ms ${CSS_EASE_OUT} ${delay}ms;
    }
    .motion-scene[data-phase="exiting"] .ms-layer--${name} {
      opacity: 0;
      transform: translateY(-${riseOut}px);
      transition: opacity ${Math.round(duration * 0.8)}ms ${CSS_EASE_IN_OUT},
                  transform ${Math.round(duration * 0.8)}ms ${CSS_EASE_IN_OUT};
    }
  `;

  return `
    .motion-scene { position: relative; }

    /* ── Rideau : panneau qui se referme puis se rouvre sur la scène suivante ── */
    .ms-curtain {
      position: absolute; inset: 0; z-index: 5; pointer-events: none;
      background: var(--ms-curtain-color, #0B0F0A);
      clip-path: inset(0 0 100% 0);
      transition: none;
    }
    .motion-scene[data-phase="idle"] .ms-curtain {
      clip-path: inset(0 0 0 0);
      transition: none;
    }
    .motion-scene[data-phase="entering"] .ms-curtain,
    .motion-scene[data-phase="reading"] .ms-curtain {
      clip-path: inset(0 0 100% 0);
      transition: clip-path ${DURATION.curtain}ms ${CSS_EASE_IN_OUT};
    }
    .motion-scene[data-phase="exiting"] .ms-curtain {
      clip-path: inset(0 0 0 0);
      transition: clip-path ${DURATION.curtain}ms ${CSS_EASE_IN_OUT};
    }

    ${layer("bg", DURATION.background, STAGGER.background, 0, 0)}
    ${layer("title", DURATION.title, STAGGER.title, 18, 10)}
    ${layer("text", DURATION.text, STAGGER.text, 14, 8)}
    ${layer("image", DURATION.image, STAGGER.image, 0, 0)}
    ${layer("icon", DURATION.icon, STAGGER.icon, 10, 6)}

    /* La couche image se révèle en zoom doux plutôt qu'en montée (voir kenBurns.js) */
    .motion-scene[data-phase="idle"] .ms-layer--image { transform: scale(1.02); }
    .motion-scene[data-phase="entering"] .ms-layer--image,
    .motion-scene[data-phase="reading"] .ms-layer--image { transform: scale(1); }
    .motion-scene[data-phase="exiting"] .ms-layer--image { transform: scale(0.99); }
  `;
}
