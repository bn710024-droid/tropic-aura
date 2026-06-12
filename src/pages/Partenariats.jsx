import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  PARTENARIATS — Option B : palette pastel, luxe européen
//  bg-layer interpolé en RAF (même mécanique que Home/About)
// ============================================================

const SECTIONS = [
  {
    id: "fondations", num: "01", surtitre: "FONDATIONS", side: "left",
    bg: "#E3F0EC",
    title: "Des fondations construites sur la confiance.",
    paragraphs: [
      "Chaque partenariat durable repose sur des fondations solides.",
      "Chez Tropic-Aura, nous croyons que le commerce international ne se résume pas à l'échange de produits. Il repose avant tout sur la confiance, la transparence et une vision commune du long terme.",
      "Nous ne recherchons pas des opportunités ponctuelles. Nous construisons des relations capables de grandir, d'évoluer et de créer de la valeur sur le long terme.",
    ],
  },
  {
    id: "reseau", num: "02", surtitre: "RÉSEAU", side: "right",
    bg: "#D8E3F2",
    title: "Un réseau qui dépasse les frontières.",
    paragraphs: [
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés.",
      "Tropic-Aura développe des relations stratégiques à travers les principales régions tropicales d'Afrique, en connectant producteurs, stations de conditionnement, partenaires logistiques, distributeurs et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème. Chaque partenariat ouvre de nouvelles opportunités.",
    ],
  },
  {
    id: "terroirs", num: "03", surtitre: "TERROIRS", side: "left",
    bg: "#D9D6E8",
    title: "Révéler le potentiel des terroirs tropicaux.",
    paragraphs: [
      "Certaines des opportunités agricoles les plus prometteuses au monde se trouvent dans les régions tropicales africaines.",
      "Tropic-Aura contribue à un avenir où ces territoires sont reconnus pour leur richesse naturelle, leur professionnalisme, leur capacité d'innovation et leur aptitude à répondre aux standards les plus exigeants du commerce mondial.",
      "Notre ambition est simple : transformer le potentiel en opportunités concrètes et créer de la valeur durable pour l'ensemble des acteurs de la chaîne.",
    ],
  },
  {
    id: "avenir", num: "04", surtitre: "AVENIR", side: "right",
    bg: "#CBBEAA",
    title: "Construire l'avenir ensemble.",
    paragraphs: [
      "Nous croyons que l'avenir du commerce tropical sera porté par des partenariats solides, une vision partagée et une collaboration durable.",
      "Tropic-Aura construit un écosystème dans lequel chaque acteur contribue à une réussite collective.",
      "Nous ne voulons pas simplement développer des relations commerciales. Nous souhaitons bâtir des alliances stratégiques capables d'accompagner la prochaine génération du commerce agricole international.",
    ],
  },
  {
    id: "cta", num: "05", surtitre: "REJOINDRE LE RÉSEAU", side: "left",
    bg: "#BFB09A",
    title: "Rejoignez un réseau qui façonne l'avenir du commerce tropical.",
    paragraphs: [
      "Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropic-Aura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité et de création de valeur.",
    ],
    hasButton: true,
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));
const N = SECTIONS.length;

