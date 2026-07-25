// ============================================================
//  useLocalizedProducts — vue traduite des données produit.
//
//  SÉPARATION VOLONTAIRE :
//    - productsData.js garde les données STRUCTURELLES et la logique
//      (slug, image, dimensions, couleurs, seasonMonths, collection,
//      origin en français). Ces valeurs servent de CLÉS : getTransportText()
//      compare origin === "Sénégal", getRelatedProducts() compare
//      collection === "SIGNATURE". Les traduire casserait ces comparaisons.
//    - les textes AFFICHÉS (nom, description, origine, disponibilité)
//      viennent d'i18n via ces hooks.
//
//  D'où le doublet `origin` (clé technique, toujours en français) et
//  `originLabel` (texte à afficher, traduit). Même principe pour
//  collection / collectionLabel.
// ============================================================
import { useTranslation } from "react-i18next";
import {
  PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
  getTransportText,
  PRODUCT_SHARED,
} from "./productsData";

/** Ajoute les libellés traduits à un produit brut. */
function localize(product, t) {
  if (!product) return null;
  const k = `catalog.items.${product.slug}`;
  return {
    ...product,
    name: t(`${k}.name`),
    description: t(`${k}.description`),
    shortDesc: t(`${k}.shortDesc`),
    originLabel: t(`${k}.origin`),
    availabilityLabel: t(`${k}.availability`),
    standardLabel: t("catalog.standard"),
    collectionLabel: t(`catalog.collections.${product.collection}`),
  };
}

/** Tous les produits, textes traduits. */
export function useLocalizedProducts() {
  const { t } = useTranslation();
  return PRODUCTS.map((p) => localize(getProductBySlug(p.slug), t));
}

/** Un produit par slug, textes traduits (null si inconnu). */
export function useLocalizedProduct(slug) {
  const { t } = useTranslation();
  return localize(getProductBySlug(slug), t);
}

/** Produits liés, textes traduits. */
export function useRelatedProducts(slug, count = 3) {
  const { t } = useTranslation();
  return getRelatedProducts(slug, count).map((p) => localize(p, t));
}

/** Textes partagés (incoterms, transport, FAQ…) dans la langue courante. */
export function useProductShared() {
  const { t } = useTranslation();
  return {
    certification: t("catalog.shared.certification"),
    incoterms: t("catalog.shared.incoterms", { returnObjects: true }),
    incotermsNote: t("catalog.shared.incotermsNote"),
    packaging: t("catalog.shared.packaging"),
    calibrage: t("catalog.shared.calibrage"),
    availabilityNote: t("catalog.shared.availabilityNote"),
    customSolutions: t("catalog.shared.customSolutions"),
    otherMarketsNote: t("catalog.shared.otherMarketsNote"),
    faq: t("catalog.shared.faq", { returnObjects: true }),
    /** Texte transport traduit, choisi selon l'origine (clé FR, cf. en-tête). */
    transportFor: (product) =>
      getTransportText(product) === PRODUCT_SHARED.transportSenegal
        ? t("catalog.shared.transportSenegal")
        : t("catalog.shared.transportOtherAfrica"),
  };
}
