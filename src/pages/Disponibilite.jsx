import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { langFromPath, pathFor } from "../i18n/routing";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";
import { PRODUCTS } from "../data/productsData";

// ============================================================
//  DISPONIBILITÉ — calendrier de saisonnalité par produit
//
//  Aucune nouvelle donnée : seasonMonths/peakMonths dans
//  productsData.js sont un encodage machine-lisible du champ
//  `availability` déjà publié sur chaque fiche produit. Cette page
//  ne fait que le RENDRE visuellement exploitable (grille 12 mois)
//  au lieu de le laisser enfoui dans une phrase par produit.
//
//  Objectif identifié lors de l'audit SEO/GEO concurrentiel : seul
//  vrai contenu manquant face aux exportateurs égyptiens étudiés
//  (GEO Exporting a un calendrier 12 mois, Tropicaura non).
// ============================================================

export const PAGE_ENTRY_COLOR = { desktop: "#0B1310", mobile: "#0B1310" };

const GOLD = "#D4AF6A";
// Abréviations 3 lettres plutôt qu'une seule : "J" seul est ambigu (janvier,
// juin, juillet partagent la même initiale) — illisible pour un planning que
// l'on doit pouvoir lire d'un coup d'œil, pas déchiffrer.
const COLLECTIONS = ["SIGNATURE", "SAISON", "SPÉCIALITÉS"];

// Couleurs d'ambiance dédiées au hover de cette page — distinctes de
// accentColor (productsData.js), pensé pour les pastilles du calendrier.
// Ici on veut une teinte reconnaissable comme celle du vrai fruit, pas un
// pastel décoratif.
const AMBIENT_COLORS = {
  mangue: "#E8890A",
  avocat: "#4C7A3D",
  ananas: "#D9A62E",
  papaye: "#E2703A",
  banane: "#E8C547",
  melon: "#D4A340",
  pasteque: "#D6455B",
  gombo: "#5E8C3F",
  "haricot-vert": "#4F8B3B",
  "citron-vert": "#A8C93B",
  "citron-jaune": "#E8D227",
  piment: "#C23B2E",
};

