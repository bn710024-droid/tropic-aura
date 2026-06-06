import ProductPage from "../components/ProductPage";

// ROUTE : /gamme/primeurs-afrique
export default function PrimeursAfrique() {
  return (
    <ProductPage
      theme="primeur"
      bg="#1A3D14"
      label="Cultures de plein champ & Primeurs"
      title="Haricots verts extra-fins"
      season="Production : zone des Niayes"
      intro="Cultivés dans le micro-climat fertile de la zone des Niayes, nos haricots verts extra-fins sont récoltés et triés à la main pour une régularité de calibre irréprochable. Notre production respecte strictement les normes européennes (LMR, GlobalG.A.P.), garantissant aux acheteurs un approvisionnement fiable et conforme."
      specs={[
        { label: "Produit phare", value: "Haricot vert extra-fin" },
        { label: "Région", value: "Niayes (Thiès, Mbour)" },
        { label: "Récolte", value: "Manuelle, tri sélectif" },
        { label: "Conformité", value: "Normes LMR · GlobalG.A.P." },
        { label: "Autres primeurs", value: "Piments, légumes de saison" },
        { label: "Expédition", value: "FOB Port Autonome de Dakar" },
      ]}
    />
  );
}
