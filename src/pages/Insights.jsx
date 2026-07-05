import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  INSIGHTS — panneau gauche sticky · liste articles verticale
//  5 articles · thumbnail + catégorie + titre + description + méta
// ============================================================

const ARTICLES = [
  {
    category: "Marchés",
    title: "Pourquoi le Sénégal devient une origine stratégique pour les fruits tropicaux",
    desc: "Position géographique, accès maritime, saisonnalité complémentaire et amélioration des infrastructures créent de nouvelles opportunités pour les importateurs à la recherche de partenaires fiables.",
    readTime: "7 min",
    date: "Juin 2026",
    img: "/menu-apropos.jpg",
    href: "/insights/senegal-origine-strategique",
  },
  {
    category: "Partenariats",
    title: "Ce qui distingue un fournisseur stable d'un fournisseur opportuniste en Afrique de l'Ouest",
    desc: "Certaines relations commerciales se développent pendant plusieurs années. D'autres s'arrêtent après une seule saison. La différence ne repose pas uniquement sur le produit.",
    readTime: "7 min",
    date: "Juin 2026",
    img: "/menu-partenariats.jpg",
    href: "/insights/fournisseur-stable-opportuniste",
  },
];

const GOLD  = "#C9A84C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.46)";
const BG    = "#090F0A";

