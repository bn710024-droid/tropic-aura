import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  PRODUITS — « La Collection »
//  Galerie éditoriale premium : une œuvre par scène, photo
//  encadrée + texte. Même mécanique de scroll que les autres
//  pages (Lenis + interpolation couleur + révélation au scroll).
//  Fonds sombres « murs de galerie » pour faire ressortir les
//  photos. Mobile-first : empilement vertical, effets réduits.
// ============================================================

const SECTIONS = [
  {
    type: "intro",
    id: "cover",
    bg: "#0E100E",
    kicker: "LE SHOWROOM",
    title: "La Collection.",
    text: "Une sélection tropicale d'exception, présentée comme une exposition. Chaque produit est choisi pour sa qualité, sa régularité et sa capacité à répondre aux marchés les plus exigeants.",
  },

  // ── Signature ──────────────────────────────────────────────
  {
    type: "product", id: "mangue", side: "left", bg: "#5E2A12",
    photo: "/prod-mangue.jpg", collection: "SIGNATURE", num: "01",
    name: "Mangue Keitt",
    desc: "Chair généreuse et peu fibreuse, sucre équilibré. Le calibre et la régularité d'une mangue pensée pour l'export.",
    meta: ["Afrique de l'Ouest", "Calibre export", "Mars – Septembre"],
  },
  {
    type: "product", id: "avocat", side: "right", bg: "#1C3326",
    photo: "/prod-avocat.jpg", collection: "SIGNATURE", num: "02",
    name: "Avocat",
    desc: "Onctuosité dense, maturation maîtrisée. Une texture beurrée recherchée par les marchés les plus exigeants.",
    meta: ["Origine tropicale", "Maturation maîtrisée", "Toute l'année"],
  },
  {
    type: "product", id: "ananas", side: "left", bg: "#6B5214",
    photo: "/prod-ananas.jpg", collection: "SIGNATURE", num: "03",
    name: "Ananas",
    desc: "Parfum intense, chair juteuse et sucrée. La signature aromatique des tropiques.",
    meta: ["Origine tropicale", "Sucre élevé", "Toute l'année"],
  },
  {
    type: "product", id: "papaye", side: "right", bg: "#7A3514",
    photo: "/prod-papaye.jpg", collection: "SIGNATURE", num: "04",
    name: "Papaye",
    desc: "Chair orangée et fondante, douceur tropicale. Une fraîcheur solaire à chaque tranche.",
    meta: ["Origine tropicale", "Chair ferme", "Toute l'année"],
  },

  // ── Saison ─────────────────────────────────────────────────
  {
    type: "product", id: "melon", side: "left", bg: "#5E5226",
    photo: "/prod-melon.jpg", collection: "SAISON", num: "05",
    name: "Melon",
    desc: "Parfum délicat, chair fondante et sucrée. La gourmandise de la pleine saison.",
    meta: ["Origine tropicale", "Chair parfumée", "Saison"],
  },
  {
    type: "product", id: "pasteque", side: "right", bg: "#5A2630",
    photo: "/prod-pasteque.jpg", collection: "SAISON", num: "06",
    name: "Pastèque",
    desc: "Désaltérante, rouge éclatante et croquante. L'essence rafraîchissante de l'été.",
    meta: ["Origine tropicale", "Gros calibre", "Saison"],
  },
  {
    type: "product", id: "citron-vert", side: "left", bg: "#36511E",
    photo: "/prod-citron-vert.jpg", collection: "SAISON", num: "07",
    name: "Citron vert",
    desc: "Acidité vive et zeste aromatique. Le relief qui réveille chaque préparation.",
    meta: ["Origine tropicale", "Zeste intense", "Toute l'année"],
  },
  {
    type: "product", id: "citron-jaune", side: "right", bg: "#6B5A14",
    photo: "/png/citron-jaune.png", contain: true, collection: "SAISON", num: "08",
    name: "Citron jaune",
    desc: "Équilibre acidulé, peau parfumée. Une fraîcheur franche et lumineuse.",
    meta: ["Origine tropicale", "Peau parfumée", "Toute l'année"],
  },

  // ── Spécialités ────────────────────────────────────────────
  {
    type: "product", id: "gombo", side: "left", bg: "#243318",
    photo: "/prod-gombo.jpg", collection: "SPÉCIALITÉS", num: "09",
    name: "Gombo",
    desc: "Tendre et frais, prisé des cuisines du monde. Une spécialité maraîchère d'exception.",
    meta: ["Afrique de l'Ouest", "Récolte jeune", "Saison"],
  },
  {
    type: "product", id: "piment", side: "right", bg: "#2E4A1C",
    photo: "/prod-piment-PLACEHOLDER.jpg", collection: "SPÉCIALITÉS", num: "10",
    name: "Piment vert",
    desc: "Piquant frais et vert intense. Le caractère des terroirs tropicaux.",
    meta: ["Afrique de l'Ouest", "Frais", "Saison"],
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

// ============================================================
export default function Produits() {
  const bgRef       = useRef(null);
  const contentRefs = useRef([]);
  const dotRefs     = useRef([]);
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
    const lerp     = (a, b, t) => Math.round(a + (b - a) * t);
    const easeOut  = (t) => 1 - (1 - t) * (1 - t);
    const last     = SECTIONS.length - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      // ── couleur de fond interpolée ──
      const prog = scroll / H;
      const ci   = Math.min(last, Math.floor(prog));
      const ft   = Math.min(1, Math.max(0, prog - ci));
      const ca   = COLORS[ci];
      const cb   = COLORS[Math.min(last, ci + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(ca[0],cb[0],ft)},${lerp(ca[1],cb[1],ft)},${lerp(ca[2],cb[2],ft)})`;
      }

      // ── révélation du contenu (fenêtre qui finit avant le centrage,
      //    pour que la dernière section non dépassable arrive bien à 100 %) ──
      SECTIONS.forEach((_, j) => {
        const el = contentRefs.current[j];
        if (!el) return;
        const enter    = j * H - H * 0.60;
        const progress = Math.min(1, Math.max(0, (scroll - enter) / (H * 0.42)));
        const e        = easeOut(progress);
        if (e >= 0.999) {
          el.style.opacity = "1";
          el.style.transform = "none";
        } else {
          el.style.opacity = e.toFixed(3);
          el.style.transform = `translateY(${Math.round(30 * (1 - e))}px)`;
        }
      });

      // ── nav dots ──
      const active = Math.min(last, Math.max(0, Math.round(scroll / H)));
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width      = on ? "9px" : "6px";
        dot.style.height     = on ? "9px" : "6px";
        dot.style.background = on ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.32)";
        dot.style.boxShadow  = on ? "0 0 0 2px rgba(255,255,255,0.18)" : "none";
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
      {/* Responsive : empilement vertical sous 820px */}
      <style>{`
        @media (max-width: 820px){
          .prod-row   { flex-direction: column !important; gap: 26px !important; padding: 96px clamp(22px,7vw,40px) 60px !important; justify-content: center !important; }
          .prod-photo { width: 100% !important; height: 40vh !important; }
          .prod-text  { width: 100% !important; padding: 0 !important; }
          .prod-name  { font-size: clamp(34px, 11vw, 52px) !important; }
        }
      `}</style>

      {/* Header fantôme transparent */}
      <header className="ghost" style={{ zIndex: 200 }}>
        <span className="ghost__logo">TROPICAURA</span>
      </header>

      {/* Fond interpolé + profondeur */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

      {/* Nav dots */}
      <nav style={{
        position: "fixed", right: "clamp(14px,2vw,28px)", top: "50%",
        transform: "translateY(-50%)", zIndex: 150,
        display: "flex", flexDirection: "column", gap: 12, pointerEvents: "auto",
      }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => (dotRefs.current[i] = el)}
            onClick={() => scrollTo(i)}
            title={s.name || s.title}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(255,255,255,0.32)", border: "none",
              cursor: "pointer", padding: 0,
              transition: "width .25s, height .25s, background .25s, box-shadow .25s",
              display: "block",
            }}
          />
        ))}
      </nav>

      {/* Scènes */}
      {SECTIONS.map((s, i) => {
        // ── Scène d'intro ──
        if (s.type === "intro") {
          return (
            <section key={s.id} className="scene" style={{ justifyContent: "center" }}>
              <div
                ref={(el) => (contentRefs.current[i] = el)}
                style={{
                  opacity: 1, textAlign: "center",
                  maxWidth: "min(760px, 86vw)",
                  padding: "0 clamp(24px,6vw,60px)",
                }}
              >
                <span style={{
                  display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: ".30em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 22,
                }}>
                  {s.kicker}
                </span>
                <h1 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                  fontSize: "clamp(44px, 7vw, 92px)", lineHeight: 1.02,
                  letterSpacing: "-.04em", color: "#fff", margin: "0 0 22px",
                }}>
                  {s.title}
                </h1>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.8,
                  color: "rgba(255,255,255,0.80)", margin: "0 auto", maxWidth: 580,
                }}>
                  {s.text}
                </p>
                <div className="scene__hint" style={{ marginTop: 40 }}>
                  <i /><span>Défilez vers le bas</span>
                </div>
              </div>
            </section>
          );
        }

        // ── Scène produit ──
        const isRight = s.side === "right";
        return (
          <section key={s.id} className="scene" style={{ justifyContent: "center" }}>
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="prod-row"
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: "translateY(30px)",
                display: "flex",
                flexDirection: isRight ? "row-reverse" : "row",
                alignItems: "center",
                gap: "clamp(32px,6vw,90px)",
                width: "100%",
                maxWidth: 1280,
                padding: "0 clamp(28px,7vw,110px)",
              }}
            >
              {/* Photo encadrée */}
              <div
                className="prod-photo"
                style={{
                  width: "46%", height: "72vh", maxHeight: 720,
                  flexShrink: 0, borderRadius: 10, overflow: "hidden",
                  background: s.contain ? "rgba(0,0,0,0.22)" : "transparent",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <img
                  src={s.photo}
                  alt={s.name}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: s.contain ? "contain" : "cover",
                    objectPosition: "center",
                    padding: s.contain ? "10%" : 0,
                    display: "block",
                    filter: "saturate(1.04)",
                  }}
                />
              </div>

              {/* Texte éditorial */}
              <div className="prod-text" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: ".22em", color: "rgba(255,255,255,0.55)",
                  }}>{s.num}</span>
                  <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.30)" }} />
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: ".22em", color: "rgba(255,255,255,0.55)",
                  }}>{s.collection}</span>
                </div>

                <h2 className="prod-name" style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                  fontSize: "clamp(34px, 4.4vw, 68px)", lineHeight: 1.04,
                  letterSpacing: "-.03em", color: "#fff", margin: "0 0 18px",
                  textShadow: "0 4px 30px rgba(0,0,0,0.30)",
                }}>
                  {s.name}
                </h2>

                <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.5)", margin: "0 0 20px", borderRadius: 2 }} />

                <p style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "clamp(14px,1.25vw,16px)", lineHeight: 1.78, fontWeight: 400,
                  color: "rgba(255,255,255,0.86)", margin: "0 0 26px", maxWidth: 480,
                }}>
                  {s.desc}
                </p>

                {/* Méta */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 26px" }}>
                  {s.meta.map((m, k) => (
                    <span key={k} style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 600,
                      letterSpacing: ".10em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.62)",
                      display: "inline-flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
