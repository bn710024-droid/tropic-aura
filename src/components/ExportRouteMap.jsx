import { useEffect, useState } from "react";

// ============================================================
//  Carte export animée — section "Notre Avenir" (À propos).
//  Illustration abstraite (pas une carte géographique littérale) :
//  deux masses continentales stylisées + un point Dakar qui pulse en
//  radar + des routes dorées tracées une à une en boucle infinie,
//  indépendante du scroll (contrairement au reste de la page, tout
//  ici tourne sur une horloge réelle — setInterval + keyframes CSS).
//  Desktop uniquement (hover requis pour les tooltips) — cf. usage
//  dans APropos.jsx qui bascule vers une photo statique en mobile.
// ============================================================

const GOLD = "#C9A84C";
const OFFWHITE = "#F2E9D8";
const MAP_BG = "#050505";
const AFRICA_FILL = "#132C1F";
const EUROPE_FILL = "#2B2E33";

const DAKAR = { x: 55, y: 455 };

const AFRICA_PATH =
  "M 115 348 Q 180 335 230 352 Q 290 400 292 470 Q 288 540 245 588 Q 190 608 150 590 Q 110 560 85 510 Q 50 480 55 455 Q 65 410 115 348 Z";
const EUROPE_PATH =
  "M 150 300 Q 120 260 128 210 Q 135 170 165 168 Q 190 150 230 155 Q 260 140 290 145 Q 320 130 340 100 Q 345 70 320 55 Q 300 80 300 120 Q 295 160 275 190 Q 260 230 250 260 Q 245 290 220 305 Q 190 300 150 300 Z";
const UK_PATH =
  "M 65 145 Q 85 140 92 165 Q 96 190 80 205 Q 62 210 55 190 Q 50 165 65 145 Z";

// Ordre = ordre d'apparition dans le cycle (boucle infinie).
const ROUTES = [
  { id: "rotterdam", name: "Rotterdam", country: "Pays-Bas", tag: "Hub fruits frais", x: 270, y: 148, path: "M 55 455 Q 100 260 270 148" },
  { id: "anvers", name: "Anvers", country: "Belgique", tag: "Terminal conteneurs", x: 255, y: 162, path: "M 55 455 Q 95 280 255 162" },
  { id: "marseille", name: "Marseille", country: "France", tag: "Marché méditerranéen", x: 225, y: 290, path: "M 55 455 Q 90 350 225 290" },
  { id: "bilbao", name: "Bilbao", country: "Espagne", tag: "Corridor ibérique", x: 140, y: 265, path: "M 55 455 Q 65 360 140 265" },
  { id: "londres", name: "Londres", country: "Royaume-Uni", tag: "Marché premium", x: 72, y: 175, path: "M 55 455 Q 10 290 72 175" },
  { id: "hambourg", name: "Hambourg", country: "Allemagne", tag: "Hub logistique", x: 300, y: 128, path: "M 55 455 Q 115 240 300 128" },
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
        .export-map { position: absolute; inset: 0; width: 100%; height: 100%; background: ${MAP_BG}; }
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
          filter: drop-shadow(0 0 3px rgba(242,233,216,0.85));
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
        .export-tooltip strong { font-size: 12px; font-weight: 700; letter-spacing: 0.02em; }
        .export-tooltip span { font-size: 10px; opacity: 0.6; }
        .export-tooltip-tag { text-transform: uppercase; letter-spacing: 0.08em; font-size: 9px !important; color: ${GOLD}; opacity: 0.85 !important; }
      `}</style>
      <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        <path d={EUROPE_PATH} fill={EUROPE_FILL} />
        <path d={UK_PATH} fill={EUROPE_FILL} />
        <path d={AFRICA_PATH} fill={AFRICA_FILL} />

        <path
          key={`route-${leg}`}
          className="export-route"
          d={route.path}
          fill="none"
          stroke={GOLD}
          strokeWidth="1.4"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
        />
        <circle key={`dot-${leg}`} className="export-travel-dot" r="3" fill={OFFWHITE} style={{ offsetPath: `path('${route.path}')` }} />

        {/* Dakar — radar en boucle continue, indépendant du cycle de routes */}
        <circle cx={DAKAR.x} cy={DAKAR.y} r="9" fill={GOLD} opacity="0.18" className="export-radar" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="9" fill={GOLD} opacity="0.18" className="export-radar export-radar--delay" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="3.4" fill={OFFWHITE} />

        {ROUTES.map((r) => (
          <g key={r.id} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered((h) => (h === r.id ? null : h))}>
            <circle cx={r.x} cy={r.y} r="10" fill="transparent" />
            <circle
              cx={r.x}
              cy={r.y}
              r="2.6"
              fill={OFFWHITE}
              className={r.id === route.id ? "export-arrive" : undefined}
              key={r.id === route.id ? `arrive-${leg}` : `static-${r.id}`}
            />
            {hovered === r.id && (
              <foreignObject x={r.x - 66} y={r.y - 64} width="132" height="56" style={{ overflow: "visible", pointerEvents: "none" }}>
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
