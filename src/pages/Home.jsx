import { useEffect, useRef, useState } from "react";
import { IMAGES } from "../images";

// ============================================================
//  HOME — 6 écrans plein écran, scroll-snap + pluie de produits
//  Moteur 100% CSS/JS (zéro dépendance) :
//   • scroll-snap-type: y mandatory  → blocage net section par section
//   • cascade : chaque produit tombe du haut avec délai/vitesse propres
//   • 3 couches de profondeur (flou + parallaxe différenciés)
//   • fond qui morphe en fondu d'une section à l'autre
// ============================================================

// ---- Gabarit de positions (réutilisé par chaque section) ----
//  x / y en %, depth 1=arrière, 2=milieu, 3=premier plan (flou)
const TEMPLATE = [
  { x: 7,  y: 15, size: 165, depth: 3, delay: 0.06, dur: 1.15, r: -8, fd: 6.5 },
  { x: 80, y: 11, size: 140, depth: 3, delay: 0.14, dur: 1.25, r: 7,  fd: 7.2 },
  { x: 18, y: 58, size: 122, depth: 2, delay: 0.22, dur: 1.05, r: -4, fd: 6.0 },
  { x: 73, y: 54, size: 130, depth: 2, delay: 0.18, dur: 1.18, r: 5,  fd: 6.8 },
  { x: 48, y: 6,  size: 96,  depth: 1, delay: 0.28, dur: 0.98, r: 3,  fd: 5.6 },
  { x: 90, y: 38, size: 86,  depth: 1, delay: 0.32, dur: 1.02, r: -6, fd: 6.3 },
  { x: 4,  y: 44, size: 90,  depth: 1, delay: 0.24, dur: 1.08, r: 4,  fd: 5.9 },
  { x: 62, y: 82, size: 110, depth: 2, delay: 0.36, dur: 1.12, r: -5, fd: 6.6 },
  { x: 31, y: 85, size: 108, depth: 3, delay: 0.10, dur: 1.22, r: 6,  fd: 7.0 },
];

const DEPTH = {
  1: { blur: 1.5, op: 0.82, par: 7,  z: 1, round: "16px" },
  2: { blur: 0,   op: 1,    par: 14, z: 3, round: "22px" },
  3: { blur: 6,   op: 0.9,  par: 28, z: 8, round: "50%"  },
};

const build = (imgs) =>
  TEMPLATE.map((t, i) => {
    const d = DEPTH[t.depth];
    return {
      img: imgs[i % imgs.length],
      x: t.x, y: t.y, size: t.size,
      delay: t.delay, dur: t.dur, r: t.r, fd: t.fd,
      blur: d.blur, op: d.op, par: d.par, z: d.z, round: d.round,
    };
  });

