import { PAGE_ENTRY_COLOR as APROPOS } from "../pages/APropos";
import { PAGE_ENTRY_COLOR as PRODUITS } from "../pages/Produits";
import { PAGE_ENTRY_COLOR as PARTENARIATS } from "../pages/Partenariats";
import { PAGE_ENTRY_COLOR as CONTACT } from "../pages/Contact";

const FALLBACK_COLOR = { desktop: "#0E9F6E", mobile: "#0E9F6E" };

// href → couleur d'entrée de la page de destination (voile du morph CTA)
const ROUTE_COLORS = {
  "/about": APROPOS,
  "/a-propos": APROPOS,
  "/products": PRODUITS,
  "/produits": PRODUITS,
  "/partnerships": PARTENARIATS,
  "/partenariats": PARTENARIATS,
  "/contact": CONTACT,
};

/**
 * Couleur du voile de morph pour une destination donnée.
 * href peut être une route (ex. "/about") ou une ancre interne (ex. "#origins") — non utilisé
 * aujourd'hui par aucun CTA, mais pris en charge en fallback pour rester défensif.
 */
export function getDestinationColor(href, isMobile) {
  const entry = ROUTE_COLORS[href];
  const color = entry || FALLBACK_COLOR;
  return isMobile ? color.mobile : color.desktop;
}
