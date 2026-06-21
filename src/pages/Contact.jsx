import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ============================================================
//  CONTACT — « Le dernier chapitre »
//  3 moments : déclaration de marque (sombre) → expérience de
//  contact (clair, coordonnées + formulaire éditorial) → bloc
//  confiance (4 piliers, sombre). Apparitions douces au scroll.
//  Mobile-first. Le formulaire ouvre le client mail pré-rempli.
//
//  ⚠️ Coordonnées provisoires — à remplacer par les vraies.
// ============================================================

const EMAIL = "contact@tropic-aura.com";
const PHONE = "+221 00 000 00 00";

const PILIERS = [
  { titre: "Basé au Sénégal",          sous: "Au cœur des terroirs tropicaux d'Afrique de l'Ouest." },
  { titre: "Orienté export",            sous: "Des standards pensés pour les marchés internationaux." },
  { titre: "Marché européen",           sous: "Importateurs, distributeurs et grande distribution." },
  { titre: "Partenariats à long terme", sous: "Une vision de la valeur durable, pas de l'opportunisme." },
];

export default function Contact() {
  const revealRefs = useRef([]);
  const logoRef    = useRef(null);

  // collecte des éléments à révéler
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    // Smooth scroll (cohérence avec le reste du site)
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    // Apparitions douces au scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealRefs.current.forEach((el) => el && io.observe(el));

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      io.disconnect();
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const f = e.target.elements;
    const nom  = f.nom.value.trim();
    const ese  = f.entreprise.value.trim();
    const mail = f.email.value.trim();
    const tel  = f.telephone.value.trim();
    const msg  = f.message.value.trim();
    const subject = `Demande de partenariat${ese ? " — " + ese : ""}`;
    const body =
      `Nom : ${nom}\n` +
      `Entreprise : ${ese}\n` +
      `Email : ${mail}\n` +
      `Téléphone : ${tel}\n\n` +
      `${msg}\n`;
    window.location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // styles partagés du formulaire (champ « éditorial » : filet bas uniquement)
  const labelStyle = {
    display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 10, fontWeight: 700, letterSpacing: ".18em",
    textTransform: "uppercase", color: "rgba(0,0,0,0.45)", marginBottom: 8,
  };
  const inputStyle = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(0,0,0,0.22)", padding: "8px 0 12px",
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16,
    color: "#1A1A1A", outline: "none",
    transition: "border-color .25s ease",
  };
  const onFocus = (e) => { e.target.style.borderColor = "#1A1A1A"; };
  const onBlur  = (e) => { e.target.style.borderColor = "rgba(0,0,0,0.22)"; };

  const r0 = { opacity: 0, transform: "translateY(26px)", transition: "opacity .9s ease, transform .9s cubic-bezier(.22,1,.36,1)" };

  return (
    <>
      <style>{`
        .ct-grid  { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(40px,7vw,110px); }
        .ct-form-2{ display: grid; grid-template-columns: 1fr 1fr; gap: 26px 28px; }
        .ct-pill  { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(24px,4vw,56px); }
        .ct-input::placeholder { color: rgba(0,0,0,0.30); }
        @media (max-width: 820px){
          .ct-grid   { grid-template-columns: 1fr !important; gap: 48px !important; }
          .ct-form-2 { grid-template-columns: 1fr !important; }
          .ct-pill   { grid-template-columns: 1fr !important; gap: 30px !important; }
          .ct-coords { flex-direction: row !important; flex-wrap: wrap !important; gap: 26px 40px !important; }
        }
      `}</style>

      {/* Logo (s'inverse automatiquement selon le fond via mix-blend) */}
      <span
        ref={logoRef}
        style={{
          position: "fixed", top: 20, left: "clamp(20px,5vw,48px)", zIndex: 200,
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
          fontSize: 18, letterSpacing: ".04em", color: "#fff",
          mixBlendMode: "difference", pointerEvents: "none",
        }}
      >
        TROPICAURA
      </span>

      {/* ━━━━━ 1. DÉCLARATION FINALE ━━━━━ */}
      <section style={{
        minHeight: "100vh", background: "#0B1310",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(120px,18vh,200px) clamp(24px,8vw,140px) clamp(80px,12vh,140px)",
      }}>
        <div style={{ maxWidth: 880 }}>
          <span ref={reveal} style={{ ...r0,
            display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: ".30em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 28,
          }}>
            Le dernier chapitre
          </span>

          <h1 ref={reveal} style={{ ...r0, transitionDelay: ".08s",
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(40px, 6.2vw, 92px)", lineHeight: 1.04,
            letterSpacing: "-.035em", color: "#fff", margin: "0 0 30px",
            maxWidth: 14 + "ch",
          }}>
            Construisons quelque chose d'exceptionnel ensemble.
          </h1>

          <p ref={reveal} style={{ ...r0, transitionDelay: ".16s",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.8, fontWeight: 400,
            color: "rgba(255,255,255,0.74)", margin: 0, maxWidth: 620,
          }}>
            Nous collaborons avec des importateurs, distributeurs et acteurs de la grande
            distribution à travers l'Europe qui recherchent des produits premium, une
            exécution fiable et une vision à long terme.
          </p>
        </div>
      </section>

      {/* ━━━━━ 2. EXPÉRIENCE DE CONTACT ━━━━━ */}
      <section style={{
        background: "#F5F1E8",
        padding: "clamp(80px,14vh,160px) clamp(24px,8vw,140px)",
      }}>
        <div className="ct-grid" style={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Colonne gauche — coordonnées */}
          <div ref={reveal} style={r0}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
              fontSize: "clamp(24px,2.4vw,34px)", letterSpacing: "-.02em",
              color: "#1A1A1A", margin: "0 0 36px", lineHeight: 1.1,
            }}>
              Parlons-en.
            </h2>

            <div className="ct-coords" style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {[
                { l: "Email",        v: EMAIL, href: `mailto:${EMAIL}` },
                { l: "Téléphone",    v: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
                { l: "Localisation", v: "Dakar, Sénégal" },
                { l: "Disponibilité", v: "Lun – Ven · 9h – 18h (GMT)" },
              ].map((c) => (
                <div key={c.l}>
                  <span style={{
                    display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 10, fontWeight: 700, letterSpacing: ".18em",
                    textTransform: "uppercase", color: "rgba(0,0,0,0.42)", marginBottom: 7,
                  }}>{c.l}</span>
                  {c.href ? (
                    <a href={c.href} style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(16px,1.4vw,19px)",
                      fontWeight: 500, color: "#1A1A1A", textDecoration: "none",
                      borderBottom: "1px solid transparent", transition: "border-color .25s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.4)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                    >{c.v}</a>
                  ) : (
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(16px,1.4vw,19px)",
                      fontWeight: 500, color: "#1A1A1A",
                    }}>{c.v}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <form ref={reveal} onSubmit={onSubmit} style={{ ...r0, transitionDelay: ".1s" }}>
            <div className="ct-form-2">
              <div>
                <label style={labelStyle} htmlFor="nom">Nom</label>
                <input className="ct-input" id="nom" name="nom" type="text" required
                  placeholder="Votre nom" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="entreprise">Entreprise</label>
                <input className="ct-input" id="entreprise" name="entreprise" type="text"
                  placeholder="Votre société" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="email">Email</label>
                <input className="ct-input" id="email" name="email" type="email" required
                  placeholder="vous@entreprise.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="telephone">Téléphone</label>
                <input className="ct-input" id="telephone" name="telephone" type="tel"
                  placeholder="+33 ..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div style={{ marginTop: 26 }}>
              <label style={labelStyle} htmlFor="message">Message</label>
              <textarea className="ct-input" id="message" name="message" rows={4} required
                placeholder="Parlez-nous de votre projet, de vos volumes, de vos marchés…"
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={onFocus} onBlur={onBlur} />
            </div>

            <button type="submit" style={{
              marginTop: 40,
              display: "inline-flex", alignItems: "center", gap: 14,
              background: "#0B1310", color: "#fff", border: "none",
              borderRadius: 100, padding: "16px 34px", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
              fontSize: 13, letterSpacing: ".06em",
              transition: "transform .3s cubic-bezier(.22,1,.36,1), background .3s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "#16241D"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "#0B1310"; }}
            >
              Démarrer une conversation
              <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
            </button>
          </form>
        </div>
      </section>

      {/* ━━━━━ 3. BLOC CONFIANCE & PARTENARIAT ━━━━━ */}
      <section style={{
        background: "#0B1310",
        padding: "clamp(80px,14vh,150px) clamp(24px,8vw,140px)",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <span ref={reveal} style={{ ...r0,
            display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: ".26em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 48,
          }}>
            Pourquoi Tropic-Aura
          </span>

          <div className="ct-pill">
            {PILIERS.map((p, i) => (
              <div key={p.titre} ref={reveal} style={{ ...r0, transitionDelay: `${0.06 * i}s` }}>
                <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.16)", marginBottom: 20 }} />
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
                  fontSize: "clamp(17px,1.5vw,21px)", letterSpacing: "-.01em",
                  color: "#fff", margin: "0 0 10px", lineHeight: 1.2,
                }}>{p.titre}</h3>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5,
                  lineHeight: 1.7, fontWeight: 400, color: "rgba(255,255,255,0.6)", margin: 0,
                }}>{p.sous}</p>
              </div>
            ))}
          </div>

          <div ref={reveal} style={{ ...r0, transitionDelay: ".3s",
            marginTop: "clamp(56px,9vh,96px)", display: "flex", alignItems: "center", gap: 18,
          }}>
            <div style={{ width: 26, height: 1, background: "rgba(255,255,255,0.18)" }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 500,
              letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
            }}>
              TROPIC-AURA · Commerce Tropical d'Excellence
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
