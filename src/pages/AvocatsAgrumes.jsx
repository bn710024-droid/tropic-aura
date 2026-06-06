import ProductPage from "../components/ProductPage";

// ROUTE : /gamme/avocats-agrumes
export default function AvocatsAgrumes() {
  return (
    <ProductPage
      theme="avocado"
      bg="#0E3D2A"
      label="Avocats & Agrumes d'exportation"
      title="Avocats Hass & Citrons verts"
      season="Disponibilité : selon calendrier de production"
      intro="L'avocat Hass d'Afrique de l'Ouest connaît un essor remarquable. Onctueux, à la maturité maîtrisée, il répond aux exigences des distributeurs européens. Nos citrons verts, gorgés de jus, complètent une gamme agrumes premium, avec une gestion rigoureuse de la chaîne du froid de la récolte au container."
      specs={[
        { label: "Avocat", value: "Variété Hass" },
        { label: "Calibres avocat", value: "12 à 30 (selon demande)" },
        { label: "Citron vert", value: "Lime juteuse, peau fine" },
        { label: "Conditionnement", value: "Caisses calibrées, capacité adaptée" },
        { label: "Chaîne du froid", value: "Maintenue de la station au port" },
        { label: "Expédition", value: "FOB Port Autonome de Dakar" },
      ]}
    />
  );
}
