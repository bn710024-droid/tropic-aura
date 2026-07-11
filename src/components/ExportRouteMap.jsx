import { useEffect, useState } from "react";

// ============================================================
//  Carte export animée — section "Notre Avenir" (À propos).
//  Fond = illustration générée (public/images/about/avenir-world-map.jpg,
//  1536x1024), intégrée DANS le viewBox du SVG (élément <image>) plutôt
//  qu'en <img> séparé — indispensable pour que le fond et les points
//  animés recadrent ensemble (object-fit:cover sur un <img> et
//  preserveAspectRatio="slice" sur un <svg> séparé ne croisent pas
//  forcément de la même façon selon le ratio du cadre, qui varie
//  fortement ici : mesuré de 0.58 à 1.71 selon la taille de fenêtre).
//  Les coordonnées Dakar + 6 villes ont été calibrées par analyse de
//  pixels sur l'image réelle (détection de composantes connexes +
//  vérification "tombe bien sur la terre"), pas à l'œil.
//  Animation des routes indépendante du scroll — horloge réelle
//  (setInterval + keyframes CSS), cf. note d'architecture dans
//  APropos.jsx qui ne s'applique qu'au flux scroll principal.
//  Desktop uniquement (hover requis pour les tooltips) — cf. usage
//  dans APropos.jsx qui bascule vers une photo statique en mobile.
// ============================================================

const GOLD = "#C9A84C";
const OFFWHITE = "#F2E9D8";

const MAP_IMG = "/images/about/avenir-world-map.jpg";
const MAP_W = 1536;
const MAP_H = 1024;

const DAKAR = { x: 628, y: 536 };

// Ordre = ordre d'apparition dans le cycle (boucle infinie).
const ROUTES = [
  { id: "rotterdam", name: "Rotterdam", country: "Pays-Bas", tag: "Hub fruits frais", x: 724, y: 320, path: "M 628 536 Q 560 380 724 320" },
  { id: "anvers", name: "Anvers", country: "Belgique", tag: "Terminal conteneurs", x: 732, y: 335, path: "M 628 536 Q 565 390 732 335" },
  { id: "marseille", name: "Marseille", country: "France", tag: "Marché méditerranéen", x: 715, y: 379, path: "M 628 536 Q 600 430 715 379" },
  { id: "bilbao", name: "Bilbao", country: "Espagne", tag: "Corridor ibérique", x: 684, y: 380, path: "M 628 536 Q 590 440 684 380" },
  { id: "londres", name: "Londres", country: "Royaume-Uni", tag: "Marché premium", x: 698, y: 368, path: "M 628 536 Q 580 410 698 368" },
  { id: "hambourg", name: "Hambourg", country: "Allemagne", tag: "Hub logistique", x: 762, y: 305, path: "M 628 536 Q 545 360 762 305" },
];

const LEG_MS = 4200;

export default function ExportRouteMap() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [leg, setLeg] = useState(0);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % ROUTES.length);
      setLeg((l) => l + 1);
    }, LEG_MS);
    return () => clearInterval(id);
  }, []);

  const route = ROUTES[activeIdx];

  return (
    <div className="export-map">
      <style>{`
        .export-map { position: absolute; inset: 0; width: 100%; height: 100%; background: #050505; }
        .export-route { opacity: 0; animation: exportRouteLife ${LEG_MS}ms ease-in-out forwards; }
        @keyframes exportRouteLife {
          0%   { opacity: 0; stroke-dashoffset: 100; }
          3%   { opacity: 1; }
          43%  { stroke-dashoffset: 0; opacity: 1; }
          67%  { stroke-dashoffset: 0; opacity: 1; }
          90%  { opacity: 0; stroke-dashoffset: 0; }
          100% { opacity: 0; stroke-dashoffset: 0; }
        }
        .export-travel-dot {
          offset-distance: 0%;
          opacity: 0;
          animation: exportDotTravel ${LEG_MS}ms ease-in-out forwards;
          filter: drop-shadow(0 0 4px rgba(242,233,216,0.85));
        }
        @keyframes exportDotTravel {
          0%   { offset-distance: 0%; opacity: 0; }
          3%   { opacity: 1; }
          43%  { offset-distance: 100%; opacity: 1; }
          50%  { opacity: 0; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        .export-radar { transform-box: fill-box; transform-origin: center; animation: exportRadar 4s ease-out infinite; }
        .export-radar--delay { animation-delay: 2s; }
        @keyframes exportRadar {
          0%   { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(3.4); opacity: 0; }
        }
        .export-arrive { transform-box: fill-box; transform-origin: center; animation: exportArrive ${LEG_MS}ms ease-out both; }
        @keyframes exportArrive {
          0%, 40% { transform: scale(1); }
          58%     { transform: scale(2.1); opacity: 0.4; }
          75%, 100% { transform: scale(1); opacity: 1; }
        }
        .export-tooltip {
          background: #0B0F0A;
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 3px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: ${OFFWHITE};
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .export-tooltip strong { font-size: 44px; font-weight: 700; letter-spacing: 0.02em; }
        .export-tooltip span { font-size: 36px; opacity: 0.6; }
        .export-tooltip-tag { text-transform: uppercase; letter-spacing: 0.08em; font-size: 32px !important; color: ${GOLD}; opacity: 0.85 !important; }
      `}</style>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        <image href={MAP_IMG} x="0" y="0" width={MAP_W} height={MAP_H} preserveAspectRatio="xMidYMid slice" />

        <path
          key={`route-${leg}`}
          className="export-route"
          d={route.path}
          fill="none"
          stroke={GOLD}
          strokeWidth="5"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
        />
        <circle key={`dot-${leg}`} className="export-travel-dot" r="11" fill={OFFWHITE} style={{ offsetPath: `path('${route.path}')` }} />

        {/* Dakar — radar en boucle continue, indépendant du cycle de routes */}
        <circle cx={DAKAR.x} cy={DAKAR.y} r="34" fill={GOLD} opacity="0.18" className="export-radar" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="34" fill={GOLD} opacity="0.18" className="export-radar export-radar--delay" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="13" fill={OFFWHITE} />

        {ROUTES.map((r) => (
          <g key={r.id} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered((h) => (h === r.id ? null : h))}>
            <circle cx={r.x} cy={r.y} r="38" fill="transparent" />
            <circle
              cx={r.x}
              cy={r.y}
              r="10"
              fill={OFFWHITE}
              className={r.id === route.id ? "export-arrive" : undefined}
              key={r.id === route.id ? `arrive-${leg}` : `static-${r.id}`}
            />
            {hovered === r.id && (
              <foreignObject x={r.x - 250} y={r.y - 240} width="500" height="210" style={{ overflow: "visible", pointerEvents: "none" }}>
                <div className="export-tooltip">
                  <strong>{r.name}</strong>
                  <span>{r.country}</span>
                  <span className="export-tooltip-tag">{r.tag}</span>
                </div>
              </foreignObject>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
