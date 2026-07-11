// Motion System Tropicaura — jetons de durée partagés (mobile "page turn").
// Ce sont les durées données par la direction créative — ne pas les
// modifier à la légère, elles définissent le rythme de marque.
//
//   Rideau   400ms   Fond    500ms   Titre   300ms
//   Texte    250ms   Image   500ms   Icônes  200ms
//
// Toutes les sections mobiles réutilisent ces mêmes valeurs — jamais de
// durée bespoke par section. C'est ce qui crée l'identité : le visiteur
// apprend l'histoire, pas l'interface.

export const DURATION = {
  curtain: 400,
  background: 500,
  title: 300,
  text: 250,
  image: 500,
  icon: 200,
};

// Décalage entre le début de chaque couche pendant l'entrée d'une scène —
// pas une pure séquence bout-à-bout (trop lent, ~2s+), plutôt une cascade
// courte où chaque couche démarre peu après la précédente et joue sa
// propre durée. Le rideau, lui, doit être fini avant que le contenu
// commence (sinon on verrait le nouveau contenu à travers le rideau qui
// se referme encore).
export const STAGGER = {
  curtain: 0,
  background: DURATION.curtain,
  title: DURATION.curtain + 80,
  text: DURATION.curtain + 160,
  image: DURATION.curtain + 40,
  icon: DURATION.curtain + 260,
};

// Temps de lecture minimum avant que la sortie puisse être déclenchée —
// évite qu'un scroll très rapide fasse jouer l'entrée et la sortie quasi
// simultanément (donnerait un flash au lieu d'une scène lue).
export const MIN_READ_MS = 260;

// Ken Burns — zoom lent et quasi imperceptible, jamais une entrée brutale.
export const KEN_BURNS_SCALE_FROM = 1.05;
export const KEN_BURNS_SCALE_TO = 1.0;
export const KEN_BURNS_DURATION_MS = 5600;

// Délai avant que l'animation de la carte export (section Notre Avenir)
// ne commence — le visiteur doit d'abord comprendre ce qu'il regarde.
export const MAP_ANIMATION_DELAY_MS = 1000;
