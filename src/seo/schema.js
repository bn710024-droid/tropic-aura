// ============================================================
//  schema.js — générateurs de données structurées JSON-LD.
//
//  Chaque fonction retourne un objet JSON-LD prêt à être sérialisé
//  dans un <script type="application/ld+json"> par SEOHead.jsx.
//
//  RÈGLE D'INTÉGRITÉ : aucune donnée non vérifiée n'est générée.
//  Volontairement ABSENTS de ce fichier : Review, AggregateRating,
//  VideoObject, BusinessEvent — ces types nécessitent des données
//  réelles (avis clients, vidéos, événements) qui n'existent pas
//  encore sur le site. Les ajouter avec des données fictives serait
//  une violation des Google Search Essentials (structured data
//  spam) pouvant entraîner une action manuelle. Structure prête à
//  les recevoir dès que ces données existeront réellement.
// ============================================================

import {
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LINKEDIN_URL,
  ADDRESS,
  EXPORT_MARKETS,
  LOGO_URL,
  LOGO_WIDTH,
  LOGO_HEIGHT,
} from "./siteConfig";

const abs = (path) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/**
 * Organization — combine les facettes réelles de l'activité
 * (export B2B agroalimentaire) sans déclarer de type LocalBusiness
 * générique trompeur : @type multiple = pratique standard schema.org
 * pour une entité qui est à la fois une Organization et une entité
 * spécialisée du commerce international.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Corporation"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: LOGO_WIDTH,
      height: LOGO_HEIGHT,
    },
    image: LOGO_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    sameAs: [LINKEDIN_URL].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS.locality,
      addressCountry: ADDRESS.country,
    },
    areaServed: EXPORT_MARKETS.map((m) => ({
      "@type": "Country",
      name: m.country,
    })),
    knowsAbout: [
      "Export de fruits tropicaux",
      "Export de légumes frais",
      "Commerce international agroalimentaire",
      "Logistique conteneurisée",
    ],
    contactPoint: contactPointSchema(),
  };
}

export function contactPointSchema() {
  return {
    "@type": "ContactPoint",
    contactType: "sales",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    areaServed: EXPORT_MARKETS.map((m) => m.code),
    availableLanguage: ["fr", "en"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "fr-FR",
  };
}

/**
 * WebPage générique — à combiner avec BreadcrumbList et, le cas
 * échéant, le schema spécifique de la page (Product, Article...).
 */
export function webPageSchema({ path, title, description, breadcrumb }) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "fr-FR",
    ...(breadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

/** BreadcrumbList — `trail` = [{ path, label }] du plus général au plus précis. */
export function breadcrumbListSchema(trail, currentPath) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${abs(currentPath)}#breadcrumb`,
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: abs(item.path),
    })),
  };
}

/** Product + Offer pour une fiche produit /produits/:slug. */
export function productSchema(product, incoterms) {
  const url = abs(`/produits/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    alternateName: product.englishName,
    description: product.description,
    image: abs(product.image),
    category: product.collection,
    countryOfOrigin: {
      "@type": "Country",
      name: product.origin,
    },
    brand: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      "@id": `${url}#offer`,
      url,
      priceCurrency: "EUR",
      // Pas de prix public fixe (B2B, tarification sur devis) →
      // on déclare availability + businessFunction sans price
      // pour rester factuel plutôt que d'inventer un montant.
      availability: "https://schema.org/InStock",
      businessFunction: "https://purl.org/goodrelations/v1#Sell",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
      eligibleRegion: EXPORT_MARKETS.map((m) => ({ "@type": "Country", name: m.country })),
      description: `Incoterms disponibles : ${incoterms.join(", ")}.`,
    },
  };
}

/** FAQPage pour une fiche produit. */
export function faqPageSchema(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * Article — pour les pages /insights/:slug. `authorType: "Organization"`
 * car aucun auteur individuel réel n'est publié sur le site (on ne
 * fabrique pas de Person fictif).
 */
export function articleSchema({ path, title, description, image, datePublished }) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: title,
    description,
    image: image ? [abs(image)] : undefined,
    datePublished,
    dateModified: datePublished,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "fr-FR",
  };
}