export default function Insights() {
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    revealRefs.current.forEach((el) => el && io.observe(el));

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); io.disconnect(); };
  }, []);

  const r = (delay = 0) => ({
    opacity: 0, transform: "translateY(16px)",
    transition: `opacity .65s ease ${delay}s, transform .65s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  const lbl = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 9, fontWeight: 700, letterSpacing: ".22em",
    textTransform: "uppercase", color: GOLD, display: "block",
  };

  /* Icônes SVG inline (document · horloge · globe) */
  const iconStyle = { width: 20, height: 20, marginBottom: 10, opacity: 0.6 };

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        /* ── Layout ── */
        .ins-wrap { display: grid; grid-template-columns: 38% 62%; min-height: 100vh; }
        .ins-left { position: sticky; top: 0; height: 100vh; overflow: hidden; }
        .ins-left-bg {
          position: absolute; inset: 0;
          background-image: url("/insights-leaf.png");
          background-size: cover; background-position: center center;
          filter: brightness(0.88) saturate(0.80);
        }
        .ins-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(170deg,rgba(9,15,10,0.25) 0%,rgba(9,15,10,0.60) 50%,rgba(9,15,10,0.90) 100%);
        }
        .ins-left-content {
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: clamp(72px,10vh,110px) clamp(28px,4.5vw,58px) clamp(28px,3.5vh,44px);
          box-sizing: border-box;
        }
        .ins-right {
          padding: clamp(40px,6vh,64px) clamp(24px,4vw,56px) clamp(48px,6vh,72px) clamp(24px,3.5vw,48px);
          box-sizing: border-box;
        }

        /* ── Stats ── */
        .ins-stats { display: flex; gap: 28px; margin-top: 28px; }
        .ins-stat  { flex: 1; }
        .ins-stat + .ins-stat { border-left: 1px solid rgba(255,255,255,0.12); padding-left: 22px; }

        /* ── CTA ── */
        .ins-cta {
          display: inline-flex; align-items: center; gap: 12; margin-top: 32px;
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,0.52);
          text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.18);
          padding-bottom: 8px; transition: color .25s, border-color .25s;
        }
        .ins-cta:hover { color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.50); }

        /* ── Rows articles ── */
        .ins-row {
          display: grid;
          grid-template-columns: 132px 1fr 90px;
          gap: 0 22px;
          padding: clamp(20px,2.5vh,28px) 0;
          border-top: 1px solid rgba(255,255,255,0.09);
          align-items: start;
          cursor: pointer;
        }
        .ins-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.09); }
        a.ins-row { text-decoration: none; color: inherit; display: grid; }
        .ins-row-img {
          width: 132px; height: 112px; border-radius: 4px;
          background-size: cover; background-position: center;
          overflow: hidden;
          transition: filter .4s ease;
        }
        .ins-row:hover .ins-row-img { filter: brightness(0.82); }
        .ins-row-title {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: clamp(14px,1.2vw,17px);
          font-weight: 700; letter-spacing: -.02em; color: #fff;
          line-height: 1.28; margin: 8px 0 10px; transition: color .25s;
        }
        .ins-row:hover .ins-row-title { color: rgba(255,255,255,0.60); }
        .ins-row-desc {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(12px,.95vw,13.5px); line-height: 1.68;
          color: rgba(255,255,255,0.42); margin: 0;
        }
        .ins-row-meta {
          text-align: right; font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,0.40);
          line-height: 1.7; padding-top: 4px;
        }

        /* ── "Voir toutes" ── */
        .ins-voir {
          margin-top: clamp(32px,4vh,48px);
          display: flex; align-items: center; gap: 0;
        }
        .ins-voir-line { flex: 1; height: 1px; background: rgba(255,255,255,0.14); }
        .ins-voir-link {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 9.5px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,0.44);
          text-decoration: none; white-space: nowrap; padding: 0 18px;
          transition: color .25s;
        }
        .ins-voir-link:hover { color: rgba(255,255,255,0.80); }
        .ins-voir-arrow { color: rgba(255,255,255,0.35); font-size: 14px; }

        /* ── Responsive ── */
        @media (max-width: 860px){
          .ins-wrap  { grid-template-columns: 1fr !important; }
          .ins-left  { position: relative !important; height: auto !important; min-height: 75vh !important; }
          .ins-row   { grid-template-columns: 100px 1fr !important; }
          .ins-row-meta { display: none !important; }
        }
        @media (max-width: 520px){
          .ins-row { grid-template-columns: 1fr !important; }
          .ins-row-img { width: 100% !important; height: 180px !important; }
        }
      `}</style>

      {/* Logo */}
      <span style={{ position:"fixed", top:16, left:"clamp(20px,5vw,48px)", zIndex:200, pointerEvents:"none" }}>
        <span className="ghost__logo">Tropicaura</span>
      </span>

      <div className="ins-wrap">

        {/* ════ PANNEAU GAUCHE ════ */}
        <div className="ins-left">
          <div className="ins-left-bg" />
          <div className="ins-left-overlay" />
          <div className="ins-left-content">

            {/* Haut */}
            <div>
              <span ref={reveal} style={{ ...r(0), ...lbl, marginBottom: 22 }}>Perspectives</span>
              <h1 ref={reveal} style={{
                ...r(0.07),
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800,
                fontSize:"clamp(19px, 1.85vw, 28px)",
                lineHeight:1.15, letterSpacing:"-.025em",
                color:WHITE, margin:0,
              }}>
                Les analyses qui éclairent le commerce tropical international.
              </h1>
              <p ref={reveal} style={{
                ...r(0.13),
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                fontSize:"clamp(12px, .95vw, 13.5px)", lineHeight:1.75,
                color:MUTED, margin:"18px 0 0",
              }}>
                Marchés européens, stratégies d'approvisionnement, logistique export
                et développement de filières tropicales performantes.
              </p>
            </div>

            {/* Stats */}
            <div ref={reveal} style={r(0.18)}>
              <div className="ins-stats">
                {/* Stat 1 */}
                <div className="ins-stat">
                  <svg style={iconStyle} viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round">
                    <rect x="4" y="2" width="12" height="16" rx="2"/>
                    <line x1="7" y1="7" x2="13" y2="7"/><line x1="7" y1="10" x2="13" y2="10"/><line x1="7" y1="13" x2="11" y2="13"/>
                  </svg>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(26px,2.4vw,34px)", letterSpacing:"-.04em", color:WHITE, lineHeight:1 }}>
                    {ARTICLES.length}
                  </span>
                  <span style={{ ...lbl, marginTop:7, fontSize:8.5 }}>Analyses publiées</span>
                </div>
                {/* Stat 2 */}
                <div className="ins-stat">
                  <svg style={iconStyle} viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round">
                    <circle cx="10" cy="10" r="7.5"/>
                    <polyline points="10,5.5 10,10 13,12.5"/>
                  </svg>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(26px,2.4vw,34px)", letterSpacing:"-.04em", color:WHITE, lineHeight:1 }}>
                    5<span style={{ fontSize:"0.5em", fontWeight:700 }}> min</span>
                  </span>
                  <span style={{ ...lbl, marginTop:7, fontSize:8.5 }}>Temps de lecture moyen</span>
                </div>
                {/* Stat 3 */}
                <div className="ins-stat">
                  <svg style={iconStyle} viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round">
                    <circle cx="10" cy="10" r="7.5"/>
                    <path d="M3 10 Q10 14 17 10M3 10 Q10 6 17 10M10 2.5 V17.5"/>
                  </svg>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:"clamp(11px,1vw,13px)", letterSpacing:"-.01em", color:WHITE, lineHeight:1.2 }}>
                    Afrique<br/>→ Europe
                  </span>
                  <span style={{ ...lbl, marginTop:7, fontSize:8.5 }}>Des opportunités qui connectent</span>
                </div>
              </div>

              {/* CTA */}
              <a href="#analyses" className="ins-cta" style={{ marginTop:32, display:"inline-flex", alignItems:"center", gap:12 }}>
                Explorer les analyses
                <span style={{ fontSize:15 }}>→</span>
              </a>
            </div>

            {/* Signature */}
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:9, fontWeight:600, letterSpacing:".20em", textTransform:"uppercase", color:"rgba(255,255,255,0.22)" }}>
              Tropicaura · Commerce Tropical d'Excellence
            </span>
          </div>
        </div>

        {/* ════ PANNEAU DROIT ════ */}
        <div className="ins-right">
          <span ref={reveal} style={{ ...r(0), ...lbl, marginBottom:28 }}>À la une</span>

          <div id="analyses">
            {ARTICLES.map((a, i) => {
              const Tag = a.href ? "a" : "article";
              return (
              <Tag key={i} ref={reveal} className="ins-row" style={r(i * 0.06)} {...(a.href ? { href: a.href } : {})}>
                {/* Thumbnail */}
                <div
                  className="ins-row-img"
                  style={{ backgroundImage: `url("${a.img}")` }}
                />
                {/* Contenu */}
                <div>
                  <span style={{ ...lbl, fontSize:8.5, marginBottom:0 }}>{a.category}</span>
                  <h2 className="ins-row-title">{a.title}</h2>
                  <p className="ins-row-desc">{a.desc}</p>
                </div>
                {/* Méta */}
                <div className="ins-row-meta">
                  <span style={{ display:"block" }}>{a.readTime} de lecture</span>
                  <span style={{ display:"block", marginTop:4 }}>{a.date}</span>
                </div>
              </Tag>
              );
            })}
          </div>

          {/* Voir toutes */}
          <div ref={reveal} className="ins-voir" style={r(0.3)}>
            <div className="ins-voir-line" />
            <a href="#" className="ins-voir-link">Voir toutes les analyses</a>
            <span className="ins-voir-arrow">→</span>
          </div>
        </div>

      </div>
    </div>
  );
}
