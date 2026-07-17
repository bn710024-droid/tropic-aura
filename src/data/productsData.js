// ============================================================
//  productsData.js — source unique de vérité pour les données
//  produit utilisées à la fois par la vitrine scrollée
//  (Produits.jsx) et par les pages détail SEO dédiées
//  (/produits/:slug — voir ProductDetail.jsx).
//
//  RÈGLE D'INTÉGRITÉ DES DONNÉES :
//  - name / description / origin / availability : repris tels
//    quels des SECTIONS de Produits.jsx (contenu déjà publié).
//  - incoterm "FOB – Port de Dakar" : repris tel quel de
//    index.html (déjà publié sur le site).
//  - exportMarkets : repris tel quel d'ExportRouteMap.jsx.
//  - packaging / transport : décrits en termes de PROCESSUS
//    généraux et vérifiables (conteneur, chaîne du froid), sans
//    inventer de chiffres (poids de carton, calibrage précis...)
//    non confirmés ailleurs dans le site.
//  - faq : questions B2B génériques dont la réponse renvoie vers
//    un contact humain plutôt que d'affirmer des faits non
//    vérifiés (certifications précises, MOQ chiffré, Incoterms
//    alternatifs...).
// ============================================================

// Dimensions réelles des fichiers PNG (lues via sharp) — nécessaires
// pour fixer width/height sur <img> et éliminer tout CLS (Cumulative
// Layout Shift) sur les pages produit dédiées.
// Couleurs de fond reprises telles quelles de Produits.jsx (SECTIONS)
// pour que chaque page produit dédiée reste visuellement cohérente
// avec la vitrine scrollée existante — même palette, même identité.
const BG_COLORS = {
  mangue: "#5E2A12",
  avocat: "#1C3326",
  ananas: "#6B5214",
  papaye: "#7A3514",
  banane: "#0E2418",
  melon: "#2A1208",
  pasteque: "#5A2630",
  "citron-vert": "#36511E",
  "citron-jaune": "#6B5A14",
  gombo: "#243318",
  piment: "#2E4A1C",
};

const IMAGE_DIMENSIONS = {
  mangue: { width: 603, height: 594 },
  avocat: { width: 415, height: 710 },
  ananas: { width: 285, height: 670 },
  papaye: { width: 544, height: 1000 },
  banane: { width: 666, height: 1000 },
  melon: { width: 800, height: 603 },
  pasteque: { width: 667, height: 1000 },
  "citron-vert": { width: 235, height: 598 },
  "citron-jaune": { width: 512, height: 679 },
  gombo: { width: 270, height: 249 },
  piment: { width: 705, height: 860 },
};

