"use strict";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  INSIGHTS — page éditoriale premium (style Linear / Stripe)
//  Background #F5F3EE · typographie imposante · espace généreux
//  Pas de grille blog classique, pas de photos de stocks partout.
// ============================================================

const FEATURED = [
  {
    category: "Market Insights",
    title: "Why Senegal Is Becoming a Strategic Origin for Tropical Produce",
    desc: "West Africa's leading exporter is quietly reshaping how European importers source mangoes, avocados and specialty produce. Here's what's driving the shift.",
    readTime: "7 min",
    date: "June 2026",
    img: "/menu-apropos.jpg",
  },
  {
    category: "Export Knowledge",
    title: "Understanding FOB and CIF for Fresh Produce Exports",
    desc: "Choosing the right Incoterm isn't just paperwork — for perishables, it determines who bears risk during the most critical phase of the journey.",
    readTime: "5 min",
    date: "May 2026",
    img: "/menu-produits.jpg",
  },
  {
    category: "Supply Chain",
    title: "Building Reliable Supply Chains Between Africa and Europe",
    desc: "Reliability is built in layers: certified producers, rigorous post-harvest handling, consistent cold chain and documentation that meets EU standards.",
    readTime: "6 min",
    date: "April 2026",
    img: "/menu-partenariats.jpg",
  },
];

const ARTICLES = [
  { category: "Product Knowledge",  title: "Mango Kent vs Keitt: The Varieties That Define the Season",             readTime: "4 min", date: "June 2026"     },
  { category: "Compliance",         title: "GlobalG.A.P. Certification: What European Importers Actually Require",  readTime: "5 min", date: "May 2026"      },
  { category: "Origins",            title: "The Niayes Region: West Africa's Most Productive Agricultural Belt",    readTime: "6 min", date: "April 2026"    },
  { category: "Market Insights",    title: "Avocado Hass from West Africa: A Growing Market Opportunity",           readTime: "4 min", date: "March 2026"    },
  { category: "Supply Chain",       title: "Cold Chain Management for Tropical Exports: A Practical Overview",       readTime: "7 min", date: "March 2026"    },
  { category: "Export Knowledge",   title: "How to Structure a FOB Contract for Perishable Goods",                  readTime: "5 min", date: "February 2026" },
  { category: "Logistics",          title: "Port of Dakar: Gateway to European Markets for Fresh Produce",          readTime: "4 min", date: "February 2026" },
  { category: "Planning",           title: "Tropical Fruit Seasons: Planning Your Africa Sourcing Calendar",         readTime: "6 min", date: "January 2026"  },
  { category: "Partnerships",       title: "Building Long-Term Trust with African Producers",                        readTime: "5 min", date: "January 2026"  },
];

const TOTAL = FEATURED.length + ARTICLES.length;

