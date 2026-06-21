import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  PRODUITS — « La Collection »
//  Galerie éditoriale premium : chaque produit est une œuvre.
//  Fruit DÉTOURÉ qui flotte (ombre douce, dépasse du cadre),
//  fond couleur + gradient subtil « ressenti », méta éditoriale.
//  Chaque produit = un chapitre : couleur, fruit, ambiance.
//  Mobile-first. Apparitions douces au scroll.
// ============================================================

const SECTIONS = [
  {
    type: "intro", id: "cover", bg: "#0E100E",
    kicker: "LE SHOWROOM", title: "La Collection.",
    text: "Une sélection tropicale d'exception, présentée comme une exposition. Chaque produit est choisi pour sa qualité, sa régularité et sa capacité à répondre aux marchés les plus exigeants.",
  },

  // ── Signature ──
  {
    type: "product", id: "mangue", side: "left", bg: "#5E2A12",
    png: "/png/prod-mangue.png", collection: "SIGNATURE", num: "01", name: "Mangue Keitt",
    desc: "Chair généreuse et peu fibreuse, sucre équilibré. Le calibre et la régularité d'une mangue pensée pour l'export.",
    meta: { "Origine": "Afrique de l'Ouest", "Disponibilité": "Mars – Septembre", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "avocat", side: "right", bg: "#1C3326",
    png: "/png/prod-avocat.png", collection: "SIGNATURE", num: "02", name: "Avocat",
    desc: "Onctuosité dense, maturation maîtrisée. Une texture beurrée recherchée par les marchés les plus exigeants.",
    meta: { "Origine": "Afrique de l'Ouest", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "ananas", side: "left", bg: "#6B5214",
    png: "/png/prod-ananas.png", collection: "SIGNATURE", num: "03", name: "Ananas",
    desc: "Parfum intense, chair juteuse et sucrée. La signature aromatique des tropiques.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "papaye", side: "right", bg: "#7A3514", glow: "#FFC641",
    png: "/png/prod-papaye.png", collection: "SIGNATURE", num: "04", name: "Papaye",
    desc: "Chair orangée et fondante, douceur tropicale. Une fraîcheur solaire à chaque tranche.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "banane", side: "left", bg: "#6B4E12",
    png: "/png/prod-banane.png", collection: "SIGNATURE", num: "05", name: "Banane",
    desc: "Douce et nourrissante, mûrissement maîtrisé. Un classique tropical d'une régularité irréprochable.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },

  // ── Saison ──
  {
    type: "product", id: "melon", side: "right", bg: "#5E5226",
    png: "/png/prod-melon.png", collection: "SAISON", num: "06", name: "Melon",
    desc: "Parfum délicat, chair fondante et sucrée. La gourmandise de la pleine saison.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Saison", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "pasteque", side: "left", bg: "#5A2630", glow: "#DA5652",
    png: "/png/prod-pasteque.png", collection: "SAISON", num: "07", name: "Pastèque",
    desc: "Désaltérante, rouge éclatante et croquante. L'essence rafraîchissante de l'été.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Saison", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "citron-vert", side: "right", bg: "#36511E",
    png: "/png/prod-citron-vert.png", collection: "SAISON", num: "08", name: "Citron vert",
    desc: "Acidité vive et zeste aromatique. Le relief qui réveille chaque préparation.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "citron-jaune", side: "left", bg: "#6B5A14",
    png: "/png/prod-citron-jaune.png", collection: "SAISON", num: "09", name: "Citron jaune",
    desc: "Équilibre acidulé, peau parfumée. Une fraîcheur franche et lumineuse.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },

  // ── Spécialités ──
  {
    type: "product", id: "gombo", side: "right", bg: "#243318",
    png: "/png/prod-gombo.png", collection: "SPÉCIALITÉS", num: "10", name: "Gombo",
    desc: "Tendre et frais, prisé des cuisines du monde. Une spécialité maraîchère d'exception.",
    meta: { "Origine": "Afrique de l'Ouest", "Disponibilité": "Saison", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "piment", side: "left", bg: "#2E4A1C",
    png: "/png/prod-piment.png", collection: "SPÉCIALITÉS", num: "11", name: "Piment vert",
    desc: "Piquant frais et vert intense. Le caractère des terroirs tropicaux.",
    meta: { "Origine": "Afrique de l'Ouest", "Disponibilité": "Saison", "Standard": "Export Premium" },
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
      const prog = scroll / H;
      const ci   = Math.min(last, Math.floor(prog));
      const ft   = Math.min(1, Math.max(0, prog - ci));
      const ca   = COLORS[ci];
      const cb   = COLORS[Math.min(last, ci + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(ca[0],cb[0],ft)},${lerp(ca[1],cb[1],ft)},${lerp(ca[2],cb[2],ft)})`;
      }

      SECTIONS.forEach((_, j) => {
        const el = contentRefs.current[j];
        if (!el) return;
        const enter    = j * H - H * 0.60;
        const progress = Math.min(1, Math.max(0, (scroll - enter) / (H * 0.42)));
        const e        = easeOut(progress);
        if (e >= 0.999) { el.style.opacity = "1"; el.style.transform = "none"; }
        else { el.style.opacity = e.toFixed(3); el.style.transform = `translateY(${Math.round(30 * (1 - e))}px)`; }
      });

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
      if (Math.abs(scroll - lastScroll) > 0.04) { lastScroll = scroll; update(scroll, window.innerHeight || 1); }
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

  const scrollTo = (i) => lenisRef.current?.scrollTo(i * window.innerHeight, { duration: 1.2 });

  return (
    <>
      <style>{`
        .ct-grid  { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(40px,7vw,110px); }
        @keyframes prodFloat { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-16px); } }
        .prod-float { animation: prodFloat 7s ease-in-out infinite; }
        .prod-row { display:flex; align-items:center; gap:clamp(24px,5vw,80px); width:100%; max-width:1280px; padding:0 clamp(28px,7vw,110px); }
        .prod-photo { width:46%; height:72vh; max-height:720px; flex-shrink:0; position:relative; display:flex; align-items:center; justify-content:center; overflow:visible; }
        .prod-name  { font-size: clamp(34px, 4.4vw, 68px); }
        @media (max-width: 820px){
          .prod-row   { flex-direction: column !important; gap: 18px !important; padding: 96px clamp(22px,7vw,40px) 60px !important; justify-content:center !important; }
          .prod-photo { width: 100% !important; height: 36vh !important; }
          .prod-text  { width: 100% !important; }
          .prod-name  { font-size: clamp(34px, 11vw, 52px) !important; }
          .prod-meta  { gap: 18px 30px !important; }
        }
        @media (prefers-reduced-motion: reduce){ .prod-float { animation: none !important; } }
      `}</style>

      <header className="ghost" style={{ zIndex: 200 }}>
        <span className="ghost__logo">TROPICAURA</span>
      </header>

      {/* Fond interpolé + gradient subtil « ressenti » */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background:
          "radial-gradient(130% 90% at 50% 16%, rgba(255,255,255,0.07), rgba(255,255,255,0) 55%)," +
          "radial-gradient(120% 80% at 50% 118%, rgba(0,0,0,0.40), rgba(0,0,0,0) 60%)",
      }} />

      {/* Nav dots */}
      <nav style={{
        position: "fixed", right: "clamp(14px,2vw,28px)", top: "50%",
        transform: "translateY(-50%)", zIndex: 150,
        display: "flex", flexDirection: "column", gap: 12, pointerEvents: "auto",
      }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} ref={(el) => (dotRefs.current[i] = el)} onClick={() => scrollTo(i)} title={s.name || s.title}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.32)", border: "none", cursor: "pointer", padding: 0, transition: "width .25s, height .25s, background .25s, box-shadow .25s", display: "block" }} />
        ))}
      </nav>

      {/* Scènes */}
      {SECTIONS.map((s, i) => {
        if (s.type === "intro") {
          return (
            <section key={s.id} className="scene" style={{ justifyContent: "center" }}>
              <div ref={(el) => (contentRefs.current[i] = el)} style={{ opacity: 1, textAlign: "center", maxWidth: "min(760px,86vw)", padding: "0 clamp(24px,6vw,60px)" }}>
                <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".30em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 22 }}>{s.kicker}</span>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "clamp(44px, 7vw, 92px)", lineHeight: 1.02, letterSpacing: "-.04em", color: "#fff", margin: "0 0 22px" }}>{s.title}</h1>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.8, color: "rgba(255,255,255,0.80)", margin: "0 auto", maxWidth: 580 }}>{s.text}</p>
                <div className="scene__hint" style={{ marginTop: 40 }}><i /><span>Défilez vers le bas</span></div>
              </div>
            </section>
          );
        }

        const isRight = s.side === "right";
        return (
          <section key={s.id} className="scene" style={{ justifyContent: "center" }}>
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="prod-row"
              style={{ opacity: i === 0 ? 1 : 0, transform: "translateY(30px)", flexDirection: isRight ? "row-reverse" : "row" }}
            >
              {/* Fruit détouré flottant (dépasse du cadre, ombre douce) */}
              <div className="prod-photo">
                {/* Halo lumineux (couleur du fond photo) → masque le halo de détourage */}
                {s.glow && (
                  <div aria-hidden="true" style={{
                    position: "absolute", inset: "2% 4%", zIndex: 0, pointerEvents: "none",
                    background: `radial-gradient(closest-side, ${s.glow}E6 0%, ${s.glow}99 44%, ${s.glow}00 78%)`,
                    filter: "blur(6px)",
                  }} />
                )}
                <img
                  src={s.png}
                  alt={s.name}
                  className="prod-float"
                  style={{
                    position: "relative", zIndex: 1,
                    width: "112%", maxWidth: "112%", maxHeight: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 36px 46px rgba(0,0,0,0.48))",
                    animationDelay: `${(i % 3) * -1.6}s`,
                  }}
                />
              </div>

              {/* Texte éditorial */}
              <div className="prod-text" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".22em", color: "rgba(255,255,255,0.55)" }}>{s.num}</span>
                  <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.30)" }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".22em", color: "rgba(255,255,255,0.55)" }}>{s.collection}</span>
                </div>

                <h2 className="prod-name" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.03em", color: "#fff", margin: "0 0 18px", textShadow: "0 4px 30px rgba(0,0,0,0.30)" }}>{s.name}</h2>

                <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.5)", margin: "0 0 22px", borderRadius: 2 }} />

                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.25vw,16px)", lineHeight: 1.78, fontWeight: 400, color: "rgba(255,255,255,0.86)", margin: "0 0 30px", maxWidth: 480 }}>{s.desc}</p>

                {/* Méta éditoriale : label / valeur */}
                <div className="prod-meta" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,2.6vw,46px)" }}>
                  {Object.entries(s.meta).map(([k, v]) => (
                    <div key={k}>
                      <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", marginBottom: 7 }}>{k}</span>
                      <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.15vw,16px)", fontWeight: 500, color: "rgba(255,255,255,0.92)" }}>{v}</span>
                    </div>
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
