import { useState } from "react";

// ============================================================
//  Carte export animée — section "Notre Avenir" (À propos).
//  Fond = image fixe (public/images/about/avenir-world-map.jpg,
//  1536x1024), intégrée DANS le viewBox du SVG (élément <image>)
//  pour que fond et overlay recadrent toujours ensemble, quel que
//  soit le ratio du cadre (mesuré de 0.58 à 1.71 selon la fenêtre).
//  Dakar + les 7 destinations ont été calibrés par analyse de pixels
//  sur l'image réelle (détection du contour ambre du Sénégal +
//  pics de luminosité des villes), pas à l'œil.
//
//  Animation 100% CSS (aucun JS par frame) : un seul cycle de 4s en
//  boucle infinie, chaque route a ses propres @keyframes selon son
//  "palier de distance" (proche / moyen / lointain) pour que le
//  réseau se déploie en éventail naturel plutôt que d'un bloc, puis
//  se referme dans l'ordre inverse. Seul le survol (tooltip) utilise
//  React state — le cycle lui-même ne dépend d'aucun setInterval.
//  Desktop uniquement (hover requis) — bascule vers une photo
//  statique en mobile, gérée dans APropos.jsx.
// ============================================================

const GOLD_LINE = "#D9A94A";
const GOLD_POINT = "#F2D896";

const MAP_IMG = "/images/about/avenir-world-map.jpg";
const MAP_W = 1536;
const MAP_H = 1024;

// Fenêtre de recadrage (dans les coordonnées de l'image pleine) centrée
// sur le nuage de points Dakar <-> destinations, pas sur le centre de
// l'image. Le centre géométrique de l'image (768,512) est loin du centre
// réel du réseau (~536,385) — Toronto/Montréal/New York sortaient du
// cadre sur fenêtre étroite avec un simple xMidYMid sur l'image entière.
const VIEW_X = 150, VIEW_Y = 25, VIEW_W = 770, VIEW_H = 720;

const DAKAR = { x: 585, y: 536 };

// tier = palier de distance : proche / moyen / lointain — pilote la
// vitesse de tracé et l'ordre d'apparition/disparition (voir CYCLE).
const ROUTES = [
  { id: "marseille", name: "Marseille", country: "France", tier: "near", x: 724, y: 338, path: "M 585 536 Q 645 400 724 338" },
  { id: "barcelone", name: "Barcelone", country: "Espagne", tier: "near", x: 683, y: 349, path: "M 585 536 Q 630 410 683 349" },
  { id: "rotterdam", name: "Rotterdam", country: "Pays-Bas", tier: "mid", x: 733, y: 234, path: "M 585 536 Q 630 330 733 234" },
  { id: "anvers", name: "Anvers", country: "Belgique", tier: "mid", x: 728, y: 262, path: "M 585 536 Q 628 350 728 262" },
  { id: "montreal", name: "Montréal", country: "Canada", tier: "far", x: 364, y: 356, path: "M 585 536 Q 480 390 364 356" },
  { id: "toronto", name: "Toronto", country: "Canada", tier: "far", x: 340, y: 367, path: "M 585 536 Q 470 400 340 367" },
  { id: "newyork", name: "New York", country: "États-Unis", tier: "far", x: 365, y: 418, path: "M 585 536 Q 490 430 365 418" },
];

// Un seul cycle de 4s, en boucle infinie. Chaque palier a sa propre
// fenêtre de tracé/tenue/fondu au sein de ce même cycle — voir le
// détail des pourcentages dans TIERS ci-dessous.
const CYCLE_MS = 4000;
const TIERS = {
  near: { drawStart: 13.75, drawEnd: 28.75, holdEnd: 72.5, fadeEnd: 85 },
  mid: { drawStart: 14.5, drawEnd: 33.25, holdEnd: 68.75, fadeEnd: 81.25 },
  far: { drawStart: 15.25, drawEnd: 39, holdEnd: 65, fadeEnd: 77.5 },
};

