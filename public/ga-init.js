// Bootstrap GA4 (gtag.js) avec consentement RGPD par défaut refusé.
// Fichier externe (pas inline) : le CSP du site (script-src 'self' ...)
// bloque les scripts inline sans nonce/hash — servir ce code comme un
// fichier same-origin l'autorise nativement, sans affaiblir le CSP.
// L'ID de mesure vient de l'attribut data-ga-id (substitué par Vite au
// build depuis VITE_GA_MEASUREMENT_ID) plutôt que d'être en dur ici.
(function () {
  var id = document.currentScript.getAttribute("data-ga-id");
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("consent", "default", { analytics_storage: "denied" });
  gtag("config", id, { anonymize_ip: true });
})();
