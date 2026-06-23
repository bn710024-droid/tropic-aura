import { useEffect, useRef } from "react";
import Lenis from "lenis";

const GOLD  = "#C9A84C";
const WHITE = "#FFFFFF";
const BG    = "#090F0A";

export default function InsightPartenariats() {
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

  const Ul = ({ items, delay }) => (
    <ul ref={reveal} className="art-ul" style={r(delay ?? 0.06)}>
      {items.map(t => <li key={t} className="art-li">{t}</li>)}
    </ul>
  );

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        .art-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 clamp(24px,6vw,80px); height: 60px;
          background: rgba(9,15,10,0.88); backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .art-brand {
          font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 800;
          font-size: 17px; letter-spacing: .04em; color: #fff; text-decoration: none;
        }
        .art-back {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px; transition: color .25s;
        }
        .art-back:hover { color: rgba(255,255,255,0.80); }
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
        .art-body {
          max-width: 720px; margin: 0 auto;
          padding: 0 clamp(24px,6vw,80px) 100px; box-sizing: border-box;
        }
        .art-intro {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(16px,1.25vw,18px); line-height: 1.85; font-weight: 400;
          color: rgba(255,255,255,0.70); margin: 0 0 28px;
        }
        .art-intro-lead { font-weight: 500; color: rgba(255,255,255,0.88); font-size: clamp(17px,1.35vw,19.5px); }
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
        .ta-block {
          margin: 48px 0; padding: 28px 32px;
          border-left: 3px solid ${GOLD};
          background: rgba(201,168,76,0.05); border-radius: 0 4px 4px 0;
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
        .art-conclusion {
          margin-top: 60px; padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.14);
        }
        .art-conclusion-h2 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: clamp(17px,1.35vw,21px); font-weight: 700;
          letter-spacing: -.02em; color: #fff; line-height: 1.28; margin: 0 0 22px;
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
        .art-sep {
          max-width: 720px; margin: 0 auto;
          padding: 0 clamp(24px,6vw,80px) 48px;
          display: flex; align-items: center; gap: 0; box-sizing: border-box;
        }
        .art-sep-line { flex: 1; height: 1px; background: rgba(255,255,255,0.10); }
        .art-sep-link {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .20em; text-transform: uppercase;
          color: rgba(255,255,255,0.32); text-decoration: none;
          white-space: nowrap; padding: 0 20px; transition: color .25s;
        }
        .art-sep-link:hover { color: rgba(255,255,255,0.72); }
      `}</style>

      {/* ══ Nav ══ */}
      <nav className="art-nav">
        <a href="/" className="art-brand">TROPIC-AURA</a>
        <a href="/insights" className="art-back">← Retour aux analyses</a>
      </nav>

      {/* ══ Hero ══ */}
      <header className="art-hero">
        <div className="art-hero-bg" />
        <div className="art-hero-overlay" />
        <div className="art-hero-content" ref={reveal} style={r(0)}>
          <span style={{ ...lbl, marginBottom: 20 }}>Partenariats</span>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(28px,3.4vw,52px)", lineHeight: 1.05,
            letterSpacing: "-.04em", color: WHITE,
            margin: "14px 0 32px", maxWidth: 820,
          }}>
            Ce qui distingue un fournisseur stable d'un fournisseur opportuniste en Afrique de l'Ouest
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {[["Tropic-Aura", true], ["7 min de lecture", false], ["Juin 2026", false]].map(([txt, bold], i) => (
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
          L'Afrique de l'Ouest attire aujourd'hui un intérêt croissant de la part des importateurs
          internationaux. La région bénéficie d'un potentiel agricole important, d'une proximité
          géographique avantageuse avec l'Europe et d'une montée progressive des standards de qualité
          destinés à l'export.
        </p>
        <p ref={reveal} className="art-intro" style={r(0.07)}>
          Dans ce contexte, de nombreux acheteurs cherchent à développer de nouvelles relations
          commerciales afin de diversifier leurs origines d'approvisionnement et sécuriser leurs volumes.
          Cependant, toutes les collaborations ne produisent pas les mêmes résultats.
        </p>
        <p ref={reveal} className="art-intro" style={r(0.09)}>
          Certaines relations commerciales se développent pendant plusieurs années et génèrent une
          croissance mutuelle. D'autres s'arrêtent après une seule saison. La différence ne repose
          pas uniquement sur le produit — elle repose souvent sur la capacité d'un fournisseur à
          construire une relation professionnelle durable.
        </p>

        {/* ── 1 ── */}
        <h2 ref={reveal} className="art-h2 art-h2-first" style={r(0)}>
          La stabilité commence bien avant la première expédition
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Lorsqu'un importateur recherche un partenaire, l'attention se porte naturellement sur
          les produits, les prix ou les volumes disponibles. Pourtant, les collaborations les plus
          solides se construisent généralement avant même le premier chargement.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>La qualité des échanges initiaux joue un rôle essentiel :</p>
        <Ul items={["clarté des informations ;","rapidité des réponses ;","compréhension des besoins ;","capacité à communiquer de manière professionnelle."]} />
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Les entreprises les plus fiables ne cherchent pas à promettre davantage qu'elles ne peuvent
          réellement livrer. Elles privilégient une communication réaliste et transparente dès le départ.
        </p>

        {/* ── 2 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          Les promesses attirent, l'exécution construit la confiance
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Dans le commerce international, il est relativement facile d'annoncer des volumes importants,
          des prix compétitifs ou des délais ambitieux. La véritable différence apparaît lorsque
          les opérations commencent.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>Un fournisseur stable est capable de :</p>
        <Ul items={["respecter ses engagements ;","communiquer rapidement en cas d'imprévu ;","maintenir une qualité cohérente ;","fournir une documentation complète ;","accompagner le client tout au long du processus."]} />
        <p ref={reveal} className="art-p" style={r(0.04)}>
          À l'inverse, les difficultés apparaissent souvent lorsque les attentes créées au départ
          ne correspondent pas à la réalité opérationnelle. La confiance se construit davantage
          par l'exécution que par les promesses.
        </p>

        {/* ── 3 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          La régularité vaut souvent plus qu'une excellente saison
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Le commerce des produits frais dépend de nombreux facteurs : climat, récoltes, logistique,
          disponibilité des emballages, conditions de transport. Dans cet environnement, la perfection
          n'existe pas.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Les acheteurs expérimentés savent qu'ils ne recherchent pas nécessairement un partenaire
          parfait. Ils recherchent un partenaire capable de maintenir un niveau de performance
          constant dans la durée.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          La régularité devient alors un avantage concurrentiel majeur. Une relation stable sur
          plusieurs saisons crée généralement davantage de valeur qu'une opération exceptionnelle
          suivie de résultats irréguliers.
        </p>

        {/* ── 4 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          La transparence réduit les risques pour toutes les parties
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Les chaînes d'approvisionnement internationales comportent toujours une part d'incertitude.
          Retards portuaires, contraintes climatiques, fluctuations de marché ou difficultés logistiques
          peuvent survenir à tout moment. La manière dont ces situations sont gérées influence
          directement la qualité de la relation commerciale.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>Les partenaires les plus appréciés sont souvent ceux qui :</p>
        <Ul items={["communiquent rapidement ;","partagent les informations pertinentes ;","signalent les difficultés dès leur apparition ;","proposent des solutions concrètes."]} />
        <p ref={reveal} className="art-p" style={r(0.04)}>
          La transparence permet aux différentes parties d'anticiper les risques plutôt que de les subir.
        </p>

        {/* ── 5 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          Une vision à long terme transforme la nature du partenariat
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Les collaborations les plus performantes ne reposent pas uniquement sur une transaction.
          Elles reposent sur une vision commune. Lorsque producteurs, exportateurs, logisticiens
          et importateurs travaillent dans une logique de long terme, les bénéfices dépassent
          largement le cadre d'une seule opération.
        </p>
        <p ref={reveal} className="art-p" style={r(0.04)}>Cette approche favorise :</p>
        <Ul items={["une meilleure planification ;","davantage de stabilité ;","une amélioration continue des processus ;","une confiance mutuelle renforcée."]} />
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Dans un secteur où les relations humaines restent fondamentales, cette dimension devient
          particulièrement importante.
        </p>

        {/* ── 6 ── */}
        <h2 ref={reveal} className="art-h2" style={r(0)}>
          L'évolution du commerce international favorise les partenaires fiables
        </h2>
        <p ref={reveal} className="art-p" style={r(0.04)}>
          Les marchés européens évoluent. Les exigences liées à la qualité, à la traçabilité,
          à la conformité réglementaire et à la visibilité logistique deviennent de plus en plus
          importantes. Dans ce contexte, les entreprises capables d'offrir :
        </p>
        <Ul items={["de la cohérence ;","de la transparence ;","de la réactivité ;","de la prévisibilité ;"]} />
        <p ref={reveal} className="art-p" style={r(0.04)}>
          renforcent progressivement leur position sur le marché. La fiabilité devient un facteur
          de différenciation aussi important que le produit lui-même.
        </p>

        {/* ══ Perspective Tropic-Aura ══ */}
        <div ref={reveal} className="ta-block" style={r(0.04)}>
          <span className="ta-label">Perspective Tropic-Aura</span>
          <p className="ta-p">
            Chez Tropic-Aura, nous croyons que les partenariats durables se construisent autour
            d'une idée simple : créer de la valeur pour l'ensemble des acteurs de la chaîne
            d'approvisionnement.
          </p>
          <p className="ta-p">
            Notre ambition est de contribuer au développement de relations commerciales fondées
            sur la confiance, la transparence et l'excellence opérationnelle.
          </p>
          <p className="ta-p">
            Nous sommes convaincus que l'avenir du commerce tropical africain reposera autant
            sur la qualité des produits que sur la qualité des relations qui les accompagnent.
          </p>
        </div>

        {/* ══ Conclusion ══ */}
        <div ref={reveal} className="art-conclusion" style={r(0.04)}>
          <h2 className="art-conclusion-h2">La stabilité comme fondation de la croissance</h2>
          <p className="art-p">
            Dans un environnement international de plus en plus exigeant, la stabilité devient
            un actif stratégique.
          </p>
          <p className="art-p">
            Les fournisseurs capables de construire des relations durables, d'exécuter leurs
            engagements avec rigueur et de communiquer avec transparence créent les conditions
            nécessaires à une croissance solide et pérenne.
          </p>
          <p className="art-p">
            Au-delà des volumes, des prix ou des saisons, ce sont souvent ces qualités qui
            distinguent les partenariats qui durent de ceux qui disparaissent rapidement.
          </p>
          <div className="art-quote">
            <p className="art-quote-text">
              Les relations commerciales les plus fortes ne se construisent pas sur une transaction
              réussie. Elles se construisent sur la capacité à réussir ensemble, saison après saison.
            </p>
          </div>
        </div>

      </div>

      {/* ══ Séparateur bas ══ */}
      <div className="art-sep">
        <div className="art-sep-line" />
        <a href="/insights" className="art-sep-link">← Toutes les analyses</a>
        <div className="art-sep-line" />
      </div>

    </div>
  );
}
