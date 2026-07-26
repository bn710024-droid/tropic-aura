import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { alternatePath, langFromPath, pathFor, SUPPORTED_LANGS } from "../i18n/routing";

// Navigation desktop — mêmes destinations de premier niveau que LiquidMenu
// (pas les sous-liens : une top nav horizontale n'a pas la place d'un
// mega-menu, contrairement au panneau fullscreen mobile).
// `key` = clé i18n du libellé + clé de page pour résoudre l'URL localisée.
const NAV_LINKS = [
  { key: "home",         page: "home" },
  { key: "about",        page: "about" },
  { key: "products",     page: "products" },
  { key: "availability", page: "availability" },
  { key: "partnerships", page: "partnerships" },
  { key: "insights",     page: "insights" },
  { key: "contact",      page: "contact" },
];

export default function TopBar({ variant = "minimal" }) {
  const isFull = variant === "full";
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  // Équivalent de la page courante dans chaque autre langue — null si elle
  // n'est pas encore traduite : le sélecteur s'affiche alors en état inactif
  // plutôt que de mener à une page inexistante.
  const altHrefs = Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, alternatePath(pathname, l)]));

  // Reflète l'état ouvert/fermé de LiquidMenu (qui l'annonce via ce même
  // événement) pour exposer aria-expanded sur le bouton — LiquidMenu garde
  // son propre isOpen en ref (piloté par rAF), ce state ne sert qu'à l'a11y.
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onToggle = (e) => setMenuOpen(e.detail.open);
    window.addEventListener("liquidmenu-toggle", onToggle);
    return () => window.removeEventListener("liquidmenu-toggle", onToggle);
  }, []);

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
      <a href={pathFor("home", lang)} className="ghost__logo">Tropicaura</a>

      {/* ── Navigation desktop complète : réservée à l'Accueil (vitrine de
           l'entreprise). Les autres pages restent immersives — logo +
           fil d'Ariane + bouton menu fullscreen uniquement, pour ne pas
           casser l'univers propre à chaque produit/section. Masquée sous
           1024px dans tous les cas (voir global.css). ── */}
      {isFull && (
        <nav className="topbar-nav" aria-label={t("a11y.mainNav")}>
          {NAV_LINKS.map((l) => (
            <a key={l.key} href={pathFor(l.page, lang)} className="topbar-nav__link">
              {t(`nav.${l.key}`)}
            </a>
          ))}
          {/* Sélecteur FR/EN/NL — de vrais <a> (pas des boutons JS) : la langue
               vit dans l'URL, donc la bascule est une navigation. Indexable,
               partageable, fonctionne au clic-droit « ouvrir dans un onglet ».
               Si la page courante n'existe pas encore dans une langue donnée,
               altHrefs[code] est null → état inactif explicite plutôt qu'un
               lien mort ou une redirection surprise vers l'accueil. */}
          <span className="topbar-nav__lang">
            {SUPPORTED_LANGS.map((code, i) => {
              const isCurrent = code === lang;
              const href = altHrefs[code];
              return (
                <span key={code}>
                  {i > 0 && <span aria-hidden="true"> | </span>}
                  {href ? (
                    <a
                      href={isCurrent ? undefined : href}
                      className="topbar-nav__lang-link"
                      aria-current={isCurrent ? "true" : undefined}
                      style={isCurrent ? { fontWeight: 700, pointerEvents: "none" } : undefined}
                      hrefLang={code}
                    >
                      {code.toUpperCase()}
                    </a>
                  ) : (
                    <span
                      className={isCurrent ? undefined : "topbar-nav__lang-en"}
                      style={isCurrent ? { fontWeight: 700 } : undefined}
                      aria-current={isCurrent ? "true" : undefined}
                      title={isCurrent ? undefined : t("a11y.langSwitch")}
                    >
                      {code.toUpperCase()}
                    </span>
                  )}
                </span>
              );
            })}
          </span>
          <a href={`${pathFor("contact", lang)}?section=form`} className="topbar-nav__cta">
            {t("nav.quote")}
          </a>
        </nav>
      )}

      <button
          id="topbar-menu-btn"
          onClick={handleMenuClick}
          aria-label={t("a11y.menu")}
          aria-expanded={menuOpen}
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
            marginRight: "clamp(2px,0.6vw,8px)",
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
