import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  PARTENARIATS — gradients par section, crossfade au scroll
//  5 calques bg-layer empilés en DOM order (dernier = dessus)
// ============================================================

const SECTIONS = [
  {
    id: "fondations", num: "01", surtitre: "FONDATIONS", side: "left",
    bg: "linear-gradient(180deg, #E1CCA0 0%, #D1B57A 100%)",
    dark: true,
    title: "Des fondations construites sur la confiance.",
    paragraphs: [
      "Chaque partenariat durable repose sur des fondations solides.",
      "Chez Tropic-Aura, nous croyons que le commerce international ne se résume pas à l'échange de produits. Il repose avant tout sur la confiance, la transparence et une vision commune du long terme.",
      "Nous ne recherchons pas des opportunités ponctuelles. Nous construisons des relations capables de grandir, d'évoluer et de créer de la valeur sur le long terme.",
    ],
  },
  {
    id: "reseau", num: "02", surtitre: "RÉSEAU", side: "right",
    bg: "linear-gradient(180deg, #90A984 0%, #708A65 100%)",
    dark: true,
    title: "Un réseau qui dépasse les frontières.",
    paragraphs: [
      "Derrière chaque réussite commerciale se trouve un réseau de partenaires engagés.",
      "Tropic-Aura développe des relations stratégiques à travers les principales régions tropicales d'Afrique, en connectant producteurs, stations de conditionnement, partenaires logistiques, distributeurs et acheteurs internationaux autour d'un objectif commun : l'excellence.",
      "Chaque connexion renforce l'écosystème. Chaque partenariat ouvre de nouvelles opportunités.",
    ],
  },
  {
    id: "terroirs", num: "03", surtitre: "TERROIRS", side: "left",
    bg: "linear-gradient(180deg, #4F7980 0%, #355C62 100%)",
    dark: false,
    title: "Révéler le potentiel des terroirs tropicaux.",
    paragraphs: [
      "Certaines des opportunités agricoles les plus prometteuses au monde se trouvent dans les régions tropicales africaines.",
      "Tropic-Aura contribue à un avenir où ces territoires sont reconnus pour leur richesse naturelle, leur professionnalisme, leur capacité d'innovation et leur aptitude à répondre aux standards les plus exigeants du commerce mondial.",
      "Notre ambition est simple : transformer le potentiel en opportunités concrètes et créer de la valeur durable pour l'ensemble des acteurs de la chaîne.",
    ],
  },
  {
    id: "avenir", num: "04", surtitre: "AVENIR", side: "right",
    bg: "linear-gradient(180deg, #D4B47B 0%, #BE9A5A 100%)",
    dark: true,
    title: "Construire l'avenir ensemble.",
    paragraphs: [
      "Nous croyons que l'avenir du commerce tropical sera porté par des partenariats solides, une vision partagée et une collaboration durable.",
      "Tropic-Aura construit un écosystème dans lequel chaque acteur contribue à une réussite collective.",
      "Nous ne voulons pas simplement développer des relations commerciales. Nous souhaitons bâtir des alliances stratégiques capables d'accompagner la prochaine génération du commerce agricole international.",
    ],
  },
  {
    id: "cta", num: "05", surtitre: "REJOINDRE LE RÉSEAU", side: "left",
    bg: "linear-gradient(180deg, #C49A5A 0%, #A87E40 100%)",
    dark: true,
    title: "Rejoignez un réseau qui façonne l'avenir du commerce tropical.",
    paragraphs: [
      "Les plus grandes opportunités naissent lorsque des partenaires ambitieux avancent dans la même direction. Que vous soyez producteur, importateur, distributeur ou partenaire logistique, Tropic-Aura souhaite collaborer avec des acteurs qui partagent une même exigence de qualité et de création de valeur.",
    ],
    hasButton: true,
  },
];

const N = SECTIONS.length;

