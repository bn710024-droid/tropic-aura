import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home         from "./pages/Home";
import APropos      from "./pages/APropos";
import Partenariats from "./pages/Partenariats";
import Produits     from "./pages/Produits";
import ProductDetail from "./pages/ProductDetail";
import Disponibilite from "./pages/Disponibilite";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
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

  // Auto-scroll vers le haut à chaque changement de route — SAUF si la page
  // cible a mémorisé sa propre position de scroll (voir Produits.jsx), auquel
  // cas on la laisse la restaurer elle-même plutôt que de forcer 0 et
  // provoquer un flash (reset puis re-saut à la position mémorisée).
  useEffect(() => {
    const hasMemory = sessionStorage.getItem(`scrollpos:${location.pathname}`) !== null;
    if (!hasMemory) window.scrollTo(0, 0);
  }, [location.pathname]);

  const isArticle = path.startsWith("/insights/") && path !== "/insights";
  // La Home rend son propre <Footer /> DANS son wrapper de scroll mobile
  // (le body y est figé) — on évite ici le doublon.
  const isHome = path === "/";

  return (
    <>
      <Routes>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isArticle && !isHome && <Footer />}
      {!isArticle && <LiquidMenu />}
      <CookieBanner />
    </>
  );
}
