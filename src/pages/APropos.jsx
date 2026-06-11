import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { IMAGES } from "../images";

// ============================================================
//  À PROPOS — même mécanique que Home (RAF + bg interpolé + fruits)
//  4 sections · couleurs chaudes · textes About · fruits tropicaux
// ============================================================

const LAYOUTS = [
  // S1 CONVICTION — ananas géant centre-droite
  [ {x:68,y:46,s:420,b:0}, {x:14,y:18,s:145,b:0}, {x:90,y:22,s:180,b:0}, {x:12,y:82,s:130,b:0}, {x:90,y:80,s:195,b:0}, {x:50,y:92,s:115,b:0} ],
  // S2 MISSION — avocat géant droite-bas
  [ {x:76,y:54,s:400,b:0}, {x:18,y:18,s:150,b:0}, {x:90,y:24,s:145,b:0}, {x:46,y:12,s:135,b:0}, {x:88,y:82,s:175,b:0}, {x:14,y:80,s:155,b:0} ],
  // S3 VISION — mangue géant haut-droite
  [ {x:72,y:32,s:410,b:0}, {x:16,y:72,s:148,b:0}, {x:92,y:82,s:182,b:0}, {x:50,y:90,s:128,b:0}, {x:14,y:22,s:148,b:0} ],
  // S4 AVENIR — ananas géant droite-milieu
  [ {x:78,y:54,s:400,b:0}, {x:18,y:22,s:152,b:0}, {x:46,y:12,s:138,b:0}, {x:14,y:80,s:148,b:0}, {x:92,y:84,s:182,b:0} ],
];

const ROT    = [-4, 6, -5, 4, -6, 3];
const FILLERS = [
  { x: 56, y: 38, s: 170, b: 18 },
  { x: 57, y: 72, s: 150, b: 16 },
];

const build = (layout, imgs) => {
  const main = layout.map((c, i) => ({
    img: imgs[i % imgs.length],
    x: c.x, y: c.y, size: c.s, blur: c.b,
    z: i === 0 ? 4 : 1,
    r: ROT[i % ROT.length],
  }));
  const fill = FILLERS.map((f, i) => ({
    img: imgs[(i + 1) % imgs.length],
    x: f.x, y: f.y, size: f.s, blur: f.b,
    z: 0,
    r: ROT[i % ROT.length],
  }));
  return [...main, ...fill].filter((it) => it.img);
};

