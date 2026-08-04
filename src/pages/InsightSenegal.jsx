import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { langFromPath, pathFor } from "../i18n/routing";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema, articleSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";

const GOLD  = "#C9A84C";
const WHITE = "#FFFFFF";
const BG    = "#090F0A";

export default function InsightSenegal() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Lenis DESKTOP UNIQUEMENT (sur mobile il fait "sauter" au retour vers le haut).
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const lenis = isDesktop ? new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true }) : null;
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    if (lenis) rafId = requestAnimationFrame(raf);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    revealRefs.current.forEach((el) => el && io.observe(el));

    return () => { cancelAnimationFrame(rafId); if (lenis) lenis.destroy(); io.disconnect(); };
  }, []);

  const r = (delay = 0) => ({
    opacity: 0, transform: "translateY(16px)",
    transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  const lbl = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 9, fontWeight: 700, letterSpacing: ".22em",
    textTransform: "uppercase", color: GOLD, display: "inline-block",
  };

  // BULLETS_1 : libellés dans les fichiers i18n (articleSenegal.BULLETS_1)
  // BULLETS_2 : libellés dans les fichiers i18n (articleSenegal.BULLETS_2)
  // BULLETS_3 : libellés dans les fichiers i18n (articleSenegal.BULLETS_3)
  // BULLETS_4 : libellés dans les fichiers i18n (articleSenegal.BULLETS_4)
  // BULLETS_5 : libellés dans les fichiers i18n (articleSenegal.BULLETS_5)
  // BULLETS_6 : libellés dans les fichiers i18n (articleSenegal.BULLETS_6)

  const articlePath = pathFor("insightSenegal", lang);
  const articleTitle = t("insights.articles.senegal.title");
  const articleDescription = t("insights.articles.senegal.desc");
  const articleTrail = buildBreadcrumbTrail(articlePath);
  const publishedTime = "2026-06-01";

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <SEOHead
        title={articleTitle}
        description={articleDescription}
        path={articlePath}
        keywords={["Sénégal export fruits", "origine stratégique fruits tropicaux", "sourcing Afrique de l'Ouest"]}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={publishedTime}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: articlePath, title: articleTitle, description: articleDescription, breadcrumb: true }),
          breadcrumbListSchema(articleTrail, articlePath),
          articleSchema({ path: articlePath, title: articleTitle, description: articleDescription, image: "/menu-apropos.jpg", datePublished: publishedTime }),
        ]}
      />

      {/* SEO: Image avec dimensions pour validation (display:none mais présente dans HTML pré-rendu) */}
      <img
        src="/logo-mark.png"
        alt={t("insights.articles.senegal.logoAlt")}
        width={448}
        height={434}
        style={{ display: "none" }}
      />

      <style>{`
        /* ── Nav ── */
        .art-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 clamp(24px,6vw,80px); height: 60px;
          background: rgba(9,15,10,0.88); backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .art-brand {
          font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 800;
          font-size: 17px; letter-spacing: .04em; color: #fff;
          text-decoration: none;
        }
        .art-back {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: color .25s;
        }
        .art-back:hover { color: rgba(255,255,255,0.80); }

        /* ── Hero ── */
        .art-hero {
          position: relative; min-height: 90vh;
          display: flex; flex-direction: column; justify-content: flex-end;
          overflow: hidden;
        }
        .art-hero-bg {
          position: absolute; inset: 0;
          background-image: url("/fonds-insights.webp");
          background-size: cover; background-position: center 20%;
        }
        .art-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(9,15,10,0.06) 0%,
            rgba(9,15,10,0.28) 38%,
            rgba(9,15,10,0.80) 66%,
            rgba(9,15,10,0.97) 86%,
            rgba(9,15,10,1) 100%
          );
        }
        .art-hero-content {
          position: relative; z-index: 2;
          max-width: 860px; margin: 0 auto; width: 100%;
          padding: 0 clamp(24px,6vw,80px) 60px;
          box-sizing: border-box;
        }
        .art-hero-rule {
          position: relative; z-index: 2;
          height: 1px; background: rgba(255,255,255,0.12);
          margin: 0 clamp(24px,6vw,80px);
        }

        /* ── Reading column ── */
        .art-body {
          max-width: 720px; margin: 0 auto;
          padding: 0 clamp(24px,6vw,80px) 100px;
          box-sizing: border-box;
        }

        /* ── Typography ── */
        .art-intro {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(16px,1.25vw,18px); line-height: 1.85; font-weight: 400;
          color: rgba(255,255,255,0.70); margin: 0 0 28px;
        }
        .art-intro-lead {
          font-weight: 500; color: rgba(255,255,255,0.88);
          font-size: clamp(17px,1.35vw,19.5px);
        }
        .art-h2 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(16px,1.3vw,20px); font-weight: 700;
          letter-spacing: -.02em; color: #fff; line-height: 1.28;
          margin: 0 0 18px; padding-top: 44px;
          border-top: 1px solid rgba(255,255,255,0.09);
        }
        .art-h2-first { margin-top: 44px; }
        .art-p {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(14px,1.02vw,16px); line-height: 1.9; font-weight: 400;
          color: rgba(255,255,255,0.62); margin: 0 0 20px;
        }
        .art-ul { list-style: none; margin: 4px 0 24px; padding: 0; }
        .art-li {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(13.5px,.98vw,15.5px); line-height: 1.75; font-weight: 400;
          color: rgba(255,255,255,0.60); padding: 9px 0 9px 22px; position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .art-li:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .art-li::before {
          content: ""; position: absolute; left: 0; top: 50%;
          transform: translateY(-50%); width: 5px; height: 5px;
          border-radius: 1px; background: ${GOLD};
        }

        /* ── Tropicaura aside ── */
        .ta-block {
          margin: 48px 0; padding: 28px 32px;
          border-left: 3px solid ${GOLD};
          background: rgba(201,168,76,0.05);
          border-radius: 0 4px 4px 0;
        }
        .ta-label {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 8.5px; font-weight: 700;
          letter-spacing: .26em; text-transform: uppercase; color: ${GOLD};
          display: block; margin-bottom: 18px;
        }
        .ta-p {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(13.5px,.98vw,15.5px); line-height: 1.85; font-weight: 400;
          color: rgba(255,255,255,0.68); margin: 0 0 14px;
        }
        .ta-p:last-child { margin-bottom: 0; }

        /* ── Conclusion ── */
        .art-conclusion {
          margin-top: 60px; padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.14);
        }
        .art-conclusion-h2 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(17px,1.35vw,21px); font-weight: 700;
          letter-spacing: -.02em; color: #fff; line-height: 1.28;
          margin: 0 0 22px;
        }
        .art-quote {
          margin-top: 44px; padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.09);
        }
        .art-quote-text {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(15px,1.15vw,17.5px); line-height: 1.62; font-weight: 600;
          color: rgba(255,255,255,0.78); font-style: italic;
          letter-spacing: -.01em; margin: 0;
        }

        /* ── Footer sep ── */
        .art-sep {
          max-width: 720px; margin: 0 auto;
          padding: 0 clamp(24px,6vw,80px) 48px;
          display: flex; align-items: center; gap: 0;
          box-sizing: border-box;
        }
        .art-sep-line { flex: 1; height: 1px; background: rgba(255,255,255,0.10); }
        .art-sep-link {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .20em; text-transform: uppercase;
          color: rgba(255,255,255,0.32); text-decoration: none;
          white-space: nowrap; padding: 0 20px; transition: color .25s;
        }
        .art-sep-link:hover { color: rgba(255,255,255,0.72); }

        /* ── Outro ── */
        .art-outro {
          position: relative; min-height: 62vh; overflow: hidden;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
        }
        .art-outro-bg {
          position: absolute; inset: 0;
          background-image: url("/fonds-insights.webp");
          background-size: cover; background-position: center bottom;
        }
        .art-outro-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(9,15,10,1) 0%,
            rgba(9,15,10,0.60) 22%,
            rgba(9,15,10,0.38) 50%,
            rgba(9,15,10,0.18) 78%,
            rgba(9,15,10,0.0) 100%
          );
        }
        .art-outro-content {
          position: relative; z-index: 2;
          max-width: 680px; width: 100%;
          padding: 0 clamp(24px,6vw,80px);
          box-sizing: border-box; text-align: center;
        }
        .art-outro-quote {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(17px,1.55vw,23px); font-weight: 600; font-style: italic;
          color: rgba(255,255,255,0.93); line-height: 1.55; letter-spacing: -.015em;
          margin: 0 0 44px;
          text-shadow: 0 2px 24px rgba(9,15,10,0.60);
        }
        .art-outro-nav {
          display: flex; align-items: center; gap: 0; width: 100%;
        }
        .art-outro-line { flex: 1; height: 1px; background: rgba(255,255,255,0.20); }
        .art-outro-link {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .20em; text-transform: uppercase;
          color: rgba(255,255,255,0.50); text-decoration: none;
          white-space: nowrap; padding: 0 20px; transition: color .25s;
        }
        .art-outro-link:hover { color: rgba(255,255,255,0.90); }
      `}</style>

      {/* ══ Nav fixe ══ */}
      <nav className="art-nav">
        <a href={pathFor("home", lang)} className="art-brand ghost__logo">Tropicaura</a>
        <a href={pathFor("insights", lang)} className="art-back">← {t("insights.seeAll")}</a>
      </nav>
      <Breadcrumbs trail={articleTrail} />

      <main>
      {/* ══ Hero ══ */}
      <header className="art-hero">
        <div className="art-hero-bg" />
        <div className="art-hero-overlay" />
        <div className="art-hero-content" ref={reveal} style={r(0)}>
          <span style={{ ...lbl, marginBottom: 20 }}>{t("insights.articles.senegal.category")}</span>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(30px,3.6vw,56px)", lineHeight: 1.05,
            letterSpacing: "-.04em", color: WHITE,
            margin: "14px 0 32px", maxWidth: 820,
          }}>{t("articleSenegal.b1")}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {[["Tropicaura", true], [`${t("insights.articles.senegal.readTime")} ${t("insights.readTimeSuffix")}`, false], [t("insights.articles.senegal.date"), false]].map(([txt, bold], i) => (
              <span key={txt} style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />}
                <span style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 11.5, fontWeight: bold ? 600 : 400,
                  letterSpacing: ".06em", color: "rgba(255,255,255,0.50)",
                }}>{txt}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="art-hero-rule" />
      </header>

      {/* ══ Corps ══ */}
      <div className="art-body">

        <p ref={reveal} className="art-intro art-intro-lead" style={r(0.04)}>{t("articleSenegal.b2")}</p>
        <p ref={reveal} className="art-intro" style={r(0.07)}>{t("articleSenegal.b3")}</p>

        {/* ── 1 ── */}
        <h2 ref={reveal} className="art-h2 art-h2-first" style={r(0)}>{t("articleSenegal.b4")}</h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b5")}</p>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b6")}</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {t("articleSenegal.BULLETS_1", { returnObjects: true }).map((item) => <li key={item} className="art-li">{item}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b7")}</p>

        {/* ── 2 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>{t("articleSenegal.b8")}</h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b9")}</p>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b10")}</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {t("articleSenegal.BULLETS_2", { returnObjects: true }).map((item) => <li key={item} className="art-li">{item}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b11")}</p>

        {/* ── 3 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>{t("articleSenegal.b12")}</h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b13")}</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {t("articleSenegal.BULLETS_3", { returnObjects: true }).map((item) => <li key={item} className="art-li">{item}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b14")}</p>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b15")}</p>

        {/* ── 4 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>{t("articleSenegal.b16")}</h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b17")}</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {t("articleSenegal.BULLETS_4", { returnObjects: true }).map((item) => <li key={item} className="art-li">{item}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b18")}</p>

        {/* ── 5 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>{t("articleSenegal.b19")}</h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b20")}</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {t("articleSenegal.BULLETS_5", { returnObjects: true }).map((item) => <li key={item} className="art-li">{item}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b21")}</p>

        {/* ── 6 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>{t("articleSenegal.b22")}</h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b23")}</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {t("articleSenegal.BULLETS_6", { returnObjects: true }).map((item) => <li key={item} className="art-li">{item}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b24")}</p>

        {/* ══ Perspective Tropicaura ══ */}
        <div ref={reveal} className="ta-block" style={r(0.04)}>
          <span className="ta-label">Perspective Tropicaura</span>
          <p className="ta-p">{t("articleSenegal.b25")}</p>
          <p className="ta-p">{t("articleSenegal.b26")}</p>
          <p className="ta-p">{t("articleSenegal.b27")}</p>
        </div>

        {/* ── 7 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>{t("articleSenegal.b28")}</h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b29")}</p>
        <p ref={reveal} className="art-p" style={r(0.04)}>{t("articleSenegal.b30")}</p>

        {/* ══ Conclusion ══ */}
        <div ref={reveal} className="art-conclusion" style={r(0.04)}>
          <h2 className="art-conclusion-h2">{t("articleSenegal.b31")}</h2>
          <p className="art-p">{t("articleSenegal.b32")}</p>
          <p className="art-p">{t("articleSenegal.b33")}</p>
          <p className="art-p">{t("articleSenegal.b34")}</p>
          <p className="art-p">{t("articleSenegal.b35")}</p>
        </div>

      </div>

      {/* ══ Outro — citation + image ══ */}
      <div className="art-outro">
        <div className="art-outro-bg" />
        <div className="art-outro-overlay" />
        <div className="art-outro-content">
          <p className="art-outro-quote">{t("articleSenegal.b36")}</p>
          <div className="art-outro-nav">
            <div className="art-outro-line" />
            <a href={pathFor("insights", lang)} className="art-outro-link">← {t("insights.seeAll")}</a>
            <div className="art-outro-line" />
          </div>
        </div>
      </div>
      </main>

    </div>
  );
}
