// ============================================================
//  useSections — vue traduite des SECTIONS d'une page narrative
//  (À Propos, Partenariats).
//
//  Même principe que useLocalizedProducts : les fichiers de thème
//  (aboutTheme.js, partnershipTheme.js) gardent tout ce qui est
//  STRUCTUREL — id, couleurs, photos, type de scène, motionVariant,
//  pace — pendant que les TEXTES viennent d'i18n, indexés par `id`.
//
//  Un champ absent du fichier de traduction retombe sur la valeur
//  d'origine du thème : une section nouvellement ajoutée s'affiche
//  donc en français plutôt que de faire apparaître une clé brute
//  (« about.sections.xxx.title ») en production.
// ============================================================
import { useTranslation } from "react-i18next";

/**
 * @param {Array} sections  SECTIONS du fichier de thème (structure)
 * @param {string} ns       préfixe i18n, ex. "about.sections"
 */
export function useLocalizedSections(sections, ns) {
  const { t } = useTranslation();

  return sections.map((s) => {
    const base = `${ns}.${s.id}`;
    // t() renvoie la clé elle-même quand elle n'existe pas : on s'en sert
    // pour détecter l'absence de traduction et retomber sur le thème.
    const tr = (field, fallback) => {
      const key = `${base}.${field}`;
      const value = t(key, { defaultValue: "" });
      return value === "" || value === key ? fallback : value;
    };
    const trArray = (field, fallback) => {
      const key = `${base}.${field}`;
      const value = t(key, { returnObjects: true, defaultValue: null });
      return Array.isArray(value) ? value : fallback;
    };

    const out = { ...s };
    for (const f of ["kicker", "title", "subtitle", "statement", "photoAlt", "hint", "button"]) {
      if (s[f] !== undefined) out[f] = tr(f, s[f]);
    }
    if (Array.isArray(s.desc)) out.desc = trArray("desc", s.desc);
    if (Array.isArray(s.paragraphs)) out.paragraphs = trArray("paragraphs", s.paragraphs);
    if (Array.isArray(s.checklist)) out.checklist = trArray("checklist", s.checklist);
    if (Array.isArray(s.actions)) {
      const translated = trArray("actions", null);
      out.actions = s.actions.map((a, i) => ({
        ...a, // conserve `icon` (structurel, jamais traduit)
        title: translated?.[i]?.title ?? a.title,
        text: translated?.[i]?.text ?? a.text,
      }));
    }
    return out;
  });
}
