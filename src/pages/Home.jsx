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

// ---- Gabarit de positions ----
const TEMPLATE = [
  { x: 7,  y: 15, size: 175, depth: 3, r: -8, fd: 6.5 },
  { x: 80, y: 11, size: 150, depth: 3, r: 7,  fd: 7.2 },
  { x: 18, y: 58, size: 128, depth: 2, r: -4, fd: 6.0 },
  { x: 73, y: 54, size: 138, depth: 2, r: 5,  fd: 6.8 },
  { x: 48, y: 30, size: 104, depth: 1, r: 3,  fd: 5.6 },
  { x: 90, y: 40, size: 92,  depth: 1, r: -6, fd: 6.3 },
  { x: 5,  y: 46, size: 96,  depth: 1, r: 4,  fd: 5.9 },
  { x: 62, y: 78, size: 120, depth: 2, r: -5, fd: 6.6 },
  { x: 31, y: 84, size: 116, depth: 3, r: 6,  fd: 7.0 },
];

//  depth → flou (statique), vitesse parallaxe, multiplicateur souris
const DEPTH = {
  1: { blur: 2,   speed: 0.78, par: 8,  z: 1, round: "16px" },
  2: { blur: 0,   speed: 1.0,  par: 16, z: 3, round: "22px" },
  3: { blur: 7,   speed: 1.3,  par: 30, z: 8, round: "50%"  },
};

const build = (imgs) =>
  TEMPLATE.map((t, i) => {
    const d = DEPTH[t.depth];
    return {
      img: imgs[i % imgs.length],
      x: t.x, y: t.y, size: t.size, r: t.r, fd: t.fd,
      blur: d.blur, speed: d.speed + (i % 3) * 0.03, par: d.par,
      z: d.z, round: d.round, phase: (i * 1.7) % 6.283,
    };
  });

