import { useState } from "react";

// ============================================================
//  Carte export animée — section "Notre Avenir" (À propos).
//  Fond = image fixe (public/images/about/avenir-world-map.jpg,
//  1536x1024), intégrée DANS le viewBox du SVG (élément <image>)
//  pour que fond et overlay recadrent toujours ensemble.
//
//  Cadrage volontairement large (VIEW_*) : le message est "l'Afrique
//  connecte le monde", pas "l'Afrique exporte vers l'Europe" — donc
//  tous les continents doivent se deviner à l'écran (Amériques,
//  Europe, Moyen-Orient, Asie, un peu d'Océanie), même petits, pas
//  seulement le corridor Atlantique Nord.
//
//  Dakar + les 8 destinations calibrés par analyse de pixels sur
//  l'image réelle (contour ambre du Sénégal, pics de luminosité des
//  villes, forme en étoile caractéristique de Dubaï), pas à l'œil.
//
//  Animation 100% CSS (aucun JS par frame) : un seul cycle de 4s en
//  boucle infinie. Les 8 routes partent de Dakar en cascade (décalage
//  ~130ms entre chacune, pas de tracé simultané) puis chaque port
//  reçoit un halo doré à son arrivée, qui tient ~0.8s avant de
//  s'estomper — pause d'environ 1s avant que le cycle ne reparte.
//  Seul le survol (tooltip) utilise React state.
//  Desktop uniquement (hover requis) — bascule vers une photo
//  statique en mobile, gérée dans APropos.jsx.
// ============================================================

const GOLD_LINE = "#D9A94A";
const GOLD_POINT = "#F2D896";

const MAP_IMG = "/images/about/avenir-world-map.jpg";
const MAP_W = 1536;
const MAP_H = 1024;

// Fenêtre de recadrage large : centrée sur le nuage de points actif
// (Toronto <-> Dubaï) mais étendue pour laisser deviner l'Amérique du
// Sud, l'Asie et l'Océanie sur les bords — le monde entier, pas juste
// le corridor Afrique-Europe-Amérique du Nord.
const VIEW_X = 30, VIEW_Y = 10, VIEW_W = 1270, VIEW_H = 890;

const DAKAR = { x: 585, y: 536 };

// Ordre = ordre de départ de la cascade (voir STAGGER_MS).
const ROUTES = [
  { id: "rotterdam", name: "Rotterdam", country: "Pays-Bas", x: 733, y: 234, path: "M 585 536 Q 630 330 733 234" },
  { id: "anvers", name: "Anvers", country: "Belgique", x: 728, y: 262, path: "M 585 536 Q 628 350 728 262" },
  { id: "marseille", name: "Marseille", country: "France", x: 724, y: 338, path: "M 585 536 Q 645 400 724 338" },
  { id: "barcelone", name: "Barcelone", country: "Espagne", x: 683, y: 349, path: "M 585 536 Q 630 410 683 349" },
  { id: "montreal", name: "Montréal", country: "Canada", x: 364, y: 356, path: "M 585 536 Q 480 390 364 356" },
  { id: "toronto", name: "Toronto", country: "Canada", x: 340, y: 367, path: "M 585 536 Q 470 400 340 367" },
  { id: "newyork", name: "New York", country: "États-Unis", x: 365, y: 418, path: "M 585 536 Q 490 430 365 418" },
  { id: "dubai", name: "Dubaï", country: "Émirats Arabes Unis", x: 920, y: 483, path: "M 585 536 Q 760 440 920 483" },
];

// Cycle unique en boucle infinie : chaque route part ~130ms après la
// précédente (cascade), dessine en ~900ms, tient son halo ~800ms puis
// s'estompe en ~400ms — suivi d'une pause d'environ 1s avant reprise.
const CYCLE_MS = 4000;
const STAGGER_MS = 130;
const DRAW_MS = 900;
const HOLD_MS = 800;
const FADE_MS = 400;

const pct = (ms) => +((ms / CYCLE_MS) * 100).toFixed(2);

const timingFor = (index) => {
  const start = index * STAGGER_MS;
  const drawEnd = start + DRAW_MS;
  const holdEnd = drawEnd + HOLD_MS;
  const fadeEnd = holdEnd + FADE_MS;
  return { start: pct(start), drawEnd: pct(drawEnd), holdEnd: pct(holdEnd), fadeEnd: pct(fadeEnd) };
};

