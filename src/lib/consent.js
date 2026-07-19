// ============================================================
//  consent.js — état du consentement cookies (RGPD), source unique
//  de vérité pour tout le site.
//
//  Catégories réellement en usage sur ce site (pas de catégorie
//  fictive) :
//    - necessary  : toujours actif, aucun consentement requis
//        (sessionStorage de position de scroll — fonctionnel,
//        première partie, pas de tracking cross-site ; Turnstile
//        si activé, protection anti-spam du formulaire).
//    - analytics  : optionnel, gate Google Analytics 4. Le script
//        GA4 n'est chargé que si accepté ET qu'un Measurement ID
//        est configuré (VITE_GA_MEASUREMENT_ID) — voir analytics.js.
//
//  Stockage : localStorage (persiste au-delà de la session, contrairement
//  à sessionStorage, ce qui est le comportement attendu pour un choix
//  de préférence cookies qui ne doit pas être redemandé à chaque visite).
// ============================================================

const STORAGE_KEY = "tropicaura-consent-v1";

export const CATEGORIES = {
  necessary: { label: "Nécessaires", locked: true },
  analytics: { label: "Mesure d'audience", locked: false },
};

const DEFAULT_STATE = { necessary: true, analytics: false };

export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null; // aucun choix fait — le bandeau doit s'afficher
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return null;
  }
}

export function setConsent(partial) {
  const next = { ...DEFAULT_STATE, ...getConsent(), ...partial, necessary: true };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("consentchange", { detail: next }));
  return next;
}

export function acceptAll() {
  return setConsent({ analytics: true });
}

export function rejectAll() {
  return setConsent({ analytics: false });
}

export function hasDecided() {
  return getConsent() !== null;
}
