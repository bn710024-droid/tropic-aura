import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { IMAGES } from "../images";
import { getDestinationColor } from "../lib/destinationColors";

// ============================================================
//  HOME — animation organique pilotée 100% par rAF
//  Chaque fruit vit sa propre vie : sa SCALE, son OPACITÉ et sa
//  POSITION sont recalculées chaque frame selon sa place dans le
//  viewport (scrub), avec une courbe power2.out.
//   • naît petit + transparent en bas → grandit + net au centre
//     → rapetisse + s'efface en haut  (0.6→1→0.6 / 0→1→0)
//   • parallaxe : chaque profondeur a une vitesse différente
//   • flottement autonome (sin) + parallaxe souris
//   • fond avec couche de profondeur (dégradé) — plus jamais plat
//  Aucune transition CSS sur les fruits : tout est calculé.
// ============================================================

// ---- COMPOSITION (règle du "Fruit Vedette", style Combilo) ----
//  slot 0 = LA VEDETTE : énorme, parfaitement nette, moitié droite.
//  Les autres : plus petits + flous (profondeur de champ).
//  Tout est calé à DROITE / sur les bords → la colonne gauche (texte)
//  reste lisible.  imgs[0] = le fruit star de la section.
//  UNE COMPOSITION DIFFÉRENTE PAR SECTION (sinon tout se ressemble au scroll).
//  Chaque layout : slot 0 = GÉANT net devant + quelques petites taches très
//  floues dispersées. Le GÉANT change de position/taille à chaque section →
//  variété + les géants voisins ne se télescopent plus pendant la transition.
//  s = size px, b = blur px. Géant toujours à DROITE (texte à gauche dégagé).
const LAYOUTS = [
  // 0 HERO — géant centre-droite
  [ {x:68,y:48,s:380,b:0}, {x:16,y:20,s:150,b:0}, {x:92,y:24,s:185,b:0}, {x:12,y:84,s:135,b:0}, {x:90,y:82,s:200,b:0}, {x:52,y:94,s:120,b:0} ],
  // 1 MANGUES — géant bas-droite, petits en haut
  [ {x:71,y:50,s:205,b:0}, {x:20,y:18,s:160,b:0}, {x:90,y:20,s:150,b:0}, {x:46,y:13,s:140,b:0}, {x:90,y:80,s:175,b:0}, {x:52,y:87,s:150,b:0}, {x:16,y:82,s:160,b:0} ],
  // 2 ANANAS — géant haut-droite, petits en bas
  [ {x:72,y:34,s:420,b:0}, {x:16,y:70,s:150,b:0}, {x:92,y:84,s:185,b:0}, {x:50,y:92,s:135,b:0}, {x:14,y:22,s:150,b:0} ],
  // 3 AVOCATS — géant droite milieu, petits aux coins
  [ {x:78,y:56,s:410,b:0}, {x:18,y:24,s:155,b:0}, {x:46,y:12,s:140,b:0}, {x:14,y:82,s:150,b:0}, {x:92,y:86,s:185,b:0} ],
  // 4 PRIMEURS — géant centre-droite haut
  [ {x:66,y:40,s:400,b:0}, {x:20,y:66,s:150,b:0}, {x:90,y:78,s:170,b:0}, {x:90,y:22,s:160,b:0}, {x:48,y:92,s:130,b:0} ],
  // 5 EXOTIQUES — géant droite bas
  [ {x:72,y:55,s:200,b:0}, {x:16,y:20,s:150,b:0}, {x:92,y:24,s:185,b:0}, {x:48,y:12,s:140,b:0}, {x:14,y:80,s:155,b:0}, {x:90,y:82,s:170,b:0} ],
];

const ROT = [-4, 6, -5, 4, -6, 3];

// Taches FLOUES de fond, posées dans les zones vides (centre) → profondeur,
// remplit le vide sans surcharger. Elles réutilisent les fruits de la section.
const FILLERS = [
  { x: 57, y: 38, s: 175, b: 18 },
  { x: 56, y: 72, s: 155, b: 16 },
];

