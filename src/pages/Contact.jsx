import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";

// ============================================================
//  CONTACT — « Le dernier chapitre »
//  3 moments : déclaration de marque (sombre) → expérience de
//  contact (clair, coordonnées + formulaire éditorial) → bloc
//  confiance (4 piliers, sombre). Apparitions douces au scroll.
//  Mobile-first. Le formulaire envoie réellement via /api/contact
//  (Resend) — la séquence de remerciement (carte, signature) ne se
//  déclenche qu'après confirmation serveur, jamais au clic seul.
// ============================================================

export const PAGE_ENTRY_COLOR = { desktop: "#0B1310", mobile: "#0B1310" };

const EMAIL = "contact@tropic-aura.com";
const PHONE = "+221 77 881 20 18";
const WHATSAPP_URL = "https://wa.me/221778812018";
const GOLD  = "#D4AF6A";

const PILIERS = [
  { titre: "Basé au Sénégal",          sous: "Au cœur des terroirs tropicaux d'Afrique de l'Ouest." },
  { titre: "Orienté export",            sous: "Des standards pensés pour les marchés internationaux." },
  { titre: "Marché européen",           sous: "Importateurs, distributeurs et grande distribution." },
  { titre: "Partenariats à long terme", sous: "Une vision de la valeur durable, pas de l'opportunisme." },
];

