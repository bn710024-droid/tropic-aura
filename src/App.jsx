import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langFromPath } from "./i18n/routing";
import Home         from "./pages/Home";
import APropos      from "./pages/APropos";
import Partenariats from "./pages/Partenariats";
import Produits     from "./pages/Produits";
import ProductDetail from "./pages/ProductDetail";
import Disponibilite from "./pages/Disponibilite";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Quality      from "./pages/Quality";
import Logistics    from "./pages/Logistics";
import Contact      from "./pages/Contact";
import Insights        from "./pages/Insights";
import InsightSenegal      from "./pages/InsightSenegal";
import InsightPartenariats from "./pages/InsightPartenariats";
import NotFound     from "./pages/NotFound";
import LiquidMenu   from "./components/LiquidMenu";
import Footer       from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import "./styles/global.css";

// ============================================================
//  <App /> — routeur applicatif (react-router-dom).
//
//  Migré depuis un routage manuel par window.location.pathname
//  vers <Routes>/<Route> : nécessaire pour supporter les URLs
//  produit paramétrées (/produits/:slug) sans dupliquer la logique
//  de correspondance de chemin. Comportement de navigation
//  inchangé ailleurs (TopBar, LiquidMenu, Footer utilisent toujours
//  des <a href> classiques → rechargement complet, testé et voulu
//  pour le comportement de saut de section ?section=<id>).
// ============================================================
export default function App() {
  const location = useLocation();
  const path = location.pathname;
  const { i18n } = useTranslation();

  // L'URL est la SOURCE DE VÉRITÉ de la langue (voir src/i18n/index.js) :
  // on synchronise i18next dessus à chaque navigation. Un chargement direct
  // sur /en/... ou un retour navigateur donne donc immédiatement la bonne
  // langue, sans état applicatif à restaurer.
  const lang = langFromPath(path);
  if (i18n.language !== lang) i18n.changeLanguage(lang);

  // L'attribut lang du <html> doit suivre : il pilote la synthèse vocale,
  // la césure typographique et sert de signal de langue aux moteurs.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Auto-scroll vers le haut à chaque changement de route — SAUF si la page
  // cible a mémorisé sa propre position de scroll (voir Produits.jsx), auquel
  // cas on la laisse la restaurer elle-même plutôt que de forcer 0 et
  // provoquer un flash (reset puis re-saut à la position mémorisée).
  useEffect(() => {
    const hasMemory = sessionStorage.getItem(`scrollpos:${location.pathname}`) !== null;
    if (!hasMemory) window.scrollTo(0, 0);
  }, [location.pathname]);

  // Un article (les deux langues) masque Footer et LiquidMenu : il porte sa
  // propre navigation de fin de lecture. Sans la branche /en/, la version
  // anglaise afficherait un footer que la française n'a pas.
  const isArticle =
    (path.startsWith("/insights/") && path !== "/insights") ||
    (path.startsWith("/en/insights/") && path !== "/en/insights");
  // La Home rend son propre <Footer /> DANS son wrapper de scroll mobile
  // (le body y est figé) — on évite ici le doublon. Vaut pour ses deux
  // langues : / (fr) et /en.
  const isHome = path === "/" || path === "/en";
  // Idem pour une fiche produit : depuis l'ajout du wrapper de scroll dédié
  // mobile (fix du calque de fond qui se décalait au scroll sur iOS Safari),
  // ProductDetail.jsx rend aussi son propre <Footer /> DANS son wrapper.
  const isProductDetail =
    (path.startsWith("/produits/") && path !== "/produits") ||
    (path.startsWith("/en/products/") && path !== "/en/products");

  return (
    <>
      <Routes>
        {/* ── Version anglaise (préfixe /en) ──
            Seules les pages réellement traduites sont déclarées ici : voir
            TRANSLATED_PAGES dans src/i18n/routing.js. Une route /en/* non
            traduite tomberait sur NotFound plutôt que d'afficher du français
            sous une URL annoncée comme anglaise. */}
        <Route path="/en" element={<Home />} />
        <Route path="/en/products" element={<Produits />} />
        <Route path="/en/products/:slug" element={<ProductDetail />} />
        <Route path="/en/contact" element={<Contact />} />
        <Route path="/en/availability" element={<Disponibilite />} />
        <Route path="/en/about" element={<APropos />} />
        <Route path="/en/partnerships" element={<Partenariats />} />
        <Route path="/en/insights" element={<Insights />} />
        <Route path="/en/insights/senegal-strategic-origin" element={<InsightSenegal />} />
        <Route path="/en/insights/reliable-vs-opportunistic-supplier" element={<InsightPartenariats />} />
        <Route path="/en/privacy" element={<PolitiqueConfidentialite />} />
        <Route path="/en/quality-compliance" element={<Quality />} />
        <Route path="/en/logistics-export" element={<Logistics />} />

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<APropos />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/partnerships" element={<Partenariats />} />
        <Route path="/partenariats" element={<Partenariats />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/products" element={<Produits />} />
        <Route path="/produits/:slug" element={<ProductDetail />} />
        <Route path="/disponibilite" element={<Disponibilite />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/senegal-origine-strategique" element={<InsightSenegal />} />
        <Route path="/insights/fournisseur-stable-opportuniste" element={<InsightPartenariats />} />
        <Route path="/qualite-conformite" element={<Quality />} />
        <Route path="/logistique-export" element={<Logistics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isArticle && !isHome && !isProductDetail && <Footer />}
      {!isArticle && <LiquidMenu />}
      <CookieBanner />
    </>
  );
}
