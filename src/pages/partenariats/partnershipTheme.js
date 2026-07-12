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
    photo: "/images/about/engagement-partenariat.jpg",
    photoAlt: "Équipe Tropicaura et partenaire dans un verger de manguiers",
    title: "Des partenariats qui se construisent dans la durée.",
    subtitle: "Nous croyons que les meilleures collaborations naissent de la confiance et grandissent avec le temps.",
  },
  {
    id: "vision", type: "vision", dark: true, bg: BLACK,
    kicker: "NOTRE VISION DU PARTENARIAT",
    statements: [
      "Nous savons qu'un partenariat ne se construit pas en une expédition.",
      "Il se construit au fil des conversations, des engagements tenus et de la confiance qui grandit avec le temps.",
    ],
    paragraphs: [
      "Chez Tropicaura, nous travaillons avec des importateurs, des distributeurs et des partenaires qui partagent notre exigence et notre vision.",
      "Nous ne cherchons pas seulement à vendre des mangues.",
      "Nous cherchons à construire des relations solides, transparentes et durables.",
    ],
  },
  {
    id: "parcours", type: "timeline", dark: true, bg: BLACK,
    kicker: "LE PARCOURS D'UN PARTENARIAT",
    title: "Chaque collaboration suit le même chemin.",
  },
  {
    id: "expedition", type: "photo", dark: true, bg: BLACK,
    photo: "/images/about/avenir-port-dakar.jpg", // repli temporaire — voir prompt de génération dédié
    photoAlt: "Conteneur quittant la station de conditionnement",
    isPlaceholder: true,
    paragraphs: [
      "Chaque expédition est préparée avec le même niveau d'exigence.",
      "Parce que la confiance se construit dans les détails.",
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
