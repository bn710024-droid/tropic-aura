import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { langFromPath, pathFor } from "../i18n/routing";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema, faqPageSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";
import { IconShip, IconPlane, IconBox, IconClock, IconDocument } from "./trust/icons";

// ============================================================
//  LOGISTICS & EXPORT PROCESS — page de confiance B2B.
//
//  RÈGLE D'INTÉGRITÉ : aucun délai chiffré générique n'est inventé
//  (voir quality.leadTimes) — les délais dépendent de la destination,
//  de la saison et du transporteur, communiqués au cas par cas.
// ============================================================

export const PAGE_ENTRY_COLOR = { desktop: "#0B1310", mobile: "#0B1310" };
const GOLD = "#D4AF6A";
const FONT = "'Plus Jakarta Sans',sans-serif";
const accentBar = { display: "inline-block", width: 26, height: 2, background: GOLD, marginRight: 14, verticalAlign: "middle", borderRadius: 2 };

export default function Logistics() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const path = pathFor("logistics", lang);
  const trail = buildBreadcrumbTrail(path);
  const description = t("logistics.seo.description");
  const faq = t("logistics.faq", { returnObjects: true });

  const revealRefs = useRef([]);
  const reveal = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };
  useEffect(() => {
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
    return () => io.disconnect();
  }, []);
  const r0 = { opacity: 0, transform: "translateY(22px)", transition: "opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1)" };

  const h2 = { fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#1A1A1A", margin: "0 0 14px", letterSpacing: "-.01em" };
  const pStyle = { fontFamily: FONT, fontSize: 14.5, lineHeight: 1.75, color: "rgba(0,0,0,0.65)", margin: "0 0 20px", maxWidth: 640 };
  const li = { fontFamily: FONT, fontSize: 14, lineHeight: 1.65, color: "rgba(0,0,0,0.7)", marginBottom: 10 };

  const steps = t("logistics.timeline.steps", { returnObjects: true });
  const chainSteps = t("logistics.chain.steps", { returnObjects: true });
  const incotermItems = t("logistics.incoterms.items", { returnObjects: true });

  return (
    <>
      <SEOHead
        title={t("logistics.seo.title")}
        description={description}
        path={path}
        keywords={lang === "en"
          ? ["FOB Dakar incoterms", "export process Senegal", "air freight sea freight fresh produce", "export documentation"]
          : ["Incoterms FOB Dakar", "process export Sénégal", "fret aérien maritime fruits légumes", "documents export"]}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path, title: t("logistics.title"), description, breadcrumb: true }),
          breadcrumbListSchema(trail, path),
          faqPageSchema(faq),
        ]}
      />
      <TopBar />
      <img src="/logo-mark.png" alt={t("logistics.seo.logoAlt")} width={512} height={512} style={{ display: "none" }} />
      <Breadcrumbs trail={trail} />

      <main>
      {/* ── Hero ── */}
      <section style={{
        minHeight: "60vh", background: "#0B1310",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(120px,18vh,200px) clamp(24px,8vw,140px) clamp(60px,10vh,110px)",
      }}>
        <div style={{ maxWidth: 880 }}>
          <span ref={reveal} style={{ ...r0, display: "block", fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: ".30em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>
            {t("logistics.kicker")}
          </span>
          <h1 ref={reveal} style={{ ...r0, transitionDelay: ".08s", fontFamily: FONT, fontWeight: 800, fontSize: "clamp(32px,4.6vw,60px)", lineHeight: 1.1, letterSpacing: "-.03em", color: "#fff", margin: "0 0 26px", maxWidth: "20ch" }}>
            {t("logistics.title")}
          </h1>
          <p ref={reveal} style={{ ...r0, transitionDelay: ".16s", fontFamily: FONT, fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.8, fontWeight: 400, color: "rgba(255,255,255,0.74)", margin: 0, maxWidth: 620 }}>
            {t("logistics.intro")}
          </p>
        </div>
      </section>

      {/* ── Timeline process export ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 980, margin: "0 auto" }}>
          <h2 style={h2}><span style={accentBar} aria-hidden="true" />{t("logistics.timeline.heading")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 30 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 20, paddingBottom: i < steps.length - 1 ? 22 : 0, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <span style={{
                    width: 30, height: 30, borderRadius: "50%", background: "#1C1712", color: GOLD,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FONT, fontWeight: 800, fontSize: 12.5, flexShrink: 0,
                  }}>{i + 1}</span>
                  {i < steps.length - 1 && <span style={{ width: 1, flex: 1, background: "rgba(0,0,0,0.15)", marginTop: 4 }} />}
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#1A1A1A", margin: "3px 0 4px" }}>{s.label}</p>
                  <p style={{ fontFamily: FONT, fontSize: 13.5, lineHeight: 1.65, color: "rgba(0,0,0,0.6)", margin: 0, maxWidth: 480 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Incoterms ── */}
      <section style={{ background: "#0B1310", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#fff", margin: "0 0 10px" }}>
            <span style={accentBar} aria-hidden="true" />{t("logistics.incoterms.heading")}
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.65)", margin: "0 0 30px", maxWidth: 640 }}>{t("logistics.incoterms.intro")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {incotermItems.map((it, i) => (
              <div key={i} style={{ border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "22px 20px" }}>
                <p style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: GOLD, margin: "0 0 8px", letterSpacing: ".02em" }}>{it.name}</p>
                <p style={{ fontFamily: FONT, fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,0.62)", margin: 0 }}>{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Transport ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 980, margin: "0 auto" }}>
          <h2 style={h2}><span style={accentBar} aria-hidden="true" />{t("logistics.transport.heading")}</h2>
          <p style={pStyle}>{t("logistics.transport.intro")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, marginTop: 10 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ color: GOLD }}><IconPlane /></span>
                <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", margin: 0 }}>{t("logistics.transport.air.heading")}</p>
              </div>
              <p style={{ ...li, marginBottom: 0 }}>{t("logistics.transport.air.text")}</p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ color: GOLD }}><IconShip /></span>
                <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", margin: 0 }}>{t("logistics.transport.sea.heading")}</p>
              </div>
              <p style={{ ...li, marginBottom: 0 }}>{t("logistics.transport.sea.text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conditionnement + Chaîne logistique + Délais ── */}
      <section style={{ background: "#0B1310", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <span style={{ color: GOLD }}><IconBox /></span>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#fff", margin: 0 }}>{t("logistics.packaging.heading")}</h2>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.65)", margin: "0 0 16px", maxWidth: 640 }}>{t("logistics.packaging.intro")}</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {t("logistics.packaging.points", { returnObjects: true }).map((p, i) => (
                <li key={i} style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>{p}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#fff", margin: "0 0 20px" }}>{t("logistics.chain.heading")}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              {chainSteps.map((s, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13.5, color: "#F5F1E8", background: "rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: 100 }}>{s}</span>
                  {i < chainSteps.length - 1 && <span style={{ color: GOLD }} aria-hidden="true">→</span>}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <span style={{ color: GOLD }}><IconClock /></span>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#fff", margin: 0 }}>{t("logistics.leadTimes.heading")}</h2>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.65)", margin: 0, maxWidth: 640 }}>{t("logistics.leadTimes.text")}</p>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <span style={{ color: GOLD }}><IconDocument /></span>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#fff", margin: 0 }}>{t("logistics.documents.heading")}</h2>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.65)", margin: "0 0 16px", maxWidth: 640 }}>{t("logistics.documents.intro")}</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {t("logistics.documents.items", { returnObjects: true }).map((it, i) => (
                <li key={i} style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>{it}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pourquoi Tropicaura ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={h2}><span style={accentBar} aria-hidden="true" />{t("logistics.why.heading")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28, marginTop: 20 }}>
            {t("logistics.why.items", { returnObjects: true }).map((item, i) => (
              <div key={i}>
                <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#1A1A1A", margin: "0 0 8px" }}>{item.title}</p>
                <p style={{ fontFamily: FONT, fontSize: 13.5, lineHeight: 1.7, color: "rgba(0,0,0,0.6)", margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#0B1310", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }} aria-labelledby="logistics-faq-heading">
        <div ref={reveal} style={{ ...r0, maxWidth: 800, margin: "0 auto" }}>
          <h2 id="logistics-faq-heading" style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#fff", margin: "0 0 14px" }}>
            <span style={accentBar} aria-hidden="true" />{lang === "en" ? "Frequently Asked Questions" : "Questions fréquentes"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {faq.map((item) => (
              <details key={item.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.14)", padding: "18px 0" }}>
                <summary style={{ cursor: "pointer", fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", listStyle: "none" }}>{item.q}</summary>
                <p style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", margin: "12px 0 0" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#1C1712", padding: "clamp(60px,9vh,100px) clamp(24px,8vw,140px)", textAlign: "center" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.6vw,32px)", color: "#fff", margin: "0 0 14px" }}>{t("logistics.cta.heading")}</h2>
          <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.7, color: "rgba(245,241,232,0.65)", margin: "0 0 30px" }}>{t("logistics.cta.text")}</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={`${pathFor("contact", lang)}?section=form`} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, textDecoration: "none", color: "#0B1310", background: GOLD, padding: "14px 28px", borderRadius: 100 }}>
              {t("logistics.cta.button")}
            </Link>
            <Link to={pathFor("contact", lang)} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, textDecoration: "none", color: "#F5F1E8", border: "1px solid rgba(245,241,232,0.35)", padding: "14px 28px", borderRadius: 100 }}>
              {t("logistics.cta.contactButton")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(50px,7vh,80px) clamp(24px,8vw,140px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ ...h2, fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>{t("logistics.related.heading")}</h2>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 12 }}>
            {[
              ["products", t("nav.products")],
              ["quality", t("nav.quality")],
              ["availability", t("nav.availability")],
              ["partnerships", t("nav.partnerships")],
              ["insights", t("nav.insights")],
              ["contact", t("nav.contact")],
            ].map(([key, label]) => (
              <Link key={key} to={pathFor(key, lang)} style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13.5, color: "#8A6A2E", textDecoration: "none", borderBottom: "1px solid rgba(138,106,46,0.3)" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
