// Contenu + palette de la page Partenariats — refonte "moins de sections,
// plus mémorable" (5 scènes : Hero, Vision, Parcours, Photo, Conclusion).
// Partagé entre le moteur desktop (Partenariats.jsx) et l'arbre mobile.

export const GOLD = "#C9A84C";
export const GOLD_LIGHT = "#F2D896";
export const BLACK = "#0B0F0A";
export const IVORY = "#F2E9D8";

export const SECTIONS = [
  {
    id: "hero", type: "hero", dark: true, bg: BLACK,
    photo: "/images/partenariats/hero-verger.jpg",
    photoAlt: "Deux partenaires Tropicaura marchant dans un verger de manguiers au coucher du soleil",
    title: "Des partenariats qui se construisent dans la durée.",
    subtitle: "Nous croyons que les meilleures collaborations naissent de la confiance et grandissent avec le temps.",
  },
  {
    id: "vision", type: "vision", dark: true, bg: BLACK,
    kicker: "NOTRE VISION",
    statement: "Nous savons qu'un partenariat ne se construit pas en une expédition. Il se construit au fil des conversations, des engagements tenus et de la confiance qui grandit avec le temps.",
    actions: [
      { icon: "team", title: "Comprendre votre marché", text: "Nous prenons le temps de cerner votre marché, vos contraintes et vos attentes." },
      { icon: "box", title: "Préparer chaque expédition", text: "Chaque commande est préparée avec rigueur et le même niveau d'exigence." },
      { icon: "truck", title: "Être présents après la livraison", text: "Notre accompagnement continue bien après le départ du conteneur." },
      { icon: "leaf", title: "Construire une relation durable", text: "Nous préférons une collaboration de long terme à une transaction ponctuelle." },
    ],
  },
  {
    id: "parcours", type: "timeline", dark: true, bg: BLACK,
    kicker: "NOTRE MANIÈRE DE TRAVAILLER",
    title: "Le parcours d'un partenariat",
  },
  {
    id: "expedition", type: "photo", dark: true, bg: BLACK,
    photo: "/images/partenariats/expedition-conteneur.jpg",
    photoAlt: "Conteneur rempli de cartons de mangues, prêt à quitter la station de conditionnement",
    icon: "leaf",
    title: "Chaque expédition est préparée avec le même niveau d'exigence.",
    paragraphs: [
      "Derrière chaque conteneur se trouvent des dizaines de décisions, de contrôles et de conversations qui rendent ce partenariat possible.",
    ],
  },
  {
    id: "conclusion", type: "conclusion", dark: true, bg: BLACK,
    paragraphs: [
      "Les meilleures collaborations commencent souvent par une simple conversation.",
      "Si cette vision vous parle, nous serions heureux d'échanger avec vous.",
    ],
    button: "Devenir partenaire",
    buttonHref: "/contact",
  },
];
