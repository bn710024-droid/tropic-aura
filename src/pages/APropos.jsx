import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function APropos() {
  const wrapper4  = useRef(null);
  const s4content = useRef(null);
  const punchline = useRef(null);

  useEffect(() => {
    /* ── Lenis smooth scroll ── */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /* ── Section 4 : contenu s'efface → punchline apparaît ── */
    gsap.fromTo(s4content.current,
      { opacity: 1 },
      {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper4.current,
          start: "top+=42% top",
          end:   "top+=62% top",
          scrub: 1,
        },
      }
    );
    gsap.fromTo(punchline.current,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapper4.current,
          start: "top+=63% top",
          end:   "top+=86% top",
          scrub: 1,
        },
      }
    );

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* ── Helpers typographiques ── */
  const sur = (c) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".22em",
    textTransform: "uppercase",
    color: c,
    marginBottom: 20,
    display: "block",
  });
  const tit = (c) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontWeight: 800,
    fontSize: "clamp(30px,4vw,56px)",
    lineHeight: 1.0,
    letterSpacing: "-.03em",
    color: c,
    marginBottom: 28,
  });
  const dsc = (c) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: "clamp(14px,1.4vw,17px)",
    lineHeight: 1.78,
    fontWeight: 400,
    color: c,
    maxWidth: 470,
  });
  const pad = {
    position: "relative",
    zIndex: 5,
    padding: "0 clamp(20px,7vw,96px)",
    maxWidth: 570,
  };
  const sec = (bg, zi) => ({
    position: "sticky",
    top: 0,
    height: "100vh",
    background: bg,
    zIndex: zi,
    display: "flex",
    alignItems: "center",
    paddingTop: 66,
    boxSizing: "border-box",
    overflow: "hidden",
  });

  return (
    <div style={{ overflowX: "hidden", background: "#F5F2ED" }}>

      {/* ── Header ── */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        height: 66,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,48px)",
        pointerEvents: "none",
      }}>
        <a href="/" style={{
          pointerEvents: "auto",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: ".04em",
          color: "#1A2A1C",
          textDecoration: "none",
        }}>
          TROPICAURA
        </a>
        <a href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#1A2A1C",
            background: "rgba(0,0,0,0.06)",
            border: "1.5px solid rgba(0,0,0,0.14)",
            borderRadius: 100,
            padding: "9px 20px",
            cursor: "pointer",
          }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ══════════════════ SECTION 1 — bg #FBFAF6 ══════════════════ */}
      <div style={{ height: "200vh" }}>
        <section style={sec("#FBFAF6", 10)}>
          <div style={pad}>
            <span style={sur("#4A7A52")}>01 . CONVICTION</span>
            <h1 style={tit("#0A1A0C")}>Pourquoi Tropicaura existe</h1>
            <p style={dsc("#2E4035")}>
              Nous croyons que les terroirs tropicaux africains comptent parmi les
              plus remarquables au monde. Pourtant, leur potentiel reste encore
              insuffisamment valorisé sur les marchés internationaux. Tropicaura
              est née de la volonté de créer un lien plus direct, plus transparent
              et plus ambitieux entre ces origines d'exception et les acheteurs les
              plus exigeants. Nous invitons nos partenaires à participer à cette
              nouvelle dynamique&nbsp;: construire des connexions durables, révéler
              la véritable valeur des origines africaines et contribuer à une chaîne
              d'approvisionnement plus équitable, plus moderne et plus performante.
            </p>
          </div>
        </section>
      </div>

      {/* ══════════════════ SECTION 2 — bg #F2F5F1 ══════════════════ */}
      <div style={{ height: "200vh" }}>
        <section style={sec("#F2F5F1", 20)}>
          <div style={pad}>
            <span style={sur("#2E5A3C")}>02 . MISSION</span>
            <h2 style={tit("#0A1A0C")}>Ce que nous faisons aujourd'hui</h2>
            <p style={dsc("#263328")}>
              Nous développons des partenariats durables entre producteurs, stations
              de conditionnement, acteurs logistiques et importateurs internationaux
              afin de faciliter l'accès à des produits tropicaux de qualité tout en
              créant davantage de valeur à l'origine. Chaque collaboration représente
              une opportunité de bâtir ensemble un commerce plus efficace, plus
              transparent et plus bénéfique pour l'ensemble des acteurs de la chaîne
              de valeur.
            </p>
          </div>
        </section>
      </div>

      {/* ══════════════════ SECTION 3 — bg #F6F1E8 ══════════════════ */}
      <div style={{ height: "200vh" }}>
        <section style={sec("#F6F1E8", 30)}>
          <div style={pad}>
            <span style={sur("#6B5022")}>03 . VISION</span>
            <h2 style={tit("#140E04")}>Là où nous voulons aller</h2>
            <p style={dsc("#302512")}>
              Nous ne voulons pas simplement exporter des fruits. Nous voulons
              participer à la construction d'une nouvelle génération de marques
              africaines capables d'inspirer confiance, de créer de la valeur et
              de représenter l'excellence des régions tropicales sur la scène
              internationale. Nous recherchons des partenaires qui partagent cette
              ambition&nbsp;: faire émerger une nouvelle référence du commerce
              international, fondée sur la qualité, l'innovation et une vision à
              long terme.
            </p>
          </div>
        </section>
      </div>

      {/* ══════════════════ SECTION 4 — bg #F8F6F2 ══════════════════ */}
      <div ref={wrapper4} style={{ height: "260vh" }}>
        <section style={sec("#F8F6F2", 40)}>

          {/* Contenu principal — disparaît au scroll */}
          <div ref={s4content} style={{ ...pad, position: "relative", zIndex: 5 }}>
            <span style={sur("#5A4A30")}>04 . AVENIR</span>
            <h2 style={tit("#0A1A0C")}>Ce que nous construisons</h2>
            <p style={dsc("#302512")}>
              Nous imaginons un futur où les produits tropicaux africains seront
              recherchés non seulement pour leur qualité naturelle, mais aussi pour
              les standards d'excellence, de professionnalisme et d'innovation qui
              les accompagnent. Tropicaura entend contribuer à cette transformation
              aux côtés de producteurs, d'acheteurs et d'acteurs engagés qui
              souhaitent participer à l'émergence d'une Afrique plus visible, plus
              compétitive et plus influente sur les marchés mondiaux.
            </p>
          </div>

          {/* Punchline finale */}
          <div ref={punchline} style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            zIndex: 7,
            padding: "40px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px,3vw,50px)",
              lineHeight: 1.2,
              letterSpacing: "-.02em",
              color: "#0A1A0C",
              maxWidth: 640,
            }}>
              "L'avenir ne se construit pas seul.
              <br />Il se construit ensemble."
            </p>
          </div>

        </section>
      </div>

    </div>
  );
}
