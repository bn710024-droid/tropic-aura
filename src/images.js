// ============================================================
//  TROPIC-AURA — Fruits détourés (PNG transparent)
//  Servis depuis public/png/ — un fruit par fichier, fond transparent.
// ============================================================
const png = (f) => `/png/${f}`;

export const IMAGES = {
  mangue:          png("mangue.png"),
  ananas:          png("ananas.png"),
  avocat:          png("avocat.png"),
  citronVert:      png("citron-vert.png"),
  citronVertCoupe: png("citron-vert-coupe.png"),
  citronJaune:     png("citron-jaune.png"),
  orange:          png("orange.png"),
  papaye:          png("papaye.png"),
  papayeCoupe:     png("papaye-coupee.png"),
  banane:          png("banane.png"),
  coco:            png("coco.png"),
  melonJaune:      png("melon-jaune.png"),
  melonVert:       png("melon-vert.png"),
  pasteque:        png("pasteque.png"),
  pastequeTranche: png("pasteque-tranche.png"),
  fraises:         png("fraises.png"),
  fruitPassion:    png("fruit-passion.png"),
  myrtilles:       png("myrtilles.png"),
  haricots:        png("haricots.png"),
  gombo:           png("gombo.png"),
};

export default IMAGES;
