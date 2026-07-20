import { useEffect, useRef } from "react";
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
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const COLLECTIONS = ["SIGNATURE", "SAISON", "SPÉCIALITÉS"];

export default function Disponibilite() {
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

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

  const description =
    "Calendrier de disponibilité par produit — mangue, avocat, agrumes, gombo, piments et fruits d'Afrique de l'Ouest exportés par Tropicaura, mois par mois.";
  const trail = buildBreadcrumbTrail("/disponibilite");

  return (
    <>
      <SEOHead
        title="Calendrier de Disponibilité — Saisonnalité des Produits"
        description={description}
        path="/disponibilite"
        keywords={["saisonnalité fruits export", "calendrier mangue Sénégal", "disponibilité fruits tropicaux export"]}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: "/disponibilite", title: "Disponibilité", description, breadcrumb: true }),
          breadcrumbListSchema(trail, "/disponibilite"),
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
          border-top: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          transition: background-color .2s ease;
        }
        /* Aucun état hover n'existait sur cette page (vérifié) — pour un
           planning consulté ligne par ligne, un léger surlignage aide à suivre
           la lecture horizontale sans distraire (même logique que le survol
           des liens de coordonnées sur Contact.jsx). */
        .avail-row:hover { background-color: rgba(0,0,0,0.035); }
        .avail-head {
          display: grid;
          grid-template-columns: 200px repeat(12, 1fr) 150px;
          gap: 6px;
          padding: 0 16px 12px;
          margin: 0 -16px;
        }
        .avail-cell {
          height: 22px; border-radius: 5px;
          background: rgba(0,0,0,0.06);
          transition: transform .15s ease;
        }
        .avail-row:hover .avail-cell { transform: scaleY(1.12); }
        .avail-more {
          color: #1A1A1A; text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.3);
          transition: border-color .2s ease;
        }
        .avail-more:hover { border-color: rgba(0,0,0,0.75); }
        @media (max-width: 860px) {
          .avail-head { display: none; }
          .avail-row { grid-template-columns: 1fr; gap: 10px; padding: 22px 16px; }
          .avail-row-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 4px; }
        }
        .avail-row-grid { display: contents; }
        @media (max-width: 860px) {
          .avail-row-grid { display: grid; }
        }
      `}</style>

      <TopBar />
      <img
        src="/logo-mark.png"
        alt="Tropicaura — Calendrier de disponibilité des fruits et légumes d'export"
        width={512} height={512} style={{ display: "none" }}
      />
      <Breadcrumbs trail={trail} />

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
            Planifier votre approvisionnement
          </span>

          <h1 ref={reveal} style={{ ...r0, transitionDelay: ".08s",
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(36px, 5.4vw, 76px)", lineHeight: 1.06,
            letterSpacing: "-.03em", color: "#fff", margin: "0 0 26px", maxWidth: "16ch",
          }}>
            Un calendrier, pas des promesses.
          </h1>

          <p ref={reveal} style={{ ...r0, transitionDelay: ".16s",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.8, fontWeight: 400,
            color: "rgba(255,255,255,0.74)", margin: 0, maxWidth: 620,
          }}>
            {PRODUCTS.length} produits, leur disponibilité réelle mois par mois. De quoi construire
            un programme d'achat sans mauvaise surprise de saison.
          </p>
        </div>
      </section>

      {/* ━━━━━ 2. CALENDRIER ━━━━━ */}
      <section style={{ background: "#F5F1E8", padding: "clamp(60px,10vh,110px) clamp(24px,8vw,140px) clamp(90px,14vh,150px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>

          <div className="avail-head" aria-hidden="true">
            <span />
            {MONTHS.map((m, i) => (
              <span key={i} title={MONTH_LABELS[i]} style={{
                textAlign: "center", fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.4)", letterSpacing: ".02em",
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
                  letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)",
                }}>
                  {coll === "SIGNATURE" ? "Signature" : coll === "SAISON" ? "Saison" : "Spécialités"}
                </span>

                {items.map((p) => (
                  <div key={p.slug} className="avail-row">
                    <div>
                      <Link to={`/produits/${p.slug}`} style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15,
                        color: "#1A1A1A", textDecoration: "none",
                      }}>{p.name}</Link>
                      <span style={{
                        display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 11.5, color: "rgba(0,0,0,0.45)", marginTop: 2,
                      }}>{p.origin}</span>
                    </div>

                    <div className="avail-row-grid">
                      {MONTHS.map((_, i) => {
                        const month = i + 1;
                        const active = p.seasonMonths?.includes(month);
                        const peak = p.peakMonths?.includes(month);
                        return (
                          <div
                            key={i} className="avail-cell"
                            title={`${MONTH_LABELS[i]}${active ? (peak ? " — pic de disponibilité" : " — disponible") : " — hors saison"}`}
                            style={{
                              background: active ? (peak ? p.accentColor : `${p.accentColor}99`) : "rgba(0,0,0,0.06)",
                              border: peak ? `1.5px solid ${GOLD}` : "none",
                            }}
                          />
                        );
                      })}
                    </div>

                    <Link
                      to={`/contact?product=${encodeURIComponent(p.name)}&origin=${encodeURIComponent(p.origin)}&section=form`}
                      className="avail-more"
                      style={{
                        justifySelf: "end", fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                      }}
                    >
                      Demander une offre →
                    </Link>
                  </div>
                ))}
              </div>
            );
          })}

          <p ref={reveal} style={{ ...r0,
            marginTop: 40, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5,
            lineHeight: 1.7, color: "rgba(0,0,0,0.45)", maxWidth: 640,
          }}>
            Fenêtres indicatives, sujettes aux aléas de récolte et de saison. Les liserés dorés
            signalent un pic de disponibilité. Pour un calendrier ferme sur votre volume et
            votre marché, contactez-nous directement.
          </p>
        </div>
      </section>
    </>
  );
}