const build = (layout, imgs) => {
  const main = layout.map((c, i) => ({
    img: imgs[i % imgs.length],
    x: c.x, y: c.y, size: c.s, blur: c.b,
    z: i === 0 ? 4 : 1,          // slot 0 = fruit principal net
    r: ROT[i % ROT.length],
  }));
  const fill = FILLERS.map((f, i) => ({
    img: imgs[(i + 1) % imgs.length],  // réutilise un fruit de la section
    x: f.x, y: f.y, size: f.s, blur: f.b,
    z: 0,                              // tout au fond (derrière les fruits nets)
    r: ROT[i % ROT.length],
  }));
  return [...main, ...fill].filter((it) => it.img);
};

// ---- Les 6 univers ----
const SECTIONS = [
  {
    id: "hero", bg: "#0E9F6E",
    mobileBg: "#0E9F6E",
    title: "Connecter les Terres Tropicales aux Marchés Mondiaux",
    desc: "Tropicaura relie des origines tropicales d'exception aux marchés mondiaux grâce à des partenariats solides, une sélection axée sur la qualité et une vision long terme du commerce africain.",
    mobileDesc: "Nous connectons les meilleurs produits tropicaux d'Afrique aux marchés internationaux grâce à une sélection exigeante et des partenariats durables.",
    cta: "Découvrir Notre Vision",
    mobileCta: "Découvrir",
    link: "/about",
    items: build(LAYOUTS[0], [
      IMAGES.ananas,
      IMAGES.fraises, IMAGES.orange, IMAGES.avocat, IMAGES.papaye, IMAGES.citronVert,
    ]),
  },
  {
    id: "origins", bg: "#E8631C",
    mobileBg: "#E8631C",
    title: "Le Potentiel de l'Afrique. Livré Autrement.",
    desc: "Derrière chaque fruit d'exception se cache une origine d'exception. Tropicaura existe pour connecter la richesse des régions tropicales d'Afrique aux opportunités des marchés mondiaux, là où l'authenticité, la qualité et l'ambition se rencontrent.",
    mobileDesc: "Nous valorisons les meilleures origines tropicales d'Afrique en les reliant aux marchés où la qualité et la confiance font la différence.",
    cta: "Découvrir Notre Histoire",
    mobileCta: "Découvrir",
    link: "/about",
    items: build(LAYOUTS[1], [
      IMAGES.mangue,
      IMAGES.orange, IMAGES.papayeCoupe, IMAGES.fruitPassion,
      IMAGES.mangue, IMAGES.orange, IMAGES.papaye,
    ]),
  },
  {
    id: "products", bg: "#F3B500",
    mobileBg: "#F3B500",
    title: "Sélectionnés pour les Marchés Exigeants.",
    desc: "L'excellence commence bien avant qu'un produit atteigne sa destination. Nous nous concentrons sur des opportunités capables de répondre aux attentes des marchés internationaux modernes, où la qualité, la régularité et la fiabilité ne sont pas des avantages — ce sont des exigences.",
    mobileDesc: "Chaque produit est sélectionné pour répondre aux standards des marchés internationaux en matière de qualité, de régularité et de fiabilité.",
    cta: "Explorer nos Produits",
    mobileCta: "Découvrir",
    link: "/products",
    items: build(LAYOUTS[2], [
      IMAGES.ananas,
      IMAGES.melonJaune, IMAGES.banane, IMAGES.citronJaune, IMAGES.orange,
    ]),
  },
  {
    id: "partnerships", bg: "#1B7A3D",
    mobileBg: "#1B7A3D",
    title: "Plus que des Transactions.",
    desc: "Les chaînes d'approvisionnement les plus solides se construisent sur la confiance. Nous cultivons des partenariats conçus pour créer de la valeur durable, en reliant producteurs, réseaux logistiques et acheteurs internationaux autour d'un engagement commun envers l'excellence.",
    mobileDesc: "Nous développons des partenariats durables entre producteurs, logisticiens et acheteurs internationaux pour créer une valeur partagée.",
    cta: "Notre Approche Partenariale",
    mobileCta: "Découvrir",
    link: "/partnerships",
    items: build(LAYOUTS[3], [
      IMAGES.avocat,
      IMAGES.citronVert, IMAGES.citronVertCoupe, IMAGES.melonVert, IMAGES.citronJaune,
    ]),
  },
  {
    id: "vision", bg: "#C9912B",
    mobileBg: "#C9912B",
    title: "L'avenir se construit avec des partenaires qui partagent les mêmes standards.",
    mobileTitle: "L'avenir se construit avec les bons partenaires.",
    desc: "Tropicaura recherche des acteurs qui accordent autant d'importance à la qualité, à la transparence et à la vision long terme qu'à la performance commerciale.",
    mobileDesc: "Nous collaborons avec des entreprises qui partagent notre exigence de qualité, de transparence et de performance sur le long terme.",
    cta: "Découvrir nos engagements",
    mobileCta: "Découvrir",
    link: "/partenariats",
    items: build(LAYOUTS[4], [
      IMAGES.pastequeTranche,
      IMAGES.orange, IMAGES.fraises, IMAGES.fruitPassion, IMAGES.melonJaune,
    ]),
  },
  {
    id: "contact", bg: "#0D9488",
    mobileBg: "#0D9488",
    title: "Créons de Nouvelles Opportunités.",
    desc: "Chaque partenariat solide commence par une conversation. Que vous exploriez de nouvelles opportunités d'approvisionnement ou que vous recherchiez une présence de confiance en Afrique, nous sommes à votre écoute.",
    mobileDesc: "Discutons de vos besoins et construisons ensemble un partenariat durable autour des produits tropicaux africains.",
    cta: "Nous Contacter",
    mobileCta: "Découvrir",
    link: "/contact",
    items: build(LAYOUTS[5], [
      IMAGES.papayeCoupe,
      IMAGES.melonVert, IMAGES.coco, IMAGES.banane, IMAGES.melonJaune, IMAGES.papaye,
    ]),
  },
];

