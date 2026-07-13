// Motion System Tropicaura — courbes d'accélération partagées.
// Utilisées par tous les modules de src/motion et par les pages qui
// calculent leurs propres interpolations (ex. le moteur scroll desktop
// de la page À Propos).

export const clamp01 = (v) => Math.min(1, Math.max(0, v));

export const lerp = (a, b, t) => a + (b - a) * t;

export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Équivalent CSS de easeInOutCubic — pour les transitions/animations
// pilotées par classe plutôt que par calcul JS image par image.
export const CSS_EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
export const CSS_EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
