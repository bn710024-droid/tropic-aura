// Motion System Tropicaura — point d'entrée unique.
// Toute page du site (About, Products, Insights, Contact, Home...) qui a
// besoin d'animations d'entrée/sortie de section importe depuis ici,
// jamais en dupliquant des formules locales.

export { default as MotionScene } from "./MotionScene";
export { useSceneTrigger } from "./useSceneTrigger";
export { buildMotionCSS } from "./motionStyles";
export { buildKenBurnsCSS } from "./kenBurns";
export { buildDrawSVGCSS, timelineStageTiming } from "./drawSVG";
export { buildGlowPulseCSS } from "./glowPulse";
export * from "./motionTokens";
export * from "./easing";
