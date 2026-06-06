// ============================================================
//  fruits.js
//  Générateurs de fruits "photo-réalistes" en SVG.
//
//  ⚠️  IMPORTANT POUR BABA :
//  Ces SVG sont des PLACEHOLDERS de qualité pour juger l'effet.
//  Quand tu auras tes vrais PNG transparents, remplace simplement
//  chaque fonction par un <img src="/assets/ta-mangue.png" />.
//  Voir le commentaire "REMPLACEMENT PNG" plus bas.
// ============================================================

const rnd = (a, b) => a + Math.random() * (b - a);
const uid = () => Math.random().toString(36).slice(2, 8);

// --- MANGUE entière -----------------------------------------
export function mango(size) {
  const id = uid();
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs><radialGradient id="mg${id}" cx="38%" cy="32%" r="75%">
      <stop offset="0%" stop-color="#FFE08A"/><stop offset="35%" stop-color="#FF9D2E"/>
      <stop offset="70%" stop-color="#E8590C"/><stop offset="100%" stop-color="#9A2A05"/>
    </radialGradient></defs>
    <path d="M50 12c18 0 33 14 35 33 2 18-10 38-32 41-20 3-38-12-40-31C11 38 28 12 50 12z" fill="url(#mg${id})"/>
    <ellipse cx="38" cy="34" rx="13" ry="9" fill="#fff" opacity="0.28"/>
    <path d="M52 13c-2-4-6-6-9-5 2 2 5 4 9 5z" fill="#3B6D11"/>
  </svg>`;
}

// --- MANGUE coupée en deux ----------------------------------
export function mangoHalf(size) {
  const id = uid();
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs><radialGradient id="mh${id}" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#FFD25A"/><stop offset="60%" stop-color="#FFA62B"/><stop offset="100%" stop-color="#E8771C"/>
    </radialGradient></defs>
    <ellipse cx="50" cy="50" rx="40" ry="34" fill="#C0390A"/>
    <ellipse cx="50" cy="50" rx="34" ry="28" fill="url(#mh${id})"/>
    <ellipse cx="50" cy="50" rx="11" ry="15" fill="#E8C77A"/>
  </svg>`;
}

// --- ANANAS -------------------------------------------------
export function pineapple(size) {
  const id = uid();
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs><radialGradient id="pg${id}" cx="40%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#FFE066"/><stop offset="55%" stop-color="#E8A317"/><stop offset="100%" stop-color="#9A6410"/>
    </radialGradient></defs>
    <path d="M50 22c14 0 22 12 22 30s-8 30-22 30-22-12-22-30 8-30 22-30z" fill="url(#pg${id})"/>
    <g stroke="#8A5A0F" stroke-width="1.4" opacity="0.5">
      <path d="M34 40l32 18M66 40L34 58M40 32l24 36M60 32L40 68"/></g>
    <g fill="#3B6D11"><path d="M50 24c-3-10-10-14-14-12 3 4 8 9 14 12z"/>
      <path d="M50 24c3-10 10-14 14-12-3 4-8 9-14 12z"/>
      <path d="M50 22c0-11 4-16 4-16s4 9 0 18z"/></g>
  </svg>`;
}

// --- ANANAS tranche -----------------------------------------
export function pineSlice(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="38" fill="#D99A1C"/><circle cx="50" cy="50" r="33" fill="#FFD45A"/>
    <circle cx="50" cy="50" r="8" fill="#E8B84A"/>
    <g stroke="#C98A18" stroke-width="1" opacity="0.6"><path d="M50 17v66M17 50h66M27 27l46 46M73 27L27 73"/></g>
  </svg>`;
}

// --- AVOCAT entier ------------------------------------------
export function avocado(size) {
  const id = uid();
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs><radialGradient id="av${id}" cx="42%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#3E6B1F"/><stop offset="100%" stop-color="#1E3A0E"/></radialGradient></defs>
    <path d="M50 14c10 0 16 10 16 22 0 6 8 12 8 26 0 16-11 26-24 26S26 78 26 62c0-14 8-20 8-26 0-12 6-22 16-22z" fill="url(#av${id})"/>
    <ellipse cx="42" cy="32" rx="7" ry="5" fill="#fff" opacity="0.2"/>
  </svg>`;
}

// --- AVOCAT coupé (noyau visible) ---------------------------
export function avoHalf(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <path d="M50 14c10 0 16 10 16 22 0 6 8 12 8 26 0 16-11 26-24 26S26 78 26 62c0-14 8-20 8-26 0-12 6-22 16-22z" fill="#2E5417"/>
    <path d="M50 22c8 0 12 8 12 17 0 5 6 9 6 20 0 12-8 20-18 20s-18-8-18-20c0-11 6-15 6-20 0-9 4-17 12-17z" fill="#C3D86F"/>
    <ellipse cx="50" cy="56" rx="13" ry="14" fill="#7A4A22"/>
    <ellipse cx="47" cy="52" rx="5" ry="6" fill="#9A6438" opacity="0.7"/>
  </svg>`;
}

