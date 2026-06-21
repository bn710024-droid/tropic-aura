import { useEffect, useRef } from "react";

// ============================================================
//  FOOTER — « L'épilogue »
//  Pas un footer classique : la conclusion du parcours de marque.
//  Couche 1 : déclaration éditoriale immense.
//  Couche 2 : zone d'information minimale (nav, contact, lieu).
//  Fond #09120A (continuité avec la dernière section sombre).
//  Posé AU-DESSUS des couches décoratives flottantes (z-index)
//  → rupture, silence, respiration. Apparitions douces au scroll.
// ============================================================

const EMAIL = "contact@tropic-aura.com";   // ⚠️ à remplacer
const PHONE = "+221 00 000 00 00";          // ⚠️ à remplacer
const LINKEDIN = "https://www.linkedin.com/"; // ⚠️ à remplacer

export default function Footer() {
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
    <footer style={{ position: "relative", zIndex: 10, background: "#09120A", overflow: "hidden" }}>
      <style>{`
        .ft-info { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: clamp(32px,5vw,80px); }
        @media (max-width: 820px){
          .ft-info { grid-template-columns: 1fr 1fr !important; gap: 44px 32px !important; }
        }
        @media (max-width: 520px){
          .ft-info { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Couche 1 : déclaration éditoriale ── */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(90px,13vh,150px) clamp(24px,8vw,140px) clamp(60px,8vh,90px)",
      }}>
        <h2 ref={reveal} style={{
          ...r0(0),
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
          fontSize: "clamp(30px, 5vw, 72px)", lineHeight: 1.06,
          letterSpacing: "-.035em", color: "#fff", margin: 0, maxWidth: 900,
        }}>
          Connecting Exceptional Origins With Exceptional Partners.
        </h2>

        <div ref={reveal} style={{
          ...r0(0.12), marginTop: "clamp(40px,6vh,64px)",
          display: "flex", flexWrap: "wrap", gap: "8px 26px",
        }}>
          {["Dakar, Senegal", "Premium Produce Export", "Europe-Focused Partnerships"].map((t, i) => (
            <span key={t} style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 500,
              letterSpacing: ".14em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.42)",
              display: "inline-flex", alignItems: "center", gap: 26,
            }}>
              {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)", marginLeft: -26 }} />}
              {t}
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
            <span style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
              fontSize: 22, letterSpacing: ".04em", color: "#fff", display: "block", marginBottom: 16,
            }}>
              TROPIC-AURA
            </span>
            <p style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, lineHeight: 1.7,
              fontWeight: 400, color: "rgba(255,255,255,0.45)", margin: 0, maxWidth: 240,
            }}>
              Commerce tropical d'excellence, du Sénégal vers les marchés les plus exigeants.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span style={colLabel}>Navigation</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[["Products", "/produits"], ["About", "/about"], ["Contact", "/contact"]].map(([l, h]) => (
                <a key={l} href={h} style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>{l}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <span style={colLabel}>Contact</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <a href={`mailto:${EMAIL}`} style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>{EMAIL}</a>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>{PHONE}</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" style={navLink} onMouseEnter={overOn} onMouseLeave={overOff}>LinkedIn</a>
            </div>
          </div>

          {/* Localisation */}
          <div>
            <span style={colLabel}>Location</span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
            }}>
              Dakar, Sénégal
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
            Built for Long-Term Partnerships.
          </span>
          <span style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 500,
            letterSpacing: ".10em", color: "rgba(255,255,255,0.28)",
          }}>
            © 2026 Tropic-Aura B.C.
          </span>
        </div>
      </div>
    </footer>
  );
}