export default function Insights() {
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity    = "1";
          e.target.style.transform  = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    revealRefs.current.forEach((el) => el && io.observe(el));

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); io.disconnect(); };
  }, []);

  const r = (delay = 0) => ({
    opacity: 0,
    transform: "translateY(22px)",
    transition: `opacity .75s ease ${delay}s, transform .75s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  const INK   = "#0A0A0A";
  const MUTED = "rgba(0,0,0,0.42)";
  const lbl   = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 10, fontWeight: 700,
    letterSpacing: ".26em", textTransform: "uppercase",
    color: MUTED, display: "block",
  };

  return (
    <div style={{ background: "#F5F3EE", minHeight: "100vh" }}>
      <style>{`
        .ins-logo     { position:fixed; top:20px; left:clamp(20px,5vw,48px); z-index:200; font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; font-size:18px; letter-spacing:.04em; color:#0A0A0A; pointer-events:none; }
        .ins-card     { display:flex; min-height:400px; background:rgba(0,0,0,0.026); border-radius:6px; overflow:hidden; transition:background .3s; }
        .ins-card:hover { background:rgba(0,0,0,0.05); }
        .ins-card-img { overflow:hidden; flex:0 0 44%; background:#D4CCC4; }
        .ins-card-img-inner { width:100%; height:100%; background-size:cover; background-position:center; transition:transform 1.1s cubic-bezier(.22,1,.36,1); }
        .ins-card:hover .ins-card-img-inner { transform:scale(1.04); }
        .ins-row      { border-top:1px solid rgba(0,0,0,0.09); padding:clamp(18px,2.2vh,26px) 0; display:grid; grid-template-columns:140px 1fr 110px; gap:clamp(14px,2.5vw,36px); align-items:baseline; cursor:pointer; }
        .ins-row:hover .ins-row-title { color:rgba(0,0,0,0.45) !important; }
        .ins-row-title { transition:color .25s ease; }
        @media (max-width:820px){
          .ins-hero-right { display:none !important; }
          .ins-card       { flex-direction:column !important; min-height:unset !important; }
          .ins-card-img   { flex:none !important; height:220px !important; }
          .ins-row        { grid-template-columns:1fr !important; gap:6px !important; }
          .ins-row-meta   { display:none !important; }
        }
      `}</style>

      {/* Logo */}
      <span className="ins-logo">TROPIC-AURA</span>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "88vh", boxSizing: "border-box",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "clamp(130px,18vh,180px) clamp(24px,8vw,140px) clamp(56px,7vh,88px)",
      }}>
        <div style={{ maxWidth: 1200, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>

          {/* Gauche — titre */}
          <div>
            <span ref={reveal} style={{ ...r(0), ...lbl, marginBottom: 28 }}>Insights</span>
            <h1 ref={reveal} style={{
              ...r(0.08),
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
              fontSize: "clamp(46px, 7.8vw, 108px)",
              lineHeight: 0.95, letterSpacing: "-.04em",
              color: INK, margin: "0 0 28px",
            }}>
              Perspectives on<br />Tropical Trade.
            </h1>
            <p ref={reveal} style={{
              ...r(0.16),
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "clamp(14px, 1.1vw, 16px)", lineHeight: 1.78,
              fontWeight: 400, color: "rgba(0,0,0,0.50)", margin: 0, maxWidth: 460,
            }}>
              Market intelligence, export knowledge, supply chain insights
              and opportunities connecting Africa with Europe.
            </p>
          </div>

          {/* Droite — métadonnées */}
          <div className="ins-hero-right" ref={reveal} style={{ ...r(0.22), textAlign: "right", flexShrink: 0, paddingBottom: 4 }}>
            <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(44px,5.5vw,72px)", fontWeight: 800, letterSpacing: "-.04em", color: INK, lineHeight: 1 }}>{TOTAL}</span>
            <span style={{ ...lbl, marginBottom: 24, textAlign: "right" }}>Articles published</span>
            <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, letterSpacing: "-.03em", color: INK, lineHeight: 1 }}>5 min</span>
            <span style={{ ...lbl, textAlign: "right" }}>Average reading time</span>
          </div>
        </div>

        {/* Scroll CTA */}
        <div ref={reveal} style={{ ...r(0.26), marginTop: 52, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 1, background: "rgba(0,0,0,0.20)" }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".20em", textTransform: "uppercase", color: MUTED }}>
            Explore Articles
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <path d="M6 1.5V10.5M6 10.5L2.5 7M6 10.5L9.5 7" stroke="rgba(0,0,0,0.42)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(0,0,0,0.09)", margin: "0 clamp(24px,8vw,140px)" }} />

      {/* ── FEATURED ── */}
      <section style={{ padding: "clamp(56px,8vh,96px) clamp(24px,8vw,140px)" }}>
        <span ref={reveal} style={{ ...r(0), ...lbl, marginBottom: 36 }}>Featured</span>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {FEATURED.map((a, i) => (
            <article
              key={i}
              ref={reveal}
              className="ins-card"
              style={{
                ...r(i * 0.07),
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
              }}
            >
              {/* Image */}
              <div className="ins-card-img">
                <div className="ins-card-img-inner" style={{ backgroundImage: `url("${a.img}")` }} />
              </div>

              {/* Contenu */}
              <div style={{
                flex: 1, padding: "clamp(30px,4.5vh,52px) clamp(28px,3.5vw,52px)",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div>
                  <span style={{ ...lbl, marginBottom: 18 }}>{a.category}</span>
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                    fontSize: "clamp(18px, 2vw, 28px)",
                    lineHeight: 1.14, letterSpacing: "-.025em",
                    color: INK, margin: "0 0 16px",
                  }}>
                    {a.title}
                  </h2>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(13px, 1vw, 14.5px)", lineHeight: 1.75,
                    color: "rgba(0,0,0,0.50)", margin: 0,
                  }}>
                    {a.desc}
                  </p>
                </div>
                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11.5, fontWeight: 500, letterSpacing: ".06em", color: MUTED }}>{a.readTime} read</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.20)" }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11.5, fontWeight: 500, letterSpacing: ".06em", color: MUTED }}>{a.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(0,0,0,0.09)", margin: "0 clamp(24px,8vw,140px)" }} />

      {/* ── ALL ARTICLES ── */}
      <section style={{ padding: "clamp(56px,8vh,96px) clamp(24px,8vw,140px)" }}>
        <span ref={reveal} style={{ ...r(0), ...lbl, marginBottom: 44 }}>
          All Articles — {TOTAL}
        </span>

        <div style={{ maxWidth: 1100 }}>
          {ARTICLES.map((a, i) => (
            <div key={i} ref={reveal} className="ins-row" style={r(i * 0.035)}>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(0,0,0,0.32)", paddingTop: 2 }}>
                {a.category}
              </span>
              <span className="ins-row-title" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(13.5px, 1.15vw, 16px)", fontWeight: 600, letterSpacing: "-.012em", color: INK, lineHeight: 1.3 }}>
                {a.title}
              </span>
              <div className="ins-row-meta" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11.5, fontWeight: 500, color: "rgba(0,0,0,0.36)", whiteSpace: "nowrap", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
                <span>{a.readTime}</span>
                <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(0,0,0,0.22)" }} />
                <span>{a.date}</span>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.09)" }} />
        </div>
      </section>

      {/* Signature footer */}
      <div style={{ padding: "clamp(32px,4vh,48px) clamp(24px,8vw,140px)", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.09)" }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(0,0,0,0.30)" }}>
          Tropic-Aura · Market Intelligence
        </span>
        <a href="/contact" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.20)", paddingBottom: 2, transition: "color .25s, border-color .25s" }}
          onMouseEnter={e => { e.currentTarget.style.color = INK; e.currentTarget.style.borderColor = "rgba(0,0,0,0.60)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(0,0,0,0.45)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.20)"; }}
        >
          Nous contacter →
        </a>
      </div>
    </div>
  );
}