export const PRODUCTS = [
  {
    slug: "mangue",
    id: "mangue",
    name: "Mangue Kent",
    englishName: "Kent Mango",
    collection: "SIGNATURE",
    num: "01",
    image: "/png/prod-mangue.png",
    description:
      "Cultivée sous le soleil du Sénégal, la mangue exportée par Tropicaura est sélectionnée pour sa qualité gustative, sa tenue au transport et sa conformité aux exigences des importateurs internationaux. Selon la saison, nous proposons des mangues adaptées aux différents marchés et cahiers des charges.",
    origin: "Sénégal",
    availability: "Juin – Mi-août",
    standard: "Export Premium",
    // Fond immersif "à l'intérieur du fruit" — voir ProductDetail.jsx.
    // Uniquement Mangue pour l'instant (seule photo fournie) ; les autres
    // produits gardent leur aplat de couleur (BG_COLORS) tant qu'aucune
    // image n'est ajoutée ici — aucun changement de code nécessaire pour
    // les activer plus tard, juste renseigner ce champ.
    bgImage: {
      desktop: { webp: "/images/interior/mangue-interior.webp", jpg: "/images/interior/mangue-interior.jpg" },
      mobile: { webp: "/images/interior/mangue-interior-mobile.webp", jpg: "/images/interior/mangue-interior-mobile.jpg" },
    },
    // Teinte d'accent (signature, accents de section, glow titre/CTA) — voir
    // hexToRgba dans ProductDetail.jsx. Or/champagne, thème Mangue.
    accentColor: "#E8C878",
  },
  {
    slug: "avocat",
    id: "avocat",
    name: "Avocat",
    englishName: "Avocado",
    collection: "SIGNATURE",
    num: "02",
    image: "/png/prod-avocat.png",
    description:
      "Sélectionné au sein des principaux bassins de production d'Afrique de l'Ouest, l'avocat Tropicaura se distingue par sa maturation maîtrisée et sa texture crémeuse — deux critères déterminants pour les chaînes d'approvisionnement internationales. Une qualité régulière, disponible toute l'année, pensée pour s'intégrer aux programmes d'achat les plus exigeants.",
    origin: "Afrique de l'Ouest",
    availability: "Toute l'année",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/avocat-interior.webp", jpg: "/images/interior/avocat-interior.jpg" },
      mobile: { webp: "/images/interior/avocat-interior-mobile.webp", jpg: "/images/interior/avocat-interior-mobile.jpg" },
    },
    // Vert doré / champagne léger — thème Avocat.
    accentColor: "#C7D9A0",
  },
  {
    slug: "ananas",
    id: "ananas",
    name: "Ananas",
    englishName: "Pineapple",
    collection: "SIGNATURE",
    num: "03",
    image: "/png/prod-ananas.png",
    description:
      "Récolté dans les terroirs tropicaux d'Afrique, l'ananas Tropicaura conjugue chair juteuse et intensité aromatique avec une tenue au transport pensée pour l'export longue distance. Présentation soignée et qualité constante en font une référence sur les marchés premium, toute l'année.",
    origin: "Afrique tropicale",
    availability: "Toute l'année",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/ananas-interior.webp", jpg: "/images/interior/ananas-interior.jpg" },
      mobile: { webp: "/images/interior/ananas-interior-mobile.webp", jpg: "/images/interior/ananas-interior-mobile.jpg" },
    },
    // Jaune doré intense — thème Ananas.
    accentColor: "#F0C556",
  },
  {
    slug: "papaye",
    id: "papaye",
    name: "Papaye",
    englishName: "Papaya",
    collection: "SIGNATURE",
    num: "04",
    image: "/png/prod-papaye.png",
    description:
      "La papaye Tropicaura se reconnaît d'abord à sa couleur éclatante et à l'équilibre de sa saveur — deux repères recherchés par les circuits spécialisés. Nos équipes veillent à une qualité constante tout au long de l'année, pour répondre aux exigences des marchés les plus sélectifs.",
    origin: "Afrique tropicale",
    availability: "Toute l'année",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/papaye-interior.webp", jpg: "/images/interior/papaye-interior.jpg" },
      mobile: { webp: "/images/interior/papaye-interior-mobile.webp", jpg: "/images/interior/papaye-interior-mobile.jpg" },
    },
    // Corail / saumon doux — thème Papaye.
    accentColor: "#EFA57B",
  },
  {
    slug: "banane",
    id: "banane",
    name: "Banane",
    englishName: "Banana",
    collection: "SIGNATURE",
    num: "05",
    image: "/png/prod-banane.png",
    description:
      "Produit de volume par excellence, la banane Tropicaura repose sur une régularité d'approvisionnement et une gestion maîtrisée de la maturité — deux exigences essentielles pour la continuité des programmes d'achat internationaux. Une qualité homogène, disponible toute l'année.",
    origin: "Afrique tropicale",
    availability: "Toute l'année",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/banane-interior.webp", jpg: "/images/interior/banane-interior.jpg" },
      mobile: { webp: "/images/interior/banane-interior-mobile.webp", jpg: "/images/interior/banane-interior-mobile.jpg" },
    },
    // Jaune crème doux — thème Banane.
    accentColor: "#EEDDA0",
  },
  {
    slug: "melon",
    id: "melon",
    name: "Melon",
    englishName: "Melon",
    collection: "SAISON",
    num: "06",
    image: "/png/prod-melon.png",
    description:
      "Cultivé au Sénégal et récolté au meilleur stade de maturité, le melon Tropicaura offre une chair fondante et un équilibre sucré recherchés par les marchés européens en saison. Une spécialité de janvier à fin avril, portée par une fraîcheur qui ne se négocie pas.",
    origin: "Sénégal",
    availability: "Janvier – Fin avril",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/melon-interior.webp", jpg: "/images/interior/melon-interior.jpg" },
      mobile: { webp: "/images/interior/melon-interior-mobile.webp", jpg: "/images/interior/melon-interior-mobile.jpg" },
    },
    // Orangé doré — thème Melon.
    accentColor: "#F2B45E",
  },
  {
    slug: "pasteque",
    id: "pasteque",
    name: "Pastèque",
    englishName: "Watermelon",
    collection: "SAISON",
    num: "07",
    image: "/png/prod-pasteque.png",
    description:
      "Cultivée au Sénégal, la pastèque Tropicaura se distingue par sa texture croquante et sa qualité visuelle — calibre régulier, coloris homogène — deux critères qui comptent dès la mise en rayon. Disponible de janvier à fin avril, elle répond aux pics de demande estivale sur les marchés européens.",
    origin: "Sénégal",
    availability: "Janvier – Fin avril",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/pasteque-interior.webp", jpg: "/images/interior/pasteque-interior.jpg" },
      mobile: { webp: "/images/interior/pasteque-interior-mobile.webp", jpg: "/images/interior/pasteque-interior-mobile.jpg" },
    },
    // Rose corail vif — thème Pastèque.
    accentColor: "#EF9090",
  },
  {
    slug: "citron-vert",
    id: "citron-vert",
    name: "Citron vert",
    englishName: "Lime",
    collection: "SAISON",
    num: "08",
    image: "/png/prod-citron-vert.png",
    description:
      "Le citron vert Tropicaura, cultivé au Sénégal, se distingue par ses arômes intenses et son acidité vive — des qualités recherchées aussi bien par la restauration que par l'industrie agroalimentaire. Disponible toute l'année, avec un pic de saison entre septembre et décembre.",
    origin: "Sénégal",
    availability: "Toute l'année (Pic : Septembre – Décembre)",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/citron-vert-interior.webp", jpg: "/images/interior/citron-vert-interior.jpg" },
      mobile: { webp: "/images/interior/citron-vert-interior-mobile.webp", jpg: "/images/interior/citron-vert-interior-mobile.jpg" },
    },
    // Vert citron vif — thème Citron vert.
    accentColor: "#C8E080",
  },
  {
    slug: "citron-jaune",
    id: "citron-jaune",
    name: "Citron jaune",
    englishName: "Lemon",
    collection: "SAISON",
    num: "09",
    image: "/png/prod-citron-jaune.png",
    description:
      "Là où le citron vert mise sur l'intensité, le citron jaune Tropicaura joue la régularité : équilibre aromatique et fraîcheur constante, cultivés au Sénégal. Disponible toute l'année avec un pic de saison entre septembre et décembre, il répond aux marchés recherchant qualité et constance.",
    origin: "Sénégal",
    availability: "Toute l'année (Pic : Septembre – Décembre)",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/citron-jaune-interior.webp", jpg: "/images/interior/citron-jaune-interior.jpg" },
      mobile: { webp: "/images/interior/citron-jaune-interior-mobile.webp", jpg: "/images/interior/citron-jaune-interior-mobile.jpg" },
    },
    // Jaune citron éclatant — thème Citron jaune.
    accentColor: "#F5E08A",
  },
  {
    slug: "gombo",
    id: "gombo",
    name: "Gombo",
    englishName: "Okra",
    collection: "SPÉCIALITÉS",
    num: "10",
    image: "/png/prod-gombo.png",
    description:
      "Le gombo Tropicaura est récolté avec soin au Sénégal pour préserver sa fraîcheur et sa tendreté jusqu'à destination — deux critères que nos équipes surveillent de près, car ils se dégradent vite. Disponible toute l'année, il trouve sa place sur de nombreux marchés internationaux.",
    origin: "Sénégal",
    availability: "Toute l'année",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/gombo-interior.webp", jpg: "/images/interior/gombo-interior.jpg" },
      mobile: { webp: "/images/interior/gombo-interior-mobile.webp", jpg: "/images/interior/gombo-interior-mobile.jpg" },
    },
    // Vert frais — thème Gombo.
    accentColor: "#A8D08A",
  },
  {
    slug: "piment",
    id: "piment",
    name: "Piments",
    englishName: "Chili Peppers",
    collection: "SPÉCIALITÉS",
    num: "11",
    image: "/png/prod-piment.png",
    description:
      "Les piments Tropicaura sont disponibles en différentes variétés et niveaux de piquant selon les besoins du marché, avec une fraîcheur maîtrisée du Sénégal jusqu'à destination. Une sélection rigoureuse, disponible de mars à août, pensée pour s'adapter aux spécifications de chaque client.",
    origin: "Sénégal",
    availability: "Mars – Août",
    standard: "Export Premium",
    bgImage: {
      desktop: { webp: "/images/interior/piment-interior.webp", jpg: "/images/interior/piment-interior.jpg" },
      mobile: { webp: "/images/interior/piment-interior-mobile.webp", jpg: "/images/interior/piment-interior-mobile.jpg" },
    },
    // Rouge-orangé épicé — thème Piments.
    accentColor: "#E8896A",
  },
];