const SECTIONS = [
  {
    id: "conviction",
    bg: "#F7ECD9",
    title: "Pourquoi Tropicaura existe",
    label: "01 · Conviction",
    desc: "Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Tropicaura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants.",
    items: build(LAYOUTS[0], [
      IMAGES.ananas, IMAGES.mangue, IMAGES.papaye, IMAGES.fraises, IMAGES.orange, IMAGES.citronVert,
    ]),
  },
  {
    id: "mission",
    bg: "#E5EEE6",
    title: "Ce que nous faisons aujourd'hui",
    label: "02 · Mission",
    desc: "Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux pour créer davantage de valeur à l'origine et bâtir un commerce plus équitable.",
    items: build(LAYOUTS[1], [
      IMAGES.avocat, IMAGES.citronVert, IMAGES.melonVert, IMAGES.citronJaune, IMAGES.citronVertCoupe, IMAGES.orange,
    ]),
  },
  {
    id: "vision",
    bg: "#EFE4D7",
    title: "Là où nous voulons aller",
    label: "03 · Vision",
    desc: "Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance et de représenter l'excellence des régions tropicales sur la scène internationale.",
    items: build(LAYOUTS[2], [
      IMAGES.mangue, IMAGES.fruitPassion, IMAGES.papayeCoupe, IMAGES.orange, IMAGES.banane,
    ]),
  },
  {
    id: "avenir",
    bg: "#E2D1AF",
    title: "Ce que nous construisons",
    label: "04 · Avenir",
    desc: "Nous imaginons un futur où les produits tropicaux africains seront recherchés pour leur excellence et leurs standards d'innovation. L'avenir ne se construit pas seul — il se construit ensemble.",
    items: build(LAYOUTS[3], [
      IMAGES.ananas, IMAGES.orange, IMAGES.melonJaune, IMAGES.banane, IMAGES.papaye,
    ]),
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS  = SECTIONS.map((s) => hexToRgb(s.bg));
const OFFSETS = [];
SECTIONS.reduce((acc, s, i) => { OFFSETS[i] = acc; return acc + s.items.length; }, 0);

// ============================================================
export default function APropos() {
  const bgRef     = useRef(null);
  const scenesRef = useRef([]);
  const fruitsRef = useRef([]);
  const lenisRef  = useRef(null);

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
    const lerp    = (a, b, t) => Math.round(a + (b - a) * t);
    const easeOut = (t) => 1 - (1 - t) * (1 - t);
    const last    = SECTIONS.length - 1;

    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      const half = H / 2;

      // fond interpolé
      const prog = scroll / H;
      const i  = Math.min(last, Math.floor(prog));
      const ft = Math.min(1, Math.max(0, prog - i));
      const a  = COLORS[i];
      const b  = COLORS[Math.min(last, i + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(a[0],b[0],ft)},${lerp(a[1],b[1],ft)},${lerp(a[2],b[2],ft)})`;
      }

      // fruits — même logique que Home
      const fruits = fruitsRef.current;
      for (let k = 0; k < fruits.length; k++) {
        const el = fruits[k];
        if (!el) continue;
        const ds    = el.dataset;
        const si    = +ds.i, y = +ds.y, baseR = +ds.r;
        const sectionTop = si * H - scroll;
        const centerY    = sectionTop + (y / 100) * H;
        const av = Math.abs((centerY - half) / half);
        if (av >= 1) { el.style.opacity = "0"; continue; }
        const fade = 1 - Math.min(1, Math.max(0, (av - 0.5) / 0.5));
        const e    = easeOut(fade);
        el.style.opacity   = e.toFixed(3);
        el.style.transform =
          `scale(${(0.86 + 0.14 * e).toFixed(3)}) rotate(${baseR}deg)`;
      }
    };

    const readScroll = () => {
      const s = lenis.animatedScroll;
      return Number.isFinite(s) ? s : (window.scrollY || 0);
    };

    const raf = (time) => {
      lenis.raf(time);
      const scroll = readScroll();
      if (Math.abs(scroll - lastScroll) > 0.04) {
        lastScroll = scroll;
        update(scroll, window.innerHeight || 1);
      }
      rafId = requestAnimationFrame(raf);
    };

    update(0, window.innerHeight || 1);
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Header ── */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        height: 66,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
        background: "transparent",
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 19, letterSpacing: ".04em",
          color: "#1A1A1A",
        }}>
          TROPICAURA
        </span>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-flex", alignItems: "center",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 13, letterSpacing: ".10em",
            textTransform: "uppercase", color: "#1A1A1A",
            background: "rgba(0,0,0,0.07)",
            border: "2px solid rgba(0,0,0,0.18)",
            borderRadius: 100, padding: "5px 5px 5px 18px", cursor: "pointer",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ── Fond interpolé + profondeur (même que Home) ── */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

      {/* ── Sections ── */}
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          data-index={i}
          ref={(el) => (scenesRef.current[i] = el)}
          className="scene"
        >
          {/* Fruits */}
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
                  left: `${it.x}%`, top: `${it.y}%`,
                  width: it.size, height: it.size,
                  marginLeft: -it.size / 2, marginTop: -it.size / 2,
                  zIndex: it.z,
                }}
              >
                <img
                  src={it.img} alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                  style={{
                    filter: it.blur
                      ? `blur(${it.blur}px)`
                      : "drop-shadow(0 8px 28px rgba(0,0,0,0.10))",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Texte */}
          <div className="scene__content">
            <span style={{
              display: "block",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 11, fontWeight: 700,
              letterSpacing: ".22em", textTransform: "uppercase",
              color: "rgba(0,0,0,0.40)", marginBottom: 14,
            }}>
              {s.label}
            </span>
            <h1 className="scene__title" style={{ color: "#1A1A1A", textShadow: "none" }}>
              {s.title}
            </h1>
            <p className="scene__desc" style={{ color: "#3A3A3A", textShadow: "none" }}>
              {s.desc}
            </p>
          </div>

          {/* Hint scroll — section 1 uniquement */}
          {i === 0 && (
            <div className="scene__hint scene__hint--dark">
              <i />
              <span>Défilez vers le bas</span>
            </div>
          )}
        </section>
      ))}
    </>
  );
}
