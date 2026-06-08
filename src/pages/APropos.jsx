import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function APropos() {
  const svgRef      = useRef(null);
  const wrapper1    = useRef(null);
  const wrapper2    = useRef(null);
  const wrapper3    = useRef(null);
  const wrapper4    = useRef(null);
  const leafRef     = useRef(null);
  const s4content   = useRef(null);
  const punchline   = useRef(null);
  const f1          = useRef([]);   // floats section 1
  const f2          = useRef([]);   // floats section 2
  const f3          = useRef([]);   // floats section 3

  useEffect(() => {
    /* ── Lenis ── */
    const lenis = new Lenis({ duration: 1.2, easing: t => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    const tick  = t => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /* ── SVG tree : init stroke-dashoffset ── */
    const svg = svgRef.current;
    const initGroup = sel => {
      const els = [...svg.querySelectorAll(sel)];
      els.forEach(p => {
        try {
          const L = p.getTotalLength();
          gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
        } catch (_) {}
      });
      return els;
    };
    const cPaths = initGroup("#ap-canopy > *");
    const tPaths = initGroup("#ap-trunk  > *");
    const bPaths = initGroup("#ap-base   > *");
    const rPaths = initGroup("#ap-roots  > *");

    const drawGroup = (paths, trigger) =>
      paths.forEach(p =>
        gsap.to(p, {
          strokeDashoffset: 0, ease: "none",
          scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: 2 },
        })
      );

    drawGroup(cPaths, wrapper1.current);
    drawGroup(tPaths, wrapper2.current);
    drawGroup(bPaths, wrapper3.current);
    drawGroup(rPaths, wrapper4.current);

    /* ── Floating images parallax ── */
    const parallax = (refs, trigger) =>
      refs.current.forEach((el, i) => {
        if (!el) return;
        const s = 0.55 + i * 0.18;
        gsap.fromTo(el, { y: 55 * s }, {
          y: -65 * s, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

    parallax(f1, wrapper1.current);
    parallax(f2, wrapper2.current);
    parallax(f3, wrapper3.current);

    /* ── Section 4 : feuille → disparaît → punchline ── */
    gsap.fromTo(leafRef.current, { y: 0, opacity: 0.35 }, {
      y: 230, opacity: 0, ease: "none",
      scrollTrigger: { trigger: wrapper4.current, start: "top+=22% top", end: "top+=58% top", scrub: 1.5 },
    });
    gsap.fromTo(s4content.current, { opacity: 1 }, {
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: wrapper4.current, start: "top+=45% top", end: "top+=65% top", scrub: 1 },
    });
    gsap.fromTo(punchline.current, { opacity: 0, y: 26 }, {
      opacity: 1, y: 0, ease: "power2.out",
      scrollTrigger: { trigger: wrapper4.current, start: "top+=65% top", end: "top+=88% top", scrub: 1 },
    });

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  /* ── Style helpers ── */
  const sur = c => ({ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:c, marginBottom:20, display:"block" });
  const tit = c => ({ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(30px,4vw,56px)", lineHeight:1.0, letterSpacing:"-.03em", color:c, marginBottom:28 });
  const dsc = c => ({ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.78, fontWeight:400, color:c, maxWidth:470 });
  const pad = { position:"relative", zIndex:5, padding:"0 clamp(20px,7vw,96px)", maxWidth:570 };
  const hide = e => { e.target.style.opacity = 0; };

  /* ── Shared section style ── */
  const sec = (bg, zi) => ({
    position:"sticky", top:0, height:"100vh",
    background:bg, zIndex:zi,
    display:"flex", alignItems:"center", overflow:"hidden",
  });

  return (
    <div style={{ background:"#FAF9F5", overflowX:"hidden" }}>

      {/* ── Header ── */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:66, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 clamp(20px,5vw,48px)", pointerEvents:"none" }}>
        <a href="/" style={{ pointerEvents:"auto", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18, letterSpacing:".04em", color:"#0E200F", textDecoration:"none" }}>TROPICAURA</a>
        <a href="/" style={{ pointerEvents:"auto", textDecoration:"none" }}>
          <span style={{ display:"inline-block", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12, letterSpacing:".12em", textTransform:"uppercase", color:"#0E200F", background:"rgba(0,0,0,0.07)", border:"1.5px solid rgba(0,0,0,0.18)", borderRadius:100, padding:"9px 20px", cursor:"pointer" }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ── SVG Arbre (fixed, mix-blend-mode:difference → visible sur tout fond) ── */}
      <svg ref={svgRef} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid meet"
        style={{ position:"fixed", inset:0, width:"100%", height:"100%", zIndex:50, opacity:0.13, pointerEvents:"none", mixBlendMode:"difference" }}>
        <g id="ap-canopy" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 720 480 L 720 60"/>
          <path d="M 720 400 C 640 340 540 280 420 200"/>
          <path d="M 720 400 C 800 340 900 280 1020 200"/>
          <path d="M 580 320 C 510 260 430 200 360 140"/>
          <path d="M 420 200 C 370 155 310 110 260 70"/>
          <path d="M 860 320 C 930 260 1010 200 1080 140"/>
          <path d="M 1020 200 C 1070 155 1130 110 1180 70"/>
          <path d="M 360 140 L 330 90 M 360 140 L 392 88"/>
          <path d="M 720 60 L 700 10 M 720 60 L 740 10"/>
          <path d="M 720 130 L 696 74 M 720 130 L 744 74"/>
          <path d="M 1080 140 L 1110 90 M 1080 140 L 1048 88"/>
          <path d="M 260 70 L 238 22 M 260 70 L 284 20"/>
          <path d="M 1180 70 L 1204 22 M 1180 70 L 1156 20"/>
        </g>
        <g id="ap-trunk" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round">
          <path d="M 708 900 L 708 320"/>
          <path d="M 732 900 L 732 320"/>
        </g>
        <g id="ap-base" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round">
          <path d="M 708 720 Q 682 800 645 900"/>
          <path d="M 732 720 Q 758 800 795 900"/>
          <path d="M 660 800 Q 596 840 510 900"/>
          <path d="M 780 800 Q 844 840 930 900"/>
        </g>
        <g id="ap-roots" fill="none" stroke="#fff" strokeWidth="0.8" strokeLinecap="round">
          <path d="M 660 820 Q 470 858 220 895"/>
          <path d="M 680 848 Q 526 870 350 912"/>
          <path d="M 700 866 L 580 940"/>
          <path d="M 720 874 L 720 980"/>
          <path d="M 740 866 L 860 940"/>
          <path d="M 760 848 Q 914 870 1090 912"/>
          <path d="M 780 820 Q 970 858 1220 895"/>
          <path d="M 644 836 Q 424 878 160 930"/>
          <path d="M 796 836 Q 1016 878 1280 930"/>
        </g>
      </svg>

      {/* ════════ SECTION 1 — ORIGINES ════════ */}
      <div ref={wrapper1} style={{ height:"200vh" }}>
        <section style={sec("#FAF9F5", 10)}>
          <img ref={el => f1.current[0]=el} src="/png/mangue.png" alt="" onError={hide}
            style={{ position:"absolute", right:"5%", top:"5%", width:"clamp(240px,28vw,400px)", pointerEvents:"none", zIndex:3 }}/>
          <img ref={el => f1.current[1]=el} src="/png/feuille_manguier.png" alt="" onError={hide}
            style={{ position:"absolute", right:"27%", top:"2%", width:200, opacity:0.7, transform:"rotate(-18deg)", pointerEvents:"none", zIndex:2 }}/>
          <img ref={el => f1.current[2]=el} src="/png/feuille_manguier.png" alt="" onError={hide}
            style={{ position:"absolute", right:"2%", bottom:"12%", width:160, opacity:0.5, transform:"rotate(22deg) scaleX(-1)", pointerEvents:"none", zIndex:2 }}/>
          <div style={pad}>
            <span style={sur("#8BA98D")}>01 . ORIGINES</span>
            <h1 style={tit("#0E200F")}>Pourquoi Tropicaura existe</h1>
            <p style={dsc("#3A4E3C")}>
              Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Pourtant, leur potentiel reste encore insuffisamment valorisé sur les marchés internationaux. Tropicaura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants. Nous invitons nos partenaires à participer à cette nouvelle dynamique : construire des connexions durables, révéler la véritable valeur des origines africaines et contribuer à une chaîne d'approvisionnement plus équitable, plus moderne et plus performante.
            </p>
          </div>
        </section>
      </div>

      {/* ════════ SECTION 2 — ENGAGEMENT ════════ */}
      <div ref={wrapper2} style={{ height:"200vh" }}>
        <section style={sec("#E3E8E3", 20)}>
          <img ref={el => f2.current[0]=el} src="/png/avocat.png" alt="" onError={hide}
            style={{ position:"absolute", right:"6%", top:"8%", width:"clamp(220px,25vw,360px)", pointerEvents:"none", zIndex:3 }}/>
          <img ref={el => f2.current[1]=el} src="/png/feuille_avocatier.png" alt="" onError={hide}
            style={{ position:"absolute", left:"38%", bottom:"8%", width:220, opacity:0.65, transform:"rotate(10deg)", pointerEvents:"none", zIndex:2 }}/>
          <div style={pad}>
            <span style={sur("#5A7A5C")}>02 . ENGAGEMENT</span>
            <h2 style={tit("#0E200F")}>Ce que nous faisons aujourd'hui</h2>
            <p style={dsc("#2E3E30")}>
              Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux afin de faciliter l'accès à des produits tropicaux de qualité tout en créant davantage de valeur à l'origine. Chaque collaboration représente une opportunité de bâtir ensemble un commerce plus efficace, plus transparent et plus bénéfique pour l'ensemble des acteurs de la chaîne de valeur.
            </p>
          </div>
        </section>
      </div>

      {/* ════════ SECTION 3 — AMBITION ════════ */}
      <div ref={wrapper3} style={{ height:"200vh" }}>
        <section style={sec("#EFEAE2", 30)}>
          <img ref={el => f3.current[0]=el} src="/png/ananas.png" alt="" onError={hide}
            style={{ position:"absolute", right:"5%", top:"4%", width:"clamp(260px,30vw,420px)", pointerEvents:"none", zIndex:3 }}/>
          <img ref={el => f3.current[1]=el} src="/png/feuille_palmier_1.png" alt="" onError={hide}
            style={{ position:"absolute", right:"29%", top:"15%", width:175, opacity:0.6, transform:"rotate(-28deg)", pointerEvents:"none", zIndex:2 }}/>
          <img ref={el => f3.current[2]=el} src="/png/feuille_palmier_2.png" alt="" onError={hide}
            style={{ position:"absolute", right:"11%", bottom:"8%", width:150, opacity:0.5, transform:"rotate(18deg)", pointerEvents:"none", zIndex:2 }}/>
          <div style={pad}>
            <span style={sur("#8A7A5A")}>03 . AMBITION</span>
            <h2 style={tit("#1A1207")}>Là où nous voulons aller</h2>
            <p style={dsc("#3A3020")}>
              Nous ne voulons pas simplement exporter des fruits. Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance, de créer de la valeur et de représenter l'excellence des régions tropicales sur la scène internationale. Nous recherchons des partenaires qui partagent cette ambition : faire émerger une nouvelle référence du commerce international, fondée sur la qualité, l'innovation et une vision à long terme.
            </p>
          </div>
        </section>
      </div>

      {/* ════════ SECTION 4 — HORIZON ════════ */}
      <div ref={wrapper4} style={{ height:"260vh" }}>
        <section style={sec("#09120A", 40)}>
          {/* Feuille SVG qui descend et s'efface */}
          <svg ref={leafRef} viewBox="0 0 60 180" width="60" height="180"
            style={{ position:"absolute", left:"50%", top:"8%", transform:"translateX(-50%)", pointerEvents:"none", zIndex:6, opacity:0.35 }}>
            <path d="M 30 175 C 30 140 30 80 30 5" stroke="rgba(255,255,255,.9)" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d="M 30 150 Q 10 135 5 112" stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 122 Q 8 105 3 82"  stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 95  Q 10 78  7 56"  stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 68  Q 14 52 14 34"  stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none"/>
            <path d="M 30 150 Q 50 135 55 112" stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 122 Q 52 105 57 82"  stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 95  Q 50 78  53 56"  stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 68  Q 46 52  46 34"  stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none"/>
          </svg>

          {/* Contenu principal (disparaît au scroll) */}
          <div ref={s4content} style={{ ...pad, position:"relative", zIndex:5 }}>
            <span style={sur("rgba(255,255,255,.4)")}>04 . HORIZON</span>
            <h2 style={tit("#ffffff")}>Ce que nous construisons</h2>
            <p style={dsc("rgba(255,255,255,.6)")}>
              Nous imaginons un futur où les produits tropicaux africains seront recherchés non seulement pour leur qualité naturelle, mais aussi pour les standards d'excellence, de professionnalisme et d'innovation qui les accompagnent. Tropicaura entend contribuer à cette transformation aux côtés de producteurs, d'acheteurs et d'acteurs engagés qui souhaitent participer à l'émergence d'une Afrique plus visible, plus compétitive et plus influente sur les marchés mondiaux.
            </p>
          </div>

          {/* Punchline finale */}
          <div ref={punchline} style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0, zIndex:7, padding:"40px", textAlign:"center" }}>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(22px,3vw,50px)", lineHeight:1.2, letterSpacing:"-.02em", color:"#ffffff", maxWidth:640 }}>
              "L'avenir ne se construit pas seul.
              <br />Il se construit ensemble."
            </p>
          </div>
        </section>
      </div>

    </div>
  );
}
