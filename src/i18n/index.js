// ============================================================
//  i18n — internationalisation FR (défaut) / EN.
//
//  ARCHITECTURE : la langue est portée par l'URL, pas par un état
//  applicatif ni la langue du navigateur.
//      /produits      → français (URLs historiques inchangées)
//      /en/products   → anglais
//  C'est la seule approche qui donne à chaque langue une URL propre,
//  indexable et partageable — condition d'un hreflang valide. Une
//  bascule par état (ou par langue navigateur) servirait deux contenus
//  différents sous la MÊME URL : Google n'indexerait qu'une version et
//  un lien partagé ne rendrait pas la bonne langue.
//
//  Pas de détection navigateur volontairement : le français reste la
//  langue par défaut du site, et une redirection automatique basée sur
//  la langue du navigateur empêche Googlebot (qui crawle en en-US)
//  d'atteindre la version française.
// ============================================================
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
// Catalogue produit dans des fichiers dédiés : 12 produits × (nom, description,
// origine, disponibilité) + textes partagés (incoterms, transport, FAQ…)
// alourdiraient trop les fichiers d'interface. Le FR est GÉNÉRÉ depuis
// productsData.js (voir scripts) pour rester la copie exacte du contenu publié.
import catalogFr from "./locales/catalog.fr.json";
import catalogEn from "./locales/catalog.en.json";

// Définis dans routing.js (module sans dépendance, utilisable au build) et
// ré-exportés ici pour que le reste de l'app garde un point d'entrée unique.
export { DEFAULT_LANG, SUPPORTED_LANGS } from "./routing";
import { DEFAULT_LANG } from "./routing";

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: { ...fr, catalog: catalogFr } },
    en: { translation: { ...en, catalog: catalogEn } },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: {
    // React échappe déjà les valeurs interpolées — le double échappement
    // d'i18next casserait les apostrophes/accents.
    escapeValue: false,
  },
  // Les ressources sont importées statiquement (bundle) : aucun fetch au
  // runtime, donc aucun flash de clés non traduites au premier rendu.
  react: { useSuspense: false },
});

export default i18n;
