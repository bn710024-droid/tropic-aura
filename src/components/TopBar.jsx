// Navigation desktop — mêmes destinations de premier niveau que LiquidMenu
// (pas les sous-liens : une top nav horizontale n'a pas la place d'un
// mega-menu, contrairement au panneau fullscreen mobile).
const NAV_LINKS = [
  { label: "Accueil",       href: "/" },
  { label: "À propos",      href: "/about" },
  { label: "Produits",      href: "/produits" },
  { label: "Disponibilité", href: "/disponibilite" },
  { label: "Partenariats",  href: "/partenariats" },
  { label: "Insights",      href: "/insights" },
  { label: "Contact",       href: "/contact" },
];

export default function TopBar({ variant = "minimal" }) {
  const isFull = variant === "full";

  const handleMenuClick = () => {
    // Dispatch un événement personnalisé que LiquidMenu écoute
    window.dispatchEvent(new CustomEvent("topbar-menu-click"));
  };

  return (
    <header
      className={`ghost topbar${isFull ? " topbar--full" : ""}`}
      style={{
        zIndex: 650, display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "transparent",
      }}
    >
      <a href="/" className="ghost__logo">Tropicaura</a>

      {/* ── Navigation desktop complète : réservée à l'Accueil (vitrine de
           l'entreprise). Les autres pages restent immersives — logo +
           fil d'Ariane + bouton menu fullscreen uniquement, pour ne pas
           casser l'univers propre à chaque produit/section. Masquée sous
           1024px dans tous les cas (voir global.css). ── */}
      {isFull && (
        <nav className="topbar-nav" aria-label="Navigation principale">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="topbar-nav__link">{l.label}</a>
          ))}
          {/* EN désactivé : pas encore de vraie version anglaise (voir
               brief langues) — mieux vaut un état "à venir" honnête qu'un
               bouton qui ne fait rien silencieusement. */}
          <span className="topbar-nav__lang" title="Version anglaise à venir">
            <strong>FR</strong><span aria-hidden="true"> | </span><span className="topbar-nav__lang-en">EN</span>
          </span>
          <a href="/contact?section=form" className="topbar-nav__cta">Demander un devis</a>
        </nav>
      )}

      <button
        id="topbar-menu-btn"
        onClick={handleMenuClick}
        aria-label="Menu"
        className="topbar-menu-btn"
        style={{
          width: 40, height: 40,
          borderRadius: "50%",
          /* Pas de backdrop-filter : sur les WebView WebKit limitées (Google
             iOS), un backdrop blur au-dessus d'un fond animé se re-rasterise
             mal → ghosting/halo près du logo. Un fond rgba légèrement plus
             présent donne la même lisibilité sans aucun filtre au rendu. */
          backgroundColor: "rgba(255,255,255,0.12)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
          alignItems: "center", justifyContent: "center",
          padding: 0,
          position: "relative",
          transition: "background-color .25s, border-color .25s",
          marginRight: "clamp(10px,2.5vw,24px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        {/* Grille 2×2 — état fermé */}
        <div id="topbar-menu-grid" style={{
          position: "absolute",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
          pointerEvents: "none",
          transition: "opacity .25s ease, transform .25s ease",
        }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: 1, backgroundColor: "#fff", display: "block" }} />
          ))}
        </div>

        {/* Croix × — état ouvert */}
        <div id="topbar-menu-cross" style={{
          position: "absolute",
          width: 16, height: 16,
          opacity: 0,
          transform: "scale(.6)",
          pointerEvents: "none",
          transition: "opacity .25s ease, transform .25s ease",
        }}>
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            width: 16, height: 1.5, backgroundColor: "#fff",
            transform: "translate(-50%,-50%) rotate(45deg)",
          }} />
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            width: 16, height: 1.5, backgroundColor: "#fff",
            transform: "translate(-50%,-50%) rotate(-45deg)",
          }} />
        </div>
      </button>
    </header>
  );
}
