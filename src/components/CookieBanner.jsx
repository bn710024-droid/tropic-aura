import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, getConsent, setConsent, acceptAll, rejectAll, hasDecided } from "../lib/consent";
import { loadAnalyticsIfConsented, updateAnalyticsConsent } from "../lib/analytics";

// ============================================================
//  COOKIE BANNER — RGPD, marchés cibles UE (NL/BE/FR/ES) + UK.
//
//  Règle CNIL/EDPB suivie : "Tout refuser" a exactement le même
//  poids visuel que "Tout accepter" — un bouton refuser plus petit
//  ou en simple lien texte est un dark pattern, explicitement
//  sanctionné par la CNIL depuis 2020. Les deux sont ici des boutons
//  pleins de taille identique.
//
//  Réouverture à tout moment : événement "open-cookie-preferences"
//  (voir Footer.jsx pour le lien qui le déclenche) plutôt qu'un état
//  local isolé — permet de rouvrir le panneau depuis n'importe où
//  sans lever ce composant plus haut dans l'arbre.
// ============================================================

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState({ analytics: false });

  useEffect(() => {
    if (!hasDecided()) setVisible(true);
    else loadAnalyticsIfConsented(getConsent());

    const reopen = () => {
      setDraft({ analytics: !!getConsent()?.analytics });
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-preferences", reopen);
    return () => window.removeEventListener("open-cookie-preferences", reopen);
  }, []);

  const handleAcceptAll = () => {
    const c = acceptAll();
    loadAnalyticsIfConsented(c);
    updateAnalyticsConsent(c);
    setVisible(false);
    setCustomizing(false);
  };

  const handleRejectAll = () => {
    const c = rejectAll();
    updateAnalyticsConsent(c);
    setVisible(false);
    setCustomizing(false);
  };

  const handleSaveCustom = () => {
    const c = setConsent(draft);
    loadAnalyticsIfConsented(c);
    updateAnalyticsConsent(c);
    setVisible(false);
    setCustomizing(false);
  };

  const FONT = "'Plus Jakarta Sans',sans-serif";
  const btnBase = {
    fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: ".02em",
    padding: "13px 22px", borderRadius: 100, cursor: "pointer",
    border: "1.5px solid rgba(255,255,255,0.3)", flex: "1 1 auto", minWidth: 140,
    transition: "transform .2s ease, background-color .2s ease",
  };

  return (
    <div
      role="dialog" aria-modal="false" aria-label="Préférences cookies"
      // Glissement doux depuis le bas plutôt qu'une apparition/disparition
      // brutale — un pop-in/pop-out sans transition se ressent comme un
      // "saut" au chargement de chaque page.
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 400,
        background: "#0B1310", borderTop: "1px solid rgba(255,255,255,0.12)",
        padding: "22px clamp(20px,5vw,40px) calc(22px + env(safe-area-inset-bottom, 0px))",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "transform .4s cubic-bezier(.22,1,.36,1), opacity .35s ease",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <p style={{
          fontFamily: FONT, fontSize: 13.5, lineHeight: 1.65,
          color: "rgba(255,255,255,0.82)", margin: "0 0 16px", maxWidth: 640,
        }}>
          Tropicaura utilise des cookies strictement nécessaires au fonctionnement du site,
          et, seulement si vous l'acceptez, un outil de mesure d'audience pour comprendre
          quelles pages intéressent nos visiteurs. Rien d'autre.{" "}
          <Link to="/politique-confidentialite" style={{ color: "#D4AF6A", textDecoration: "underline" }}>
            En savoir plus
          </Link>
        </p>

        {customizing && (
          <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: "16px 18px", marginBottom: 16,
          }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <label key={key} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.85)",
                opacity: cat.locked ? 0.55 : 1,
              }}>
                <span>{cat.label}{cat.locked ? " (toujours actif)" : ""}</span>
                <input
                  type="checkbox"
                  checked={cat.locked ? true : draft.analytics}
                  disabled={cat.locked}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: "#D4AF6A", cursor: cat.locked ? "default" : "pointer" }}
                />
              </label>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {!customizing ? (
            <>
              <button
                onClick={handleRejectAll}
                style={{ ...btnBase, background: "transparent", color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Tout refuser
              </button>
              <button
                onClick={handleAcceptAll}
                style={{ ...btnBase, background: "#fff", color: "#0B1310", border: "1.5px solid #fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                Tout accepter
              </button>
              <button
                onClick={() => { setDraft({ analytics: !!getConsent()?.analytics }); setCustomizing(true); }}
                style={{
                  ...btnBase, background: "transparent", color: "rgba(255,255,255,0.7)",
                  border: "1.5px solid transparent", flex: "0 0 auto", minWidth: 0,
                }}
              >
                Personnaliser
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCustomizing(false)}
                style={{ ...btnBase, background: "transparent", color: "rgba(255,255,255,0.7)", flex: "0 0 auto", minWidth: 0 }}
              >
                Retour
              </button>
              <button
                onClick={handleSaveCustom}
                style={{ ...btnBase, background: "#fff", color: "#0B1310", border: "1.5px solid #fff" }}
              >
                Enregistrer mes choix
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