export default function Contact() {
  const revealRefs = useRef([]);
  const logoRef    = useRef(null);
  const messageRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | sent | error
  const [errorMsg, setErrorMsg] = useState("");
  const [signatureWriting, setSignatureWriting] = useState(false);

  // Pré-remplissage contextuel : arrivée depuis le CTA "Demander une offre"
  // d'une fiche produit (?product=...&origin=...) — voir ProductDetail.jsx.
  // Texte écrit directement dans le champ (defaultValue, modifiable), pas
  // en placeholder : un placeholder disparaît dès la frappe et peut donner
  // l'impression trompeuse qu'un message est déjà présent alors qu'il est vide.
  const searchParams = new URLSearchParams(window.location.search);
  const productParam = searchParams.get("product");
  const originParam  = searchParams.get("origin");
  const prefillMessage = productParam
    ? `Bonjour, je souhaiterais recevoir une offre pour ${productParam}${originParam ? ` (origine : ${originParam})` : ""}. Voici les volumes recherchés…`
    : "";

  // Particules dorées de la carte de remerciement — positions/délais figés
  // une seule fois (pas régénérés à chaque re-render de status). Mélange de
  // deux comportements (chute / flottement) pour un effet "poussière au
  // soleil" plutôt qu'une pluie uniforme.
  const dustParticles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4.5 + Math.random() * 3,
    size: 3 + Math.random() * 3,
    variant: i % 3 === 0 ? "float" : "fall",
  })), []);

  // collecte des éléments à révéler
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    // Smooth scroll (cohérence avec le reste du site) — DESKTOP UNIQUEMENT.
    // Sur mobile, Lenis fait "sauter" au retour vers le haut → scroll natif iOS.
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const lenis = isDesktop ? new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    }) : null;
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    if (lenis) rafId = requestAnimationFrame(raf);

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

    // Saut direct vers une section via ?section=<id> (déclenché par le
    // sous-lien "Nous contacter" du menu → /contact?section=form).
    const target = new URLSearchParams(window.location.search).get("section");
    let scrollTimeout;
    if (target === "form") {
      scrollTimeout = setTimeout(() => {
        const el = document.getElementById("contact-form");
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { duration: 1.2 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Curseur placé dans le message une fois le scroll lancé, seulement
        // si on arrive avec un produit pré-rempli (pas de focus intrusif sinon).
        if (productParam) {
          setTimeout(() => messageRef.current?.focus(), 500);
        }
      }, 80);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (lenis) lenis.destroy();
      io.disconnect();
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    const f = e.target.elements;
    const payload = {
      nom: f.nom.value.trim(),
      entreprise: f.entreprise.value.trim(),
      email: f.email.value.trim(),
      telephone: f.telephone.value.trim(),
      message: f.message.value.trim(),
      product: productParam || undefined,
      origin: originParam || undefined,
    };

    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "L'envoi a échoué. Réessayez ou écrivez-nous directement à contact@tropic-aura.com.");
        return;
      }
      setStatus("sent");
      // La signature "s'écrit" seule après un court temps de lecture du
      // message — voir carte de remerciement.
      setTimeout(() => setSignatureWriting(true), 2400);
    } catch {
      setStatus("error");
      setErrorMsg("L'envoi a échoué. Réessayez ou écrivez-nous directement à contact@tropic-aura.com.");
    }
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

  const contactDescription =
    "Contactez Tropicaura pour vos besoins d'import de fruits et légumes frais d'Afrique de l'Ouest. Devis, volumes, Incoterms FOB Dakar — réponse sous 48h.";
  const contactTrail = buildBreadcrumbTrail("/contact");

  return (
    <>
      <SEOHead
        title="Contact — Demander une Offre Export"
        description={contactDescription}
        path="/contact"
        keywords={["contact export fruits", "devis import fruits Afrique", "fournisseur Sénégal contact"]}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: "/contact", title: "Contact", description: contactDescription, breadcrumb: true, pageType: "ContactPage" }),
          breadcrumbListSchema(contactTrail, "/contact"),
        ]}
      />
      <style>{`
        .ct-grid  { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(40px,7vw,110px); }
        .ct-form-2{ display: grid; grid-template-columns: 1fr 1fr; gap: 26px 28px; }
        .ct-pill  { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(24px,4vw,56px); }
        .ct-input::placeholder { color: rgba(0,0,0,0.30); }
        @keyframes dustFall {
          0%   { transform: translateY(-10%) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          70%  { opacity: .8; }
          100% { transform: translateY(320px) translateX(14px); opacity: 0; }
        }
        @keyframes dustFloat {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          15%  { opacity: .9; }
          50%  { transform: translateY(-14px) translateX(8px); opacity: .5; }
          85%  { opacity: .7; }
          100% { transform: translateY(6px) translateX(-6px); opacity: 0; }
        }
        @keyframes cardIn {
          from { opacity: 0; filter: blur(4px); transform: translateY(20px) scale(.97); }
          to   { opacity: 1; filter: blur(0); transform: none; }
        }
        @keyframes cardShine {
          from { transform: translateX(-160%) skewX(-12deg); }
          to   { transform: translateX(160%) skewX(-12deg); }
        }
        @keyframes signOff {
          0%   { transform: rotate(0deg); }
          45%  { transform: rotate(.35deg); }
          100% { transform: rotate(0deg); }
        }
        @media (max-width: 820px){
          .ct-grid   { grid-template-columns: 1fr !important; gap: 48px !important; }
          .ct-form-2 { grid-template-columns: 1fr !important; }
          .ct-pill   { grid-template-columns: 1fr !important; gap: 30px !important; }
          .ct-coords { flex-direction: row !important; flex-wrap: wrap !important; gap: 26px 40px !important; }
        }
      `}</style>

      {/* Top bar avec logo + menu */}
      <TopBar />
      <img src="/logo-mark.png" alt="Tropicaura — Nous contacter pour vos besoins d'import fruits légumes" width={512} height={512} style={{ display: "none" }} />
      <Breadcrumbs trail={contactTrail} />

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
      <section id="contact-form" style={{
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
                { l: "Disponibilité", v: "Tous les jours · 8h – 00h (GMT)" },
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

          {/* Colonne droite — formulaire, puis carte de remerciement en overlay
              une fois l'envoi confirmé par le serveur (jamais avant). */}
          <form ref={reveal} onSubmit={onSubmit} style={{ ...r0, transitionDelay: ".1s", position: "relative" }}>
            <div style={{
              opacity: status === "sent" ? 0 : 1,
              filter: status === "sent" ? "blur(6px)" : "blur(0px)",
              transform: status === "sent" ? "translateY(14px)" : "none",
              pointerEvents: status === "sent" ? "none" : "auto",
              transition: "opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1), filter .6s ease",
            }}>
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
                <textarea ref={messageRef} className="ct-input" id="message" name="message" rows={4} required
                  placeholder="Parlez-nous de votre projet, de vos volumes, de vos marchés…"
                  defaultValue={prefillMessage}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>

              <button type="submit" disabled={status === "submitting"} style={{
                marginTop: 40,
                display: "inline-flex", alignItems: "center", gap: 14,
                background: status === "submitting" ? "#3A4A41" : "#0B1310", color: "#fff", border: "none",
                borderRadius: 100, padding: "16px 34px",
                cursor: status === "submitting" ? "default" : "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
                fontSize: 13, letterSpacing: ".06em",
                transition: "transform .3s cubic-bezier(.22,1,.36,1), background .3s",
              }}
                onMouseEnter={(e) => { if (status !== "submitting") { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "#16241D"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = status === "submitting" ? "#3A4A41" : "#0B1310"; }}
              >
                {status === "submitting" ? "Envoi en cours…" : status === "error" ? "Réessayer" : "Démarrer une conversation"}
                {status !== "submitting" && <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>}
              </button>

              {status === "error" && (
                <p style={{
                  marginTop: 16, fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 13.5, lineHeight: 1.6, color: "#B4432F",
                }}>
                  {errorMsg}
                </p>
              )}
            </div>

            {status === "sent" && (
              <div style={{
                position: "absolute", inset: 0, overflow: "hidden",
                animation: "cardIn .65s cubic-bezier(.22,1,.36,1) both",
                animationDelay: ".12s",
              }}>
                {/* Halo doré extrêmement doux derrière le texte — pas de flou
                    sur le contenu lui-même (contrairement au glass-card
                    rejeté ailleurs sur le site), juste une présence à peine
                    perceptible en arrière-plan. */}
                <div style={{
                  position: "absolute", left: "-10%", top: "-15%", width: "55%", height: "70%",
                  background: `radial-gradient(closest-side, ${GOLD}1F, transparent)`,
                  filter: "blur(70px)", pointerEvents: "none",
                }} />

                {/* Reflet unique, volontairement sous le seuil de perception
                    consciente — on le sent plus qu'on ne le voit. */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
                    background: "linear-gradient(100deg, transparent, rgba(255,255,255,.12), transparent)",
                    animation: "cardShine 1.6s ease-out 1s 1 both",
                  }} />
                </div>

                {/* Poussière dorée — chute et flottement mêlés */}
                <div style={{ position: "absolute", inset: "-40px 0 auto 0", height: 460, overflow: "hidden", pointerEvents: "none" }}>
                  {dustParticles.map((p, i) => (
                    <span key={i} style={{
                      position: "absolute", top: 0, left: `${p.left}%`,
                      width: p.size, height: p.size, borderRadius: "50%",
                      background: GOLD, boxShadow: `0 0 6px ${GOLD}`,
                      animation: `${p.variant === "float" ? "dustFloat" : "dustFall"} ${p.duration}s ease-in-out ${p.delay}s infinite`,
                    }} />
                  ))}
                </div>

                <div style={{ position: "relative", display: "flex", gap: 22, alignItems: "flex-start" }}>
                  <picture>
                    <source srcSet="/images/babacar-niang.webp" type="image/webp" />
                    <img
                      src="/images/babacar-niang.jpg"
                      alt="Babacar Niang, fondateur de Tropicaura"
                      width={92} height={92}
                      style={{
                        flexShrink: 0, width: 92, height: 92, borderRadius: "50%",
                        objectFit: "cover", border: `2px solid ${GOLD}`,
                      }}
                    />
                  </picture>

                  <div>
                    <p style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(15px,1.3vw,17px)",
                      lineHeight: 1.75, fontWeight: 400, color: "#1A1A1A", margin: "6px 0 20px", maxWidth: 46 + "ch",
                    }}>
                      Merci d'avoir pris le temps de nous écrire. Chaque demande est lue personnellement.
                      Je réponds moi-même à tous les messages afin de construire des partenariats solides
                      dès le premier échange.
                    </p>

                    <div style={{ overflow: "hidden", width: signatureWriting ? "auto" : 0, transition: "width 1.8s cubic-bezier(.65,0,.35,1)" }}>
                      <span style={{
                        display: "block", whiteSpace: "nowrap", transformOrigin: "left bottom",
                        fontFamily: "'Dancing Script',cursive", fontWeight: 700,
                        fontSize: 32, color: "#1A1A1A",
                        animation: signatureWriting ? "signOff .25s ease-out 1.8s both" : "none",
                      }}>
                        Babacar Niang
                      </span>
                    </div>

                    {/* Fin trait doré — se dessine juste après la signature,
                        comme si le document venait d'être paraphé. */}
                    <div style={{
                      width: signatureWriting ? 170 : 0, height: 1, background: GOLD,
                      transition: "width 1s cubic-bezier(.65,0,.35,1) 1.8s",
                    }} />

                    <span style={{
                      display: "block", marginTop: 8,
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700,
                      letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)",
                    }}>
                      Founder, Tropicaura
                    </span>

                    <span style={{
                      display: "block", marginTop: 12,
                      opacity: signatureWriting ? 1 : 0,
                      transition: "opacity 1.4s ease 2s",
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, fontStyle: "italic",
                      color: "rgba(0,0,0,0.55)",
                    }}>
                      Chaque demande est étudiée personnellement, avec une réponse apportée dans les meilleurs délais.
                    </span>

                    <p style={{
                      marginTop: 22, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13,
                      lineHeight: 1.6, fontStyle: "italic", color: "rgba(0,0,0,0.5)", maxWidth: 42 + "ch",
                    }}>
                      PS : Je n'ai pas encore une équipe de 50 personnes. Il y a de fortes chances que
                      ce soit moi qui lise votre message
                    </p>

                    <span style={{
                      display: "block", marginTop: 34, marginBottom: 14,
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700,
                      letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)",
                    }}>
                      En attendant ma réponse…
                    </span>

                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {[
                        { label: "WhatsApp",               href: WHATSAPP_URL, external: true },
                        { label: "Découvrir nos produits", href: "/produits" },
                        { label: "Lire nos insights",       href: "/insights" },
                      ].map((c) => (
                        <a key={c.href} href={c.href}
                          {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "12px 20px", borderRadius: 100,
                            border: "1px solid rgba(0,0,0,0.18)", textDecoration: "none",
                            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5, fontWeight: 600,
                            color: "#1A1A1A", transition: "border-color .25s, transform .25s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)"; e.currentTarget.style.transform = "none"; }}
                        >
                          {c.label} <span>→</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
            Pourquoi Tropicaura
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
              Tropicaura · Commerce Tropical d'Excellence
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
