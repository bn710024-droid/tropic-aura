import { useState } from "react";
import { Link } from "react-router-dom";

// ============================================================
//  <Header />  —  barre fixe + menu rideau plein écran
// ============================================================
const LOGO = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
    <path d="M12 2C8 2 5 5.5 5 9c0 5 5 11 7 13 2-2 7-8 7-13 0-3.5-3-7-7-7zm0 9a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

export default function Header({ scrolled = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={`ta-header ${scrolled ? "scr" : ""}`}>
        <Link to="/" className="ta-logo">
          <span className="ta-logo-i">{LOGO}</span>
          <span className="ta-logo-t">Tropic-Aura</span>
        </Link>
        <nav className="ta-nav">
          <Link className="ta-nl" to="/gamme/fruits-exotiques">Fruits</Link>
          <Link className="ta-nl" to="/gamme/avocats-agrumes">Avocats</Link>
          <Link className="ta-nl" to="/gamme/primeurs-afrique">Primeurs</Link>
          <Link className="ta-nl" to="/notre-histoire">À propos</Link>
          <Link className="ta-cta" to="/#contact">Contact</Link>
          <button className="ta-mb" aria-label="Menu" onClick={() => setOpen(true)}>
            <span /><span /><span />
          </button>
        </nav>
      </header>

      <div className={`ta-menu ${open ? "op" : ""}`}>
        <div className="ta-mtop">
          <Link to="/" className="ta-logo" onClick={() => setOpen(false)}>
            <span className="ta-logo-i">{LOGO}</span>
            <span className="ta-logo-t">Tropic-Aura</span>
          </Link>
          <button className="ta-mclose" aria-label="Fermer" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="ta-mlinks">
          <Link className="ta-ml" to="/" onClick={() => setOpen(false)}>Accueil</Link>
          <Link className="ta-ml" to="/gamme/fruits-exotiques" onClick={() => setOpen(false)}>Fruits tropicaux</Link>
          <Link className="ta-ml" to="/gamme/avocats-agrumes" onClick={() => setOpen(false)}>Avocats & Agrumes</Link>
          <Link className="ta-ml" to="/gamme/primeurs-afrique" onClick={() => setOpen(false)}>Primeurs</Link>
          <Link className="ta-ml" to="/notre-histoire" onClick={() => setOpen(false)}>À propos</Link>
        </div>
        <div className="ta-mfoot">Tropic-Aura B.C. · Export Premium · Dakar, Sénégal</div>
      </div>
    </>
  );
}
