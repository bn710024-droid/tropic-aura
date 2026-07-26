import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { langFromPath, pathFor } from "../i18n/routing";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema, faqPageSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";
import { IconShield, IconMagnifier, IconCertificate, IconThermometer, IconTag, IconDocument } from "./trust/icons";

// ============================================================
//  QUALITY & COMPLIANCE — page de confiance B2B.
//
//  Certification GlobalGAP : même affirmation que la FAQ partagée des
//  fiches produit (catalog.fr.json / catalog.en.json) — cohérence
//  volontaire entre cette page et le reste du site.
// ============================================================

export const PAGE_ENTRY_COLOR = { desktop: "#0B1310", mobile: "#0B1310" };
const GOLD = "#D4AF6A";
const FONT = "'Plus Jakarta Sans',sans-serif";

const accentBar = { display: "inline-block", width: 26, height: 2, background: GOLD, marginRight: 14, verticalAlign: "middle", borderRadius: 2 };

const SECTION_ICONS = { approach: IconTag, control: IconMagnifier, phytosanitary: IconCertificate, coldChain: IconThermometer, traceability: IconShield, documents: IconDocument };

export default function Quality() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const path = pathFor("quality", lang);
  const trail = buildBreadcrumbTrail(path);
  const description = t("quality.seo.description");
  const faq = t("quality.faq", { returnObjects: true });

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

  const sectionKeys = ["approach", "control", "phytosanitary", "coldChain", "traceability"];
  const h2 = { fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", color: "#1A1A1A", margin: "0 0 14px", letterSpacing: "-.01em" };
  const pStyle = { fontFamily: FONT, fontSize: 14.5, lineHeight: 1.75, color: "rgba(0,0,0,0.65)", margin: "0 0 16px", maxWidth: 640 };
  const li = { fontFamily: FONT, fontSize: 14, lineHeight: 1.65, color: "rgba(0,0,0,0.7)", marginBottom: 10 };

  return (
    <>
      <SEOHead
        title={t("quality.seo.title")}
        description={description}
        path={path}
        keywords={lang === "en"
          ? ["export quality control", "phytosanitary certificate Senegal", "fresh produce traceability", "cold chain export"]
          : ["contrôle qualité export", "certificat phytosanitaire Sénégal", "traçabilité fruits légumes", "chaîne du froid export"]}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path, title: t("quality.title"), description, breadcrumb: true }),
          breadcrumbListSchema(trail, path),
          faqPageSchema(faq),
        ]}
      />
      <TopBar />
      <img src="/logo-mark.png" alt={t("quality.seo.logoAlt")} width={512} height={512} style={{ display: "none" }} />
      <Breadcrumbs trail={trail} />

      {/* ── Hero ── */}
      <section style={{
        minHeight: "60vh", background: "#0B1310",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(120px,18vh,200px) clamp(24px,8vw,140px) clamp(60px,10vh,110px)",
      }}>
        <div style={{ maxWidth: 880 }}>
          <span ref={reveal} style={{ ...r0, display: "block", fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: ".30em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>
            {t("quality.kicker")}
          </span>
          <h1 ref={reveal} style={{ ...r0, transitionDelay: ".08s", fontFamily: FONT, fontWeight: 800, fontSize: "clamp(32px,4.6vw,60px)", lineHeight: 1.1, letterSpacing: "-.03em", color: "#fff", margin: "0 0 26px", maxWidth: "20ch" }}>
            {t("quality.title")}
          </h1>
          <p ref={reveal} style={{ ...r0, transitionDelay: ".16s", fontFamily: FONT, fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.8, fontWeight: 400, color: "rgba(255,255,255,0.74)", margin: 0, maxWidth: 620 }}>
            {t("quality.intro")}
          </p>
        </div>
      </section>

      {/* ── Sections qualité ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 56 }}>
          {sectionKeys.map((key) => {
            const Icon = SECTION_ICONS[key];
            const pts = t(`quality.sections.${key}.points`, { returnObjects: true });
            return (
              <div key={key} ref={reveal} style={r0}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                  <span style={{ color: GOLD }}><Icon /></span>
                  <h2 style={{ ...h2, margin: 0 }}>{t(`quality.sections.${key}.heading`)}</h2>
                </div>
                <p style={pStyle}>{t(`quality.sections.${key}.intro`)}</p>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {pts.map((pt, i) => <li key={i} style={li}>{pt}</li>)}
                </ul>
              </div>
            );
          })}

          {/* ── Documents ── */}
          <div ref={reveal} style={r0}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <span style={{ color: GOLD }}><IconDocument /></span>
              <h2 style={{ ...h2, margin: 0 }}>{t("quality.sections.documents.heading")}</h2>
            </div>
            <p style={pStyle}>{t("quality.sections.documents.intro")}</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {t("quality.sections.documents.items", { returnObjects: true }).map((it, i) => <li key={i} style={li}>{it}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pourquoi Tropicaura ── */}
      <section style={{ background: "#0B1310", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(24px,2.6vw,34px)", color: "#fff", margin: "0 0 32px", letterSpacing: "-.02em" }}>
            <span style={accentBar} aria-hidden="true" />{t("quality.why.heading")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
            {t("quality.why.items", { returnObjects: true }).map((item, i) => (
              <div key={i}>
                <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", margin: "0 0 8px" }}>{item.title}</p>
                <p style={{ fontFamily: FONT, fontSize: 13.5, lineHeight: 1.7, color: "rgba(255,255,255,0.62)", margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(70px,10vh,110px) clamp(24px,8vw,140px)" }} aria-labelledby="quality-faq-heading">
        <div ref={reveal} style={{ ...r0, maxWidth: 800, margin: "0 auto" }}>
          <h2 id="quality-faq-heading" style={h2}>
            <span style={accentBar} aria-hidden="true" />{lang === "en" ? "Frequently Asked Questions" : "Questions fréquentes"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {faq.map((item) => (
              <details key={item.q} style={{ borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "18px 0" }}>
                <summary style={{ cursor: "pointer", fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#1A1A1A", listStyle: "none" }}>{item.q}</summary>
                <p style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.75, color: "rgba(0,0,0,0.68)", margin: "12px 0 0" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#1C1712", padding: "clamp(60px,9vh,100px) clamp(24px,8vw,140px)", textAlign: "center" }}>
        <div ref={reveal} style={{ ...r0, maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(22px,2.6vw,32px)", color: "#fff", margin: "0 0 14px" }}>{t("quality.cta.heading")}</h2>
          <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.7, color: "rgba(245,241,232,0.65)", margin: "0 0 30px" }}>{t("quality.cta.text")}</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={`${pathFor("contact", lang)}?section=form`} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, textDecoration: "none", color: "#0B1310", background: GOLD, padding: "14px 28px", borderRadius: 100 }}>
              {t("quality.cta.button")}
            </Link>
            <Link to={pathFor("contact", lang)} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, textDecoration: "none", color: "#F5F1E8", border: "1px solid rgba(245,241,232,0.35)", padding: "14px 28px", borderRadius: 100 }}>
              {t("quality.cta.contactButton")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(50px,7vh,80px) clamp(24px,8vw,140px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ ...h2, fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>{t("quality.related.heading")}</h2>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 12 }}>
            {[
              ["products", t("nav.products")],
              ["logistics", t("nav.logistics")],
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
    </>
  );
}