/* Pastèque & fruits rouges (myrtilles, fraises, fruit de la passion) sont
   gardés pour le mix d'accueil — ils ressortent sur le vert du Hero. */

// ---- Calque fruits mobile GLOBAL — RIVIÈRE À DROITE avec PROFONDEUR DE CHAMP ----
// Un seul calque fixed, parallaxe ratio 0.5 (Combilo) : screenY = topVh - 0.5*scrollVh.
// 3 plans photo : loin (26-42px, flou 3-5, estompé) · net (46-78px, focus) ·
// proche caméra (85-130px, flou 7-10, translucide, chevauchement autorisé = passe devant).
// Rotations aléatoires ±24°. Ordre du tableau = ordre de peinture (loin→net→proche).
// Généré par script : X ∈ [55%,93vw], gap max 14.5vh (aucun trou), 12-17 visibles partout,
// 0 chevauchement net/loin, 0 doublon <30vh.
// ── Composition mobile — CADRE NATUREL façon Combilo (règles 3 & 4 de l'utilisateur) ──
//    Texte au CENTRE, fruits en CADRE sur les DEUX bords (gauche + droite).
//    Profondeur de champ : GROS fruits = TRÈS FLOUS (premier plan hors focus, sur
//    les bords) ; PETITS fruits = NETS (les sujets). Rivière continue, aucune
//    notion de section. Séparation garantie par colonnes horizontales (immunes au
//    parallaxe) : fruits nets confinés aux bandes bord-gauche (≤24%) et bord-droite
//    (≥76%) ; le texte occupe le centre. Les gros flous peuvent déborder légèrement
//    hors des bords EXTÉRIEURS (bokeh atmosphérique, jamais un fruit net coupé).
//    Couverture verticale : net topVh 0-345, flou topVh 0-275.
const PARALLAX_MID = 0.5;   // plan NET (petits sujets)
const PARALLAX_SOFT = 0.35; // plan FLOU (gros, premier plan)