// ============================================================
export default function Partenariats() {
  const bgRef       = useRef(null);
  const contentRefs = useRef([]);
  const dotRefs     = useRef([]);
  const revealed    = useRef(new Set());
  const lenisRef    = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId;
    const lerp    = (a, b, t) => Math.round(a + (b - a) * t);
    const easeOut = (t) => 1 - (1 - t) * (1 - t);
    const last    = N - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      // ── fond interpolé ──
      const prog = scroll / H;
      const ci   = Math.min(last, Math.floor(prog));
      const ft   = Math.min(1, Math.max(0, prog - ci));
      const ca   = COLORS[ci];
      const cb   = COLORS[Math.min(last, ci + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(ca[0],cb[0],ft)},${lerp(ca[1],cb[1],ft)},${lerp(ca[2],cb[2],ft)})`;
      }

      // ── fade-in contenu ──
      SECTIONS.forEach((_, j) => {
        const el = contentRefs.current[j];
        if (!el || revealed.current.has(j)) return;
        const enter    = j === 0 ? -H * 0.5 : j * H - H * 0.08;
        const progress = Math.min(1, Math.max(0, (scroll - enter) / (H * 0.28)));
        const e        = easeOut(progress);
        el.style.opacity   = e.toFixed(3);
        el.style.transform = `translateY(${(24 * (1 - e)).toFixed(1)}px)`;
        if (e >= 0.999) revealed.current.add(j);
      });

      // ── nav dots ──
      const active = Math.min(last, Math.max(0, Math.round(scroll / H)));
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width      = on ? "9px" : "6px";
        dot.style.height     = on ? "9px" : "6px";
        dot.style.background = on ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.20)";
        dot.style.boxShadow  = on ? "0 0 0 2px rgba(0,0,0,0.10)" : "none";
      });
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

  const scrollTo = (i) =>
    lenisRef.current?.scrollTo(i * window.innerHeight, { duration: 1.2 });

  return (
    <>
      {/* ── Header ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
        background: "rgba(255,255,255,0.60)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <a href="/" style={{
          pointerEvents: "auto", textDecoration: "none",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 18, letterSpacing: ".04em",
          color: "#1A1A1A",
        }}>TROPICAURA</a>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 12, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#1A1A1A",
            background: "rgba(0,0,0,0.05)",
            border: "1.5px solid rgba(0,0,0,0.16)",
            borderRadius: 100, padding: "7px 20px", cursor: "pointer",
          }}>← Accueil</span>
        </a>
      </header>

      {/* ── Fond interpolé ── */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />

      {/* ── Nav dots ── */}
      <nav style={{
        position: "fixed", right: "clamp(14px,2vw,28px)",
        top: "50%", transform: "translateY(-50%)",
        zIndex: 150, display: "flex", flexDirection: "column", gap: 12,
        pointerEvents: "auto",
      }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => (dotRefs.current[i] = el)}
            onClick={() => scrollTo(i)}
            title={s.title}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(0,0,0,0.20)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width .25s, height .25s, background .25s, box-shadow .25s",
              display: "block",
            }}
          />
        ))}
      </nav>

      {/* ── Sections ── */}
      {SECTIONS.map((s, i) => {
        const isRight = s.side === "right";
        return (
          <section
            key={s.id}
            data-index={i}
            className="scene"
            style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}
          >
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="scene__content"
              style={{
                opacity:      i === 0 ? 1 : 0,
                transform:    i === 0 ? "translateY(0)" : "translateY(24px)",
                paddingLeft:  isRight ? 16 : "clamp(24px,7vw,96px)",
                paddingRight: isRight ? "clamp(24px,7vw,96px)" : 16,
              }}
            >
              {/* Numéro + surtitre */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 10, fontWeight: 700, letterSpacing: ".26em",
                  textTransform: "uppercase", color: "rgba(0,0,0,0.35)",
                }}>{s.num}</span>
                <div style={{ width: 1, height: 24, background: "rgba(0,0,0,0.15)" }} />
                <span style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 10, fontWeight: 700, letterSpacing: ".22em",
                  textTransform: "uppercase", color: "rgba(0,0,0,0.40)",
                }}>{s.surtitre}</span>
              </div>

              {/* Titre */}
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(24px, 2.8vw, 44px)",
                lineHeight: 1.08, letterSpacing: "-.03em",
                color: "#111111",
                margin: "0 0 18px",
              }}>
                {s.title}
              </h2>

              {/* Ligne de séparation */}
              <div style={{
                width: 32, height: 1,
                background: "rgba(0,0,0,0.18)",
                margin: "0 0 20px",
              }} />

              {/* Paragraphes */}
              {s.paragraphs.map((p, pi) => (
                <p key={pi} style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  lineHeight: 1.80, fontWeight: 400,
                  color: "rgba(0,0,0,0.62)",
                  margin: pi < s.paragraphs.length - 1 ? "0 0 12px" : "0",
                }}>
                  {p}
                </p>
              ))}

              {/* Bouton CTA */}
              {s.hasButton && (
                <div style={{ marginTop: 36 }}>
                  <a href="/contact" style={{ textDecoration: "none" }}>
                    <button style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontWeight: 700, fontSize: 11,
                      letterSpacing: ".18em", textTransform: "uppercase",
                      color: "#111111",
                      background: "transparent",
                      border: "1.5px solid rgba(0,0,0,0.35)",
                      borderRadius: 100, padding: "13px 38px",
                      cursor: "pointer",
                      transition: "background .3s, border-color .3s",
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.06)";
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.60)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.35)";
                      }}
                    >
                      Devenir partenaire →
                    </button>
                  </a>
                </div>
              )}
            </div>

            {i === 0 && (
              <div className="scene__hint--dark">
                <i /><span>Défilez vers le bas</span>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
