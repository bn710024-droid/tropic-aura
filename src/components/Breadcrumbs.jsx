import { Link } from "react-router-dom";

// ============================================================
//  <Breadcrumbs /> — fil d'Ariane accessible et discret.
//
//  Contrainte design : ne JAMAIS perturber les héros plein écran
//  existants. Rendu en position fixed (n'affecte donc jamais le
//  flux du document ni la mise en page premium).
//
//  Fond en "chip" semi-transparent + flou (même traitement que le
//  bouton menu de TopBar) plutôt qu'un texte nu dépendant d'un
//  fond clair/sombre fixe : plusieurs pages (À Propos) changent la
//  couleur de fond AU SCROLL alors que ce composant reste épinglé
//  en position fixed — un texte blanc nu deviendrait illisible sur
//  une section claire. Le chip garantit un contraste WCAG correct
//  quel que soit le contenu défilant derrière.
//
//  `trail` = [{ path, label }] du plus général (Accueil) au plus
//  précis (page courante) — voir routesRegistry.buildBreadcrumbTrail.
// ============================================================
export default function Breadcrumbs({ trail }) {
  if (!trail || trail.length < 2) return null; // rien à afficher sur la home

  const color = "rgba(255,255,255,0.62)";
  const currentColor = "rgba(255,255,255,0.95)";
  const sepColor = "rgba(255,255,255,0.35)";
  const goldAccent = "#D4AF6A";

  return (
    <nav
      aria-label="Fil d'Ariane"
      style={{
        position: "fixed",
        top: 62,
        left: "clamp(20px,5vw,48px)",
        zIndex: 190,
        pointerEvents: "auto",
      }}
    >
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
          margin: 0,
          padding: "6px 14px",
          listStyle: "none",
          borderRadius: 100,
          background: "rgba(0,0,0,0.34)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          const isHome = i === 0;
          return (
            <li key={item.path} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span aria-hidden="true" style={{ color: sepColor }}>/</span>}
              {isLast ? (
                <span aria-current="page" style={{ color: currentColor }}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  style={{ color, textDecoration: "none", transition: "color .2s ease", display: "inline-flex", alignItems: "center", gap: 5 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = goldAccent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = color)}
                >
                  {isHome && <span aria-hidden="true" style={{ fontSize: 11 }}>⌂</span>}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