// PLAN NET — petits sujets parfaitement nets, en cadre sur les deux bords.
const FRUITS_MID = [
  // ── bord GAUCHE (bord droit ≤ ~24%) ──
  { src: "/png/m/mangue.png",       topVh: 12,  left: "3%",  size: 58, blur: 0, opacity: 1, rot: -5 },
  { src: "/png/m/fraises.png",      topVh: 40,  left: "2%",  size: 54, blur: 0, opacity: 1, rot: 8 },
  { src: "/png/m/citron-vert.png",  topVh: 72,  left: "5%",  size: 50, blur: 0, opacity: 1, rot: -12 },
  { src: "/png/m/myrtilles.png",    topVh: 96,  left: "4%",  size: 52, blur: 0, opacity: 1, rot: 6 },
  { src: "/png/m/avocat.png",       topVh: 128, left: "3%",  size: 56, blur: 0, opacity: 1, rot: -9 },
  { src: "/png/m/citron-jaune.png", topVh: 162, left: "6%",  size: 46, blur: 0, opacity: 1, rot: 14 },
  { src: "/png/m/coco.png",         topVh: 196, left: "2%",  size: 54, blur: 0, opacity: 1, rot: -6 },
  { src: "/png/m/orange.png",       topVh: 230, left: "5%",  size: 50, blur: 0, opacity: 1, rot: 10 },
  { src: "/png/m/fraises.png",      topVh: 264, left: "3%",  size: 56, blur: 0, opacity: 1, rot: -14 },
  { src: "/png/m/myrtilles.png",    topVh: 300, left: "4%",  size: 52, blur: 0, opacity: 1, rot: 18 },
  { src: "/png/m/avocat.png",       topVh: 338, left: "2%",  size: 54, blur: 0, opacity: 1, rot: -4 },
  // ── bord DROITE (bord gauche ≥ ~76%) ──
  { src: "/png/m/citron-jaune.png", topVh: 6,   left: "85%", size: 52, blur: 0, opacity: 1, rot: 7 },
  { src: "/png/m/orange.png",       topVh: 34,  left: "80%", size: 56, blur: 0, opacity: 1, rot: -8 },
  { src: "/png/m/mangue.png",       topVh: 66,  left: "86%", size: 48, blur: 0, opacity: 1, rot: 12 },
  { src: "/png/m/myrtilles.png",    topVh: 98,  left: "82%", size: 52, blur: 0, opacity: 1, rot: -15 },
  { src: "/png/m/citron-vert.png",  topVh: 130, left: "87%", size: 46, blur: 0, opacity: 1, rot: 5 },
  { src: "/png/m/avocat.png",       topVh: 165, left: "80%", size: 56, blur: 0, opacity: 1, rot: -18 },
  { src: "/png/m/coco.png",         topVh: 205, left: "85%", size: 50, blur: 0, opacity: 1, rot: 11 },
  { src: "/png/m/orange.png",       topVh: 240, left: "83%", size: 52, blur: 0, opacity: 1, rot: -6 },
  { src: "/png/m/fraises.png",      topVh: 278, left: "86%", size: 48, blur: 0, opacity: 1, rot: 20 },
  { src: "/png/m/myrtilles.png",    topVh: 318, left: "82%", size: 52, blur: 0, opacity: 1, rot: -10 },
  // ── CENTRE — un fruit DERRIÈRE le texte par section (le texte passe par-dessus,
  //    z:1 < texte z:10). Légèrement flous + semi-transparents → le blanc reste
  //    lisible. Ils NE SUIVENT PAS le texte : parallaxe 0.5×, ils dérivent (Combilo).
  //    topVh ≈ 49 + 50×section → tombe derrière le titre de chaque section au scroll.
  { src: "/png/m/orange.png",       topVh: 50,  left: "46%", size: 72, blur: 7, opacity: 0.3,  rot: -8 },
  { src: "/png/m/orange.png",       topVh: 100, left: "40%", size: 72, blur: 5, opacity: 0.58, rot: 10 },
  { src: "/png/m/avocat.png",       topVh: 150, left: "52%", size: 74, blur: 4, opacity: 0.6,  rot: -12 },
  { src: "/png/m/fraises.png",      topVh: 200, left: "43%", size: 68, blur: 6, opacity: 0.56, rot: 8 },
  { src: "/png/m/papaye.png",       topVh: 250, left: "50%", size: 78, blur: 5, opacity: 0.58, rot: -6 },
  { src: "/png/m/citron-vert.png",  topVh: 300, left: "42%", size: 70, blur: 6, opacity: 0.56, rot: 14 },
];