// ---- Les 6 univers ----
const SECTIONS = [
  {
    id: "hero",
    bg: "#0E9F6E",
    title: "Créer des façons rafraîchissantes ensemble",
    desc: "L'offre et la demande s'équilibrent chaque jour pour offrir les meilleurs produits tropicaux frais. C'est ça, Tropic-Aura.",
    cta: "Découvrir",
    items: build([
      IMAGES.mangoKent, IMAGES.ananas, IMAGES.avocat, IMAGES.citron,
      IMAGES.papaye, IMAGES.banane, IMAGES.mangoCoupe, IMAGES.melonCoupe, IMAGES.mangoKeitt,
    ]),
  },
  {
    id: "mangues",
    bg: "#E8631C",
    title: "Mangues Kent & Keitt",
    desc: "Chair ferme, peu fibreuse, sucrosité intense. Cueillies à maturité optimale et calibrées pour les marchés européens.",
    cta: "Découvrir",
    items: build([
      IMAGES.mangoKent, IMAGES.mangoKeitt, IMAGES.mangoCoupe, IMAGES.mangoArbreKent,
      IMAGES.mangoVerger, IMAGES.mangoArbreKeitt, IMAGES.mangoCaisse,
    ]),
  },
  {
    id: "ananas",
    bg: "#F3B500",
    title: "Ananas Victoria",
    desc: "Petit format, chair dorée ultra-sucrée. Le préféré des marchés premium néerlandais et belges.",
    cta: "Découvrir",
    items: build([
      IMAGES.ananas, IMAGES.ananasChamp, IMAGES.ananasExport,
      IMAGES.melon, IMAGES.melonCoupe, IMAGES.papaye,
    ]),
  },
  {
    id: "avocats",
    bg: "#1B7A3D",
    title: "Avocats Hass & Citrons verts",
    desc: "Onctuosité parfaite, agrumes gorgés de jus. Calibrés et conditionnés pour les distributeurs les plus exigeants.",
    cta: "Découvrir",
    items: build([
      IMAGES.avocat, IMAGES.citron, IMAGES.citronArbre,
      IMAGES.avocat, IMAGES.citron,
    ]),
  },
  {
    id: "primeurs",
    bg: "#D8392F",
    title: "Haricots verts & Piments",
    desc: "Cultures de plein champ de la zone des Niayes. Conformité stricte aux normes LMR européennes.",
    cta: "Découvrir",
    items: build([
      IMAGES.haricots, IMAGES.haricots2, IMAGES.piments, IMAGES.capsicum,
    ]),
  },
  {
    id: "exotiques",
    bg: "#E84393",
    title: "Papaye, Melon & Noix de Coco",
    desc: "La force des terroirs tropicaux d'Afrique de l'Ouest, acheminée avec une logistique zéro défaut.",
    cta: "Découvrir",
    items: build([
      IMAGES.papaye, IMAGES.papayeArbre, IMAGES.melon, IMAGES.melonCoupe,
      IMAGES.coco, IMAGES.banane, IMAGES.pasteque,
    ]),
  },
];

export default function Home() {
  const containerRef = useRef(null);
  const scenesRef = useRef([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  // ---- Section active déterminée par la position de scroll ----
  //  Plus fiable qu'un IntersectionObserver sur un conteneur scrollable :
  //  l'index = round(scrollTop / hauteur d'écran).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const idx = Math.max(
        0,
        Math.min(SECTIONS.length - 1, Math.round(el.scrollTop / el.clientHeight))
      );
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    // cascade de la 1re section après le 1er paint
    const raf = requestAnimationFrame(() => {
      activeRef.current = -1; // force le 1er setActive
      update();
    });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ---- Parallaxe souris (uniquement la section active) ----
  useEffect(() => {
    let mx = 0, my = 0, cx = 0, cy = 0, raf;
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const scene = scenesRef.current[activeRef.current];
      if (scene) {
        scene.querySelectorAll(".cell").forEach((el) => {
          const f = Number(el.dataset.par) || 0;
          el.style.transform = `translate(${cx * f}px, ${cy * f}px)`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i) => {
    const target = scenesRef.current[Math.min(i, SECTIONS.length - 1)];
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="snap"
      ref={containerRef}
      style={{ backgroundColor: SECTIONS[active].bg }}
    >
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          data-index={i}
          ref={(el) => (scenesRef.current[i] = el)}
          className={`scene${active === i ? " active" : ""}`}
        >
          {/* Pluie de produits */}
          <div className="rain">
            {s.items.map((it, j) => (
              <div
                key={j}
                className="cell"
                data-par={it.par}
                style={{ left: `${it.x}%`, top: `${it.y}%`, zIndex: it.z }}
              >
                <div
                  className="fall"
                  style={{
                    width: it.size,
                    height: it.size,
                    transitionDelay: `${it.delay}s`,
                    transitionDuration: `${it.dur}s`,
                    "--op": it.op,
                  }}
                >
                  <div
                    className="float"
                    style={{
                      "--r": `${it.r}deg`,
                      "--fd": `${it.fd}s`,
                      animationDelay: `${(it.delay + it.dur).toFixed(2)}s`,
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
                </div>
              </div>
            ))}
          </div>

          {/* Contenu centré */}
          <div className="scene__content">
            <h1 className="scene__title">{s.title}</h1>
            <p className="scene__desc">{s.desc}</p>
            <button className="scene__cta" onClick={() => goTo(i + 1)}>
              {s.cta} <span>→</span>
            </button>
          </div>

          {/* Indice de scroll (hero uniquement) */}
          {i === 0 && (
            <div className="scene__hint">
              <span>Défilez vers le bas</span>
              <i />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
