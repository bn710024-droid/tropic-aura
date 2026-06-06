import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FruitConstellation from "../components/FruitConstellation";

// ============================================================
//  PAGE D'ACCUEIL
//  Structure validée avec Baba (compromis trio) :
//   1. Hero            — constellation de bienvenue
//   2. Notre gamme     — LE master mix (tous les fruits ensemble)
//   3. Nos atouts      — bento grid 4 cartes (corporate)
//   4. À propos        — institutionnel
//   5. Contact B2B     — formulaire
// ============================================================

const SECTIONS = [
  {
    id: "hero", bg: "#051A10", theme: "hero", count: 9,
    badge: "Export B2B Premium · FOB Dakar",
    h: ["Le Sénégal,", "à l'état ", "pur"], em: "pur",
    p: "Tropic-Aura connecte les meilleurs vergers sénégalais aux marchés européens. Qualité constante, documentation irréprochable.",
    cta: "Demander un devis", route: "/#contact",
  },
  {
    id: "gamme", bg: "#3D2410", theme: "master", count: 11,
    badge: "Notre gamme d'exportation",
    h: ["Fruits & primeurs", "d'", "exception"], em: "exception",
    p: "Mangues Kent & Keitt, ananas Victoria, avocats Hass, citrons verts et haricots verts extra-fins. Une gamme premium calibrée pour l'Europe.",
    cta: "Découvrir nos fruits", route: "/gamme/fruits-exotiques",
  },
];

const BENTO = [
  { icon: "🌱", title: "Sourcing", desc: "Producteurs partenaires sélectionnés. Contrôle variétal avant récolte." },
  { icon: "🚢", title: "Logistique", desc: "FOB Port Autonome de Dakar. Suivi container jusqu'à destination." },
  { icon: "✓", title: "Qualité", desc: "Conformité LMR, calibrage rigoureux, traçabilité totale." },
  { icon: "📦", title: "Conditionnement", desc: "Station fruitière agréée. Emballage aux normes UE." },
];

export default function Home() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const H = typeof window !== "undefined" ? window.innerHeight : 800;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      const idx = Math.round(el.scrollTop / H);
      setScrolled(el.scrollTop > 30);
      setActive(idx);
      // parallaxe verticale de la couche active
      const layer = el.querySelector(`#sec-${idx} .ta-layer`);
      if (layer) {
        const off = el.scrollTop - idx * H;
        [...layer.children].forEach((c) => {
          const dp = parseFloat(c.dataset.depth);
          c.style.marginTop = off * dp * 0.15 + "px";
        });
      }
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [H]);

  const go = (i) => scrollRef.current?.scrollTo({ top: i * H, behavior: "smooth" });
  const totalSections = SECTIONS.length + 3; // gamme blocks + bento + about + contact

  function handleCta(route) {
    if (route.startsWith("/#")) go(totalSections - 1);
    else navigate(route);
  }

  return (
    <div className="ta-root">
      <Header scrolled={scrolled} />

      <div className="ta-scroll" ref={scrollRef}>
        {/* --- Sections fruitées (hero + gamme) --- */}
        {SECTIONS.map((s, i) => (
          <section className="ta-section" id={`sec-${i}`} key={s.id} style={{ background: s.bg }}>
            <div className="ta-glow" style={{ background: "#F97316" }} />
            <FruitConstellation theme={s.theme} count={s.count} active={active === i} />
            <div className="ta-content">
              <div className="ta-badge"><span className="ta-dot" />{s.badge}</div>
              <h1 className="ta-h">
                {s.h[0]}<br />{s.h[1]}<em>{s.em}</em>{s.h[2] === s.em ? "" : s.h[2]}
              </h1>
              <p className="ta-sub">{s.p}</p>
              <button className="ta-btn" onClick={() => handleCta(s.route)}>{s.cta} →</button>
            </div>
          </section>
        ))}

        {/* --- Nos atouts : bento grid --- */}
        <section className="ta-section ta-center" id={`sec-${SECTIONS.length}`} style={{ background: "#0B1F0E" }}>
          <div className="ta-inner">
            <div className="ta-label">Nos atouts</div>
            <h2 className="ta-h2">De la récolte au port,<br />sans maillon faible.</h2>
            <div className="ta-bento">
              {BENTO.map((b) => (
                <div className="ta-card" key={b.title}>
                  <span className="ta-card-i">{b.icon}</span>
                  <h3 className="ta-card-t">{b.title}</h3>
                  <p className="ta-card-d">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- À propos --- */}
        <section className="ta-section ta-light ta-center" id={`sec-${SECTIONS.length + 1}`} style={{ background: "#F5F0E8" }}>
          <FruitConstellation theme="master" count={6} active={active === SECTIONS.length + 1} light />
          <div className="ta-inner ta-about">
            <div className="ta-label">À propos de Tropic-Aura</div>
            <h2 className="ta-h2">Notre rôle dans la filière<br />des fruits frais.</h2>
            <p className="ta-about-p">
              Tropic-Aura assure la liaison entre les producteurs sénégalais et les acheteurs européens.
              Nous connaissons chaque verger, chaque partenaire — du sourcing au certificat phytosanitaire,
              sans rupture ni surprise. Notre engagement : créer de la valeur durable pour les groupements
              de producteurs locaux tout en livrant l'Europe avec une régularité irréprochable.
            </p>
            <button className="ta-btn" onClick={() => navigate("/notre-histoire")}>Notre histoire →</button>
          </div>
        </section>

        {/* --- Contact B2B --- */}
        <section className="ta-section" id={`sec-${SECTIONS.length + 2}`} style={{ background: "#F97316" }}>
          <div className="ta-inner ta-contact">
            <div className="ta-contact-left">
              <div className="ta-label" style={{ color: "rgba(255,255,255,.75)" }}>Contact B2B</div>
              <h2 className="ta-h2" style={{ color: "#fff" }}>Travaillons<br />ensemble.</h2>
              <p className="ta-sub" style={{ color: "rgba(255,255,255,.85)" }}>
                Importateurs, grossistes, distributeurs — réponse sous 24h avec une offre FOB Dakar personnalisée.
              </p>
              <div className="ta-contact-info">
                <div>✉ contact@tropic-aura.com</div>
                <div>📱 WhatsApp Business</div>
                <div>🚢 FOB Port Autonome de Dakar</div>
              </div>
            </div>
            <form className="ta-form" onSubmit={(e) => e.preventDefault()}>
              <h3 className="ta-form-t">Demande de devis</h3>
              <input type="text" placeholder="Entreprise / Nom" />
              <input type="email" placeholder="Email professionnel" />
              <select defaultValue="">
                <option value="" disabled>Produit souhaité</option>
                <option>Mangue Kent / Keitt</option>
                <option>Ananas Victoria</option>
                <option>Avocat Hass / Citron vert</option>
                <option>Haricots verts extra-fins</option>
                <option>Mix / Autre</option>
              </select>
              <input type="text" placeholder="Volume estimé (ex : 2 containers)" />
              <button type="submit" className="ta-submit">Envoyer la demande →</button>
            </form>
          </div>
        </section>
      </div>

      {/* --- Dots de navigation --- */}
      <div className="ta-dots">
        {Array.from({ length: totalSections }).map((_, i) => (
          <button key={i} aria-label={`Section ${i + 1}`}
            className={`ta-pd ${active === i ? "on" : ""}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}
