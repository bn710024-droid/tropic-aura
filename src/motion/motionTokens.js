// Motion System Tropicaura — jetons de durée partagés (mobile "page turn").
// Base d'origine donnée par la direction créative (rideau 400 / fond 500 /
// titre 300 / texte 250 / image 500 / icônes 200), réduite d'~28% sur
// demande ("augmente un peu la rapidité de l'affichage") — mêmes
// proportions entre couches, juste plus vif. Toutes les sections mobiles
// réutilisent ces mêmes valeurs — jamais de durée bespoke par section.
export const DURATION = {
  curtain: 290,
  background: 360,
  title: 220,
  text: 180,
  image: 360,
  icon: 145,
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
export const MIN_READ_MS = 190;

// Ken Burns — zoom lent et quasi imperceptible, jamais une entrée brutale.
export const KEN_BURNS_SCALE_FROM = 1.05;
export const KEN_BURNS_SCALE_TO = 1.0;
export const KEN_BURNS_DURATION_MS = 5600;

// Délai avant que l'animation de la carte export (section Notre Avenir)
// ne commence — le visiteur doit d'abord comprendre ce qu'il regarde.
export const MAP_ANIMATION_DELAY_MS = 1000;
