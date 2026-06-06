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
const COMPO = [
  { x: 64, y: 50, size: 460, blur: 0, speed: 1.04, z: 7, r: -5 }, // ★ VEDETTE
  { x: 13, y: 90, size: 300, blur: 5, speed: 0.94, z: 3, r: 8  }, // gros secondaire bas-gauche (flou)
  { x: 89, y: 19, size: 155, blur: 2, speed: 1.0,  z: 5, r: -4 }, // moyen haut-droite
  { x: 86, y: 82, size: 185, blur: 2, speed: 1.0,  z: 5, r: 6  }, // moyen bas-droite
  { x: 96, y: 52, size: 115, blur: 8, speed: 0.85, z: 2, r: 3  }, // petit flou extrême droite
  { x: 58, y: 8,  size: 100, blur: 9, speed: 0.84, z: 2, r: -7 }, // petit flou haut-centre
  { x: 55, y: 92, size: 105, blur: 7, speed: 0.9,  z: 2, r: 4  }, // petit flou bas-centre
  { x: 94, y: 90, size: 95,  blur: 9, speed: 0.82, z: 2, r: -6 }, // petit flou coin bas-droite
  { x: 75, y: 66, size: 88,  blur: 8, speed: 0.86, z: 2, r: 6  }, // petit flou
];

const build = (imgs) =>
  COMPO.map((c, i) => ({
    img: imgs[i % imgs.length],
    x: c.x, y: c.y, size: c.size, r: c.r,
    blur: c.blur, speed: c.speed, z: c.z,
  }));

// ---- Les 6 univers ----
const SECTIONS = [
  {
    id: "hero", bg: "#0E9F6E",
    title: "Créer des façons rafraîchissantes ensemble",
    desc: "L'offre et la demande s'équilibrent chaque jour pour offrir les meilleurs produits tropicaux frais. C'est ça, Tropic-Aura.",
    cta: "Découvrir",
    items: build([
      IMAGES.mangue,        // ★ vedette
      IMAGES.pasteque, IMAGES.ananas, IMAGES.avocat, IMAGES.citronVert,
      IMAGES.fraises, IMAGES.fruitPassion, IMAGES.orange, IMAGES.banane,
    ]),
  },
  {
    id: "mangues", bg: "#E8631C",
    title: "Mangues Kent & Keitt",
    desc: "Chair ferme, peu fibreuse, sucrosité intense. Cueillies à maturité optimale et calibrées pour les marchés européens.",
    cta: "Découvrir",
    items: build([
      IMAGES.mangue,        // ★ vedette
      IMAGES.papayeCoupe, IMAGES.mangue, IMAGES.orange,
      IMAGES.fruitPassion, IMAGES.mangue, IMAGES.orange, IMAGES.mangue, IMAGES.papaye,
    ]),
  },
  {
    id: "ananas", bg: "#F3B500",
    title: "Ananas Victoria",
    desc: "Petit format, chair dorée ultra-sucrée. Le préféré des marchés premium néerlandais et belges.",
    cta: "Découvrir",
    items: build([
      IMAGES.ananas,        // ★ vedette
      IMAGES.melonJaune, IMAGES.papaye, IMAGES.orange,
      IMAGES.melonVert, IMAGES.ananas, IMAGES.fruitPassion, IMAGES.orange, IMAGES.papayeCoupe,
    ]),
  },
  {
    id: "avocats", bg: "#1B7A3D",
    title: "Avocats Hass & Citrons verts",
    desc: "Onctuosité parfaite, agrumes gorgés de jus. Calibrés et conditionnés pour les distributeurs les plus exigeants.",
    cta: "Découvrir",
    items: build([
      IMAGES.avocat,        // ★ vedette
      IMAGES.citronVert, IMAGES.citronVertCoupe, IMAGES.citronJaune,
      IMAGES.avocat, IMAGES.citronVert, IMAGES.orange, IMAGES.citronJaune, IMAGES.avocat,
    ]),
  },
  {
    id: "primeurs", bg: "#D8392F",
    title: "Haricots verts & Gombo",
    desc: "Cultures de plein champ de la zone des Niayes. Conformité stricte aux normes LMR européennes.",
    cta: "Découvrir",
    items: build([
      IMAGES.haricots,      // ★ vedette
      IMAGES.gombo, IMAGES.haricots, IMAGES.gombo,
      IMAGES.haricots, IMAGES.gombo, IMAGES.haricots, IMAGES.gombo, IMAGES.haricots,
    ]),
  },
  {
    id: "exotiques", bg: "#E84393",
    title: "Papaye, Melon & Noix de Coco",
    desc: "La force des terroirs tropicaux d'Afrique de l'Ouest, acheminée avec une logistique zéro défaut.",
    cta: "Découvrir",
    items: build([
      IMAGES.papayeCoupe,   // ★ vedette
      IMAGES.melonVert, IMAGES.coco, IMAGES.pasteque,
      IMAGES.banane, IMAGES.myrtilles, IMAGES.melonJaune, IMAGES.pastequeTranche, IMAGES.papaye,
    ]),
  },
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
        const si = +ds.i, y = +ds.y, size = +ds.size, speed = +ds.speed, baseR = +ds.r;

        const sectionTop = si * H - scroll;
        // le fruit est centré sur son point d'ancrage (marges négatives)
        const restCenterY = sectionTop + (y / 100) * H;
        const rel = scroll - si * H;
        const parY = -rel * (speed - 1);            // parallaxe douce liée au scroll
        const centerY = restCenterY + parY;

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

    const raf = (time) => {
      lenis.raf(time);
      const scroll = lenis.animatedScroll ?? window.scrollY;
      // court-circuit : scroll immobile → on ne touche à rien (stabilité totale)
      if (Math.abs(scroll - lastScroll) > 0.04) {
        lastScroll = scroll;
        update(scroll, window.innerHeight || 1);
      }
      rafId = requestAnimationFrame(raf);
    };
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
                data-speed={it.speed}
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
                    filter:
                      `drop-shadow(0 16px 22px rgba(0,0,0,.28))` +
                      (it.blur ? ` blur(${it.blur}px)` : ""),
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
