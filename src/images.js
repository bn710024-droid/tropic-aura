// ============================================================
//  TROPIC-AURA B.C. — Référentiel unique des images
//  Source : /public du repo GitHub bn710024-droid/tropic-aura
//  RÈGLE ABSOLUE : ne jamais hardcoder d'URL dans les composants.
//  Toujours passer par IMAGES.xxx
// ============================================================

export const BASE_URL =
  'https://raw.githubusercontent.com/bn710024-droid/tropic-aura/main/public/'

const img = (filename) =>
  BASE_URL + encodeURIComponent(filename)

// ─── Identité ────────────────────────────────────────────────
export const LOGO           = img('WhatsApp Image 2026-06-03 at 04.41.34 (11).jpeg')

// ─── Hero & ambiance ─────────────────────────────────────────
export const HERO           = img('WhatsApp Image 2026-06-03 at 04.41.34 (4).jpeg')
export const MANGO_VERGER   = img('WhatsApp Image 2026-06-03 at 04.41.34.jpeg')
export const TERROIR        = img('WhatsApp Image 2026-06-03 at 04.41.34 (28).jpeg')
export const MAIN_TERROIR   = img('WhatsApp Image 2026-06-03 at 04.41.34 (7).jpeg')

// ─── Mangues ─────────────────────────────────────────────────
export const MANGO_COUPE        = img('WhatsApp Image 2026-06-03 at 04.41.34 (1).jpeg')
export const MANGO_KENT         = img('WhatsApp Image 2026-06-03 at 04.41.34 (8).jpeg')
export const MANGO_KEITT        = img('WhatsApp Image 2026-06-03 at 04.41.34 (9).jpeg')
export const MANGO_ARBRE_KEITT  = img('WhatsApp Image 2026-06-03 at 04.41.34 (2).jpeg')
export const MANGO_ARBRE_KENT   = img('WhatsApp Image 2026-06-03 at 04.41.34 (3).jpeg')
export const MANGO_CAISSE       = img('WhatsApp Image 2026-06-03 at 04.41.34 (10).jpeg')

// ─── Autres fruits ───────────────────────────────────────────
export const AVOCAT          = img('WhatsApp Image 2026-06-03 at 04.41.34 (5).jpeg')
export const BANANE          = img('WhatsApp Image 2026-06-03 at 04.41.34 (6).jpeg')
export const ANANAS          = img('WhatsApp Image 2026-06-03 at 04.41.34 (15).jpeg')
export const ANANAS_CHAMP    = img('WhatsApp Image 2026-06-03 at 04.41.34 (13).jpeg')
export const ANANAS_EXPORT   = img('WhatsApp Image 2026-06-03 at 04.41.34 (14).jpeg')
export const PASTEQUE        = img('WhatsApp Image 2026-06-03 at 04.41.34 (16).jpeg')
export const PASTEQUE_DARK   = img('WhatsApp Image 2026-06-03 at 04.41.34 (17).jpeg')
export const MELON           = img('WhatsApp Image 2026-06-03 at 04.41.34 (18).jpeg')
export const MELON_COUPE     = img('WhatsApp Image 2026-06-03 at 04.41.34 (19).jpeg')
export const PAPAYE          = img('WhatsApp Image 2026-06-03 at 04.41.34 (25).jpeg')
export const PAPAYE_ARBRE    = img('WhatsApp Image 2026-06-03 at 04.41.34 (26).jpeg')
export const COCO            = img('WhatsApp Image 2026-06-03 at 04.41.34 (12).jpeg')

// ─── Légumes ─────────────────────────────────────────────────
export const HARICOTS        = img('WhatsApp Image 2026-06-03 at 04.41.34 (21).jpeg')
export const HARICOTS_2      = img('WhatsApp Image 2026-06-03 at 04.41.34 (22).jpeg')
export const PIMENTS         = img('WhatsApp Image 2026-06-03 at 04.41.34 (20).jpeg')
export const CAPSICUM        = img('WhatsApp Image 2026-06-03 at 04.41.34 (27).jpeg')
export const CITRON          = img('WhatsApp Image 2026-06-03 at 04.41.34 (23).jpeg')
export const CITRON_ARBRE    = img('WhatsApp Image 2026-06-03 at 04.41.34 (24).jpeg')

// ─── Objet global (import unique dans les composants) ────────
export const IMAGES = {
  logo:           LOGO,
  hero:           HERO,
  mangoVerger:    MANGO_VERGER,
  terroir:        TERROIR,
  mainTerroir:    MAIN_TERROIR,
  mangoCoupe:     MANGO_COUPE,
  mangoKent:      MANGO_KENT,
  mangoKeitt:     MANGO_KEITT,
  mangoArbreKeitt:MANGO_ARBRE_KEITT,
  mangoArbreKent: MANGO_ARBRE_KENT,
  mangoCaisse:    MANGO_CAISSE,
  avocat:         AVOCAT,
  banane:         BANANE,
  ananas:         ANANAS,
  ananasChamp:    ANANAS_CHAMP,
  ananasExport:   ANANAS_EXPORT,
  pasteque:       PASTEQUE,
  pastequeDark:   PASTEQUE_DARK,
  melon:          MELON,
  melonCoupe:     MELON_COUPE,
  papaye:         PAPAYE,
  papayeArbre:    PAPAYE_ARBRE,
  coco:           COCO,
  haricots:       HARICOTS,
  haricots2:      HARICOTS_2,
  piments:        PIMENTS,
  capsicum:       CAPSICUM,
  citron:         CITRON,
  citronArbre:    CITRON_ARBRE,
}

export default IMAGES
