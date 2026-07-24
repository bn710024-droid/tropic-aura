// ============================================================
//  mobileFruits.js — manifeste des calques fruits mobiles (Home).
//
//  SOURCE UNIQUE partagée entre :
//    - Home.jsx (rendu des plans MID/SOFT)
//    - scripts/generate-blurred-fruits.mjs (pré-génération des flous)
//
//  POURQUOI le flou est PRÉ-CUIT dans les images plutôt qu'appliqué en
//  CSS (filter: blur) : les WebView WebKit limitées (navigateur intégré
//  Google/GSA sur iOS, entre autres) rasterisent mal les filter CSS —
//  flou découpé net au bord de la boîte (halo carré), artefacts qui
//  reviennent au re-compositing après navigation. Historique complet :
//  commits d384738, 3ca7194, 82971d2 — trois parades runtime successives
//  (padding, conteneur, couche GPU) ont réduit sans éliminer. Un flou
//  cuit dans le PNG n'est PAS un filtre au rendu : il ne peut pas être
//  raté. Les fruits NETS restent des <img> avec le PNG source.
//
//  Toute modification de size/blur ici doit être suivie de :
//    node scripts/generate-blurred-fruits.mjs
//  puis d'un commit des PNG générés (public/png/m/blurred/).
// ============================================================

// Marge transparente autour du fruit flou, en multiples du rayon de flou :
// le flou gaussien retombe à ~0 bien avant 3 sigmas → aucune coupure visible.
export const BLUR_PAD_RATIO = 3;

// Chemin de l'image pré-floutée générée pour une entrée du manifeste.
// WebP : un contenu flou (basses fréquences) se compresse ~10× mieux
// qu'en PNG, à qualité visuelle égale — alpha inclus, supporté partout
// où tourne ce site (le catalogue produit est déjà servi en .webp).
export const blurredFruitSrc = (f) => {
  const base = f.src.split("/").pop().replace(/\.png$/, "");
  return `/png/m/blurred/${base}-s${f.size}-b${f.blur}.webp`;
};

// ── Plan MID — rivière principale, sous le texte (parallaxe 0.5×) ──
export const FRUITS_MID = [
  // ── bord GAUCHE (bord droit ≤ ~24%) ──
  { src: "/png/m/mangue.png",       topVh: 12,  left: "3%",  size: 58, blur: 0, opacity: 1, rot: -5 },
  { src: "/png/m/fraises.png",      topVh: 40,  left: "2%",  size: 54, blur: 0, opacity: 1, rot: 8 },
  { src: "/png/m/citron-vert.png",  topVh: 72,  left: "5%",  size: 50, blur: 0, opacity: 1, rot: -12 },
  { src: "/png/m/myrtilles.png",    topVh: 96,  left: "4%",  size: 52, blur: 0, opacity: 1, rot: 6 },
  { src: "/png/m/avocat.png",       topVh: 128, left: "3%",  size: 56, blur: 0, opacity: 1, rot: -9 },
  { src: "/png/m/citron-jaune.png", topVh: 162, left: "6%",  size: 46, blur: 0, opacity: 1, rot: 14 },
  { src: "/png/m/coco.png",         topVh: 196, left: "2%",  size: 54, blur: 0, opacity: 1, rot: -6 },
  { src: "/png/m/orange.png",       topVh: 230, left: "5%",  size: 50, blur: 0, opacity: 1, rot: 10 },
  { src: "/png/m/fraises.png",      topVh: 264, left: "3%",  size: 56, blur: 0, opacity: 1, rot: -14 },
  { src: "/png/m/myrtilles.png",    topVh: 300, left: "4%",  size: 52, blur: 0, opacity: 1, rot: 18 },
  { src: "/png/m/avocat.png",       topVh: 338, left: "2%",  size: 54, blur: 0, opacity: 1, rot: -4 },
  // ── bord DROITE (bord gauche ≥ ~76%) ──
  { src: "/png/m/citron-jaune.png", topVh: 6,   left: "85%", size: 52, blur: 0, opacity: 1, rot: 7 },
  { src: "/png/m/orange.png",       topVh: 34,  left: "80%", size: 56, blur: 0, opacity: 1, rot: -8 },
  { src: "/png/m/mangue.png",       topVh: 66,  left: "86%", size: 48, blur: 0, opacity: 1, rot: 12 },
  { src: "/png/m/myrtilles.png",    topVh: 98,  left: "82%", size: 52, blur: 0, opacity: 1, rot: -15 },
  { src: "/png/m/citron-vert.png",  topVh: 130, left: "87%", size: 46, blur: 0, opacity: 1, rot: 5 },
  { src: "/png/m/avocat.png",       topVh: 165, left: "80%", size: 56, blur: 0, opacity: 1, rot: -18 },
  { src: "/png/m/coco.png",         topVh: 205, left: "85%", size: 50, blur: 0, opacity: 1, rot: 11 },
  { src: "/png/m/orange.png",       topVh: 240, left: "83%", size: 52, blur: 0, opacity: 1, rot: -6 },
  { src: "/png/m/fraises.png",      topVh: 278, left: "86%", size: 48, blur: 0, opacity: 1, rot: 20 },
  { src: "/png/m/myrtilles.png",    topVh: 318, left: "82%", size: 52, blur: 0, opacity: 1, rot: -10 },
  // ── CENTRE — un fruit DERRIÈRE le texte par section (le texte passe par-dessus,
  //    z:1 < texte z:10). Légèrement flous + semi-transparents → le blanc reste
  //    lisible. Ils NE SUIVENT PAS le texte : parallaxe 0.5×, ils dérivent (Combilo).
  //    topVh ≈ 49 + 50×section → tombe derrière le titre de chaque section au scroll.
  { src: "/png/m/orange.png",       topVh: 50,  left: "46%", size: 72, blur: 7, opacity: 0.3,  rot: -8 },
  { src: "/png/m/orange.png",       topVh: 100, left: "40%", size: 72, blur: 5, opacity: 0.58, rot: 10 },
  { src: "/png/m/avocat.png",       topVh: 150, left: "52%", size: 74, blur: 4, opacity: 0.6,  rot: -12 },
  { src: "/png/m/fraises.png",      topVh: 200, left: "43%", size: 68, blur: 6, opacity: 0.56, rot: 8 },
  { src: "/png/m/papaye.png",       topVh: 250, left: "50%", size: 78, blur: 5, opacity: 0.58, rot: -6 },
  { src: "/png/m/citron-vert.png",  topVh: 300, left: "42%", size: 70, blur: 6, opacity: 0.56, rot: 14 },
];

