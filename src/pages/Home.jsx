import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { IMAGES } from "../images";

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
  [ {x:68,y:48,s:430,b:0}, {x:16,y:20,s:150,b:0}, {x:92,y:24,s:185,b:0}, {x:12,y:84,s:135,b:0}, {x:90,y:82,s:200,b:0}, {x:52,y:94,s:120,b:0} ],
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
    link: "/about",
    items: build(LAYOUTS[0], [
      IMAGES.ananas,
      IMAGES.fraises, IMAGES.orange, IMAGES.avocat, IMAGES.papaye, IMAGES.citronVert,
    ]),
    fruitsMobile: [
      // ── Couche 4 : premier plan extrême (z:4) — gros, flous 4-5px, passent DEVANT le texte
      { layer: "front", src: "/png/ananas.png",           left: "6%",  size: 150, blur: 4, opacity: 0.80, fallDur: "30s", fallDelay: "-4s",  rest: "8vh"  },
      { layer: "front", src: "/png/avocat.png",           left: "62%", size: 130, blur: 5, opacity: 0.78, fallDur: "34s", fallDelay: "-18s", rest: "55vh" },
      { layer: "front", src: "/png/pasteque-tranche.png", left: "32%", size: 112, blur: 4, opacity: 0.85, fallDur: "32s", fallDelay: "-27s", rest: "78vh" },
      // ── Couche 3 : milieu net (z:2) — sujets de lecture, rotation lente, left ≥ 56% (jamais sur le titre)
      { layer: "net", src: "/png/orange.png",        left: "64%", size: 84, blur: 0, opacity: 1, fallDur: "44s", fallDelay: "-6s",  rotDur: "12s", rest: "12vh" },
      { layer: "net", src: "/png/mangue.png",        left: "78%", size: 92, blur: 0, opacity: 1, fallDur: "48s", fallDelay: "-22s", rotDur: "14s", rest: "38vh" },
      { layer: "net", src: "/png/fruit-passion.png", left: "58%", size: 62, blur: 0, opacity: 1, fallDur: "46s", fallDelay: "-33s", rotDur: "10s", rest: "64vh" },
      { layer: "net", src: "/png/fraises.png",       left: "85%", size: 70, blur: 0, opacity: 1, fallDur: "42s", fallDelay: "-14s", rotDur: "13s", rest: "82vh" },
      // ── Couche 2 : bokeh lointain (z:1) — petits, très flous, derrière le texte
      { layer: "bokeh", src: "/png/citron-vert.png",   left: "12%", size: 40, blur: 12, opacity: 0.40, fallDur: "60s", fallDelay: "-8s",  rotate: -12, rest: "6vh"  },
      { layer: "bokeh", src: "/png/papaye.png",        left: "30%", size: 44, blur: 12, opacity: 0.38, fallDur: "64s", fallDelay: "-25s", rotate: 18,  rest: "20vh" },
      { layer: "bokeh", src: "/png/myrtilles.png",     left: "48%", size: 34, blur: 10, opacity: 0.45, fallDur: "58s", fallDelay: "-41s", rotate: 0,   rest: "34vh" },
      { layer: "bokeh", src: "/png/citron-jaune.png",  left: "72%", size: 30, blur: 14, opacity: 0.35, fallDur: "66s", fallDelay: "-15s", rotate: 24,  rest: "48vh" },
      { layer: "bokeh", src: "/png/banane.png",        left: "20%", size: 46, blur: 13, opacity: 0.32, fallDur: "62s", fallDelay: "-50s", rotate: -30, rest: "62vh" },
      { layer: "bokeh", src: "/png/coco.png",          left: "88%", size: 36, blur: 11, opacity: 0.42, fallDur: "56s", fallDelay: "-30s", rotate: 10,  rest: "76vh" },
      { layer: "bokeh", src: "/png/papaye-coupee.png", left: "40%", size: 42, blur: 12, opacity: 0.40, fallDur: "60s", fallDelay: "-46s", rotate: -20, rest: "90vh" },
    ],
  },
  {
    id: "origins", bg: "#E8631C",
    mobileBg: "#E8631C",
    title: "Le Potentiel de l'Afrique. Livré Autrement.",
    desc: "Derrière chaque fruit d'exception se cache une origine d'exception. Tropicaura existe pour connecter la richesse des régions tropicales d'Afrique aux opportunités des marchés mondiaux, là où l'authenticité, la qualité et l'ambition se rencontrent.",
    mobileDesc: "Nous valorisons les meilleures origines tropicales d'Afrique en les reliant aux marchés où la qualité et la confiance font la différence.",
    cta: "Découvrir Notre Histoire",
    link: "/about",
    items: build(LAYOUTS[1], [
      IMAGES.mangue,
      IMAGES.orange, IMAGES.papayeCoupe, IMAGES.fruitPassion,
      IMAGES.mangue, IMAGES.orange, IMAGES.papaye,
    ]),
    fruitsMobile: [
      { src: "/png/ananas.png",  position: { bottom: "-8%",  right: "-18%" }, size: "55vw", rotation:   8, blur:  0, opacity: 1.0,  zIndex: 3 },
      { src: "/png/mangue.png",  position: { top: "18%",     right: "-8%"  }, size: "32vw", rotation: -15, blur: 14, opacity: 0.5,  zIndex: 1 },
      { src: "/png/papaye.png",  position: { bottom: "30%",  left: "-18%"  }, size: "38vw", rotation: -25, blur: 14, opacity: 0.55, zIndex: 1 },
    ],
  },
  {
    id: "products", bg: "#F3B500",
    mobileBg: "#F3B500",
    title: "Sélectionnés pour les Marchés Exigeants.",
    desc: "L'excellence commence bien avant qu'un produit atteigne sa destination. Nous nous concentrons sur des opportunités capables de répondre aux attentes des marchés internationaux modernes, où la qualité, la régularité et la fiabilité ne sont pas des avantages — ce sont des exigences.",
    mobileDesc: "Chaque produit est sélectionné pour répondre aux standards des marchés internationaux en matière de qualité, de régularité et de fiabilité.",
    cta: "Explorer nos Produits",
    link: "/products",
    items: build(LAYOUTS[2], [
      IMAGES.ananas,
      IMAGES.melonJaune, IMAGES.banane, IMAGES.citronJaune, IMAGES.orange,
    ]),
    fruitsMobile: [
      { src: "/png/orange.png",       position: { top: "12%",   right: "-12%" }, size: "45vw", rotation:  20, blur:  0, opacity: 1.0, zIndex: 3 },
      { src: "/png/citron-jaune.png", position: { bottom: "8%", left: "-10%"  }, size: "28vw", rotation: -10, blur: 14, opacity: 0.5, zIndex: 1 },
    ],
  },
  {
    id: "partnerships", bg: "#1B7A3D",
    mobileBg: "#1B7A3D",
    title: "Plus que des Transactions.",
    desc: "Les chaînes d'approvisionnement les plus solides se construisent sur la confiance. Nous cultivons des partenariats conçus pour créer de la valeur durable, en reliant producteurs, réseaux logistiques et acheteurs internationaux autour d'un engagement commun envers l'excellence.",
    mobileDesc: "Nous développons des partenariats durables entre producteurs, logisticiens et acheteurs internationaux pour créer une valeur partagée.",
    cta: "Notre Approche Partenariale",
    link: "/partnerships",
    items: build(LAYOUTS[3], [
      IMAGES.avocat,
      IMAGES.citronVert, IMAGES.citronVertCoupe, IMAGES.melonVert, IMAGES.citronJaune,
    ]),
    fruitsMobile: [
      { src: "/png/fraises.png",    position: { bottom: "-12%", left: "50%"   }, size: "68vw", rotation:   0, blur:  0, opacity: 1.0, zIndex: 1, extraTransform: "translateX(-50%)" },
      { src: "/png/citron-vert.png", position: { top: "12%",   right: "-15%"  }, size: "30vw", rotation: -20, blur: 14, opacity: 0.4, zIndex: 1 },
    ],
  },
  {
    id: "vision", bg: "#C9912B",
    mobileBg: "#C9912B",
    title: "L'avenir se construit avec des partenaires qui partagent les mêmes standards.",
    mobileTitle: "L'avenir se construit avec les bons partenaires.",
    desc: "Tropicaura recherche des acteurs qui accordent autant d'importance à la qualité, à la transparence et à la vision long terme qu'à la performance commerciale.",
    mobileDesc: "Nous collaborons avec des entreprises qui partagent notre exigence de qualité, de transparence et de performance sur le long terme.",
    cta: "Découvrir nos engagements",
    link: "/univers",
    items: build(LAYOUTS[4], [
      IMAGES.pastequeTranche,
      IMAGES.orange, IMAGES.fraises, IMAGES.fruitPassion, IMAGES.melonJaune,
    ]),
    fruitsMobile: [
      { src: "/png/papaye-coupee.png", position: { top: "-10%",    right: "-12%" }, size: "50vw", rotation:  25, blur:  0, opacity: 1.0,  zIndex: 3 },
      { src: "/png/avocat.png",        position: { bottom: "15%",  left: "-15%"  }, size: "42vw", rotation: -20, blur: 14, opacity: 0.55, zIndex: 1 },
    ],
  },
  {
    id: "contact", bg: "#0D9488",
    mobileBg: "#0D9488",
    title: "Créons de Nouvelles Opportunités.",
    desc: "Chaque partenariat solide commence par une conversation. Que vous exploriez de nouvelles opportunités d'approvisionnement ou que vous recherchiez une présence de confiance en Afrique, nous sommes à votre écoute.",
    mobileDesc: "Discutons de vos besoins et construisons ensemble un partenariat durable autour des produits tropicaux africains.",
    cta: "Nous Contacter",
    link: "/contact",
    items: build(LAYOUTS[5], [
      IMAGES.papayeCoupe,
      IMAGES.melonVert, IMAGES.coco, IMAGES.banane, IMAGES.melonJaune, IMAGES.papaye,
    ]),
    fruitsMobile: [
      { src: "/png/orange.png",  position: { bottom: "-8%", right: "-8%"  }, size: "52vw", rotation:  10, blur:  0, opacity: 1.0, zIndex: 3 },
      { src: "/png/fraises.png", position: { bottom: "18%", right: "22%"  }, size: "28vw", rotation:  45, blur: 14, opacity: 0.5, zIndex: 1 },
    ],
  },
];

