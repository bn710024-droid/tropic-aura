import ProductPage from "../components/ProductPage";

// ROUTE : /gamme/fruits-exotiques  —  Le navire amiral (Mangue Kent/Keitt)
export default function FruitsExotiques() {
  return (
    <ProductPage
      theme="mango"
      bg="#3D2410"
      label="Navire amiral · Campagne mangue"
      title="Mangues Kent & Keitt"
      season="Saison : Mai – Octobre"
      intro="Nos mangues sénégalaises sont sélectionnées pour leur chair ferme, peu fibreuse, et leur sucrosité intense. Récoltées à maturité optimale, calibrées et conditionnées en station agréée, elles sont expédiées par voie maritime depuis le Port de Dakar pour une fraîcheur garantie à l'arrivée en Europe."
      specs={[
        { label: "Variétés", value: "Kent (principale), Keitt (tardive)" },
        { label: "Calibres", value: "8 à 14 fruits / colis" },
        { label: "Taux de sucre", value: "14–18 °Brix" },
        { label: "Conditionnement", value: "Colis carton 4 kg, palettisé" },
        { label: "Traitement post-récolte", value: "Lavage, tri, chaîne du froid" },
        { label: "Expédition", value: "FOB Port Autonome de Dakar" },
      ]}
    />
  );
}
