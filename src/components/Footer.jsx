import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { langFromPath, pathFor } from "../i18n/routing";

// ============================================================
//  FOOTER — « L'épilogue »
//  Pas un footer classique : la conclusion du parcours de marque.
//  Couche 1 : déclaration éditoriale immense.
//  Couche 2 : zone d'information minimale (nav, contact, lieu).
//  Fond #09120A (continuité avec la dernière section sombre).
//  Posé AU-DESSUS des couches décoratives flottantes (z-index)
//  → rupture, silence, respiration. Apparitions douces au scroll.
// ============================================================

const EMAIL = "contact@tropic-aura.com";
const PHONE = "+221 77 881 20 18";
const WHATSAPP = "https://wa.me/221789179805";
// LinkedIn retiré : le compte a été banni par la plateforme. Le lien pointait
// de toute façon vers l'accueil du réseau, pas vers une page Tropicaura —
// un lien social qui ne mène nulle part coûte plus en crédibilité qu'il ne
// rapporte. À réintroduire uniquement le jour où une vraie page existe.
const INSTAGRAM = "https://www.instagram.com/tropicaura_export/";

export default function Footer() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const r0 = (delay = 0) => ({
    opacity: 0, transform: "translateY(30px)",
    transition: `opacity 1s ease ${delay}s, transform 1s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  const navLink = {
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 500,
    color: "rgba(255,255,255,0.65)", textDecoration: "none",
    transition: "color .25s ease", display: "inline-block",
  };
  const overOn  = (e) => (e.currentTarget.style.color = "#fff");
  const overOff = (e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)");
  const colLabel = {
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700,
    letterSpacing: ".22em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.38)", marginBottom: 20, display: "block",
  };

  return (
    <footer style={{ position: "relative", zIndex: 10, background: "transparent", overflow: "hidden" }}>
      <style>{`
        .ft-info { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: clamp(32px,5vw,80px); }
        @media (max-width: 820px){
          .ft-info { grid-template-columns: 1fr 1fr !important; gap: 44px 32px !important; }
        }
        @media (max-width: 520px){
          .ft-info { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Fond : transparent en haut → #09120A. Sur les pages à fond fixe
         (accueil, etc.), la couleur de la page transparaît et se fond
         dans le footer → même logique de transition couleur que le site. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(9,18,10,0) 0%, rgba(9,18,10,0.6) 22vh, #09120A 48vh)",
      }} />

      {/* Contenu au-dessus du dégradé */}
      <div style={{ position: "relative", zIndex: 1 }}>

      {/* ── Couche 1 : déclaration éditoriale (écran plein → s'intègre
             au rythme de scroll « un écran à la fois ») ── */}
      <div style={{
        minHeight: "100vh", boxSizing: "border-box",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(90px,13vh,150px) clamp(24px,8vw,140px) clamp(60px,8vh,90px)",
      }}>
        <h2 ref={reveal} style={{
          ...r0(0),
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
          fontSize: "clamp(30px, 5vw, 72px)", lineHeight: 1.06,
          letterSpacing: "-.035em", color: "#fff", margin: 0, maxWidth: 900,
        }}>
          {t("footer.statement")}
        </h2>

        <div ref={reveal} style={{
          ...r0(0.12), marginTop: "clamp(40px,6vh,64px)",
          display: "flex", flexWrap: "wrap", gap: "8px 26px",
        }}>
          {[t("footer.tags.location"), t("footer.tags.export"), t("footer.tags.focus")].map((label, i) => (
            <span key={label} style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 500,
              letterSpacing: ".14em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.42)",
              display: "inline-flex", alignItems: "center", gap: 26,
            }}>
              {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)", marginLeft: -26 }} />}
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Ligne très fine ── */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.15)", margin: "0 clamp(24px,8vw,140px)" }} />

      {/* ── Couche 2 : zone d'information ── */}
      <div style={{ padding: "clamp(64px,9vh,110px) clamp(24px,8vw,140px) clamp(40px,5vh,56px)" }}>
        <div className="ft-info" ref={reveal} style={r0(0)}>
          {/* Marque */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <img src="/logo-mark.png" alt="" style={{ height: 38, display: "block" }} />
              <span style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                fontSize: 20, letterSpacing: "-.01em", color: "#fff",
              }}>Tropicaura</span>
            </div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, lineHeight: 1.7,
              fontWeight: 400, color: "rgba(255,255,255,0.45)", margin: 0, maxWidth: 240,
            }}>
              <span className="only-desktop">{t("footer.brandDesc")}</span>
              <span className="only-mobile">{t("footer.brandDescMobile")}</span>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span style={colLabel}>{t("footer.colNavigation")}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {["products", "about", "insights", "contact"].map((page) => (
                <a key={page} href={pathFor(page, lang)} style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>
                  {t(`nav.${page}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <span style={colLabel}>{t("footer.colContact")}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <a href={`mailto:${EMAIL}`} style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>{EMAIL}</a>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>{PHONE}</a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>Instagram</a>
            </div>
          </div>

          {/* Localisation */}
          <div>
            <span style={colLabel}>{t("footer.colLocation")}</span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
            }}>
              {t("footer.location")}
            </span>
          </div>
        </div>

        {/* Signature finale */}
        <div ref={reveal} style={{
          ...r0(0.1), marginTop: "clamp(64px,9vh,110px)",
          display: "flex", flexWrap: "wrap", justifyContent: "space-between",
          alignItems: "center", gap: 18,
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.4vw,18px)",
            fontWeight: 600, letterSpacing: ".02em", color: "rgba(255,255,255,0.55)",
          }}>
            {t("footer.signature")}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <a
              href={pathFor("privacy", lang)}
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 500,
                letterSpacing: ".08em", color: "rgba(255,255,255,0.4)", textDecoration: "none",
              }}
              onMouseEnter={overOn} onMouseLeave={overOff}
            >
              {t("footer.privacy")}
            </a>
            <button
              onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 500,
                letterSpacing: ".08em", color: "rgba(255,255,255,0.4)", background: "none",
                border: "none", padding: 0, cursor: "pointer",
              }}
              onMouseEnter={overOn} onMouseLeave={overOff}
            >
              {t("footer.cookies")}
            </button>
            <span style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 500,
              letterSpacing: ".10em", color: "rgba(255,255,255,0.28)",
            }}>
              © 2026 Tropicaura B.C.
            </span>
          </div>
        </div>
      </div>

      </div>{/* fin contenu */}
    </footer>
  );
}