export default function Disponibilite() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  // Mois traduits (tableaux i18n) : le calendrier est la donnée la plus lue
  // par un acheteur — « Aoû » n'a aucun sens pour un importateur anglophone.
  const MONTHS = t("availability.months", { returnObjects: true });
  const MONTH_LABELS = t("availability.monthsFull", { returnObjects: true });
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // Produit actuellement survolé (desktop) — pilote la teinte d'ambiance
  // plein écran. State local à ce composant : aucun re-render du reste de
  // l'app, transition gérée en CSS (opacity/background-color).
  const [hoveredSlug, setHoveredSlug] = useState(null);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    const lenis = isDesktop
      ? new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true })
      : null;
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
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    revealRefs.current.forEach((el) => el && io.observe(el));

    return () => {
      cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      io.disconnect();
    };
  }, []);

  const r0 = { opacity: 0, transform: "translateY(24px)", transition: "opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1)" };

  const description = t("availability.seo.description");
  const availabilityPath = pathFor("availability", lang);
  const trail = buildBreadcrumbTrail(availabilityPath);

  return (
    <div className="avail-page">
      <div
        className="avail-ambient"
        aria-hidden="true"
        style={{
          opacity: hoveredSlug ? 0.3 : 0,
          backgroundColor: hoveredSlug ? AMBIENT_COLORS[hoveredSlug] : "transparent",
        }}
      />
      <SEOHead
        title={t("availability.seo.title")}
        description={description}
        path={availabilityPath}
        keywords={lang === "en"
          ? ["fruit export seasonality", "Senegal mango calendar", "tropical produce availability"]
          : ["saisonnalité fruits export", "calendrier mangue Sénégal", "disponibilité fruits tropicaux export"]}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: availabilityPath, title: t("nav.availability"), description, breadcrumb: true }),
          breadcrumbListSchema(trail, availabilityPath),
        ]}
      />
      <style>{`
        .avail-row {
          display: grid;
          grid-template-columns: 200px repeat(12, 1fr) 150px;
          align-items: center;
          gap: 6px;
          padding: 14px 16px;
          margin: 0 -16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          position: relative;
          z-index: 1;
          transition: background-color .2s ease;
        }
        /* Survol teinté avec la couleur du produit (--row-hover-bg, posée
           inline par produit) plutôt qu'un gris générique — relie visuellement
           la ligne survolée à l'ambiance globale (.avail-ambient ci-dessous). */
        .avail-row:hover { background-color: var(--row-hover-bg, rgba(255,255,255,0.03)); }
        .avail-head {
          display: grid;
          grid-template-columns: 200px repeat(12, 1fr) 150px;
          gap: 6px;
          padding: 0 16px 12px;
          margin: 0 -16px;
        }
        .avail-cell {
          height: 22px; border-radius: 5px;
          background: rgba(255,255,255,0.07);
          transition: transform .15s ease;
        }
        .avail-row:hover .avail-cell { transform: scaleY(1.12); }
        .avail-more {
          color: #F5F1E8; text-decoration: none;
          border-bottom: 1px solid rgba(245,241,232,0.35);
          transition: border-color .2s ease;
        }
        .avail-more:hover { border-color: rgba(245,241,232,0.85); }
        @media (max-width: 860px) {
          .avail-head { display: none; }
          .avail-row { grid-template-columns: 1fr; gap: 10px; padding: 22px 16px; }
          .avail-row-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 4px; }
        }
        .avail-row-grid { display: contents; }
        @media (max-width: 860px) {
          .avail-row-grid { display: grid; }
        }

        /* ── Ambiance : TOUTE la page (nav, hero, calendrier) change de
           teinte, dominante par la couleur du produit survolé (desktop
           uniquement). Calque fixed plein écran, au-dessus de tout mais
           pointer-events:none — ne bloque jamais un clic ou un survol. ── */
        .avail-ambient {
          position: fixed; inset: 0; z-index: 9999;
          pointer-events: none;
          opacity: 0;
          transition: opacity .7s ease, background-color .7s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .avail-ambient { transition: none; }
        }
        @media (hover: none), (max-width: 860px) {
          .avail-ambient { display: none; }
        }
      `}</style>

      <TopBar />
      <img
        src="/logo-mark.png"
        alt={t("availability.seo.logoAlt")}
        width={512} height={512} style={{ display: "none" }}
      />
      <Breadcrumbs trail={trail} />

      <main>
      {/* ━━━━━ 1. DÉCLARATION ━━━━━ */}
      <section style={{
        minHeight: "70vh", background: "#0B1310",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(120px,18vh,200px) clamp(24px,8vw,140px) clamp(60px,10vh,110px)",
      }}>
        <div style={{ maxWidth: 880 }}>
          <span ref={reveal} style={{ ...r0,
            display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: ".30em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 28,
          }}>
            {t("availability.kicker")}
          </span>

          <h1 ref={reveal} style={{ ...r0, transitionDelay: ".08s",
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(36px, 5.4vw, 76px)", lineHeight: 1.06,
            letterSpacing: "-.03em", color: "#fff", margin: "0 0 26px", maxWidth: "16ch",
          }}>
            {t("availability.title")}
          </h1>

          <p ref={reveal} style={{ ...r0, transitionDelay: ".16s",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.8, fontWeight: 400,
            color: "rgba(255,255,255,0.74)", margin: 0, maxWidth: 620,
          }}>
            {t("availability.intro", { count: PRODUCTS.length })}
          </p>
        </div>
      </section>

      {/* ━━━━━ 2. CALENDRIER ━━━━━ */}
      <section style={{ background: "#1C1712", padding: "clamp(60px,10vh,110px) clamp(24px,8vw,140px) clamp(90px,14vh,150px)" }}>
        <div className="avail-cal-wrap" style={{ maxWidth: 1180, margin: "0 auto" }}>

          <div className="avail-head" aria-hidden="true">
            <span />
            {MONTHS.map((m, i) => (
              <span key={i} title={MONTH_LABELS[i]} style={{
                textAlign: "center", fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 11, fontWeight: 700, color: "rgba(245,241,232,0.45)", letterSpacing: ".02em",
              }}>{m}</span>
            ))}
            <span />
          </div>

          {COLLECTIONS.map((coll) => {
            const items = PRODUCTS.filter((p) => p.collection === coll);
            if (!items.length) return null;
            return (
              <div key={coll} ref={reveal} style={{ ...r0, marginTop: 44 }}>
                {/* Filet doré : même repère visuel que Contact/ProductDetail
                    (accentBar), absent jusqu'ici sur cette page — d'où le léger
                    manque de rythme signalé face aux autres pages. */}
                <div style={{ width: 36, height: 2, background: GOLD, marginBottom: 14, borderRadius: 2 }} />
                <span style={{
                  display: "block", marginBottom: 6,
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10.5, fontWeight: 700,
                  letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(245,241,232,0.45)",
                }}>
                  {t(`catalog.collections.${coll}`)}
                </span>

                {items.map((p) => (
                  <div
                    key={p.slug}
                    className="avail-row"
                    data-product={p.slug}
                    style={{ "--row-hover-bg": `${AMBIENT_COLORS[p.slug]}0D` }}
                    onMouseEnter={() => setHoveredSlug(p.slug)}
                    onMouseLeave={() => setHoveredSlug((s) => (s === p.slug ? null : s))}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img
                        src={p.image}
                        alt=""
                        width={40} height={40}
                        loading="lazy"
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "rgba(255,255,255,0.06)" }}
                      />
                      <div>
                        <Link to={`${pathFor("products", lang)}/${p.slug}`} style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15,
                          color: "#F5F1E8", textDecoration: "none",
                        }}>{t(`catalog.items.${p.slug}.name`)}</Link>
                        <span style={{
                          display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: 11.5, color: "rgba(245,241,232,0.55)", marginTop: 2,
                        }}>{p.origin}</span>
                      </div>
                    </div>

                    <div className="avail-row-grid">
                      {MONTHS.map((_, i) => {
                        const month = i + 1;
                        const active = p.seasonMonths?.includes(month);
                        const peak = p.peakMonths?.includes(month);
                        return (
                          <div
                            key={i} className="avail-cell"
                            title={`${MONTH_LABELS[i]}${active ? (peak ? t("availability.state.peak") : t("availability.state.available")) : t("availability.state.off")}`}
                            style={{
                              background: active ? (peak ? p.accentColor : `${p.accentColor}99`) : "rgba(255,255,255,0.07)",
                              border: peak ? `1.5px solid ${GOLD}` : "none",
                            }}
                          />
                        );
                      })}
                    </div>

                    <Link
                      to={`${pathFor("contact", lang)}?product=${encodeURIComponent(t(`catalog.items.${p.slug}.name`))}&origin=${encodeURIComponent(t(`catalog.items.${p.slug}.origin`))}&section=form`}
                      className="avail-more"
                      style={{
                        justifySelf: "end", fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                      }}
                    >
                      {t("availability.requestOffer")}
                    </Link>
                  </div>
                ))}
              </div>
            );
          })}

          <p ref={reveal} style={{ ...r0,
            marginTop: 40, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5,
            lineHeight: 1.7, color: "rgba(245,241,232,0.5)", maxWidth: 640,
          }}>
            {t("availability.note")}
          </p>
        </div>
      </section>
      </main>
    </div>
  );
}
