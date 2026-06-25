import { useEffect, useRef } from "react";
import Lenis from "lenis";

const GOLD  = "#C9A84C";
const WHITE = "#FFFFFF";
const BG    = "#090F0A";

export default function InsightSenegal() {
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    revealRefs.current.forEach((el) => el && io.observe(el));

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); io.disconnect(); };
  }, []);

  const r = (delay = 0) => ({
    opacity: 0, transform: "translateY(16px)",
    transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  const lbl = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 9, fontWeight: 700, letterSpacing: ".22em",
    textTransform: "uppercase", color: GOLD, display: "inline-block",
  };

  const BULLETS_1 = [
    "Une meilleure préservation de la fraîcheur des produits.",
    "Une réduction des risques logistiques.",
    "Une meilleure maîtrise de la chaîne du froid.",
    "Une plus grande flexibilité pour les importateurs.",
  ];
  const BULLETS_2 = [
    "De prolonger leur saison commerciale.",
    "De maintenir une présence continue sur leurs marchés.",
    "De réduire leur dépendance à une seule origine.",
  ];
  const BULLETS_3 = [
    "les stations de conditionnement,",
    "les systèmes de traçabilité,",
    "les infrastructures portuaires,",
    "les procédures phytosanitaires,",
  ];
  const BULLETS_4 = [
    "la qualité des produits,",
    "la disponibilité des volumes,",
    "la réactivité des opérateurs,",
    "la proximité logistique.",
  ];
  const BULLETS_5 = [
    "les avocats,",
    "les melons,",
    "les pastèques,",
    "les citrons verts,",
    "les légumes spécialisés comme le gombo.",
  ];
  const BULLETS_6 = [
    "une communication transparente,",
    "une exécution fiable,",
    "une documentation rigoureuse,",
    "une capacité à résoudre les problèmes rapidement.",
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        /* ── Nav ── */
        .art-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 clamp(24px,6vw,80px); height: 60px;
          background: rgba(9,15,10,0.88); backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .art-brand {
          font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 800;
          font-size: 17px; letter-spacing: .04em; color: #fff;
          text-decoration: none;
        }
        .art-back {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: color .25s;
        }
        .art-back:hover { color: rgba(255,255,255,0.80); }

        /* ── Hero ── */
        .art-hero {
          position: relative; min-height: 90vh;
          display: flex; flex-direction: column; justify-content: flex-end;
          overflow: hidden;
        }
        .art-hero-bg {
          position: absolute; inset: 0;
          background-image: url("/fonds-insights.png");
          background-size: cover; background-position: center 20%;
        }
        .art-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(9,15,10,0.06) 0%,
            rgba(9,15,10,0.28) 38%,
            rgba(9,15,10,0.80) 66%,
            rgba(9,15,10,0.97) 86%,
            rgba(9,15,10,1) 100%
          );
        }
        .art-hero-content {
          position: relative; z-index: 2;
          max-width: 860px; margin: 0 auto; width: 100%;
          padding: 0 clamp(24px,6vw,80px) 60px;
          box-sizing: border-box;
        }
        .art-hero-rule {
          position: relative; z-index: 2;
          height: 1px; background: rgba(255,255,255,0.12);
          margin: 0 clamp(24px,6vw,80px);
        }

        /* ── Reading column ── */
        .art-body {
          max-width: 720px; margin: 0 auto;
          padding: 0 clamp(24px,6vw,80px) 100px;
          box-sizing: border-box;
        }

        /* ── Typography ── */
        .art-intro {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(16px,1.25vw,18px); line-height: 1.85; font-weight: 400;
          color: rgba(255,255,255,0.70); margin: 0 0 28px;
        }
        .art-intro-lead {
          font-weight: 500; color: rgba(255,255,255,0.88);
          font-size: clamp(17px,1.35vw,19.5px);
        }
        .art-h2 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(16px,1.3vw,20px); font-weight: 700;
          letter-spacing: -.02em; color: #fff; line-height: 1.28;
          margin: 0 0 18px; padding-top: 44px;
          border-top: 1px solid rgba(255,255,255,0.09);
        }
        .art-h2-first { margin-top: 44px; }
        .art-p {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(14px,1.02vw,16px); line-height: 1.9; font-weight: 400;
          color: rgba(255,255,255,0.62); margin: 0 0 20px;
        }
        .art-ul { list-style: none; margin: 4px 0 24px; padding: 0; }
        .art-li {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(13.5px,.98vw,15.5px); line-height: 1.75; font-weight: 400;
          color: rgba(255,255,255,0.60); padding: 9px 0 9px 22px; position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .art-li:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .art-li::before {
          content: ""; position: absolute; left: 0; top: 50%;
          transform: translateY(-50%); width: 5px; height: 5px;
          border-radius: 1px; background: ${GOLD};
        }

        /* ── Tropicaura aside ── */
        .ta-block {
          margin: 48px 0; padding: 28px 32px;
          border-left: 3px solid ${GOLD};
          background: rgba(201,168,76,0.05);
          border-radius: 0 4px 4px 0;
        }
        .ta-label {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 8.5px; font-weight: 700;
          letter-spacing: .26em; text-transform: uppercase; color: ${GOLD};
          display: block; margin-bottom: 18px;
        }
        .ta-p {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(13.5px,.98vw,15.5px); line-height: 1.85; font-weight: 400;
          color: rgba(255,255,255,0.68); margin: 0 0 14px;
        }
        .ta-p:last-child { margin-bottom: 0; }

        /* ── Conclusion ── */
        .art-conclusion {
          margin-top: 60px; padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.14);
        }
        .art-conclusion-h2 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(17px,1.35vw,21px); font-weight: 700;
          letter-spacing: -.02em; color: #fff; line-height: 1.28;
          margin: 0 0 22px;
        }
        .art-quote {
          margin-top: 44px; padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.09);
        }
        .art-quote-text {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(15px,1.15vw,17.5px); line-height: 1.62; font-weight: 600;
          color: rgba(255,255,255,0.78); font-style: italic;
          letter-spacing: -.01em; margin: 0;
        }

        /* ── Footer sep ── */
        .art-sep {
          max-width: 720px; margin: 0 auto;
          padding: 0 clamp(24px,6vw,80px) 48px;
          display: flex; align-items: center; gap: 0;
          box-sizing: border-box;
        }
        .art-sep-line { flex: 1; height: 1px; background: rgba(255,255,255,0.10); }
        .art-sep-link {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .20em; text-transform: uppercase;
          color: rgba(255,255,255,0.32); text-decoration: none;
          white-space: nowrap; padding: 0 20px; transition: color .25s;
        }
        .art-sep-link:hover { color: rgba(255,255,255,0.72); }

        /* ── Outro ── */
        .art-outro {
          position: relative; min-height: 62vh; overflow: hidden;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
        }
        .art-outro-bg {
          position: absolute; inset: 0;
          background-image: url("/fonds-insights.png");
          background-size: cover; background-position: center bottom;
        }
        .art-outro-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(9,15,10,1) 0%,
            rgba(9,15,10,0.60) 22%,
            rgba(9,15,10,0.38) 50%,
            rgba(9,15,10,0.18) 78%,
            rgba(9,15,10,0.0) 100%
          );
        }
        .art-outro-content {
          position: relative; z-index: 2;
          max-width: 680px; width: 100%;
          padding: 0 clamp(24px,6vw,80px);
          box-sizing: border-box; text-align: center;
        }
        .art-outro-quote {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(17px,1.55vw,23px); font-weight: 600; font-style: italic;
          color: rgba(255,255,255,0.93); line-height: 1.55; letter-spacing: -.015em;
          margin: 0 0 44px;
          text-shadow: 0 2px 24px rgba(9,15,10,0.60);
        }
        .art-outro-nav {
          display: flex; align-items: center; gap: 0; width: 100%;
        }
        .art-outro-line { flex: 1; height: 1px; background: rgba(255,255,255,0.20); }
        .art-outro-link {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .20em; text-transform: uppercase;
          color: rgba(255,255,255,0.50); text-decoration: none;
          white-space: nowrap; padding: 0 20px; transition: color .25s;
        }
        .art-outro-link:hover { color: rgba(255,255,255,0.90); }
      `}</style>

      {/* ══ Nav fixe ══ */}
      <nav className="art-nav">
        <a href="/" className="art-brand"><img src="/logo.png" alt="Tropicaura" style={{ height: 32, display: "block" }} /></a>
        <a href="/insights" className="art-back">← Retour aux analyses</a>
      </nav>

      {/* ══ Hero ══ */}
      <header className="art-hero">
        <div className="art-hero-bg" />
        <div className="art-hero-overlay" />
        <div className="art-hero-content" ref={reveal} style={r(0)}>
          <span style={{ ...lbl, marginBottom: 20 }}>Marchés</span>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(30px,3.6vw,56px)", lineHeight: 1.05,
            letterSpacing: "-.04em", color: WHITE,
            margin: "14px 0 32px", maxWidth: 820,
          }}>
            Pourquoi le Sénégal devient une origine stratégique pour les fruits tropicaux
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {[["Tropicaura", true], ["7 min de lecture", false], ["Juin 2026", false]].map(([txt, bold], i) => (
              <span key={txt} style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />}
                <span style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 11.5, fontWeight: bold ? 600 : 400,
                  letterSpacing: ".06em", color: "rgba(255,255,255,0.50)",
                }}>{txt}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="art-hero-rule" />
      </header>

      {/* ══ Corps ══ */}
      <div className="art-body">

        <p ref={reveal} className="art-intro art-intro-lead" style={r(0.04)}>
          Le commerce international des fruits frais évolue rapidement. Face à la recherche constante
          de nouvelles origines fiables, compétitives et capables de répondre aux exigences croissantes
          des marchés européens, le Sénégal s'impose progressivement comme une destination stratégique
          pour l'approvisionnement en fruits tropicaux.
        </p>
        <p ref={reveal} className="art-intro" style={r(0.07)}>
          Longtemps dominé par certaines régions d'Amérique latine ou d'Asie, le marché européen
          observe aujourd'hui avec un intérêt grandissant le potentiel de l'Afrique de l'Ouest.
          Au cœur de cette dynamique, le Sénégal bénéficie d'atouts naturels, logistiques et
          commerciaux particulièrement attractifs.
        </p>

        {/* ── 1 ── */}
        <h2 ref={reveal} className="art-h2 art-h2-first" style={r(0)}>
          Une position géographique privilégiée
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          L'un des premiers avantages du Sénégal réside dans sa proximité avec l'Europe.
          Comparé à d'autres origines tropicales situées à plusieurs semaines de navigation,
          le Sénégal offre des délais de transit plus courts vers les principaux ports européens
          tels qu'Anvers, Rotterdam, Algeciras ou Marseille.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>Cette proximité permet :</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {BULLETS_1.map(t => <li key={t} className="art-li">{t}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Pour les produits périssables, chaque jour gagné durant le transport représente
          un avantage commercial important.
        </p>

        {/* ── 2 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          Une saisonnalité complémentaire aux autres origines
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Le Sénégal dispose également d'un calendrier de production particulièrement intéressant.
          Certaines variétés de mangues, notamment la Keitt et la Kent, arrivent sur le marché
          à des périodes où l'offre mondiale est plus limitée.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>Cette complémentarité permet aux importateurs :</p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {BULLETS_2.map(t => <li key={t} className="art-li">{t}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Dans un contexte où les distributeurs recherchent une disponibilité régulière tout au
          long de l'année, cette caractéristique devient un argument majeur.
        </p>

        {/* ── 3 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          Des infrastructures export en constante amélioration
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Au cours des dernières années, le secteur agricole sénégalais a connu d'importantes
          évolutions. Les investissements réalisés dans :
        </p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {BULLETS_3.map(t => <li key={t} className="art-li">{t}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          ont permis d'améliorer significativement les standards de qualité destinés à l'export.
          Aujourd'hui, de nombreux acteurs du secteur travaillent selon des exigences conformes
          aux attentes des marchés européens.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Cette professionnalisation renforce la crédibilité du pays auprès des acheteurs internationaux.
        </p>

        {/* ── 4 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          Une origine encore compétitive
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Alors que les coûts de production augmentent dans plusieurs régions du monde, le Sénégal
          conserve une compétitivité intéressante sur certains produits.
          Cette compétitivité ne repose pas uniquement sur les prix. Elle s'appuie également sur :
        </p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {BULLETS_4.map(t => <li key={t} className="art-li">{t}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Pour les importateurs européens, la recherche d'une origine ne consiste plus seulement
          à trouver le prix le plus bas, mais à identifier le meilleur équilibre entre qualité,
          fiabilité et coût global.
        </p>

        {/* ── 5 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          Une diversité croissante de produits
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Si la mangue demeure l'une des principales références exportées, le potentiel sénégalais
          ne se limite pas à un seul produit. Les marchés internationaux observent également avec intérêt :
        </p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {BULLETS_5.map(t => <li key={t} className="art-li">{t}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Cette diversification permet de construire des partenariats plus solides et d'élargir
          les opportunités commerciales entre producteurs, exportateurs et distributeurs.
        </p>

        {/* ── 6 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          La confiance devient le véritable avantage concurrentiel
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Dans le commerce international moderne, la qualité seule ne suffit plus.
          Les importateurs recherchent désormais :
        </p>
        <ul ref={reveal} className="art-ul" style={r(0.06)}>
          {BULLETS_6.map(t => <li key={t} className="art-li">{t}</li>)}
        </ul>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Le Sénégal voit émerger une nouvelle génération d'acteurs export capables de répondre
          à ces attentes. Cette évolution contribue à renforcer l'image du pays comme partenaire
          commercial crédible sur le long terme.
        </p>

        {/* ══ Perspective Tropicaura ══ */}
        <div ref={reveal} className="ta-block" style={r(0.04)}>
          <span className="ta-label">Perspective Tropicaura</span>
          <p className="ta-p">
            Cette évolution s'appuie également sur l'émergence de sociétés capables de connecter
            efficacement les producteurs locaux aux exigences des marchés internationaux.
          </p>
          <p className="ta-p">
            Chez Tropicaura, nous croyons que la valeur ne réside pas uniquement dans le produit
            lui-même, mais dans la qualité de l'exécution, la transparence des échanges et la
            capacité à construire des relations durables entre les différents acteurs de la chaîne
            d'approvisionnement.
          </p>
          <p className="ta-p">
            Notre ambition est de contribuer à cette nouvelle génération du commerce tropical africain :
            plus structurée, plus fiable et davantage orientée vers le long terme.
          </p>
        </div>

        {/* ── 7 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          Une opportunité qui ne fait que commencer
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          L'intérêt croissant des marchés européens pour l'Afrique de l'Ouest n'est pas une tendance
          passagère. La combinaison de facteurs géographiques, logistiques, agricoles et humains
          positionne aujourd'hui le Sénégal parmi les origines les plus prometteuses du commerce
          tropical international.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Pour les importateurs à la recherche de nouvelles opportunités d'approvisionnement, comme
          pour les producteurs souhaitant accéder à davantage de marchés, le pays dispose désormais
          des fondations nécessaires pour jouer un rôle de plus en plus important dans les années
          à venir.
        </p>

        {/* ══ Conclusion ══ */}
        <div ref={reveal} className="art-conclusion" style={r(0.04)}>
          <h2 className="art-conclusion-h2">Le Sénégal, une origine d'avenir</h2>
          <p className="art-p">
            Le Sénégal dispose aujourd'hui de nombreux atouts pour devenir l'une des origines de
            référence du commerce tropical vers l'Europe.
          </p>
          <p className="art-p">
            Sa proximité géographique, sa saisonnalité stratégique, l'amélioration continue de ses
            infrastructures et la montée en compétence de ses acteurs créent un environnement
            favorable à des partenariats durables.
          </p>
          <p className="art-p">
            Chez Tropicaura, nous sommes convaincus que l'avenir du commerce tropical repose sur
            des relations solides entre producteurs, exportateurs, logisticiens et importateurs.
          </p>
          <p className="art-p">
            Notre mission est de faciliter ces connexions et de contribuer au développement d'une
            chaîne d'approvisionnement plus fiable, plus transparente et plus performante entre
            l'Afrique et l'Europe.
          </p>
        </div>

      </div>

      {/* ══ Outro — citation + image ══ */}
      <div className="art-outro">
        <div className="art-outro-bg" />
        <div className="art-outro-overlay" />
        <div className="art-outro-content">
          <p className="art-outro-quote">
            Les meilleures opportunités naissent lorsque les bons partenaires avancent dans la
            même direction.
          </p>
          <div className="art-outro-nav">
            <div className="art-outro-line" />
            <a href="/insights" className="art-outro-link">← Toutes les analyses</a>
            <div className="art-outro-line" />
          </div>
        </div>
      </div>

    </div>
  );
}
