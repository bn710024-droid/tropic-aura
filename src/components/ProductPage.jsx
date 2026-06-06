import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FruitConstellation from "../components/FruitConstellation";

// ============================================================
//  <ProductPage />  —  gabarit réutilisable pour les pages
//  produits dédiées (Fruits, Avocats, Primeurs).
//
//  Props : { theme, bg, label, title, intro, specs[], season }
// ============================================================
export default function ProductPage({ theme, bg, label, title, intro, specs = [], season }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ta-page" style={{ background: bg }}>
      <Header scrolled />
      <div className="ta-page-hero">
        <FruitConstellation theme={theme} count={9} active={ready} />
        <div className="ta-page-content">
          <div className="ta-label">{label}</div>
          <h1 className="ta-page-h">{title}</h1>
          {season && <div className="ta-season">{season}</div>}
          <p className="ta-page-intro">{intro}</p>
          <button className="ta-btn" onClick={() => navigate("/#contact")}>Demander une offre →</button>
        </div>
      </div>

      <div className="ta-specs-wrap">
        <h2 className="ta-specs-title">Spécifications techniques</h2>
        <div className="ta-specs">
          {specs.map((s) => (
            <div className="ta-spec" key={s.label}>
              <div className="ta-spec-label">{s.label}</div>
              <div className="ta-spec-value">{s.value}</div>
            </div>
          ))}
        </div>
        <button className="ta-back" onClick={() => navigate("/")}>← Retour à l'accueil</button>
      </div>
    </div>
  );
}
