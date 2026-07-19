// ============================================================
//  analytics.js — gestion du consentement pour Google Analytics 4.
//
//  Le tag gtag.js lui-même est chargé statiquement dans index.html
//  (nécessaire pour que les crawlers de vérification Google le
//  détectent — ils ne lisent que le HTML servi, pas le DOM
//  post-hydratation React). Ce module ne gère QUE le consentement :
//  gtag('consent', 'update', ...) pas d'envoi de données avant
//  acceptation, conforme RGPD/ePrivacy.
// ============================================================

export function loadAnalyticsIfConsented(consent) {
  updateAnalyticsConsent(consent);
}

// Révoquer le consentement en cours de session (l'utilisateur rouvre les
// préférences et refuse) : GA4 n'expose pas de méthode d'unload propre une
// fois le script chargé — on arrête l'envoi de données via consent mode
// plutôt que de recharger la page, qui serait plus intrusif.
export function updateAnalyticsConsent(consent) {
  if (!window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: consent?.analytics ? "granted" : "denied",
  });
}

/**
 * Événements de conversion réels du site (pas une liste générique) —
 * à appeler depuis les points d'action existants :
 *   - trackEvent("generate_lead", { form: "contact" })  → Contact.jsx,
 *     après confirmation serveur de l'envoi (jamais au clic seul, même
 *     discipline que la carte de remerciement).
 *   - trackEvent("select_content", { product })          → clic "Demander
 *     une offre" sur une fiche produit / le calendrier de disponibilité.
 */
export function trackEvent(name, params = {}) {
  if (!window.gtag) return; // pas chargé (refusé ou GA4 pas encore configuré)
  window.gtag("event", name, params);
}