/* Pastèque & fruits rouges (myrtilles, fraises, fruit de la passion) sont
   gardés pour le mix d'accueil — ils ressortent sur le vert du Hero. */

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
      if (!lenis) return window.scrollY || 0;
      const s = lenis.animatedScroll;
      return Number.isFinite(s) ? s : (window.scrollY || 0);
    };

    const raf = (time) => {
      if (lenis) lenis.raf(time);
      const scroll = readScroll();
      // court-circuit : scroll immobile → on ne touche à rien (stabilité totale)
      if (Math.abs(scroll - lastScroll) > 0.04) {
        lastScroll = scroll;
        update(scroll, window.innerHeight || 1);
      }
      rafId = requestAnimationFrame(raf);
    };

    // 1er rendu forcé : les fruits reçoivent leur opacité dès le montage,
    // sans dépendre de l'état initial de Lenis.
    update(0, window.innerHeight || 1);
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (lenis) lenis.destroy();
    };
  }, []);

  const goTo = (i) => {
    const target = scenesRef.current[Math.min(i, SECTIONS.length - 1)];
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target);
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Header fantôme — transparent, flotte par-dessus tout (ancrage marque) */}
      <header className="ghost">
        <img src="/logo.png" alt="Tropicaura" style={{ height: 36, display: "block" }} />
      </header>

      {/* Fond : couleur interpolée + couche de profondeur (jamais plat) */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          data-index={i}
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

          {/* Fruits mobile — 4 couches animées (hero) ou format simple (autres sections) */}
          <div className="rain-mobile">
            {s.fruitsMobile.map((fruit, j) => {
              if (fruit.layer) {
                return (
                  <div
                    key={j}
                    className={`fwrap fwrap--${fruit.layer}`}
                    style={{
                      left: fruit.left,
                      "--rest": fruit.rest,
                      animationDuration: fruit.fallDur,
                      animationDelay: fruit.fallDelay,
                    }}
                  >
                    <img
                      src={fruit.src}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      draggable={false}
                      style={{
                        width: fruit.size,
                        filter: fruit.blur ? `blur(${fruit.blur}px)` : undefined,
                        opacity: fruit.opacity ?? 1,
                        transform: fruit.rotate ? `rotate(${fruit.rotate}deg)` : undefined,
                        animationDuration: fruit.rotDur,
                      }}
                    />
                  </div>
                );
              }
              const transforms = [
                fruit.extraTransform,
                fruit.rotation != null ? `rotate(${fruit.rotation}deg)` : null,
              ].filter(Boolean).join(' ');
              return (
                <img
                  key={j}
                  className="scene__fruit"
                  src={fruit.src}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                  style={{
                    ...fruit.position,
                    width: fruit.size,
                    transform: transforms || undefined,
                    filter: fruit.blur ? `blur(${fruit.blur}px)` : undefined,
                    opacity: fruit.opacity ?? 1,
                    zIndex: fruit.zIndex ?? 1,
                  }}
                />
              );
            })}
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
            <button className="scene__cta" onClick={() => s.link ? window.location.href = s.link : goTo(i + 1)}>
              <span className="cta-label">{s.cta}</span>
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
    </>
  );
}
