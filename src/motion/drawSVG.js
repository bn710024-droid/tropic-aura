import { CSS_EASE_IN_OUT } from "./easing";

// Motion System Tropicaura — tracé SVG animé (généralisé depuis la carte
// export de la page À Propos, src/components/ExportRouteMap.jsx).
//
// Un point voyageur parcourt un chemin (stroke-dashoffset + offset-path),
// avec un halo doré qui s'allume à chaque étape atteinte. Fonctionne pour
// un seul chemin traversant plusieurs étapes en séquence (timeline) ou
// pour plusieurs chemins partant d'une même origine (carte export) selon
// comment on appelle buildDrawSVGCSS.
//
// Génère un cycle CSS complet (@keyframes) pour un tracé donné, à durée
// fixe, en boucle infinie — aucun JS par frame.
export function buildDrawSVGCSS({
  className,
  cycleMs,
  drawStartPct,
  drawEndPct,
  holdEndPct,
  fadeEndPct,
  strokeColor,
}) {
  return `
    .${className} {
      opacity: 0;
      stroke: ${strokeColor};
      animation: ${className}-draw ${cycleMs}ms ${CSS_EASE_IN_OUT} infinite;
    }
    @keyframes ${className}-draw {
      0%, ${drawStartPct}%   { opacity: 0; stroke-dashoffset: 100; }
      ${drawStartPct + 0.3}% { opacity: 1; }
      ${drawEndPct}%         { opacity: 1; stroke-dashoffset: 0; }
      ${holdEndPct}%         { opacity: 1; stroke-dashoffset: 0; }
      ${fadeEndPct}%         { opacity: 0; stroke-dashoffset: 0; }
      100%                   { opacity: 0; stroke-dashoffset: 0; }
    }
    .${className}-dot {
      offset-distance: 0%;
      opacity: 0;
      animation: ${className}-dot ${cycleMs}ms ${CSS_EASE_IN_OUT} infinite;
      filter: drop-shadow(0 0 4px rgba(242,216,150,0.85));
    }
    @keyframes ${className}-dot {
      0%, ${drawStartPct}%   { offset-distance: 0%; opacity: 0; }
      ${drawStartPct + 0.3}% { opacity: 1; }
      ${drawEndPct}%         { offset-distance: 100%; opacity: 1; }
      ${drawEndPct + 3}%     { opacity: 0; }
      100%                   { opacity: 0; }
    }
    .${className}-arrive {
      transform-box: fill-box;
      transform-origin: center;
      animation: ${className}-arrive ${cycleMs}ms ease-out infinite;
    }
    @keyframes ${className}-arrive {
      0%, ${drawEndPct - 0.25}% { transform: scale(1); opacity: 0.35; }
      ${drawEndPct}%            { transform: scale(1); opacity: 1; }
      ${drawEndPct + 3}%        { transform: scale(1.7); opacity: 0.4; }
      ${drawEndPct + 6}%        { transform: scale(1); opacity: 1; }
      ${holdEndPct}%            { transform: scale(1); opacity: 1; }
      ${fadeEndPct}%            { opacity: 0.35; }
      100%                      { opacity: 0.35; }
    }
  `;
}

// Répartit un cycle en étapes séquentielles (une timeline unique visitant
// N points dans l'ordre) plutôt qu'en éventail depuis une origine commune
// (voir ExportRouteMap pour ce second cas). Chaque étape i démarre son
// tracé quand la précédente vient de finir le sien.
export function timelineStageTiming(cycleMs, stepCount, { holdMs = 2000, fadeMs = 500, pauseMs = 800 } = {}) {
  const travelBudget = cycleMs - holdMs - fadeMs - pauseMs;
  const perStep = travelBudget / stepCount;
  const stops = [];
  for (let i = 0; i < stepCount; i++) {
    const drawStart = i * perStep;
    const drawEnd = drawStart + perStep;
    stops.push({
      drawStartPct: +((drawStart / cycleMs) * 100).toFixed(2),
      drawEndPct: +((drawEnd / cycleMs) * 100).toFixed(2),
    });
  }
  const holdEndPct = +(((travelBudget + holdMs) / cycleMs) * 100).toFixed(2);
  const fadeEndPct = +(((travelBudget + holdMs + fadeMs) / cycleMs) * 100).toFixed(2);
  return { stops, holdEndPct, fadeEndPct };
}
