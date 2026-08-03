// ============================================================
//  Tropicaura — Fruits détourés (WebP transparent)
//  Servis depuis public/png/ — un fruit par fichier, fond transparent.
//  Convertis depuis les PNG sources (mêmes noms, .webp) : ~87% plus
//  légers à qualité visuelle équivalente (alpha préservé).
// ============================================================
const png = (f) => `/png/${f}`;

export const IMAGES = {
  mangue:          png("mangue.webp"),
  ananas:          png("ananas.webp"),
  avocat:          png("avocat.webp"),
  citronVert:      png("citron-vert.webp"),
  citronVertCoupe: png("citron-vert-coupe.webp"),
  citronJaune:     png("citron-jaune.webp"),
  orange:          png("orange.webp"),
  papaye:          png("papaye.webp"),
  papayeCoupe:     png("papaye-coupee.webp"),
  banane:          png("banane.webp"),
  coco:            png("coco.webp"),
  melonJaune:      png("melon-jaune.webp"),
  melonVert:       png("melon-vert.webp"),
  pastequeTranche: png("pasteque-tranche.webp"),
  fraises:         png("fraises.webp"),
  fruitPassion:    png("fruit-passion.webp"),
};
