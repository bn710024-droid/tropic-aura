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
const build = (layout, imgs) =>
  layout.map((c, i) => ({
    img: imgs[i % imgs.length],
    x: c.x, y: c.y, size: c.s, blur: c.b,
    z: i === 0 ? 4 : 1,          // slot 0 = géant net devant les petites taches
    r: ROT[i % ROT.length],
  })).filter((it) => it.img);

// ---- Les 6 univers ----
const SECTIONS = [
  {
    id: "hero", bg: "#0E9F6E",
    title: "Créer des façons rafraîchissantes ensemble",
    desc: "L'offre et la demande s'équilibrent chaque jour pour offrir les meilleurs produits tropicaux frais. C'est ça, Tropic-Aura.",
    cta: "Découvrir",
    items: build(LAYOUTS[0], [
      IMAGES.ananas,        // ★ géant net (ananas sur le vert — pas la mangue)
      IMAGES.fraises, IMAGES.orange, IMAGES.avocat, IMAGES.papaye, IMAGES.citronVert,
    ]),
  },
  {
    id: "mangues", bg: "#E8631C",
    title: "Mangues Kent & Keitt",
    desc: "Chair ferme, peu fibreuse, sucrosité intense. Cueillies à maturité optimale et calibrées pour les marchés européens.",
    cta: "Découvrir",
    items: build(LAYOUTS[1], [
      IMAGES.mangue,        // produit principal (taille proche des autres)
      IMAGES.orange, IMAGES.papayeCoupe, IMAGES.fruitPassion,
      IMAGES.mangue, IMAGES.orange, IMAGES.papaye,   // quelques répétitions
    ]),
  },
  {
    id: "ananas", bg: "#F3B500",
    title: "Ananas Victoria",
    desc: "Petit format, chair dorée ultra-sucrée. Le préféré des marchés premium néerlandais et belges.",
    cta: "Découvrir",
    items: build(LAYOUTS[2], [
      IMAGES.ananas,        // ★ géant net
      IMAGES.melonJaune, IMAGES.banane, IMAGES.citronJaune, IMAGES.orange,
    ]),
  },
  {
    id: "avocats", bg: "#1B7A3D",
    title: "Avocats Hass & Citrons verts",
    desc: "Onctuosité parfaite, agrumes gorgés de jus. Calibrés et conditionnés pour les distributeurs les plus exigeants.",
    cta: "Découvrir",
    items: build(LAYOUTS[3], [
      IMAGES.avocat,        // ★ géant net
      IMAGES.citronVert, IMAGES.citronVertCoupe, IMAGES.melonVert, IMAGES.citronJaune,
    ]),
  },
  {
    id: "pasteque", bg: "#C9912B",
    title: "Pastèque & Fruits frais",
    desc: "Pastèques juteuses et fruits gorgés de soleil, calibrés pour l'export. Fraîcheur garantie de la récolte au conteneur.",
    cta: "Découvrir",
    items: build(LAYOUTS[4], [
      IMAGES.pastequeTranche,   // ★ géant net
      IMAGES.orange, IMAGES.fraises, IMAGES.fruitPassion, IMAGES.melonJaune,
    ]),
  },
  {
    id: "exotiques", bg: "#0D9488",
    title: "Papaye, Melon & Noix de Coco",
    desc: "La force des terroirs tropicaux d'Afrique de l'Ouest, acheminée avec une logistique zéro défaut.",
    cta: "Découvrir",
    items: build(LAYOUTS[5], [
      IMAGES.papayeCoupe,   // produit principal (taille proche des autres)
      IMAGES.melonVert, IMAGES.coco, IMAGES.banane, IMAGES.melonJaune, IMAGES.papaye,
    ]),
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
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
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
      const s = lenis.animatedScroll;
      return Number.isFinite(s) ? s : (window.scrollY || 0);  // garde anti-NaN/undefined
    };

    const raf = (time) => {
      lenis.raf(time);
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
      lenis.destroy();
    };
  }, []);

  const goTo = (i) => {
    const target = scenesRef.current[Math.min(i, SECTIONS.length - 1)];
    if (target && lenisRef.current) lenisRef.current.scrollTo(target);
  };

  return (
    <>
      {/* Header fantôme — transparent, flotte par-dessus tout (ancrage marque) */}
      <header className="ghost">
        <span className="ghost__logo">TROPIC-AURA</span>
        <button className="ghost__contact" onClick={() => goTo(SECTIONS.length - 1)}>
          Contact <span>→</span>
        </button>
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
            <h1 className="scene__title">{s.title}</h1>
            <p className="scene__desc">{s.desc}</p>
            <button className="scene__cta" onClick={() => goTo(i + 1)}>
              {s.cta} <span>→</span>
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
