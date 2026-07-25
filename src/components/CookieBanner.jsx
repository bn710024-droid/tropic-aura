import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  // ── Anti-flash : deux états distincts ──────────────────────────
  //  `mounted` = le bandeau existe-t-il dans le DOM. Faux dès le
  //  premier rendu pour un visiteur qui a DÉJÀ décidé → on retourne
  //  `null`, aucun élément caché avec transition ne traîne dans le
  //  DOM, donc il est PHYSIQUEMENT impossible qu'il « apparaisse puis
  //  reparte » au chargement d'une page (le bug signalé sur PC).
  //  `shown` = état animé (glissement). On monte caché, puis on
  //  déclenche l'entrée à la frame suivante (rAF) pour un vrai
  //  glissement, et on démonte APRÈS l'animation de sortie.
  const [mounted, setMounted] = useState(() => !hasDecided());
  const [shown, setShown] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState({ analytics: false });
  const exitTimer = useRef(0);
  const enterTimer = useRef(0);

  // Déclenche le glissement d'entrée APRÈS le premier paint caché. On
  // combine rAF (fluide quand l'onglet est visible) et un setTimeout de
  // secours : rAF est gelé quand l'onglet est en arrière-plan, le timer
  // garantit malgré tout l'entrée quand l'utilisateur revient.
  const slideIn = () => {
    requestAnimationFrame(() => setShown(true));
    window.clearTimeout(enterTimer.current);
    enterTimer.current = window.setTimeout(() => setShown(true), 60);
  };

  useEffect(() => {
    if (hasDecided()) {
      loadAnalyticsIfConsented(getConsent());
    } else {
      slideIn();
    }

    const reopen = () => {
      window.clearTimeout(exitTimer.current);
      setDraft({ analytics: !!getConsent()?.analytics });
      setCustomizing(true);
      setMounted(true);
      slideIn();
    };
    window.addEventListener("open-cookie-preferences", reopen);
    return () => {
      window.removeEventListener("open-cookie-preferences", reopen);
      window.clearTimeout(exitTimer.current);
      window.clearTimeout(enterTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sortie animée puis démontage (le délai couvre la transition de .4s).
  const dismiss = () => {
    setShown(false);
    setCustomizing(false);
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => setMounted(false), 450);
  };

  const handleAcceptAll = () => {
    const c = acceptAll();
    loadAnalyticsIfConsented(c);
    updateAnalyticsConsent(c);
    dismiss();
  };

  const handleRejectAll = () => {
    const c = rejectAll();
    updateAnalyticsConsent(c);
    dismiss();
  };

  const handleSaveCustom = () => {
    const c = setConsent(draft);
    loadAnalyticsIfConsented(c);
    updateAnalyticsConsent(c);
    dismiss();
  };

  // Rien dans le DOM tant que le bandeau n'est pas monté → zéro flash.
  if (!mounted) return null;

  const FONT = "'Plus Jakarta Sans',sans-serif";
  const btnBase = {
    fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: ".02em",
    padding: "13px 22px", borderRadius: 100, cursor: "pointer",
    border: "1.5px solid rgba(255,255,255,0.3)", flex: "1 1 auto", minWidth: 140,
    transition: "transform .2s ease, background-color .2s ease",
  };

  return (
    <div
      role="dialog" aria-modal="false" aria-label={t("cookies.dialogLabel")}
      // Glissement doux depuis le bas plutôt qu'une apparition/disparition
      // brutale — un pop-in/pop-out sans transition se ressent comme un
      // "saut" au chargement de chaque page.
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 400,
        background: "#0B1310", borderTop: "1px solid rgba(255,255,255,0.12)",
        padding: "22px clamp(20px,5vw,40px) calc(22px + env(safe-area-inset-bottom, 0px))",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
        transform: shown ? "translateY(0)" : "translateY(100%)",
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "auto" : "none",
        transition: "transform .4s cubic-bezier(.22,1,.36,1), opacity .35s ease",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <p style={{
          fontFamily: FONT, fontSize: 13.5, lineHeight: 1.65,
          color: "rgba(255,255,255,0.82)", margin: "0 0 16px", maxWidth: 640,
        }}>
          {t("cookies.text")}{" "}
          <Link to="/politique-confidentialite" style={{ color: "#D4AF6A", textDecoration: "underline" }}>
            {t("cookies.learnMore")}
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
                <span>{t(`cookies.categories.${key}`)}{cat.locked ? t("cookies.alwaysOn") : ""}</span>
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
                {t("cookies.rejectAll")}
              </button>
              <button
                onClick={handleAcceptAll}
                style={{ ...btnBase, background: "#fff", color: "#0B1310", border: "1.5px solid #fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                {t("cookies.acceptAll")}
              </button>
              <button
                onClick={() => { setDraft({ analytics: !!getConsent()?.analytics }); setCustomizing(true); }}
                style={{
                  ...btnBase, background: "transparent", color: "rgba(255,255,255,0.7)",
                  border: "1.5px solid transparent", flex: "0 0 auto", minWidth: 0,
                }}
              >
                {t("cookies.customise")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCustomizing(false)}
                style={{ ...btnBase, background: "transparent", color: "rgba(255,255,255,0.7)", flex: "0 0 auto", minWidth: 0 }}
              >
                {t("cookies.back")}
              </button>
              <button
                onClick={handleSaveCustom}
                style={{ ...btnBase, background: "#fff", color: "#0B1310", border: "1.5px solid #fff" }}
              >
                {t("cookies.save")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
