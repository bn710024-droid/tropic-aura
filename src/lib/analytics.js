// ============================================================
//  analytics.js — chargement conditionnel de Google Analytics 4.
//
//  Le script gtag.js n'est injecté QUE si les deux conditions sont
//  réunies :
//    1. l'utilisateur a accepté la catégorie "analytics" (RGPD —
//       aucun script tiers non essentiel avant consentement) ;
//    2. VITE_GA_MEASUREMENT_ID est configuré (Vercel → Environment
//       Variables). Tant que la propriété GA4 n'existe pas, cette
//       variable est absente et rien ne se charge — pas d'erreur,
//       pas de script fantôme.
//
//  GA4 plutôt qu'Universal Analytics : UA est arrêté par Google
//  depuis juillet 2023 (aucune nouvelle donnée collectée) — ce
//  n'est plus un choix, c'est la seule option disponible aujourd'hui.
// ============================================================

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let loaded = false;

export function loadAnalyticsIfConsented(consent) {
  if (!GA_ID || !consent?.analytics || loaded) return;
  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  // anonymize_ip : conforme aux recommandations CNIL pour limiter la
  // donnée personnelle collectée à ce qui est strictement nécessaire.
  gtag("config", GA_ID, { anonymize_ip: true });
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
