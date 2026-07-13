// Palette + contenu de la page À Propos — source unique de vérité,
// partagée entre le moteur desktop (APropos.jsx) et les scènes mobiles
// (AboutMobileSection.jsx).
//
// `desc` est un TABLEAU de paragraphes (toutes les sections en ont
// plusieurs désormais) — chaque page qui consomme SECTIONS doit mapper
// dessus plutôt que d'afficher un seul <p>.

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
    desc: [
      "Nous ne cherchons pas uniquement à exporter des fruits. Nous cherchons à augmenter la valeur créée à partir de chaque récolte africaine.",
      "Notre vision est de construire progressivement un réseau reliant les producteurs, les partenaires logistiques et les acheteurs internationaux autour d'une même exigence : qualité, traçabilité, conformité et création de valeur à chaque étape de la chaîne.",
    ],
    // Le premier paragraphe est la phrase fondatrice de Tropicaura — mise en
    // avant en doré plutôt qu'isolée dans sa propre scène (redondant avec ce
    // texte). Index dans le tableau `desc` ci-dessus.
    descHighlight: 0,
    hint: "Défiler pour découvrir",
    photo: "/images/about/vision-verger.jpg",
    photoAlt: "Verger de manguiers",
    motionVariant: "origin",
    pace: "slow",
  },
  {
    id: "aujourdhui", num: "02", kicker: "NOS FONDATIONS", bg: IVORY, dark: false,
    title: "Chaque exportation réussie repose sur une organisation rigoureuse.",
    desc: [
      "Notre priorité est de construire des bases solides. Nous développons progressivement un réseau de producteurs et de partenaires partageant les mêmes exigences de qualité, de traçabilité et de fiabilité afin de répondre durablement aux attentes des marchés internationaux.",
      "Chaque produit que nous commercialisons doit satisfaire des standards élevés de sélection, de préparation, de conformité documentaire et de coordination logistique.",
    ],
    checklist: [
      "Réseau de producteurs",
      "Contrôle qualité",
      "Traçabilité",
      "Documentation export",
      "Logistique internationale",
    ],
    photo: "/images/about/today-atelier.jpg",
    photoAlt: "Atelier de conditionnement",
    motionVariant: "action",
    pace: "normal",
  },
  {
    id: "demain", num: "03", kicker: "NOTRE DÉVELOPPEMENT", bg: SAGE, dark: true,
    title: "Préparer aujourd'hui les capacités de demain.",
    desc: [
      "Notre développement ne repose pas uniquement sur l'augmentation des volumes. Il repose sur le renforcement progressif de nos compétences, de nos partenariats et de nos capacités opérationnelles afin d'accompagner une croissance durable sur les marchés internationaux.",
      "Chaque étape construite aujourd'hui prépare les opportunités de demain.",
    ],
    photo: "/images/about/demain-conditionnement.jpg",
    photoAlt: "Ligne de conditionnement Tropicaura",
    motionVariant: "timeline",
    pace: "normal",
  },
  {
    id: "ambition", num: "04", kicker: "CRÉER PLUS DE VALEUR", bg: STONE, dark: false,
    title: "Aller au-delà de l'exportation.",
    desc: [
      "À long terme, notre ambition est de développer nos propres capacités de transformation afin de créer davantage de valeur localement.",
      "En réduisant progressivement les pertes post-récolte, en valorisant les récoltes et en développant nos propres produits et marques, nous souhaitons offrir aux marchés internationaux des produits à plus forte valeur ajoutée tout en renforçant durablement la compétitivité de notre filière.",
      "Nous considérons les producteurs comme des partenaires essentiels de cette ambition. Une chaîne de valeur durable ne peut exister sans une croissance partagée avec celles et ceux qui cultivent les produits que nous exportons.",
    ],
    photo: "/images/about/ambition-site.jpg",
    photoAlt: "Site industriel Tropicaura",
    photoPosition: "62% 50%",
    motionVariant: "investment",
    pace: "normal",
  },
  {
    id: "avenir", num: "05", kicker: "NOTRE RÉSEAU INTERNATIONAL", bg: BLACK, dark: true,
    title: "Relier l'Afrique aux marchés du monde.",
    desc: [
      "Depuis Dakar, nous développons progressivement un réseau de partenaires commerciaux et logistiques reliant les producteurs africains aux principaux marchés internationaux.",
      "Notre objectif est de faciliter la circulation des produits grâce à une organisation fondée sur la transparence, la préparation et la fiabilité, afin de construire des relations durables avec nos partenaires partout dans le monde.",
    ],
    photo: "/images/about/avenir-port-dakar.jpg",
    photoAlt: "Port de Dakar",
    motionVariant: "network",
    pace: "normal",
  },
  {
    id: "engagement", num: "06", kicker: "NOTRE ENGAGEMENT", bg: IVORY, dark: false,
    title: "La confiance se construit dans le temps.",
    desc: [
      "Nous croyons que les partenariats durables reposent sur la transparence, la constance et le respect des engagements.",
      "Chaque collaboration doit créer de la valeur pour l'ensemble des acteurs de la chaîne : producteurs, partenaires logistiques, distributeurs et acheteurs internationaux.",
      "Notre ambition est de construire une entreprise reconnue non seulement pour la qualité des produits qu'elle commercialise, mais aussi pour la qualité des relations qu'elle entretient avec chacun de ses partenaires.",
    ],
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