export default function ExportRouteMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="export-map">
      <style>{`
        .export-map { position: absolute; inset: 0; width: 100%; height: 100%; background: #050505; }

        /* ── Dakar : anneau fin qui respire doucement une fois par cycle, jamais plus de quelques px ── */
        .export-dakar-ring { transform-box: fill-box; transform-origin: center; animation: dakarPulse ${CYCLE_MS}ms ease-out infinite; }
        @keyframes dakarPulse {
          0%   { transform: scale(1); opacity: 0.55; }
          10%  { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        ${ROUTES.map((r, i) => {
          const t = timingFor(i);
          return `
        .export-route--${r.id} { opacity: 0; animation: routeDraw-${r.id} ${CYCLE_MS}ms cubic-bezier(0.45,0,0.2,1) infinite; }
        @keyframes routeDraw-${r.id} {
          0%, ${t.start}%      { opacity: 0; stroke-dashoffset: 100; }
          ${t.start + 0.4}%    { opacity: 1; }
          ${t.drawEnd}%        { opacity: 1; stroke-dashoffset: 0; }
          ${t.holdEnd}%        { opacity: 1; stroke-dashoffset: 0; }
          ${t.fadeEnd}%        { opacity: 0; stroke-dashoffset: 0; }
          100%                 { opacity: 0; stroke-dashoffset: 0; }
        }
        .export-dot--${r.id} {
          offset-distance: 0%;
          opacity: 0;
          animation: dotTravel-${r.id} ${CYCLE_MS}ms cubic-bezier(0.45,0,0.2,1) infinite;
          filter: drop-shadow(0 0 4px rgba(242,216,150,0.85));
        }
        @keyframes dotTravel-${r.id} {
          0%, ${t.start}%       { offset-distance: 0%; opacity: 0; }
          ${t.start + 0.4}%     { opacity: 1; }
          ${t.drawEnd}%         { offset-distance: 100%; opacity: 1; }
          ${t.drawEnd + 3}%     { opacity: 0; }
          100%                  { opacity: 0; }
        }
        .export-arrive--${r.id} { transform-box: fill-box; transform-origin: center; animation: arrivePulse-${r.id} ${CYCLE_MS}ms ease-out infinite; }
        @keyframes arrivePulse-${r.id} {
          0%, ${t.drawEnd - 0.25}% { transform: scale(1); opacity: 0; }
          ${t.drawEnd}%            { transform: scale(1); opacity: 1; }
          ${t.drawEnd + 3}%        { transform: scale(1.7); opacity: 0.4; }
          ${t.drawEnd + 6}%        { transform: scale(1); opacity: 1; }
          ${t.holdEnd}%            { transform: scale(1); opacity: 1; }
          ${t.fadeEnd}%            { opacity: 0; }
          100%                     { opacity: 0; }
        }`;
        }).join("\n")}

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
        .export-tooltip strong { font-size: 38px; font-weight: 700; letter-spacing: 0.02em; color: #F2E9D8; }
        .export-tooltip span { font-size: 30px; opacity: 0.65; }
      `}</style>
      <svg viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        <image href={MAP_IMG} x="0" y="0" width={MAP_W} height={MAP_H} preserveAspectRatio="xMidYMid slice" />

        {ROUTES.map((r) => (
          <path
            key={r.id}
            className={`export-route--${r.id}`}
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
            className={`export-dot--${r.id}`}
            r="7"
            fill={GOLD_POINT}
            style={{ offsetPath: `path('${r.path}')` }}
          />
        ))}

        {/* Dakar — point d'origine : petit point fixe + fin anneau de 2px qui pulse doucement */}
        <circle cx={DAKAR.x} cy={DAKAR.y} r="9" fill="none" stroke={GOLD_LINE} strokeWidth="2" vectorEffect="non-scaling-stroke" className="export-dakar-ring" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="9" fill="none" stroke={GOLD_LINE} strokeWidth="1.4" opacity="0.5" vectorEffect="non-scaling-stroke" />
        <circle cx={DAKAR.x} cy={DAKAR.y} r="4.5" fill={GOLD_POINT} />

        {ROUTES.map((r) => (
          <g key={`g-${r.id}`} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered((h) => (h === r.id ? null : h))}>
            <circle cx={r.x} cy={r.y} r="26" fill="transparent" />
            <circle cx={r.x} cy={r.y} r="6.5" fill={GOLD_POINT} className={`export-arrive--${r.id}`} />
            {hovered === r.id && (
              <foreignObject x={r.x - 210} y={r.y - 190} width="420" height="160" style={{ overflow: "visible", pointerEvents: "none" }}>
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
