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
//  Stockage : localStorage EN PRIORITÉ + cookie de secours. Le site fait
//  des rechargements complets de page entre les rubriques (voir App.jsx —
//  <a href> classiques, pas de navigation client React Router), donc le
//  choix doit survivre à un rechargement complet à coup sûr : certains
//  réglages navigateur (mode privé strict, bloqueurs de traqueurs) peuvent
//  effacer ou bloquer localStorage sans bloquer les cookies classiques
//  (ou l'inverse) — lire/écrire les deux évite que le bandeau ne
//  redemande le choix sur certaines pages/navigateurs.
// ============================================================

const STORAGE_KEY = "tropicaura-consent-v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

export const CATEGORIES = {
  necessary: { label: "Nécessaires", locked: true },
  analytics: { label: "Mesure d'audience", locked: false },
};

const DEFAULT_STATE = { necessary: true, analytics: false };

function readCookie() {
  try {
    const match = document.cookie.match(new RegExp("(?:^|; )" + STORAGE_KEY + "=([^;]*)"));
    return match ? JSON.parse(decodeURIComponent(match[1])) : null;
  } catch {
    return null;
  }
}

function writeCookie(value) {
  try {
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(value))}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
  } catch {
    // cookies désactivés — localStorage reste la source principale
  }
}

export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    // localStorage bloqué — on retombe sur le cookie ci-dessous
  }
  const fromCookie = readCookie();
  if (fromCookie) return { ...DEFAULT_STATE, ...fromCookie };
  return null; // aucun choix fait nulle part — le bandeau doit s'afficher
}

export function setConsent(partial) {
  const next = { ...DEFAULT_STATE, ...getConsent(), ...partial, necessary: true };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage bloqué — le cookie ci-dessous prend le relais
  }
  writeCookie(next);
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
