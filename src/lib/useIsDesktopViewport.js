import { useEffect, useState } from "react";

const QUERY = "(min-width: 769px)";

// Utilisé uniquement pour choisir QUELLE des deux arborescences
// (desktop / mobile "page turn") porte le <h1> sémantique de la page —
// les deux arborescences restent montées en permanence (CSS pur, comme
// partout ailleurs sur le site) ; seul le tag de titre change, jamais le
// texte ni les classes d'animation. Voir APropos.jsx / Partenariats.jsx.
export default function useIsDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}
