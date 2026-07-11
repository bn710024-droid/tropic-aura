// Palette + contenu de la page À Propos — source unique de vérité,
// partagée entre le moteur desktop (APropos.jsx) et les scènes mobiles
// (AboutMobileSection.jsx). Extrait de APropos.jsx sans changement de
// valeur — pur déplacement, aucune régression attendue.

export const GOLD = "#C9A84C";
export const BLACK = "#0B0F0A";
export const IVORY = "#F2E9D8";
export const FOREST = "#122A1E";
export const SAGE = "#2E3628"; // vert sauge/olive très sombre — distinct de FOREST, légèrement plus clair
export const STONE = "#DDDAD2"; // gris minéral clair — pierre / béton poli
export const IVORY_TEXT = "rgba(242,233,216,0.82)";
export const FOREST_TEXT = "rgba(23,48,31,0.82)";

// motionVariant : indice narratif utilisé par la scène mobile pour choisir
// un rythme (voir PACE ci-dessous) — pas une mécanique différente, juste
// une nuance de tempo cohérente avec l'histoire de la section.
export const SECTIONS = [
  {
    id: "vision", num: "01", kicker: "NOTRE VISION", bg: FOREST, dark: true,
    title: "Construire davantage qu'une entreprise d'export.",
    desc: "Notre ambition est de créer une chaîne de valeur durable reliant les producteurs africains aux marchés internationaux.",
    hint: "Défiler pour découvrir",
    photo: "/images/about/vision-verger.jpg",
    photoAlt: "Verger de manguiers",
    motionVariant: "origin",
    pace: "slow",
  },
  {
    id: "aujourdhui", num: "02", kicker: "AUJOURD'HUI", bg: IVORY, dark: false,
    title: "Nous construisons un réseau fiable.",
    desc: "Chaque jour, nos équipes et partenaires travaillent pour garantir la qualité, la traçabilité et la fiabilité de nos mangues d'exportation.",
    checklist: [
      "Réseau de producteurs",
      "Préparation export",
      "Contrôle qualité",
      "Documentation export",
      "Logistique internationale",
    ],
    photo: "/images/about/today-atelier.jpg",
    photoAlt: "Atelier de conditionnement",
    motionVariant: "action",
    pace: "normal",
  },
  {
    id: "demain", num: "03", kicker: "DEMAIN", bg: SAGE, dark: true,
    title: "Nous préparons la croissance.",
    desc: "Nous investissons dans nos capacités, nos infrastructures et nos partenariats pour répondre à une demande internationale croissante.",
    photo: "/images/about/demain-conditionnement.jpg",
    photoAlt: "Ligne de conditionnement Tropicaura",
    motionVariant: "timeline",
    pace: "normal",
  },
  {
    id: "ambition", num: "04", kicker: "NOTRE AMBITION", bg: STONE, dark: false,
    title: "Investir pour créer plus de valeur.",
    desc: "Nous souhaitons investir progressivement dans la transformation, réduire les pertes post-récolte et créer plus de valeur pour nos partenaires et pour les marchés.",
    photo: "/images/about/ambition-site.jpg",
    photoAlt: "Site industriel Tropicaura",
    photoPosition: "62% 50%",
    motionVariant: "investment",
    pace: "normal",
  },
  {
    id: "avenir", num: "05", kicker: "NOTRE AVENIR", bg: BLACK, dark: true,
    title: "Relier l'Afrique aux marchés du monde.",
    desc: "Depuis Dakar, nous connectons nos producteurs aux plus grands ports et marchés internationaux avec efficacité et transparence.",
    photo: "/images/about/avenir-port-dakar.jpg",
    photoAlt: "Port de Dakar",
    motionVariant: "network",
    pace: "normal",
  },
  {
    id: "engagement", num: "06", kicker: "NOTRE ENGAGEMENT", bg: IVORY, dark: false,
    title: "Des relations durables basées sur la confiance.",
    desc: "Nous construisons des partenariats solides et transparents avec nos producteurs, nos clients et nos collaborateurs.",
    photo: "/images/about/engagement-partenariat.jpg",
    photoAlt: "Équipe Tropicaura et partenaire dans un verger de manguiers",
    calm: true,
    motionVariant: "calm",
    pace: "slow",
  },
];

// Rythme relatif — multiplie les durées du Motion System pour les
// sections qui doivent "respirer" davantage (ouverture et clôture du
// récit) sans dupliquer le système d'animation lui-même.
export const PACE = {
  slow: 1.18,
  normal: 1,
};
