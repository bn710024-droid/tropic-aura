// ============================================================
//  TROPIC-AURA — Mapping des images locales (public/)
//  Les fichiers sont servis à la racine du site.
//  encodeURI gère les espaces dans les noms WhatsApp.
// ============================================================
const img = (file) => `/${encodeURIComponent(file)}`

const F = (n) =>
  img(`WhatsApp Image 2026-06-03 at 04.41.34${n ? ` (${n})` : ''}.jpeg`)

export const IMAGES = {
  logo:            F(11),
  // Mangues
  mangoVerger:     F(''),
  mangoCoupe:      F(1),
  mangoArbreKeitt: F(2),
  mangoArbreKent:  F(3),
  mangoMarket:     F(4),
  mangoKent:       F(8),
  mangoKeitt:      F(9),
  mangoCaisse:     F(10),
  // Fruits
  avocat:          F(5),
  banane:          F(6),
  ananas:          F(15),
  ananasChamp:     F(13),
  ananasExport:    F(14),
  pasteque:        F(16),
  pastequeDark:    F(17),
  melon:           F(18),
  melonCoupe:      F(19),
  papaye:          F(25),
  papayeArbre:     F(26),
  coco:            F(12),
  // Légumes
  haricots:        F(21),
  haricots2:       F(22),
  piments:         F(20),
  capsicum:        F(27),
  citron:          F(23),
  citronArbre:     F(24),
  // Terroir
  mainTerroir:     F(7),
  terroir:         F(28),
}

export default IMAGES