// PLAN FLOU — fruits de premier plan flous (profondeur de champ), en cadre sur
// les deux bords, format moyen pour tenir dans les bandes latérales sans mordre
// le texte ni sortir en sliver. Bord droit ≤ ~22% (gauche) / bord gauche ≥ ~78% (droite).
const FRUITS_SOFT = [
  // ── bord GAUCHE ──
  { src: "/png/m/banane.png",        topVh: 10,  left: "0%", size: 74, blur: 10, opacity: 0.5,  rot: 15 },
  { src: "/png/m/ananas.png",        topVh: 62,  left: "1%", size: 76, blur: 10, opacity: 0.5,  rot: 8 },
  { src: "/png/m/mangue.png",        topVh: 118, left: "0%", size: 72, blur: 11, opacity: 0.5,  rot: -14 },
  { src: "/png/m/pasteque.png",      topVh: 175, left: "2%", size: 70, blur: 10, opacity: 0.5,  rot: -9 },
  { src: "/png/m/papaye.png",        topVh: 228, left: "0%", size: 74, blur: 11, opacity: 0.5,  rot: 13 },
  { src: "/png/m/melon-jaune.png",   topVh: 90,  left: "8%", size: 46, blur: 8,  opacity: 0.42, rot: -7 },
  { src: "/png/m/citron-vert.png",   topVh: 200, left: "9%", size: 44, blur: 8,  opacity: 0.42, rot: 19 },
  // ── bord DROITE ──
  { src: "/png/m/fraises.png",       topVh: 34,  left: "78%", size: 74, blur: 10, opacity: 0.5,  rot: -12 },
  { src: "/png/m/ananas.png",        topVh: 92,  left: "78%", size: 76, blur: 10, opacity: 0.5,  rot: 8 },
  { src: "/png/m/melon-jaune.png",   topVh: 150, left: "79%", size: 72, blur: 11, opacity: 0.5,  rot: 14 },
  { src: "/png/m/pasteque.png",      topVh: 208, left: "80%", size: 70, blur: 10, opacity: 0.5,  rot: -19 },
  { src: "/png/m/banane.png",        topVh: 262, left: "79%", size: 72, blur: 11, opacity: 0.5,  rot: 21 },
  { src: "/png/m/orange.png",        topVh: 130, left: "88%", size: 44, blur: 8,  opacity: 0.42, rot: -6 },
  { src: "/png/m/fruit-passion.png", topVh: 245, left: "89%", size: 42, blur: 8,  opacity: 0.42, rot: -18 },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

// offsets cumulés pour indexer les fruits à plat
const OFFSETS = [];
SECTIONS.reduce((acc, s, i) => { OFFSETS[i] = acc; return acc + s.items.length; }, 0);

export default function Home() {
  const bgRef = useRef(null);
  const scenesRef = useRef([]);
  const fruitsRef = useRef([]);   // éléments .cell (plats, indexés)
  const lenisRef = useRef(null);
  const fruitsLayerRef = useRef(null);      // plan MID : rivière principale, sous le texte (parallaxe 0.5×)
  const fruitsSoftRef = useRef(null);       // plan SOFT : gros fruits flous, sous le texte aussi (parallaxe 0.35×)
  const wrapperRef = useRef(null);  // wrapper de scroll dédié mobile — html/body sont figés (overflow:hidden),
                                     // c'est CE div qui défile réellement, garantissant que les calques fruits
                                     // (fixed, hors du wrapper) restent ancrés au vrai viewport sans ambiguïté WebKit.
  const [morphTarget, setMorphTarget] = useState(null);

  // Filet de sécurité pour la parallaxe mobile : sur iOS Safari, requestAnimationFrame
  // peut être retardé pendant un geste de scroll tactile actif — un vrai listener
  // 'scroll' natif ne l'est pas. Toujours posé (pas de check isMobile au montage : un
  // redimensionnement/toggle responsive SANS rechargement laisserait ce check figé sur
  // sa valeur de montage — écrire un transform sur .fruits-layer-mobile ne coûte rien
  // et n'a aucun effet visuel sur desktop, où le calque est display:none via CSS).
  // (Ancien effet `applyParallax` supprimé — il faisait double emploi avec update()
  //  qui écrit déjà les transforms des deux calques. Un seul déclencheur mobile
  //  désormais : onNativeScrollUpdate, ci-dessous. Fini le triple write par scroll.)

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const lenis = isDesktop ? new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
    }) : null;
    lenisRef.current = lenis;

    let rafId;
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const easeOut = (t) => 1 - (1 - t) * (1 - t);  // power2.out
    const last = SECTIONS.length - 1;

    // ---- tout est INDEXÉ SUR LE SCROLL ----
    //  Aucun terme temporel : si le scroll ne bouge pas, rien ne bouge.
    //  Les fruits sont parfaitement figés au repos.
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };  // force un recalcul
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      const half = H / 2;

      // couleur de fond interpolée (fusion continue, liée au scroll)
      const prog = scroll / H;
      const i = Math.min(last, Math.floor(prog));
      const ft = Math.min(1, Math.max(0, prog - i));
      const a = COLORS[i];
      const b = COLORS[Math.min(last, i + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(a[0], b[0], ft)},${lerp(a[1], b[1], ft)},${lerp(a[2], b[2], ft)})`;
      }

      // ── PARALLAXE MOBILE : calque fruits global glisse à 50% de la vitesse du
      //    contenu (ratio 0.5, Combilo exact). Piloté par CETTE boucle rAF (lecture window.scrollY
      //    fiable — même chemin que le fondu couleur), en redondance du listener natif.
      //    Fonction PURE du scroll → figé au repos, aucune inertie temporelle.
      //    Écrit toujours (pas de gate figée sur "lenis" au montage — le calque est
      //    display:none via CSS sur desktop, écrire dessus est un no-op visuel).
      if (fruitsLayerRef.current) {
        fruitsLayerRef.current.style.transform =
          `translate3d(0, ${(-scroll * PARALLAX_MID).toFixed(1)}px, 0)`;
      }
      if (fruitsSoftRef.current) {
        fruitsSoftRef.current.style.transform =
          `translate3d(0, ${(-scroll * PARALLAX_SOFT).toFixed(1)}px, 0)`;
      }

      // Fruits DESKTOP (.cell) : ne concernent que le desktop (display:none sur
      // mobile). On saute entièrement la boucle sur mobile (!lenis) → plus aucune
      // écriture de style inutile sur ~36 éléments cachés à chaque scroll.
      if (!lenis) return;

      // chaque fruit : scale / opacity / position = fonction PURE du scroll
      const fruits = fruitsRef.current;
      for (let k = 0; k < fruits.length; k++) {
        const el = fruits[k];
        if (!el) continue;
        const ds = el.dataset;
        const si = +ds.i, y = +ds.y, size = +ds.size, baseR = +ds.r;

        const sectionTop = si * H - scroll;
        // le fruit est centré sur son point d'ancrage (marges négatives)
        const restCenterY = sectionTop + (y / 100) * H;
        // parY = 0 : chaque fruit suit EXACTEMENT sa section (flux naturel).
        // Quand une section sort par le haut, ses fruits sortent avec elle ;
        // la suivante entre par le bas. Les géants de 2 sections ne sont
        // JAMAIS au centre en même temps → ILS NE SE TOUCHENT PAS.
        const parY = 0;
        const centerY = restCenterY;

        const av = Math.abs((centerY - half) / half);
        if (av >= 1) { el.style.opacity = "0"; continue; }

        // plateau : pleine présence dans la bande centrale (av < 0.5),
        // fondu doux uniquement vers les bords haut/bas (power2.out).
        const fade = 1 - Math.min(1, Math.max(0, (av - 0.5) / 0.5));
        const e = easeOut(fade);
        el.style.opacity = e.toFixed(3);
        // scale très subtil (les tailles sont déjà fixées par la compo) :
        // la vedette reste grande et nette, ne rétrécit quasiment pas.
        el.style.transform =
          `translateY(${parY.toFixed(1)}px) scale(${(0.86 + 0.14 * e).toFixed(3)}) rotate(${baseR}deg)`;
      }
    };

    const readScroll = () => {
      if (lenis) {
        const s = lenis.animatedScroll;
        return Number.isFinite(s) ? s : (window.scrollY || 0);
      }
      // Mobile (pas de Lenis) : le wrapper dédié est le vrai scroller depuis que
      // html/body sont figés (overflow:hidden) — window.scrollY resterait bloqué à 0.
      const wrapper = wrapperRef.current;
      if (wrapper && wrapper.scrollHeight > wrapper.clientHeight) return wrapper.scrollTop;
      return window.scrollY || 0;
    };

    // Boucle rAF : DESKTOP UNIQUEMENT (pilote Lenis + les fruits .cell). Sur mobile,
    // aucun rAF continu — c'est onNativeScrollUpdate qui met tout à jour au scroll.
    const raf = (time) => {
      lenis.raf(time);
      const scroll = readScroll();
      if (Math.abs(scroll - lastScroll) > 0.04) {
        lastScroll = scroll;
        update(scroll, window.innerHeight || 1);
      }
      rafId = requestAnimationFrame(raf);
    };

    // MOBILE : l'événement 'scroll' natif déclenche, mais les écritures de style
    // sont COALESCÉES dans un rAF (une seule mise à jour par frame, calée sur le
    // paint). Sans ça, plusieurs events par frame écrivaient background-color +
    // transforms de façon synchrone au milieu du geste tactile → judder sur les
    // fruits. On lit scrollTop DANS le rAF pour la valeur la plus fraîche.
    let scrollRafId = 0;
    const onNativeScrollUpdate = () => {
      if (scrollRafId) return;                    // une frame déjà en attente → on coalesce
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        const wrapper = wrapperRef.current;
        const scroll = (wrapper && wrapper.scrollHeight > wrapper.clientHeight)
          ? wrapper.scrollTop
          : (window.scrollY || 0);
        if (Math.abs(scroll - lastScroll) > 0.04) {
          lastScroll = scroll;
          update(scroll, window.innerHeight || 1);
        }
      });
    };
    const wrapperEl = wrapperRef.current;

    // 1er rendu forcé (mobile + desktop) : couleur de fond + transforms initiaux.
    update(0, window.innerHeight || 1);

    if (lenis) {
      rafId = requestAnimationFrame(raf);                 // desktop : boucle rAF
    } else if (wrapperEl) {
      wrapperEl.addEventListener('scroll', onNativeScrollUpdate, { passive: true }); // mobile
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      window.removeEventListener("resize", onResize);
      if (wrapperEl) wrapperEl.removeEventListener('scroll', onNativeScrollUpdate);
      if (lenis) lenis.destroy();
    };
  }, []);

  // Snap mobile RETIRÉ (demande utilisateur) : le défilement mobile est désormais
  // 100% libre et naturel — momentum natif iOS, aucune pose section-par-section,
  // plus aucun effet "escalier". (CSS scroll-snap déjà retiré côté wrapper/.scene.)

  const goTo = (i) => {
    const target = scenesRef.current[Math.min(i, SECTIONS.length - 1)];
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target);
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  // Morph du CTA (mobile ET desktop) vers plein écran au tap, avant navigation.
  // Couleur du voile dérivée du fond de la page de destination (getDestinationColor).
  // prefers-reduced-motion : navigation immédiate, aucun morph.
  const handleCtaClick = (e, href, fallbackIndex) => {
    if (!href) { goTo(fallbackIndex); return; }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      window.location.href = href;
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const color = getDestinationColor(href, isMobile);

    e.preventDefault();
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    setMorphTarget({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      color,
    });
    requestAnimationFrame(() => { btn.classList.add('is-tapping'); });
    setTimeout(() => { window.location.href = href; }, 500);
    setTimeout(() => setMorphTarget(null), 700);
  };

  return (
    <>
      {/* Header fantôme — transparent, flotte par-dessus tout (ancrage marque) */}
      <header className="ghost">
        <span className="ghost__logo">Tropicaura</span>
      </header>

      {/* Fond : couleur interpolée + couche de profondeur (jamais plat) */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

      {/* Plan MID — rivière principale pleine largeur, SOUS le texte (z:1),
          parallaxe inverse 0.5× pilotée par la boucle rAF + listener scroll natif. */}
      <div className="fruits-layer-mobile" ref={fruitsLayerRef}>
        {FRUITS_MID.map((f, j) => (
          <img
            key={j}
            className="global-fruit"
            src={f.src}
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
            style={{
              top: `${f.topVh}vh`,
              left: f.left,
              width: f.size,
              filter: f.blur ? `blur(${f.blur}px)` : undefined,
              opacity: f.opacity ?? 1,
              transform: f.rot ? `rotate(${f.rot}deg)` : undefined,
            }}
          />
        ))}
      </div>

      {/* Plan SOFT — profondeur de champ : gros fruits très flous, SOUS le texte
          (z:2 < scene z:10), plus lents (0.35×) — la lourdeur flottante Combilo.
          Règle absolue : aucun fruit ne passe jamais devant une lettre ou un CTA. */}
      <div className="fruits-layer-mobile fruits-layer-mobile--soft" ref={fruitsSoftRef}>
        {FRUITS_SOFT.map((f, j) => (
          <img
            key={j}
            className="global-fruit"
            src={f.src}
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
            style={{
              top: `${f.topVh}vh`,
              left: f.left,
              width: f.size,
              filter: `blur(${f.blur}px)`,
              opacity: f.opacity,
              transform: f.rot ? `rotate(${f.rot}deg)` : undefined,
            }}
          />
        ))}
      </div>

      {/* Voile de morph CTA mobile — un seul, position/couleur pilotées par morphTarget */}
      {morphTarget && (
        <div
          className="cta-morph"
          style={{
            top: morphTarget.top,
            left: morphTarget.left,
            width: morphTarget.width,
            height: morphTarget.height,
            backgroundColor: morphTarget.color,
          }}
        />
      )}

      {/* Wrapper de scroll dédié mobile — html/body figés (overflow:hidden), c'est CE
          div qui défile. Sur desktop : display:contents (no-op total, aucune box créée,
          Lenis/scroll document inchangés). Objectif : .fruits-layer-mobile (fixed, hors
          de ce wrapper) n'a plus aucune ambiguïté avec un scroller racine WebKit. */}
      <div className="mobile-scroll-wrapper" ref={wrapperRef}>
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          data-index={i}
          data-id={s.id}
          ref={(el) => (scenesRef.current[i] = el)}
          className="scene"
          style={{ '--mobile-bg': s.mobileBg }}
        >
          <div className="rain">
            {s.items.map((it, j) => (
              <div
                key={j}
                className="cell"
                ref={(el) => (fruitsRef.current[OFFSETS[i] + j] = el)}
                data-i={i}
                data-y={it.y}
                data-size={it.size}
                data-r={it.r}
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  width: it.size,
                  height: it.size,
                  marginLeft: -it.size / 2,   /* centre le fruit sur (x, y) */
                  marginTop: -it.size / 2,
                  zIndex: it.z,
                }}
              >
                <img
                  src={it.img}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                  style={{
                    // ZÉRO ombre (la profondeur vient de l'échelle + du flou)
                    filter: it.blur ? `blur(${it.blur}px)` : "none",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="scene__content">
            <h1 className="scene__title">
              <span className="only-desktop">{s.title}</span>
              <span className="only-mobile">{s.mobileTitle || s.title}</span>
            </h1>
            <p className="scene__desc">
              <span className="only-desktop">{s.desc}</span>
              <span className="only-mobile">{s.mobileDesc || s.desc}</span>
            </p>
            <button
              className="scene__cta"
              onClick={(e) => handleCtaClick(e, s.link, i + 1)}
            >
              <span className="cta-label">
                <span className="only-desktop">{s.cta}</span>
                <span className="only-mobile">{s.mobileCta}</span>
              </span>
              <span className="cta-arrow"><span>→</span></span>
            </button>
          </div>

          {i === 0 && (
            <div className="scene__hint">
              <i />
              <span>Défilez vers le bas</span>
            </div>
          )}
        </section>
      ))}
      </div>
    </>
  );
}
