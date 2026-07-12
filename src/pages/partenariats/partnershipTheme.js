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
    subtitle: "Nous croyons que les meilleures collaborations naissent de la confiance, se construisent par les actions et grandissent avec le temps.",
  },
  {
    id: "vision", type: "vision", dark: true, bg: BLACK,
    kicker: "NOTRE VISION",
    statement: "Nous savons qu'un partenariat ne se construit pas en une expédition. Il se construit au fil des conversations, des décisions prises ensemble et des engagements respectés.",
    actions: [
      { icon: "team", title: "Comprendre vos objectifs", text: "Nous prenons le temps de comprendre vos marchés, vos marges, vos contraintes logistiques et vos volumes." },
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
    title: "Chaque conteneur quitte nos partenaires avec le même niveau d'exigence, qu'il s'agisse de votre première commande ou de votre cinquantième.",
    paragraphs: [
      "Derrière chaque conteneur se trouvent des dizaines de contrôles, de décisions et d'échanges qui permettent d'expédier chaque commande dans les meilleures conditions.",
    ],
  },
  {
    id: "conclusion", type: "conclusion", dark: true, bg: BLACK,
    paragraphs: [
      "Les meilleures collaborations commencent souvent par une simple conversation.",
      "Si vous recherchez un partenaire fiable pour construire une relation durable, nous serions ravis d'échanger avec vous.",
    ],
    button: "Devenir partenaire",
    buttonHref: "/contact",
  },
];
