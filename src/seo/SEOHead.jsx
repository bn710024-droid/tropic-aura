import { Helmet } from "react-helmet-async";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  GENERATOR,
  APPLICATION_NAME,
  LEGAL_NAME,
} from "./siteConfig";

/**
 * SEOHead — équivalent React/Vite de la Metadata API de Next.js.
 * Centralise title, description, keywords, canonical, robots,
 * Open Graph, Twitter Cards et injection de données structurées
 * JSON-LD pour n'importe quelle page du site.
 *
 * @param {Object} props
 * @param {string} props.title - Titre de page (sans le suffixe site, ajouté automatiquement).
 * @param {string} props.description - Meta description (idéalement 120-160 caractères).
 * @param {string} props.path - Chemin absolu depuis la racine, ex. "/produits/mangue".
 * @param {string[]} [props.keywords] - Mots-clés ciblés pour cette page.
 * @param {"website"|"article"|"product"} [props.type="website"] - Type Open Graph.
 * @param {{url:string,width:number,height:number,alt:string}} [props.image] - Image OG/Twitter dédiée.
 * @param {boolean} [props.noindex=false] - Exclut la page de l'index (pages utilitaires uniquement).
 * @param {Object|Object[]} [props.jsonLd] - Un ou plusieurs objets JSON-LD à injecter.
 * @param {string} [props.publishedTime] - ISO 8601, pour type="article".
 * @param {string} [props.modifiedTime] - ISO 8601, pour type="article".
 */
export default function SEOHead({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd,
  publishedTime,
  modifiedTime,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Export Premium de fruits & légumes d'Afrique de l'Ouest`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      {/* ── Identité de base ── */}
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <meta name="author" content={LEGAL_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <meta name="creator" content={SITE_NAME} />
      <meta name="application-name" content={APPLICATION_NAME} />
      <meta name="generator" content={GENERATOR} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="category" content="Business/Export" />

      {/* ── Indexation & canonical ── */}
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
      />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* ── hreflang — site actuellement 100% francophone : on ne
          déclare volontairement PAS de version "en" tant qu'elle
          n'existe pas réellement (éviterait des erreurs Search
          Console de contenu non correspondant à la langue annoncée).
          Auto-référence fr + x-default = pratique valide et honnête. ── */}
      <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />
      <meta property="og:image" content={image.url} />
      <meta property="og:image:width" content={String(image.width)} />
      <meta property="og:image:height" content={String(image.height)} />
      <meta property="og:image:alt" content={image.alt} />
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* ── Twitter Cards ── */}
      <meta name="twitter:card" content="summary_large_image" />
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}
      {TWITTER_HANDLE && <meta name="twitter:creator" content={TWITTER_HANDLE} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.url} />
      <meta name="twitter:image:alt" content={image.alt} />

      {/* ── Données structurées JSON-LD ── */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