// ============================================================
export default function Partenariats() {
  const bgRefs      = useRef([]);
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
    const easeOut  = (t) => 1 - (1 - t) * (1 - t);
    const last     = N - 1;
    let lastScroll = -99999;
    const onResize = () => { lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      const prog = scroll / H;
      const ci   = Math.min(last, Math.floor(prog));
      const ft   = Math.min(1, Math.max(0, prog - ci));

      // ── crossfade entre couches de gradient ──
      // DOM order = z-order: bg-4 est au-dessus de bg-3, etc.
      // bg-0 toujours visible en dessous. Les suivants s'ouvrent en fondu.
      bgRefs.current.forEach((el, j) => {
        if (!el) return;
        const opacity = j <= ci ? 1 : j === ci + 1 ? ft : 0;
        el.style.opacity = opacity.toFixed(3);
      });

      // ── fade-in contenu (une seule fois) ──
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

      // ── nav dots (couleur adaptée à la section active) ──
      const active   = Math.min(last, Math.max(0, Math.round(scroll / H)));
      const isDark   = SECTIONS[active].dark;
      const dotOn    = isDark ? "rgba(0,0,0,0.60)"    : "rgba(255,255,255,0.90)";
      const dotOff   = isDark ? "rgba(0,0,0,0.20)"    : "rgba(255,255,255,0.30)";
      const shadowOn = isDark ? "0 0 0 2px rgba(0,0,0,0.10)" : "0 0 0 2px rgba(255,255,255,0.15)";
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width      = on ? "9px" : "6px";
        dot.style.height     = on ? "9px" : "6px";
        dot.style.background = on ? dotOn : dotOff;
        dot.style.boxShadow  = on ? shadowOn : "none";
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
      {/* Pulse léger des dots de navigation (opacity 0.5 → 1, en boucle) */}
      <style>{`
        @keyframes dotPulse { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
      `}</style>

      {/* ── Header frosted glass ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <a href="/" style={{ pointerEvents:"auto", textDecoration:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18, letterSpacing:".04em", color:"#1A1A1A" }}>
          TROPICAURA
        </a>
      </header>

      {/* ── Couches de gradient (DOM order = z-order) ── */}
      {SECTIONS.map((s, i) => (
        <div
          key={s.id + "-bg"}
          ref={(el) => (bgRefs.current[i] = el)}
          className="bg-layer"
          style={{ background: s.bg, opacity: i === 0 ? 1 : 0 }}
        />
      ))}

      {/* ── Nav dots ── */}
      <nav style={{ position:"fixed", right:"clamp(14px,2vw,28px)", top:"50%", transform:"translateY(-50%)", zIndex:150, display:"flex", flexDirection:"column", gap:12, pointerEvents:"auto" }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => (dotRefs.current[i] = el)}
            onClick={() => scrollTo(i)}
            title={s.title}
            style={{ width:6, height:6, borderRadius:"50%", background:"rgba(0,0,0,0.20)", border:"none", cursor:"pointer", padding:0, transition:"width .25s, height .25s, background .25s, box-shadow .25s", display:"block", animation:"dotPulse 1.8s ease-in-out infinite", animationDelay:`${i * 0.18}s` }}
          />
        ))}
      </nav>

      {/* ── Sections ── */}
      {SECTIONS.map((s, i) => {
        const isRight      = s.side === "right";
        const textColor    = s.dark ? "#111111"              : "#FFFFFF";
        const labelColor   = s.dark ? "rgba(0,0,0,0.40)"    : "rgba(255,255,255,0.62)";
        const dividerColor = s.dark ? "rgba(0,0,0,0.18)"    : "rgba(255,255,255,0.35)";
        const paraColor    = s.dark ? "rgba(0,0,0,0.62)"    : "rgba(255,255,255,0.82)";

        return (
          <section key={s.id} data-index={i} className="scene" style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}>
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
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".26em", textTransform:"uppercase", color:labelColor }}>
                  {s.num}
                </span>
                <div style={{ width:1, height:24, background:dividerColor }} />
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:labelColor }}>
                  {s.surtitre}
                </span>
              </div>

              {/* Titre */}
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(24px, 2.8vw, 44px)", lineHeight:1.08, letterSpacing:"-.03em", color:textColor, margin:"0 0 18px" }}>
                {s.title}
              </h2>

              {/* Filet */}
              <div style={{ width:32, height:1, background:dividerColor, margin:"0 0 20px" }} />

              {/* Paragraphes */}
              {s.paragraphs.map((p, pi) => (
                <p key={pi} style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(13px,1.1vw,15px)", lineHeight:1.80, fontWeight:400, color:paraColor, margin: pi < s.paragraphs.length - 1 ? "0 0 12px" : "0" }}>
                  {p}
                </p>
              ))}

              {/* Bouton CTA */}
              {s.hasButton && (
                <div style={{ marginTop:36 }}>
                  <a href="/contact" style={{ textDecoration:"none" }}>
                    <button
                      style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:11, letterSpacing:".18em", textTransform:"uppercase", color:textColor, background:"transparent", border:`1.5px solid ${dividerColor}`, borderRadius:100, padding:"13px 38px", cursor:"pointer", transition:"background .3s, border-color .3s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = s.dark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = s.dark ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.60)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = dividerColor; }}
                    >
                      Devenir partenaire →
                    </button>
                  </a>
                </div>
              )}
            </div>

            {i === 0 && (
              <div className="scene__hint scene__hint--dark">
                <i /><span>Défilez vers le bas</span>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