// ---- Les 6 univers ----
const SECTIONS = [
  {
    id: "hero", bg: "#0E9F6E",
    title: "Créer des façons rafraîchissantes ensemble",
    desc: "L'offre et la demande s'équilibrent chaque jour pour offrir les meilleurs produits tropicaux frais. C'est ça, Tropic-Aura.",
    cta: "Découvrir",
    items: build([
      IMAGES.mangoKent, IMAGES.ananas, IMAGES.avocat, IMAGES.citron,
      IMAGES.papaye, IMAGES.banane, IMAGES.mangoCoupe, IMAGES.melonCoupe, IMAGES.mangoKeitt,
    ]),
  },
  {
    id: "mangues", bg: "#E8631C",
    title: "Mangues Kent & Keitt",
    desc: "Chair ferme, peu fibreuse, sucrosité intense. Cueillies à maturité optimale et calibrées pour les marchés européens.",
    cta: "Découvrir",
    items: build([
      IMAGES.mangoKent, IMAGES.mangoKeitt, IMAGES.mangoCoupe, IMAGES.mangoArbreKent,
      IMAGES.mangoVerger, IMAGES.mangoArbreKeitt, IMAGES.mangoCaisse,
    ]),
  },
  {
    id: "ananas", bg: "#F3B500",
    title: "Ananas Victoria",
    desc: "Petit format, chair dorée ultra-sucrée. Le préféré des marchés premium néerlandais et belges.",
    cta: "Découvrir",
    items: build([
      IMAGES.ananas, IMAGES.ananasChamp, IMAGES.ananasExport,
      IMAGES.melon, IMAGES.melonCoupe, IMAGES.papaye,
    ]),
  },
  {
    id: "avocats", bg: "#1B7A3D",
    title: "Avocats Hass & Citrons verts",
    desc: "Onctuosité parfaite, agrumes gorgés de jus. Calibrés et conditionnés pour les distributeurs les plus exigeants.",
    cta: "Découvrir",
    items: build([
      IMAGES.avocat, IMAGES.citron, IMAGES.citronArbre,
      IMAGES.avocat, IMAGES.citron,
    ]),
  },
  {
    id: "primeurs", bg: "#D8392F",
    title: "Haricots verts & Piments",
    desc: "Cultures de plein champ de la zone des Niayes. Conformité stricte aux normes LMR européennes.",
    cta: "Découvrir",
    items: build([
      IMAGES.haricots, IMAGES.haricots2, IMAGES.piments, IMAGES.capsicum,
    ]),
  },
  {
    id: "exotiques", bg: "#E84393",
    title: "Papaye, Melon & Noix de Coco",
    desc: "La force des terroirs tropicaux d'Afrique de l'Ouest, acheminée avec une logistique zéro défaut.",
    cta: "Découvrir",
    items: build([
      IMAGES.papaye, IMAGES.papayeArbre, IMAGES.melon, IMAGES.melonCoupe,
      IMAGES.coco, IMAGES.banane, IMAGES.pasteque,
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

    let mx = 0, my = 0, cx = 0, cy = 0, rafId;
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const easeOut = (t) => 1 - (1 - t) * (1 - t);  // power2.out
    const last = SECTIONS.length - 1;

    const raf = (time) => {
      lenis.raf(time);
      const H = window.innerHeight || 1;
      const half = H / 2;
      const scroll = lenis.animatedScroll ?? window.scrollY;

      // ---- couleur de fond interpolée (fusion continue) ----
      const prog = scroll / H;
      const i = Math.min(last, Math.floor(prog));
      const ft = Math.min(1, Math.max(0, prog - i));
      const a = COLORS[i];
      const b = COLORS[Math.min(last, i + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(a[0], b[0], ft)},${lerp(a[1], b[1], ft)},${lerp(a[2], b[2], ft)})`;
      }

      // ---- lissage parallaxe souris ----
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const tSec = time * 0.001;  // secondes

      // ---- chaque fruit : scale / opacity / position recalculés ----
      const fruits = fruitsRef.current;
      for (let k = 0; k < fruits.length; k++) {
        const el = fruits[k];
        if (!el) continue;
        const ds = el.dataset;
        const si = +ds.i, y = +ds.y, size = +ds.size;
        const speed = +ds.speed, par = +ds.par, baseR = +ds.r, phase = +ds.phase;

        // position de repos (centre) du fruit dans le viewport
        const sectionTop = si * H - scroll;
        const restCenterY = sectionTop + (y / 100) * H + size / 2;
        // parallaxe : décalage selon la profondeur
        const rel = scroll - si * H;
        const parY = -rel * (speed - 1);
        const centerY = restCenterY + parY;

        // distance normalisée au centre du viewport (0 centre, 1 bord)
        const vc = (centerY - half) / half;
        const d = Math.min(1, Math.abs(vc));

        // hors champ → invisible, on saute les calculs lourds
        if (d >= 1) { el.style.opacity = "0"; continue; }

        const e = easeOut(1 - d);          // courbe douce
        const opacity = e;                  // 0 → 1
        const scale = 0.6 + 0.4 * e;        // 0.6 → 1

        // flottement autonome (respiration)
        const fy = Math.sin(tSec * 0.9 + phase) * 9;
        const fx = Math.cos(tSec * 0.8 + phase) * 7;
        const rot = baseR + Math.sin(tSec * 0.7 + phase) * 4;

        // parallaxe souris (selon profondeur)
        const mxv = cx * par;
        const myv = cy * par;

        el.style.opacity = opacity.toFixed(3);
        el.style.transform =
          `translate(${(mxv + fx).toFixed(1)}px, ${(parY + fy + myv).toFixed(1)}px) ` +
          `scale(${scale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      lenis.destroy();
    };
  }, []);

  const goTo = (i) => {
    const target = scenesRef.current[Math.min(i, SECTIONS.length - 1)];
    if (target && lenisRef.current) lenisRef.current.scrollTo(target);
  };

  return (
    <>
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
                data-par={it.par}
                data-r={it.r}
                data-phase={it.phase}
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  width: it.size,
                  height: it.size,
                  zIndex: it.z,
                }}
              >
                <img
                  src={it.img}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                  style={{ filter: `blur(${it.blur}px)`, borderRadius: it.round }}
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
              <span>Défilez vers le bas</span>
              <i />
            </div>
          )}
        </section>
      ))}
    </>
  );
}
