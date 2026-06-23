import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  INSIGHTS — layout sticky gauche + défilement droite
//  Fond sombre · cartes À la une · grille 2 colonnes articles
// ============================================================

const FEATURED = [
  {
    category: "Marchés",
    title: "Pourquoi le Sénégal devient une origine stratégique pour les produits tropicaux",
    readTime: "7 min",
    date: "Juin 2026",
    img: "/menu-apropos.jpg",
  },
  {
    category: "Export",
    title: "FOB et CIF : comprendre les incoterms pour l'export de produits frais",
    readTime: "5 min",
    date: "Mai 2026",
    img: "/menu-produits.jpg",
  },
  {
    category: "Chaîne d'approvisionnement",
    title: "Construire des chaînes d'approvisionnement fiables entre l'Afrique et l'Europe",
    readTime: "6 min",
    date: "Avril 2026",
    img: "/menu-partenariats.jpg",
  },
];

const ARTICLES = [
  { category: "Connaissance produit",  title: "Mangue Kent vs Keitt : les variétés qui définissent la saison",                                    readTime: "4 min", date: "Juin 2026"      },
  { category: "Logistique",            title: "Port de Dakar : porte d'entrée vers les marchés européens pour les fruits frais",                  readTime: "4 min", date: "Février 2026"   },
  { category: "Conformité",            title: "Certification GlobalG.A.P. : ce que les importateurs européens exigent vraiment",                  readTime: "5 min", date: "Mai 2026"       },
  { category: "Planification",         title: "Saisons des fruits tropicaux : planifiez votre calendrier d'approvisionnement en Afrique",          readTime: "6 min", date: "Janvier 2026"   },
  { category: "Origines",              title: "La région des Niayes : la ceinture agricole la plus productive d'Afrique de l'Ouest",              readTime: "6 min", date: "Avril 2026"     },
  { category: "Partenariats",          title: "Construire une relation de confiance durable avec les producteurs africains",                       readTime: "5 min", date: "Janvier 2026"   },
  { category: "Marchés",               title: "Avocat Hass d'Afrique de l'Ouest : une opportunité de marché en croissance",                       readTime: "4 min", date: "Mars 2026"      },
  { category: "Marchés",               title: "Les tendances du marché européen des fruits tropicaux en 2026",                                    readTime: "6 min", date: "Décembre 2025"  },
  { category: "Logistique",            title: "Gestion de la chaîne du froid pour les exportations tropicales : aperçu pratique",                 readTime: "7 min", date: "Mars 2026"      },
  { category: "Export",                title: "Documentation export : le guide complet pour éviter les retards et les refus",                     readTime: "5 min", date: "Décembre 2025"  },
  { category: "Export",                title: "Comment structurer un contrat FOB pour les produits périssables",                                  readTime: "5 min", date: "Février 2026"   },
  { category: "Durabilité",            title: "Durabilité dans le commerce tropical : un avantage compétitif pour demain",                        readTime: "4 min", date: "Novembre 2025"  },
];

