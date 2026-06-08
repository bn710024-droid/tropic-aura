import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function APropos() {
  const bgRef     = useRef(null);   // arbre.png fond fixe
  const wrapper1  = useRef(null);
  const wrapper2  = useRef(null);
  const wrapper3  = useRef(null);
  const wrapper4  = useRef(null);
  const leafRef   = useRef(null);
  const s4content = useRef(null);
  const punchline = useRef(null);
  const f1 = useRef([]);
  const f2 = useRef([]);
  const f3 = useRef([]);

  useEffect(() => {
    /* ── Lenis smooth scroll ── */
    const lenis = new Lenis({ duration: 1.2, easing: t => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    const tick = t => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /* ── arbre.png : défile de canopée (0%) → racines (100%) ── */
    gsap.to(bgRef.current, {
      backgroundPositionY: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    /* ── Flottants : parallaxe doux ── */
    const parallax = (refs, trigger) =>
      refs.current.forEach((el, i) => {
        if (!el) return;
        const s = 0.55 + i * 0.18;
        gsap.fromTo(el, { y: 50 * s }, {
          y: -60 * s, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    parallax(f1, wrapper1.current);
    parallax(f2, wrapper2.current);
    parallax(f3, wrapper3.current);

    /* ── Section 4 : feuille descend → disparaît → punchline ── */
    gsap.fromTo(leafRef.current, { y: 0, opacity: 0.4 }, {
      y: 230, opacity: 0, ease: "none",
      scrollTrigger: { trigger: wrapper4.current, start: "top+=20% top", end: "top+=55% top", scrub: 1.5 },
    });
    gsap.fromTo(s4content.current, { opacity: 1 }, {
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: wrapper4.current, start: "top+=42% top", end: "top+=62% top", scrub: 1 },
    });
    gsap.fromTo(punchline.current, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, ease: "power2.out",
      scrollTrigger: { trigger: wrapper4.current, start: "top+=63% top", end: "top+=86% top", scrub: 1 },
    });

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  /* ── Helpers styles ── */
  const sur = c => ({ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:c, marginBottom:20, display:"block" });
  const tit = c => ({ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"clamp(30px,4vw,56px)", lineHeight:1.0, letterSpacing:"-.03em", color:c, marginBottom:28 });
  const dsc = c => ({ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.78, fontWeight:400, color:c, maxWidth:470 });
  const pad = { position:"relative", zIndex:5, padding:"0 clamp(20px,7vw,96px)", maxWidth:570 };
  const hide = e => { e.target.style.opacity = 0; };
  const sec = (bg, zi) => ({ position:"sticky", top:0, height:"100vh", background:bg, zIndex:zi, display:"flex", alignItems:"center", overflow:"hidden" });

  return (
    <div style={{ overflowX:"hidden" }}>

      {/* ── FOND : arbre.png fixe, défile canopée → racines ── */}
      <div ref={bgRef} style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"url('/png/arbre.png')",
        backgroundSize:"cover",
        backgroundRepeat:"no-repeat",
        backgroundPosition:"center 0%",
      }} />

      {/* ── Header ── */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:66, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 clamp(20px,5vw,48px)", pointerEvents:"none" }}>
        <a href="/" style={{ pointerEvents:"auto", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18, letterSpacing:".04em", color:"#fff", textDecoration:"none", textShadow:"0 2px 14px rgba(0,0,0,.5)" }}>
          TROPICAURA
        </a>
        <a href="/" style={{ pointerEvents:"auto", textDecoration:"none" }}>
          <span style={{ display:"inline-block", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12, letterSpacing:".12em", textTransform:"uppercase", color:"#fff", background:"rgba(0,0,0,0.30)", border:"1.5px solid rgba(255,255,255,0.45)", borderRadius:100, padding:"9px 20px", cursor:"pointer" }}>
            ← Accueil
          </span>
        </a>
      </header>

      {/* ════════ SECTION 1 — ORIGINES ════════ */}
      <div ref={wrapper1} style={{ height:"200vh" }}>
        <section style={sec("rgba(250,249,245,0.80)", 10)}>
          <img ref={el => f1.current[0]=el} src="/png/mangue.png" alt="" onError={hide}
            style={{ position:"absolute", right:"5%", top:"5%", width:"clamp(240px,28vw,400px)", pointerEvents:"none", zIndex:3 }}/>
          <img ref={el => f1.current[1]=el} src="/png/feuille_manguier.jpg" alt="" onError={hide}
            style={{ position:"absolute", right:"27%", top:"2%", width:200, opacity:0.7, transform:"rotate(-18deg)", pointerEvents:"none", zIndex:2 }}/>
          <img ref={el => f1.current[2]=el} src="/png/feuille_manguier.jpg" alt="" onError={hide}
            style={{ position:"absolute", right:"2%", bottom:"12%", width:160, opacity:0.5, transform:"rotate(22deg) scaleX(-1)", pointerEvents:"none", zIndex:2 }}/>
          <div style={pad}>
            <span style={sur("#4A7A5A")}>01 . ORIGINES</span>
            <h1 style={tit("#0A1A0C")}>Pourquoi Tropicaura existe</h1>
            <p style={dsc("#2E4035")}>
              Nous croyons que les terroirs tropicaux africains comptent parmi les plus remarquables au monde. Pourtant, leur potentiel reste encore insuffisamment valorisé sur les marchés internationaux. Tropicaura est née de la volonté de créer un lien plus direct, plus transparent et plus ambitieux entre ces origines d'exception et les acheteurs les plus exigeants. Nous invitons nos partenaires à participer à cette nouvelle dynamique : construire des connexions durables, révéler la véritable valeur des origines africaines et contribuer à une chaîne d'approvisionnement plus équitable, plus moderne et plus performante.
            </p>
          </div>
        </section>
      </div>

      {/* ════════ SECTION 2 — ENGAGEMENT ════════ */}
      <div ref={wrapper2} style={{ height:"200vh" }}>
        <section style={sec("rgba(220,230,220,0.82)", 20)}>
          <img ref={el => f2.current[0]=el} src="/png/avocat.png" alt="" onError={hide}
            style={{ position:"absolute", right:"6%", top:"8%", width:"clamp(220px,25vw,360px)", pointerEvents:"none", zIndex:3 }}/>
          <img ref={el => f2.current[1]=el} src="/png/feuille_avocatier.jpg" alt="" onError={hide}
            style={{ position:"absolute", left:"38%", bottom:"8%", width:220, opacity:0.65, transform:"rotate(10deg)", pointerEvents:"none", zIndex:2 }}/>
          <div style={pad}>
            <span style={sur("#2E6040")}>02 . ENGAGEMENT</span>
            <h2 style={tit("#0A1A0C")}>Ce que nous faisons aujourd'hui</h2>
            <p style={dsc("#263328")}>
              Nous développons des partenariats durables entre producteurs, stations de conditionnement, acteurs logistiques et importateurs internationaux afin de faciliter l'accès à des produits tropicaux de qualité tout en créant davantage de valeur à l'origine. Chaque collaboration représente une opportunité de bâtir ensemble un commerce plus efficace, plus transparent et plus bénéfique pour l'ensemble des acteurs de la chaîne de valeur.
            </p>
          </div>
        </section>
      </div>

      {/* ════════ SECTION 3 — AMBITION ════════ */}
      <div ref={wrapper3} style={{ height:"200vh" }}>
        <section style={sec("rgba(235,228,215,0.82)", 30)}>
          <img ref={el => f3.current[0]=el} src="/png/ananas.png" alt="" onError={hide}
            style={{ position:"absolute", right:"5%", top:"4%", width:"clamp(260px,30vw,420px)", pointerEvents:"none", zIndex:3 }}/>
          <img ref={el => f3.current[1]=el} src="/png/feuille_palmier_1.jpg" alt="" onError={hide}
            style={{ position:"absolute", right:"29%", top:"15%", width:175, opacity:0.6, transform:"rotate(-28deg)", pointerEvents:"none", zIndex:2 }}/>
          <img ref={el => f3.current[2]=el} src="/png/feuille_palmier_2.jpg" alt="" onError={hide}
            style={{ position:"absolute", right:"11%", bottom:"8%", width:150, opacity:0.5, transform:"rotate(18deg)", pointerEvents:"none", zIndex:2 }}/>
          <div style={pad}>
            <span style={sur("#5C4A20")}>03 . AMBITION</span>
            <h2 style={tit("#140E04")}>Là où nous voulons aller</h2>
            <p style={dsc("#302510")}>
              Nous ne voulons pas simplement exporter des fruits. Nous voulons participer à la construction d'une nouvelle génération de marques africaines capables d'inspirer confiance, de créer de la valeur et de représenter l'excellence des régions tropicales sur la scène internationale. Nous recherchons des partenaires qui partagent cette ambition : faire émerger une nouvelle référence du commerce international, fondée sur la qualité, l'innovation et une vision à long terme.
            </p>
          </div>
        </section>
      </div>

      {/* ════════ SECTION 4 — HORIZON ════════ */}
      <div ref={wrapper4} style={{ height:"260vh" }}>
        <section style={sec("rgba(6,12,7,0.88)", 40)}>

          {/* Feuille de palmier SVG — descend en apesanteur, s'efface */}
          <svg ref={leafRef} viewBox="0 0 60 180" width="60" height="180"
            style={{ position:"absolute", left:"50%", top:"8%", transform:"translateX(-50%)", pointerEvents:"none", zIndex:6, opacity:0.4 }}>
            <path d="M 30 175 C 30 140 30 80 30 5" stroke="rgba(255,255,255,.9)" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d="M 30 150 Q 10 135 5 112"  stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 122 Q 8 105 3 82"    stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 95  Q 10 78  7 56"   stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 68  Q 14 52 14 34"   stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none"/>
            <path d="M 30 150 Q 50 135 55 112"  stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 122 Q 52 105 57 82"   stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 95  Q 50 78  53 56"   stroke="rgba(255,255,255,.6)" strokeWidth=".8" fill="none"/>
            <path d="M 30 68  Q 46 52  46 34"   stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none"/>
          </svg>

          {/* Contenu principal — disparaît au scroll */}
          <div ref={s4content} style={{ ...pad, position:"relative", zIndex:5 }}>
            <span style={sur("rgba(255,255,255,.4)")}>04 . HORIZON</span>
            <h2 style={tit("#ffffff")}>Ce que nous construisons</h2>
            <p style={dsc("rgba(255,255,255,.6)")}>
              Nous imaginons un futur où les produits tropicaux africains seront recherchés non seulement pour leur qualité naturelle, mais aussi pour les standards d'excellence, de professionnalisme et d'innovation qui les accompagnent. Tropicaura entend contribuer à cette transformation aux côtés de producteurs, d'acheteurs et d'acteurs engagés qui souhaitent participer à l'émergence d'une Afrique plus visible, plus compétitive et plus influente sur les marchés mondiaux.
            </p>
          </div>

          {/* Punchline finale — silence total */}
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