/** Contenu partagé, identique pour chaque page produit — évite la duplication de logique. */
export const PRODUCT_SHARED = {
  incoterms: ["EXW", "FOB Dakar", "CIF (selon la destination et les modalités convenues)"],
  incotermsNote:
    "Les conditions logistiques sont définies avec chaque partenaire afin de proposer la solution la plus adaptée au marché de destination.",
  packaging:
    "Conditionnement adapté au cahier des charges du client et aux exigences du marché de destination.",
  calibrage: "Défini conformément au cahier des charges et aux exigences commerciales du client.",
  // Deux variantes selon l'origine du produit (cf. getTransportText ci-dessous) :
  // les produits sénégalais partent tous du même port (Dakar), les produits
  // sourcés ailleurs en Afrique de l'Ouest/tropicale n'ont pas de port unique.
  transportSenegal:
    "Expédition maritime au départ du Port de Dakar (Sénégal) avec une gestion rigoureuse de la chaîne du froid pour les produits qui le nécessitent. Pour les expéditions urgentes, les produits premium ou les demandes spécifiques, des solutions de transport aérien peuvent également être organisées selon les besoins du client.",
  transportOtherAfrica:
    "Les expéditions sont organisées depuis le port d'origine le plus adapté, en fonction du pays de production et des contraintes logistiques. Pour les produits premium, les commandes urgentes ou les cahiers des charges spécifiques, des solutions de transport aérien peuvent également être proposées sur demande.",
  availabilityNote:
    "Les variétés proposées dépendent de la saison de récolte, des disponibilités et des exigences du marché de destination. Nos équipes sélectionnent la solution la plus adaptée à chaque demande.",
  customSolutions:
    "Chaque projet d'export présente des exigences spécifiques en matière de variété, de calibrage, de conditionnement et de logistique. Tropicaura élabore chaque offre en fonction du cahier des charges communiqué par le client afin de proposer une solution adaptée à son marché.",
  otherMarketsNote:
    "Nous étudions également les opportunités commerciales vers d'autres marchés en fonction des besoins de nos partenaires.",
  faq: [
    {
      q: "Quel est le volume minimum de commande (MOQ) ?",
      a: "Le volume minimum dépend du produit, de la saison et de la destination. Contactez notre équipe pour obtenir une proposition adaptée à votre marché.",
    },
    {
      q: "Quels Incoterms proposez-vous ?",
      a: "Nos expéditions peuvent être organisées en EXW, FOB Dakar ou CIF selon la destination et les besoins du client. Contactez notre équipe pour définir la solution logistique adaptée à votre marché.",
    },
    {
      q: "Proposez-vous des certifications qualité ?",
      a: "Les certifications disponibles varient selon le produit et le programme. Contactez-nous pour connaître les certifications applicables à votre commande.",
    },
    {
      q: "Vers quels marchés exportez-vous ?",
      a: "Nous développons un réseau de partenaires reliant l'Afrique de l'Ouest aux principaux marchés internationaux, notamment en Europe, en Amérique du Nord et au Moyen-Orient.",
    },
  ],
};

/** Texte transport adapté à l'origine du produit — voir transportSenegal/transportOtherAfrica dans PRODUCT_SHARED. */
export function getTransportText(product) {
  return product.origin === "Sénégal" ? PRODUCT_SHARED.transportSenegal : PRODUCT_SHARED.transportOtherAfrica;
}

export function getProductBySlug(slug) {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  return { ...product, ...IMAGE_DIMENSIONS[product.slug], bg: BG_COLORS[product.slug] };
}

export function getRelatedProducts(slug, count = 3) {
  const current = getProductBySlug(slug);
  const withDims = (p) => ({ ...p, ...IMAGE_DIMENSIONS[p.slug], bg: BG_COLORS[p.slug] });
  if (!current) return PRODUCTS.slice(0, count).map(withDims);
  const sameCollection = PRODUCTS.filter((p) => p.slug !== slug && p.collection === current.collection);
  const others = PRODUCTS.filter((p) => p.slug !== slug && p.collection !== current.collection);
  return [...sameCollection, ...others].slice(0, count).map(withDims);
}
