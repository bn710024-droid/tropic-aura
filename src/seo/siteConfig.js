// ============================================================
//  siteConfig.js — source unique de vérité pour toutes les données
//  d'identité du site utilisées par le SEO (metadata, Open Graph,
//  Twitter Cards, JSON-LD, sitemap, manifest).
//
//  RÈGLE : aucune donnée inventée ici. Tout ce qui figure dans ce
//  fichier est repris tel quel de contenus déjà publiés ailleurs
//  dans le site (Contact.jsx, Footer.jsx, ExportRouteMap.jsx) —
//  jamais de faux avis, fausses certifications, ou fausse adresse.
// ============================================================

/** URL canonique de production. À synchroniser avec le domaine réel une fois acheté/branché. */
export const SITE_URL = "https://www.tropic-aura.com";

export const SITE_NAME = "Tropicaura";
export const LEGAL_NAME = "Tropicaura B.C.";

export const CONTACT_EMAIL = "contact@tropic-aura.com";
export const CONTACT_PHONE = "+221 77 881 20 18";
export const LINKEDIN_URL = "https://www.linkedin.com/";

export const ADDRESS = {
  locality: "Dakar",
  country: "SN",
  countryName: "Sénégal",
};

// Marchés d'export réellement représentés dans ExportRouteMap.jsx
// (composant existant, jamais modifié) — utilisés pour areaServed.
export const EXPORT_MARKETS = [
  { country: "Pays-Bas", code: "NL" },
  { country: "Belgique", code: "BE" },
  { country: "France", code: "FR" },
  { country: "Espagne", code: "ES" },
  { country: "Royaume-Uni", code: "GB" },
  { country: "Canada", code: "CA" },
  { country: "États-Unis", code: "US" },
  { country: "Émirats Arabes Unis", code: "AE" },
];

export const DEFAULT_LOCALE = "fr_FR";
export const DEFAULT_LANG = "fr";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og/default.jpg`,
  width: 1200,
  height: 630,
  alt: "Tropicaura — Export premium de fruits et légumes d'Afrique de l'Ouest",
};

export const LOGO_URL = `${SITE_URL}/logo-mark.png`;
export const LOGO_WIDTH = 512;
export const LOGO_HEIGHT = 512;

// Pas de comptes sociaux Twitter/X confirmés dans le code existant →
// on omet twitter:site/creator plutôt que d'inventer un handle.
export const TWITTER_HANDLE = null;

export const GENERATOR = "Vite + React 18";
export const APPLICATION_NAME = SITE_NAME;
