import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   Helper : anime tous les <path> et <line> d'un SVG en stroke-dashoffset,
   scrubbed au wrapper de la section.
───────────────────────────────────────────────────────────────────────────── */
function initSVGDraw(svgEl, trigger) {
  if (!svgEl || !trigger) return;
  const els = [...svgEl.querySelectorAll("path, line")];
  els.forEach((el) => {
    try {
      const L = el.getTotalLength();
      if (!isFinite(L) || L <= 0) return;
      gsap.set(el, { strokeDasharray: L, strokeDashoffset: L });
      gsap.to(el, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    } catch (_) {}
  });
}

export default function APropos() {
  const wrapper1  = useRef(null);
  const wrapper2  = useRef(null);
  const wrapper3  = useRef(null);
  const wrapper4  = useRef(null);
  const svg1      = useRef(null);
  const svg2      = useRef(null);
  const svg3      = useRef(null);
  const svg4      = useRef(null);
  const s4deco    = useRef(null);   // anneau décoratif section 4
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

    /* ── SVG linework : tracé progressif par section ── */
    initSVGDraw(svg1.current, wrapper1.current);
    initSVGDraw(svg2.current, wrapper2.current);
    initSVGDraw(svg3.current, wrapper3.current);
    initSVGDraw(svg4.current, wrapper4.current);

    /* ── Section 4 : anneau s'efface → contenu s'efface → punchline ── */
    gsap.fromTo(s4deco.current,
      { opacity: 0.3 },
      {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper4.current,
          start: "top+=18% top",
          end:   "top+=52% top",
          scrub: 1.5,
        },
      }
    );
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

  /* ── Helpers typographiques (inline) ── */
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
    overflow: "hidden",
  });
  const svgLayer = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  };

  return (
    <div style={{ overflowX: "hidden" }}>

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

      {/* ══════════════════════════════════════════════════
          SECTION 1 — ORIGINES   bg #F6F1E8
          SVG : arcs organiques concentriques (canopée)
      ══════════════════════════════════════════════════ */}
      <div ref={wrapper1} style={{ height: "200vh" }}>
        <section style={sec("#FBFAF6", 10)}>

          <svg ref={svg1}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{ ...svgLayer, opacity: 0.085 }}>
            <g fill="none" stroke="#8B7040" strokeWidth="1" strokeLinecap="round">
              {/* Grands arcs concentriques depuis le haut — canopée abstraite */}
              <path d="M -80  720 Q 720 -120 1520  720"/>
              <path d="M   0  830 Q 720  -20 1440  830"/>
              <path d="M  60  900 Q 720   80 1380  900"/>
              <path d="M 180  900 Q 720  200 1260  900"/>
              <path d="M 340  900 Q 720  330 1100  900"/>
              <path d="M 520  900 Q 720  450  920  900"/>
              {/* Petits arcs internes — légèreté */}
              <path d="M 460  420 Q 590  180 720  360"/>
              <path d="M 720  360 Q 850  180 980  420"/>
              <path d="M 540  280 Q 720   70 900  280"/>
              <path d="M 620  200 Q 720   30 820  200"/>
            </g>
          </svg>

          <div style={pad}>
            <span style={sur("#4A7A52")}>01 . ORIGINES</span>
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

      {/* ══════════════════════════════════════════════════
          SECTION 2 — ENGAGEMENT   bg #DCE6DF
          SVG : lignes verticales architecturales fines
      ══════════════════════════════════════════════════ */}
      <div ref={wrapper2} style={{ height: "200vh" }}>
        <section style={sec("#F2F5F1", 20)}>

          <svg ref={svg2}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{ ...svgLayer, opacity: 0.09 }}>
            <g fill="none" stroke="#284838" strokeWidth="1" strokeLinecap="square">
              {/* 13 verticales — espacement légèrement irrégulier, hauteurs variées */}
              <line x1="148"  y1="72"  x2="148"  y2="828"/>
              <line x1="254"  y1="52"  x2="254"  y2="900"/>
              <line x1="366"  y1="34"  x2="366"  y2="856"/>
              <line x1="468"  y1="64"  x2="468"  y2="900"/>
              <line x1="574"  y1="48"  x2="574"  y2="870"/>
              <line x1="672"  y1="28"  x2="672"  y2="900"/>
              <line x1="720"  y1="18"  x2="720"  y2="900"/>
              <line x1="768"  y1="28"  x2="768"  y2="900"/>
              <line x1="866"  y1="48"  x2="866"  y2="870"/>
              <line x1="972"  y1="64"  x2="972"  y2="900"/>
              <line x1="1074" y1="34"  x2="1074" y2="856"/>
              <line x1="1186" y1="52"  x2="1186" y2="900"/>
              <line x1="1292" y1="72"  x2="1292" y2="828"/>
            </g>
          </svg>

          <div style={pad}>
            <span style={sur("#2E5A3C")}>02 . ENGAGEMENT</span>
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

      {/* ══════════════════════════════════════════════════
          SECTION 3 — AMBITION   bg #E7DFD2
          SVG : système de branchement — cartographie/architecture
      ══════════════════════════════════════════════════ */}
      <div ref={wrapper3} style={{ height: "200vh" }}>
        <section style={sec("#F6F1E8", 30)}>

          <svg ref={svg3}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{ ...svgLayer, opacity: 0.09 }}>
            <g fill="none" stroke="#6B5030" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              {/* Deux verticales centrales */}
              <line x1="690" y1="0"   x2="690" y2="370"/>
              <line x1="750" y1="0"   x2="750" y2="370"/>
              {/* Niveau 1 : 4 branches */}
              <line x1="690" y1="370" x2="460" y2="590"/>
              <line x1="690" y1="370" x2="640" y2="590"/>
              <line x1="750" y1="370" x2="800" y2="590"/>
              <line x1="750" y1="370" x2="980" y2="590"/>
              {/* Niveau 2 : 8 branches */}
              <line x1="460" y1="590" x2="330" y2="820"/>
              <line x1="460" y1="590" x2="530" y2="820"/>
              <line x1="640" y1="590" x2="590" y2="820"/>
              <line x1="640" y1="590" x2="690" y2="820"/>
              <line x1="800" y1="590" x2="750" y2="820"/>
              <line x1="800" y1="590" x2="850" y2="820"/>
              <line x1="980" y1="590" x2="910" y2="820"/>
              <line x1="980" y1="590" x2="1110" y2="820"/>
              {/* Connecteurs horizontaux — grille architecturale */}
              <line x1="330"  y1="820" x2="1110" y2="820"/>
              <line x1="460"  y1="590" x2="980"  y2="590"/>
            </g>
          </svg>

          <div style={pad}>
            <span style={sur("#6B5022")}>03 . AMBITION</span>
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

      {/* ══════════════════════════════════════════════════
          SECTION 4 — HORIZON   bg #0B1310
          SVG : réseau constellation / routes commerciales
      ══════════════════════════════════════════════════ */}
      <div ref={wrapper4} style={{ height: "260vh" }}>
        <section style={sec("#F8F6F2", 40)}>

          <svg ref={svg4}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{ ...svgLayer, opacity: 0.11 }}>
            <g fill="none" stroke="#2C3428" strokeWidth="0.8" strokeLinecap="round">
              {/* Grandes courbes — routes maritimes / connexions mondiales */}
              <path d="M -100 380 Q 360 180 720 360 Q 1080 540 1540 380"/>
              <path d="M -100 520 Q 360 340 720 460 Q 1080 580 1540 520"/>
              {/* Réseau — tier haut */}
              <line x1="148"  y1="188" x2="380"  y2="298"/>
              <line x1="380"  y1="298" x2="720"  y2="228"/>
              <line x1="720"  y1="228" x2="1060" y2="298"/>
              <line x1="1060" y1="298" x2="1292" y2="188"/>
              {/* Réseau — liaisons diagonales */}
              <line x1="380"  y1="298" x2="270"  y2="548"/>
              <line x1="720"  y1="228" x2="720"  y2="496"/>
              <line x1="1060" y1="298" x2="1170" y2="548"/>
              {/* Réseau — tier bas */}
              <line x1="270"  y1="548" x2="92"   y2="742"/>
              <line x1="270"  y1="548" x2="468"  y2="742"/>
              <line x1="720"  y1="496" x2="468"  y2="742"/>
              <line x1="720"  y1="496" x2="972"  y2="742"/>
              <line x1="1170" y1="548" x2="972"  y2="742"/>
              <line x1="1170" y1="548" x2="1348" y2="742"/>
              {/* Liaisons longues distances */}
              <line x1="148"  y1="188" x2="720"  y2="496"/>
              <line x1="1292" y1="188" x2="720"  y2="496"/>
            </g>
            {/* Nœuds — points fixes */}
            <g fill="rgba(30,40,28,0.15)" stroke="none">
              <circle cx="148"  cy="188" r="2.5"/>
              <circle cx="380"  cy="298" r="2"/>
              <circle cx="720"  cy="228" r="3"/>
              <circle cx="1060" cy="298" r="2"/>
              <circle cx="1292" cy="188" r="2.5"/>
              <circle cx="270"  cy="548" r="2"/>
              <circle cx="720"  cy="496" r="3"/>
              <circle cx="1170" cy="548" r="2"/>
              <circle cx="92"   cy="742" r="2"/>
              <circle cx="468"  cy="742" r="2"/>
              <circle cx="972"  cy="742" r="2"/>
              <circle cx="1348" cy="742" r="2"/>
            </g>
          </svg>

          {/* Anneau décoratif — s'efface au scroll */}
          <div ref={s4deco} style={{
            position: "absolute",
            left: "50%", top: "11%",
            transform: "translateX(-50%)",
            zIndex: 6,
            pointerEvents: "none",
          }}>
            <svg viewBox="0 0 80 80" width="72" height="72">
              <circle cx="40" cy="40" r="34"
                fill="none"
                stroke="rgba(30,40,28,0.22)"
                strokeWidth="0.8"/>
              <circle cx="40" cy="40" r="3"
                fill="rgba(30,40,28,0.20)"/>
              <line x1="40" y1="3"  x2="40" y2="16"
                stroke="rgba(30,40,28,0.14)" strokeWidth="0.8"/>
              <line x1="77" y1="40" x2="64" y2="40"
                stroke="rgba(30,40,28,0.14)" strokeWidth="0.8"/>
              <line x1="40" y1="77" x2="40" y2="64"
                stroke="rgba(30,40,28,0.14)" strokeWidth="0.8"/>
              <line x1="3"  y1="40" x2="16" y2="40"
                stroke="rgba(30,40,28,0.14)" strokeWidth="0.8"/>
            </svg>
          </div>

          {/* Contenu principal — disparaît au scroll */}
          <div ref={s4content} style={{ ...pad, position: "relative", zIndex: 5 }}>
            <span style={sur("#5A4A30")}>04 . HORIZON</span>
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
