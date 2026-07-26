import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Lenis from "lenis";
import { IMAGES } from "../images";
import { getDestinationColor } from "../lib/destinationColors";
import { pathFor } from "../i18n/routing";
import { FRUITS_MID, FRUITS_SOFT, BLUR_PAD_RATIO, blurredFruitSrc } from "../data/mobileFruits";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, websiteSchema, webPageSchema } from "../seo/schema";

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
    link: "about",
    items: build(LAYOUTS[0], [
      IMAGES.ananas,
      IMAGES.fraises, IMAGES.orange, IMAGES.avocat, IMAGES.papaye, IMAGES.citronVert,
    ]),
  },
  {
    id: "origins", bg: "#E8631C",
    mobileBg: "#E8631C",
    link: "about",
    items: build(LAYOUTS[1], [
      IMAGES.mangue,
      IMAGES.orange, IMAGES.papayeCoupe, IMAGES.fruitPassion,
      IMAGES.mangue, IMAGES.orange, IMAGES.papaye,
    ]),
  },
  {
    id: "products", bg: "#F3B500",
    mobileBg: "#F3B500",
    link: "products",
    items: build(LAYOUTS[2], [
      IMAGES.ananas,
      IMAGES.melonJaune, IMAGES.banane, IMAGES.citronJaune, IMAGES.orange,
    ]),
  },
  {
    id: "partnerships", bg: "#1B7A3D",
    mobileBg: "#1B7A3D",
    link: "partnerships",
    items: build(LAYOUTS[3], [
      IMAGES.avocat,
      IMAGES.citronVert, IMAGES.citronVertCoupe, IMAGES.melonVert, IMAGES.citronJaune,
    ]),
  },
  {
    id: "vision", bg: "#C9912B",
    mobileBg: "#C9912B",
    link: "partnerships",
    items: build(LAYOUTS[4], [
      IMAGES.pastequeTranche,
      IMAGES.orange, IMAGES.fraises, IMAGES.fruitPassion, IMAGES.melonJaune,
    ]),
  },
  {
    id: "contact", bg: "#0D9488",
    mobileBg: "#0D9488",
    link: "contact",
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
// Parallaxe volontairement douce : à 0.5/0.35 les fruits "pleuvaient" trop vite
// au scroll (frappe à l'œil sur mobile). Abaissée pour un glissement ambiant,
// pas une pluie. Valeurs réversibles si l'on veut plus/moins de mouvement.
const PARALLAX_MID = 0.28;   // plan NET (petits sujets)
const PARALLAX_SOFT = 0.18;  // plan FLOU (gros, premier plan)

// PLANS NET/FLOU : manifeste partagé dans src/data/mobileFruits.js (source
// unique, utilisée aussi par scripts/generate-blurred-fruits.mjs qui pré-cuit
// le flou dans des WebP — voir le rationale complet là-bas).

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

// offsets cumulés pour indexer les fruits à plat
const OFFSETS = [];
SECTIONS.reduce((acc, s, i) => { OFFSETS[i] = acc; return acc + s.items.length; }, 0);

// Mémoire de scroll (voir Produits.jsx pour le même principe) : reprendre où
// l'utilisateur s'était arrêté au retour sur l'accueil. Particularité ici :
// handleCtaClick quitte la page via window.location.href (rechargement
// complet, pas une navigation React Router) — le cleanup de useEffect ne se
// déclenche donc JAMAIS à la sortie. On sauvegarde plutôt sur 'pagehide',
// seul événement fiable qui survit à un rechargement complet ou une fermeture
// d'onglet (contrairement à 'beforeunload', déconseillé et parfois bloqué).
const SCROLL_MEMORY_KEY = "scrollpos:/";

export default function Home() {
  const { t, i18n } = useTranslation();
  const bgRef = useRef(null);
  const bgFadeRef = useRef(null);  // calque de fondu opacity — voir .bg-fade-layer dans global.css
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
    const easeOut = (t) => 1 - (1 - t) * (1 - t);  // power2.out
    const last = SECTIONS.length - 1;

    // ---- tout est INDEXÉ SUR LE SCROLL ----
    //  Aucun terme temporel : si le scroll ne bouge pas, rien ne bouge.
    //  Les fruits sont parfaitement figés au repos.
    let lastScroll = -99999;
    let lastColorIndex = -1;  // évite de repeindre backgroundColor à chaque frame (voir update())

    // Hauteur RÉELLE d'une section (.scene à 100vh) : sur un vrai mobile,
    // window.innerHeight (viewport visuel) rétrécit avec la barre d'URL alors
    // que 100vh reste fixe → sans ça, l'index de section dérive au fil du scroll.
    const measureH = () => {
      const sc = document.querySelector('.scene');
      const h = sc ? sc.getBoundingClientRect().height : 0;
      return h > 0 ? h : (window.innerHeight || 1);
    };
    let secH = measureH();
    const onResize = () => { secH = measureH(); lastScroll = -99999; };  // force un recalcul
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      const half = H / 2;

      // couleur de fond interpolée (fusion continue, liée au scroll) — le
      // fondu lui-même est un opacity (compositor-only, pas de repaint) sur
      // .bg-fade-layer ; seul le changement d'INDEX de section (rare, ~1 fois
      // par écran, pas à chaque frame) repeint les deux backgroundColor. Avant
      // ce correctif, backgroundColor était réécrit à chaque frame de scroll
      // (repaint continu), visible en judder à travers les fruits semi-
      // transparents posés juste au-dessus de ce calque.
      const prog = scroll / H;
      const i = Math.min(last, Math.floor(prog));
      const ft = Math.min(1, Math.max(0, prog - i));
      const a = COLORS[i];
      const b = COLORS[Math.min(last, i + 1)];
      if (i !== lastColorIndex) {
        lastColorIndex = i;
        if (bgRef.current) bgRef.current.style.backgroundColor = `rgb(${a[0]},${a[1]},${a[2]})`;
        if (bgFadeRef.current) bgFadeRef.current.style.backgroundColor = `rgb(${b[0]},${b[1]},${b[2]})`;
      }
      if (bgFadeRef.current) bgFadeRef.current.style.opacity = ft.toFixed(3);

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
        update(scroll, secH);
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
          update(scroll, secH);
        }
      });
    };
    const wrapperEl = wrapperRef.current;

    const savePosition = () => sessionStorage.setItem(SCROLL_MEMORY_KEY, String(readScroll()));

    // Restauration : reprend la position quittée si elle existe (voir
    // Produits.jsx pour le même principe — ici en plus mobile-wrapper-aware).
    const savedY = Number(sessionStorage.getItem(SCROLL_MEMORY_KEY));
    if (savedY > 0) {
      if (lenis) lenis.scrollTo(savedY, { immediate: true });
      else if (wrapperEl) wrapperEl.scrollTop = savedY;
      else window.scrollTo(0, savedY);
      lastScroll = savedY;
      update(savedY, secH);
    } else {
      // 1er rendu forcé (mobile + desktop) : couleur de fond + transforms initiaux.
      update(0, secH);
    }

    if (lenis) {
      rafId = requestAnimationFrame(raf);                 // desktop : boucle rAF
    } else if (wrapperEl) {
      wrapperEl.addEventListener('scroll', onNativeScrollUpdate, { passive: true }); // mobile
    }

    // 'pagehide' plutôt que 'beforeunload' : seul événement fiable qui se
    // déclenche à la fois sur rechargement complet (handleCtaClick) ET sur
    // fermeture d'onglet, sans bloquer le bfcache ni la navigation.
    window.addEventListener('pagehide', savePosition);

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener('pagehide', savePosition);
      if (wrapperEl) wrapperEl.removeEventListener('scroll', onNativeScrollUpdate);
      savePosition();
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
    // Transition rapide (voir .cta-morph, 220ms) : navigation à ~190ms pour une
    // réponse immédiate au clic. Rapidité > effet.
    setTimeout(() => { window.location.href = href; }, 190);
    setTimeout(() => setMorphTarget(null), 400);
  };

  // SEO — le titre et la description mènent avec « Exportateur » + « Sénégal » :
  // c'est la requête à intention d'achat réelle des importateurs (« exportateur
  // fruits Sénégal », « Senegal mango exporter »), là où « Afrique de l'Ouest »
  // est trop vague et n'était porté par aucune recherche. Nommer explicitement
  // le métier (exportateur, pas intermédiaire) et les produits phares évite en
  // plus que Google résume l'activité en « courtier / négociant ».
  // Le slogan « vergers → marchés internationaux » reste le message de marque
  // à l'écran (hero) ; en SERP la priorité est la qualification, pas le slogan.
  // Chaque langue a son titre/description propres (voir les fichiers i18n) :
  // la version EN mène sur « Senegal » + « exporter », requête réelle des
  // acheteurs anglophones. Longueurs tenues sous les limites d'affichage
  // (titre ≤ 60, description ≤ 155) — des descriptions trop longues avaient
  // déjà été signalées en erreur par Bing Webmaster Tools et corrigées.
  const isEnglish = i18n.language === "en";
  const homeDescription = t("home.seo.description");
  const homePath = isEnglish ? "/en" : "/";
  const homeKeywords = isEnglish
    ? ["Senegal fruit exporter", "fresh produce exporter Senegal", "mango exporter Africa", "green beans okra export", "B2B fruit supplier West Africa", "FOB Dakar"]
    : ["exportateur fruits Sénégal", "exportateur légumes Sénégal", "export mangue Sénégal", "fournisseur fruits frais Afrique", "Senegal fruit exporter", "export haricot vert gombo", "FOB Dakar"];

  return (
    <>
      <SEOHead
        title={t("home.seo.title")}
        description={homeDescription}
        path={homePath}
        keywords={homeKeywords}
        jsonLd={[organizationSchema(), websiteSchema(), webPageSchema({ path: homePath, title: "Tropicaura", description: homeDescription })]}
      />

      {/* Top bar complète (vitrine de l'entreprise) — les autres pages
          restent minimalistes : logo + fil d'Ariane + bouton menu, voir
          TopBar.jsx. */}
      <TopBar variant="full" />

      {/* SEO: Image avec dimensions pour validation (display:none mais présente dans HTML pré-rendu) */}
      <img
        src="/logo-mark.png"
        alt="Logo Tropicaura — Export premium de fruits et légumes d'Afrique de l'Ouest"
        width={512}
        height={512}
        style={{ display: "none" }}
      />

      {/* Fond : couleur interpolée (fondu opacity via .bg-fade-layer, voir
          update() dans l'effet ci-dessus) + couche de profondeur (jamais plat) */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-fade-layer" ref={bgFadeRef} />
      <div className="bg-depth" />

      {/* Plan MID — rivière principale pleine largeur, SOUS le texte (z:1),
          parallaxe inverse 0.5× pilotée par la boucle rAF + listener scroll natif. */}
      {/* Fruits flous : image PRÉ-FLOUTÉE (WebP généré par
          scripts/generate-blurred-fruits.mjs, marge transparente incluse) au
          lieu de filter:blur() au rendu. Trois parades runtime successives
          (padding, conteneur, couche GPU — d384738/3ca7194/82971d2) n'ont pas
          suffi sur les WebView WebKit limitées (Google iOS) : le flou revenait
          en halo carré au re-compositing après navigation. Un flou cuit dans
          le fichier ne peut pas être raté — il n'y a plus rien à calculer.
          Géométrie : l'image inclut une marge de blur×BLUR_PAD_RATIO par côté,
          d'où le décalage top/left et la largeur augmentée — le fruit visible
          garde exactement sa position/taille d'origine. */}
      <div className="fruits-layer-mobile" ref={fruitsLayerRef}>
        {FRUITS_MID.map((f, j) => {
          const pad = f.blur ? f.blur * BLUR_PAD_RATIO : 0;
          return (
            <img
              key={j}
              className="global-fruit"
              src={f.blur ? blurredFruitSrc(f) : f.src}
              alt=""
              loading="eager"
              decoding="async"
              draggable={false}
              style={{
                top: pad ? `calc(${f.topVh}vh - ${pad}px)` : `${f.topVh}vh`,
                left: pad ? `calc(${f.left} - ${pad}px)` : f.left,
                width: f.size + pad * 2,
                opacity: f.opacity ?? 1,
                transform: f.rot ? `rotate(${f.rot}deg)` : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Plan SOFT — profondeur de champ : gros fruits très flous, SOUS le texte
          (z:2 < scene z:10), plus lents (0.35×) — la lourdeur flottante Combilo.
          Règle absolue : aucun fruit ne passe jamais devant une lettre ou un CTA.
          Tous pré-floutés (voir commentaire du plan MID ci-dessus). */}
      <div className="fruits-layer-mobile fruits-layer-mobile--soft" ref={fruitsSoftRef}>
        {FRUITS_SOFT.map((f, j) => {
          const pad = f.blur * BLUR_PAD_RATIO;
          return (
            <img
              key={j}
              className="global-fruit"
              src={blurredFruitSrc(f)}
              alt=""
              loading="eager"
              decoding="async"
              draggable={false}
              style={{
                top: `calc(${f.topVh}vh - ${pad}px)`,
                left: `calc(${f.left} - ${pad}px)`,
                width: f.size + pad * 2,
                opacity: f.opacity,
                transform: f.rot ? `rotate(${f.rot}deg)` : undefined,
              }}
            />
          );
        })}
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
            {/* SEO : un seul <h1> par page (première scène) — les scènes
                suivantes utilisent <h2> pour la même classe CSS afin de
                préserver une hiérarchie de titres valide sans dupliquer
                le H1 (voir audit "H1 unique par page"). Pas de variante
                only-desktop/only-mobile ici (contrairement aux scènes
                suivantes) : la scène "hero" n'a pas de mobileTitle propre,
                donc les deux copies affichaient un texte identique —
                rendu une seule fois pour ne pas dupliquer le texte du H1
                dans le DOM. */}
            {i === 0 ? (
              <h1 className="scene__title">{t(`home.${s.id}.title`)}</h1>
            ) : (
              <h2 className="scene__title">
                <span className="only-desktop">{t(`home.${s.id}.title`)}</span>
                <span className="only-mobile">{t(`home.${s.id}.mobileTitle`, { defaultValue: t(`home.${s.id}.title`) })}</span>
              </h2>
            )}
            <p className="scene__desc">
              <span className="only-desktop">{t(`home.${s.id}.desc`)}</span>
              <span className="only-mobile">{t(`home.${s.id}.mobileDesc`, { defaultValue: t(`home.${s.id}.desc`) })}</span>
            </p>
            <button
              className="scene__cta"
              onClick={(e) => handleCtaClick(e, pathFor(s.link, i18n.language), i + 1)}
            >
              <span className="cta-label">
                <span className="only-desktop">{t(`home.${s.id}.cta`)}</span>
                <span className="only-mobile">{t(`home.${s.id}.mobileCta`)}</span>
              </span>
              <span className="cta-arrow"><span>→</span></span>
            </button>
          </div>

          {i === 0 && (
            <div className="scene__hint">
              <i />
              <span>{t("home.scrollHint")}</span>
            </div>
          )}
        </section>
      ))}
      {/* Footer DANS le wrapper : sur mobile le body est figé (overflow:hidden)
          et ce wrapper est le vrai scroller — le footer doit donc vivre ici pour
          être atteignable. Sur desktop le wrapper est display:contents (no-op),
          le footer flotte normalement après les sections. */}
      <Footer />
      </div>
    </>
  );
}
