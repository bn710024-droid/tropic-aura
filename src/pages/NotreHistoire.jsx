import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// ROUTE : /notre-histoire
export default function NotreHistoire() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const VALUES = [
    { t: "Impact local", d: "Partenariats durables avec les groupements de producteurs sénégalais." },
    { t: "Commerce équitable", d: "Rémunération juste et relations long terme avec nos partenaires." },
    { t: "Emplois durables", d: "Création d'emplois dans les stations de conditionnement locales." },
    { t: "Traçabilité", d: "Du verger au container, chaque lot documenté et suivi." },
  ];

  return (
    <div className="ta-page" style={{ background: "#051A10" }}>
      <Header scrolled />
      <div className="ta-story">
        <div className="ta-label">Notre histoire</div>
        <h1 className="ta-page-h" style={{ maxWidth: 620 }}>
          Un partenaire stratégique,<br />ancré dans le terroir.
        </h1>
        <p className="ta-page-intro" style={{ maxWidth: 620 }}>
          Tropic-Aura B.C. est née d'une conviction : l'Afrique de l'Ouest produit certains des meilleurs
          fruits et légumes du monde, et mérite un accès direct et équitable aux marchés européens.
          Nous assurons la liaison au sein de la filière des produits frais, du producteur à l'acheteur final,
          en garantissant qualité, régularité et transparence à chaque étape.
        </p>

        <div className="ta-values">
          {VALUES.map((v) => (
            <div className="ta-value" key={v.t}>
              <h3 className="ta-value-t">{v.t}</h3>
              <p className="ta-value-d">{v.d}</p>
            </div>
          ))}
        </div>

        <button className="ta-btn" onClick={() => navigate("/#contact")}>Travailler avec nous →</button>
        <button className="ta-back" onClick={() => navigate("/")}>← Retour à l'accueil</button>
      </div>
    </div>
  );
}