// ── Plan SOFT — fruits de premier plan flous (profondeur de champ), en cadre
// sur les deux bords. Bord droit ≤ ~22% (gauche) / bord gauche ≥ ~78% (droite). ──
export const FRUITS_SOFT = [
  // ── bord GAUCHE ──
  { src: "/png/m/banane.png",        topVh: 10,  left: "0%", size: 74, blur: 10, opacity: 0.5,  rot: 15 },
  { src: "/png/m/ananas.png",        topVh: 62,  left: "1%", size: 76, blur: 10, opacity: 0.5,  rot: 8 },
  { src: "/png/m/mangue.png",        topVh: 118, left: "0%", size: 72, blur: 11, opacity: 0.5,  rot: -14 },
  { src: "/png/m/pasteque.png",      topVh: 175, left: "2%", size: 70, blur: 10, opacity: 0.5,  rot: -9 },
  { src: "/png/m/papaye.png",        topVh: 228, left: "0%", size: 74, blur: 11, opacity: 0.5,  rot: 13 },
  { src: "/png/m/melon-jaune.png",   topVh: 90,  left: "8%", size: 46, blur: 8,  opacity: 0.42, rot: -7 },
  { src: "/png/m/citron-vert.png",   topVh: 200, left: "9%", size: 44, blur: 8,  opacity: 0.42, rot: 19 },
  // ── bord DROITE ──
  { src: "/png/m/fraises.png",       topVh: 34,  left: "78%", size: 74, blur: 10, opacity: 0.5,  rot: -12 },
  { src: "/png/m/ananas.png",        topVh: 92,  left: "78%", size: 76, blur: 10, opacity: 0.5,  rot: 8 },
  { src: "/png/m/melon-jaune.png",   topVh: 150, left: "79%", size: 72, blur: 11, opacity: 0.5,  rot: 14 },
  { src: "/png/m/pasteque.png",      topVh: 208, left: "80%", size: 70, blur: 10, opacity: 0.5,  rot: -19 },
  { src: "/png/m/banane.png",        topVh: 262, left: "79%", size: 72, blur: 11, opacity: 0.5,  rot: 21 },
  { src: "/png/m/orange.png",        topVh: 130, left: "88%", size: 44, blur: 8,  opacity: 0.42, rot: -6 },
  { src: "/png/m/fruit-passion.png", topVh: 245, left: "89%", size: 42, blur: 8,  opacity: 0.42, rot: -18 },
];