export default function ExportRouteMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="export-map">
      <style>{`
        .export-map { position: absolute; inset: 0; width: 100%; height: 100%; background: #050505; }

        /* ── Halo Dakar : une seule respiration en tout début de cycle ── */
        .export-dakar-halo { transform-box: fill-box; transform-origin: center; animation: dakarHalo ${CYCLE_MS}ms ease-out infinite; }
        @keyframes dakarHalo {
          0%   { transform: scale(1); opacity: 0.5; }
          12.5% { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        ${Object.entries(TIERS).map(([tier, t]) => `
        .export-route--${tier} {
          opacity: 0;
          animation: routeDraw-${tier} ${CYCLE_MS}ms cubic-bezier(0.45,0,0.2,1) infinite;
        }
        @keyframes routeDraw-${tier} {
          0%, ${t.drawStart}%   { opacity: 0; stroke-dashoffset: 100; }
          ${t.drawStart + 0.3}% { opacity: 1; }
          ${t.drawEnd}%         { opacity: 1; stroke-dashoffset: 0; }
          ${t.holdEnd}%         { opacity: 1; stroke-dashoffset: 0; }
          ${t.fadeEnd}%         { opacity: 0; stroke-dashoffset: 0; }
          100%                  { opacity: 0; stroke-dashoffset: 0; }
        }
        .export-dot--${tier} {
          offset-distance: 0%;
          opacity: 0;
          animation: dotTravel-${tier} ${CYCLE_MS}ms cubic-bezier(0.45,0,0.2,1) infinite;
          filter: drop-shadow(0 0 4px rgba(242,216,150,0.85));
        }
        @keyframes dotTravel-${tier} {
          0%, ${t.drawStart}%     { offset-distance: 0%; opacity: 0; }
          ${t.drawStart + 0.3}%   { opacity: 1; }
          ${t.drawEnd}%           { offset-distance: 100%; opacity: 1; }
          ${t.drawEnd + 3.5}%     { opacity: 0; }
          100%                    { opacity: 0; }
        }
        .export-arrive--${tier} {
          transform-box: fill-box;
          transform-origin: center;
          animation: arrivePulse-${tier} ${CYCLE_MS}ms ease-out infinite;
        }
        @keyframes arrivePulse-${tier} {
          0%, ${t.drawEnd - 0.25}% { transform: scale(1); opacity: 0; }
          ${t.drawEnd}%            { transform: scale(1); opacity: 1; }
          ${t.drawEnd + 4}%        { transform: scale(1.8); opacity: 0.4; }
          ${t.drawEnd + 8}%        { transform: scale(1); opacity: 1; }
          ${t.holdEnd}%            { transform: scale(1); opacity: 1; }
          ${t.fadeEnd}%            { opacity: 0; }
          100%                     { opacity: 0; }
        }
        `).join("\n")}

        .export-tooltip {
          background: #0B0F0A;
          border: 1px solid rgba(217,169,74,0.35);
          border-radius: 3px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: ${GOLD_POINT};
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .export-tooltip strong { font-size: 44px; font-weight: 700; letter-spacing: 0.02em; color: #F2E9D8; }
        .export-tooltip span { font-size: 34px; opacity: 0.65; }
      `}</style>
      <svg viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        <image href={MAP_IMG} x="0" y="0" width={MAP_W} height={MAP_H} preserveAspectRatio="xMidYMid slice" />

        {ROUTES.map((r) => (
          <path
            key={r.id}
            className={`export-route--${r.tier}`}
            d={r.path}
            fill="none"
            stroke={GOLD_LINE}
            strokeWidth="1.3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength="100"
            strokeDasharray="100"
          />
        ))}
        {ROUTES.map((r) => (
          <circle
            key={`dot-${r.id}`}
            className={`export-dot--${r.tier}`}
            r="10"
            fill={GOLD_POINT}
            style={{ offsetPath: `path('${r.path}')` }}
          />
        ))}

        {/* Dakar — point d'origine fixe, contour léger + halo qui respire une fois par cycle */}
        <circle cx={DAKAR.x} cy={DAKAR.y} r="20" fill="none" stroke={GOLD_LINE} strokeWidth="1" opacity="0.35" vectorEffect="non-scaling-stroke" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="20" fill={GOLD_LINE} opacity="0.16" className="export-dakar-halo" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="12" fill={GOLD_POINT} />

        {ROUTES.map((r) => (
          <g key={`g-${r.id}`} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered((h) => (h === r.id ? null : h))}>
            <circle cx={r.x} cy={r.y} r="36" fill="transparent" />
            <circle cx={r.x} cy={r.y} r="9" fill={GOLD_POINT} className={`export-arrive--${r.tier}`} />
            {hovered === r.id && (
              <foreignObject x={r.x - 250} y={r.y - 220} width="500" height="190" style={{ overflow: "visible", pointerEvents: "none" }}>
                <div className="export-tooltip">
                  <strong>{r.name}</strong>
                  <span>{r.country}</span>
                </div>
              </foreignObject>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