const GOLD  = "#C9A84C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.50)";
const SEP   = "rgba(255,255,255,0.09)";
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
          e.target.style.opacity   = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    revealRefs.current.forEach((el) => el && io.observe(el));

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); io.disconnect(); };
  }, []);

  const r = (delay = 0) => ({
    opacity: 0, transform: "translateY(18px)",
    transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  const lbl = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 9.5, fontWeight: 700, letterSpacing: ".22em",
    textTransform: "uppercase", color: GOLD, display: "block",
  };

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        .ins-wrap { display: grid; grid-template-columns: 38% 62%; min-height: 100vh; }
        /* Panneau gauche sticky */
        .ins-left { position: sticky; top: 0; height: 100vh; overflow: hidden; }
        .ins-left-bg {
          position: absolute; inset: 0;
          background-image: url("/menu-accueil.jpg");
          background-size: cover; background-position: center;
          filter: brightness(0.38) saturate(0.7);
        }
        .ins-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(9,15,10,0.30) 0%, rgba(9,15,10,0.55) 55%, rgba(9,15,10,0.85) 100%);
        }
        .ins-left-content {
          position: relative; z-index: 2;
          height: 100%; display: flex; flex-direction: column; justify-content: space-between;
          padding: clamp(72px,10vh,110px) clamp(28px,5vw,60px) clamp(32px,4vh,48px);
        }
        /* Panneau droit */
        .ins-right { padding: clamp(56px,8vh,80px) clamp(24px,4vw,56px) clamp(56px,8vh,80px) clamp(28px,3.5vw,48px); }
        /* Cartes À la une */
        .ins-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 22px; }
        .ins-card { border-radius: 6px; overflow: hidden; background: rgba(255,255,255,0.04); cursor: pointer; transition: background .3s; }
        .ins-card:hover { background: rgba(255,255,255,0.08); }
        .ins-card-img { height: 160px; background-size: cover; background-position: center; transition: transform 1s cubic-bezier(.22,1,.36,1); }
        .ins-card:hover .ins-card-img { transform: scale(1.05); }
        .ins-card-body { padding: 16px 16px 18px; }
        /* Grille articles */
        .ins-art-grid { display: grid; grid-template-columns: 1fr 1fr; margin-top: 22px; }
        .ins-art-item { border-top: 1px solid rgba(255,255,255,0.09); padding: 20px 0 20px 0; cursor: pointer; display: flex; flex-direction: column; gap: 8px; position: relative; }
        .ins-art-item:nth-child(odd)  { padding-right: 28px; }
        .ins-art-item:nth-child(even) { padding-left: 28px; border-left: 1px solid rgba(255,255,255,0.09); }
        .ins-art-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:clamp(13px,1.05vw,15px); font-weight:600; letter-spacing:-.01em; color:${WHITE}; line-height:1.35; transition: color .25s ease; }
        .ins-art-item:hover .ins-art-title { color: rgba(255,255,255,0.55); }
        .ins-art-arrow { position:absolute; bottom:20px; right:0; font-size:14px; color:rgba(255,255,255,0.30); transition: color .25s, transform .25s cubic-bezier(.22,1,.36,1); }
        .ins-art-item:nth-child(even) .ins-art-arrow { right: 0; }
        .ins-art-item:hover .ins-art-arrow { color:rgba(255,255,255,0.75); transform: translateX(3px); }
        /* Stats */
        .ins-stats { display: flex; gap: 0; margin-top: 32px; }
        .ins-stat { flex: 1; }
        .ins-stat + .ins-stat { border-left: 1px solid rgba(255,255,255,0.14); padding-left: 24px; }
        /* Responsive */
        @media (max-width:900px){
          .ins-wrap  { grid-template-columns: 1fr !important; }
          .ins-left  { position: relative !important; height: auto !important; min-height: 85vh !important; }
          .ins-cards { grid-template-columns: 1fr !important; }
          .ins-art-grid { grid-template-columns: 1fr !important; }
          .ins-art-item:nth-child(even) { border-left: none !important; padding-left: 0 !important; }
          .ins-art-item:nth-child(odd) { padding-right: 0 !important; }
        }
      `}</style>

      {/* ── Logo ── */}
      <span style={{ position:"fixed", top:20, left:"clamp(20px,5vw,48px)", zIndex:200, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18, letterSpacing:".04em", color:WHITE, pointerEvents:"none", mixBlendMode:"normal" }}>
        TROPIC-AURA
      </span>

      <div className="ins-wrap">

        {/* ════ PANNEAU GAUCHE STICKY ════ */}
        <div className="ins-left">
          <div className="ins-left-bg" />
          <div className="ins-left-overlay" />
          <div className="ins-left-content">

            {/* Haut */}
            <div>
              <span ref={reveal} style={{ ...r(0), ...lbl, marginBottom: 24 }}>Perspectives</span>
              <h1 ref={reveal} style={{
                ...r(0.07),
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                fontSize: "clamp(26px, 2.8vw, 40px)",
                lineHeight: 1.10, letterSpacing: "-.03em",
                color: WHITE, margin: 0,
              }}>
                Comprendre les dynamiques qui façonnent le commerce tropical de demain.
              </h1>
              <p ref={reveal} style={{
                ...r(0.14),
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: "clamp(12.5px, 1vw, 14px)", lineHeight: 1.75,
                fontWeight: 400, color: MUTED, margin: "20px 0 0",
              }}>
                Analyses de marché, expertise export, logistique internationale et
                opportunités reliant l'Afrique aux marchés les plus exigeants du monde.
              </p>
            </div>

            {/* Stats */}
            <div ref={reveal} style={{ ...r(0.20) }}>
              <div className="ins-stats">
                <div className="ins-stat">
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(32px,3vw,44px)", letterSpacing:"-.04em", color:WHITE, lineHeight:1 }}>
                    {ARTICLES.length + FEATURED.length}
                  </span>
                  <span style={{ ...lbl, marginTop: 8 }}>Analyses publiées</span>
                </div>
                <div className="ins-stat">
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(32px,3vw,44px)", letterSpacing:"-.04em", color:WHITE, lineHeight:1 }}>
                    5<span style={{ fontSize:"0.55em" }}> min</span>
                  </span>
                  <span style={{ ...lbl, marginTop: 8 }}>Temps de lecture moyen</span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: 32, display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)" }}>
                  Explorer les articles
                </span>
                <span style={{ color:"rgba(255,255,255,0.55)", fontSize:16 }}>→</span>
              </div>
            </div>

            {/* Signature */}
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:9.5, fontWeight:600, letterSpacing:".20em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)" }}>
              Tropic-Aura · Intelligence de marché
            </span>
          </div>
        </div>

        {/* ════ PANNEAU DROIT ════ */}
        <div className="ins-right">

          {/* ── À LA UNE ── */}
          <div>
            <span ref={reveal} style={{ ...r(0), ...lbl }}>À la une</span>
            <div className="ins-cards">
              {FEATURED.map((a, i) => (
                <article key={i} ref={reveal} className="ins-card" style={r(i * 0.07)}>
                  <div
                    className="ins-card-img"
                    style={{ backgroundImage: `url("${a.img}")` }}
                  />
                  <div className="ins-card-body">
                    <span style={{ ...lbl, fontSize: 8.5, marginBottom: 10 }}>{a.category}</span>
                    <h2 style={{
                      fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
                      fontSize:"clamp(13px,1.1vw,15px)", lineHeight:1.35,
                      letterSpacing:"-.015em", color:WHITE, margin:"0 0 14px",
                    }}>
                      {a.title}
                    </h2>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:500, color:MUTED }}>{a.readTime} de lecture</span>
                      <span style={{ width:2, height:2, borderRadius:"50%", background:"rgba(255,255,255,0.25)" }} />
                      <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:500, color:MUTED }}>{a.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ── TOUTES LES ANALYSES ── */}
          <div style={{ marginTop: "clamp(48px,6vh,72px)" }}>
            <span ref={reveal} style={{ ...r(0), ...lbl }}>
              Toutes les analyses — {ARTICLES.length + FEATURED.length}
            </span>
            <div className="ins-art-grid">
              {ARTICLES.map((a, i) => (
                <div key={i} ref={reveal} className="ins-art-item" style={r(i * 0.03)}>
                  <span style={{ ...lbl, fontSize: 8.5 }}>{a.category}</span>
                  <span className="ins-art-title">{a.title}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                    <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:MUTED }}>{a.readTime}</span>
                    <span style={{ width:2, height:2, borderRadius:"50%", background:"rgba(255,255,255,0.22)" }} />
                    <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:MUTED }}>{a.date}</span>
                  </div>
                  <span className="ins-art-arrow">→</span>
                </div>
              ))}
            </div>
            {/* Border bas */}
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.09)", marginTop:0 }} />
          </div>

        </div>{/* fin panneau droit */}
      </div>{/* fin grid */}
    </div>
  );
}