// --- CITRON VERT entier -------------------------------------
export function lime(size) {
  const id = uid();
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs><radialGradient id="li${id}" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#A8D44A"/><stop offset="100%" stop-color="#4A7A14"/></radialGradient></defs>
    <ellipse cx="50" cy="50" rx="36" ry="32" fill="url(#li${id})"/>
    <ellipse cx="38" cy="36" rx="9" ry="6" fill="#fff" opacity="0.25"/>
  </svg>`;
}

// --- CITRON VERT quartier -----------------------------------
export function limeWedge(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <path d="M50 50L18 30A38 38 0 0 1 82 30z" fill="#5A8A1C"/>
    <path d="M50 50L24 34A32 32 0 0 1 76 34z" fill="#D4E89A"/>
    <g stroke="#8AB840" stroke-width="1" opacity="0.6"><path d="M50 50L36 30M50 50h28M50 50L64 30"/></g>
  </svg>`;
}

// --- HARICOT VERT -------------------------------------------
export function bean(size) {
  return `<svg width="${size}" height="${size * 0.4}" viewBox="0 0 100 40">
    <path d="M8 20c10-12 30-14 44-10s30 6 40 2c-6 8-22 12-40 8S22 28 8 20z" fill="#4A8A1E"/>
    <path d="M12 18c10-8 28-9 40-5" stroke="#7AB840" stroke-width="2" fill="none" opacity="0.5"/>
  </svg>`;
}

// --- PIMENT -------------------------------------------------
export function chili(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <path d="M30 20c4 6 6 14 14 28s24 28 32 30c4-2 2-10-6-22S52 50 44 36 34 18 30 20z" fill="#C81E1E"/>
    <path d="M30 20c-2-6-6-8-10-6 3 3 6 5 10 6z" fill="#3B6D11"/>
  </svg>`;
}

// --- FEUILLE tropicale --------------------------------------
export function leaf(size) {
  const id = uid();
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs><linearGradient id="lf${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5AAE2E"/><stop offset="100%" stop-color="#2E6A12"/></linearGradient></defs>
    <path d="M50 8C30 28 22 56 30 88c20-14 36-40 38-72-6-4-12-6-18-8z" fill="url(#lf${id})"/>
    <path d="M48 16C36 34 32 58 36 80" stroke="#1E4A0C" stroke-width="1.5" fill="none" opacity="0.5"/>
  </svg>`;
}

// ============================================================
//  COLLECTIONS PAR THÈME
//  Chaque section pioche dans une de ces listes.
// ============================================================
export const FRUIT_SETS = {
  // Accueil : mix de bienvenue
  hero:    [mango, pineapple, avocado, lime, leaf, mangoHalf, pineSlice],
  // Section "Notre gamme" : LE master mix (idée de Gemini)
  master:  [mango, mangoHalf, pineapple, avoHalf, pineSlice, lime, limeWedge, leaf, mango, avocado],
  // Pages produits dédiées
  mango:   [mango, mango, mangoHalf, mango, leaf, mangoHalf, leaf],
  exotic:  [pineapple, pineSlice, pineapple, pineSlice, leaf, pineapple, leaf],
  avocado: [avocado, avoHalf, lime, avocado, limeWedge, lime, leaf],
  primeur: [bean, bean, chili, bean, bean, chili, bean, leaf],
};

// ============================================================
//  SLOTS DE POSITION (en %)
//  Volontairement structurés (PAS aléatoires) pour ne JAMAIS
//  cacher le texte de la colonne gauche.  z=3 → flou/devant,
//  z=2 → net/derrière.
// ============================================================
export const SLOTS = [
  { x: 62, y: 18, s: 130, z: 3, b: 7 }, { x: 84, y: 42, s: 170, z: 2, b: 0 },
  { x: 55, y: 62, s: 110, z: 3, b: 6 }, { x: 74, y: 74, s: 150, z: 2, b: 0 },
  { x: 90, y: 14, s: 90,  z: 3, b: 9 }, { x: 48, y: 30, s: 80,  z: 3, b: 5 },
  { x: 68, y: 48, s: 120, z: 2, b: 0 }, { x: 88, y: 66, s: 100, z: 3, b: 8 },
  { x: 58, y: 84, s: 95,  z: 2, b: 0 }, { x: 80, y: 26, s: 85,  z: 3, b: 7 },
  { x: 46, y: 52, s: 75,  z: 3, b: 6 }, { x: 94, y: 54, s: 110, z: 2, b: 0 },
  { x: 64, y: 8,  s: 70,  z: 3, b: 9 }, { x: 72, y: 92, s: 85,  z: 2, b: 0 },
];

export { rnd };
