import { useTranslation } from "react-i18next";
import { CSS_EASE_IN_OUT } from "../motion/easing";

// ============================================================
//  Timeline SVG animée — section "Le parcours d'un partenariat".
//  Ligne horizontale plate, 5 étapes numérotées (01→05) en cercles
//  bagués — pas une courbe. Un point lumineux parcourt la ligne dans
//  l'ordre, chaque cercle s'allume (contour → plein doré) à son tour,
//  reste éclairé 2s une fois la dernière étape atteinte, puis
//  s'éteint et recommence — boucle infinie, ~11s, 100% CSS (même
//  technique que ExportRouteMap.jsx).
// ============================================================

const GOLD_LINE = "#C9A84C";
const GOLD_POINT = "#F2D896";
const BLACK_FILL = "#0B0F0A";
const IVORY = "#F2E9D8";

const VIEW_W = 1000;
const VIEW_H = 40;
const Y = 20;
const R = 22;

// title/text traduits via partnerships.sections.parcours.steps[i] (voir
// PartnershipTimeline ci-dessous) — seule la géométrie (id/num/x) reste ici.
const STEPS = [
  { id: "echange", num: "01", x: 60 },
  { id: "comprehension", num: "02", x: 280 },
  { id: "preparation", num: "03", x: 500 },
  { id: "expedition", num: "04", x: 720 },
  { id: "developpement", num: "05", x: 940 },
];

const PATH = `M ${STEPS[0].x} ${Y} L ${STEPS[4].x} ${Y}`;

const CYCLE_MS = 11000;
const ARRIVE_PCT = [13.6, 27.3, 40.9, 54.5, 68.2];
const HOLD_END_PCT = 86.4;
const FADE_END_PCT = 95.5;

export default function PartnershipTimeline() {
  const { t } = useTranslation();
  const translatedSteps = t("partnerships.sections.parcours.steps", { returnObjects: true });
  const steps = STEPS.map((s, i) => ({ ...s, ...translatedSteps[i] }));
  return (
    <div className="pt-timeline">
      <style>{`
        .pt-timeline { position: relative; width: 100%; }
        .pt-line {
          opacity: 0;
          stroke: ${GOLD_LINE};
          animation: pt-line-draw ${CYCLE_MS}ms ${CSS_EASE_IN_OUT} infinite;
        }
        @keyframes pt-line-draw {
          0%                        { opacity: 0; stroke-dashoffset: 100; }
          0.5%                      { opacity: 0.5; }
          ${ARRIVE_PCT[4]}%         { opacity: 0.5; stroke-dashoffset: 0; }
          ${HOLD_END_PCT}%          { opacity: 0.5; stroke-dashoffset: 0; }
          ${FADE_END_PCT}%          { opacity: 0; stroke-dashoffset: 0; }
          100%                      { opacity: 0; stroke-dashoffset: 0; }
        }
        .pt-dot {
          offset-path: path('${PATH}');
          offset-distance: 0%;
          opacity: 0;
          animation: pt-dot-travel ${CYCLE_MS}ms ${CSS_EASE_IN_OUT} infinite;
          filter: drop-shadow(0 0 4px rgba(242,216,150,0.85));
        }
        @keyframes pt-dot-travel {
          0%                 { offset-distance: 0%; opacity: 0; }
          0.5%                { opacity: 1; }
          ${ARRIVE_PCT[4]}%  { offset-distance: 100%; opacity: 1; }
          ${ARRIVE_PCT[4] + 2}% { opacity: 0; }
          100%               { opacity: 0; }
        }
        ${STEPS.map((s, i) => `
        .pt-ring-${i} {
          fill: ${BLACK_FILL}; stroke: rgba(201,168,76,0.45); stroke-width: 1.3;
          animation: pt-ring-${i} ${CYCLE_MS}ms ease-out infinite;
        }
        @keyframes pt-ring-${i} {
          0%, ${ARRIVE_PCT[i] - 0.3}% { stroke: rgba(201,168,76,0.45); fill: ${BLACK_FILL}; }
          ${ARRIVE_PCT[i]}%           { stroke: ${GOLD_LINE}; fill: rgba(201,168,76,0.16); }
          ${ARRIVE_PCT[i] + 5}%       { stroke: ${GOLD_LINE}; fill: rgba(201,168,76,0.16); }
          ${HOLD_END_PCT}%            { stroke: ${GOLD_LINE}; fill: rgba(201,168,76,0.16); }
          ${FADE_END_PCT}%            { stroke: rgba(201,168,76,0.45); fill: ${BLACK_FILL}; }
          100%                        { stroke: rgba(201,168,76,0.45); fill: ${BLACK_FILL}; }
        }
        .pt-num-${i} {
          fill: rgba(242,233,216,0.55);
          animation: pt-num-${i} ${CYCLE_MS}ms ease-out infinite;
        }
        @keyframes pt-num-${i} {
          0%, ${ARRIVE_PCT[i] - 0.3}% { fill: rgba(242,233,216,0.55); }
          ${ARRIVE_PCT[i]}%           { fill: ${GOLD_POINT}; }
          ${HOLD_END_PCT}%            { fill: ${GOLD_POINT}; }
          ${FADE_END_PCT}%            { fill: rgba(242,233,216,0.55); }
          100%                        { fill: rgba(242,233,216,0.55); }
        }
        .pt-label-${i} { opacity: 0.35; animation: pt-label-${i} ${CYCLE_MS}ms ease-out infinite; }
        @keyframes pt-label-${i} {
          0%, ${ARRIVE_PCT[i]}%   { opacity: 0.35; transform: translateY(4px); }
          ${ARRIVE_PCT[i] + 3}%   { opacity: 1; transform: translateY(0); }
          ${HOLD_END_PCT}%        { opacity: 1; transform: translateY(0); }
          ${FADE_END_PCT}%        { opacity: 0.35; }
          100%                    { opacity: 0.35; }
        }
        `).join("\n")}
      `}</style>

      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
        <path
          className="pt-line"
          d={PATH}
          fill="none"
          strokeWidth="1.3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength="100"
          strokeDasharray="100"
        />
        <circle className="pt-dot" r="5" fill={GOLD_POINT} />
        {STEPS.map((s, i) => (
          <g key={s.id}>
            <circle className={`pt-ring-${i}`} cx={s.x} cy={Y} r={R} />
            <text className={`pt-num-${i}`} x={s.x} y={Y + 5} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="700">{s.num}</text>
          </g>
        ))}
      </svg>

      <div className="pt-labels">
        {steps.map((s, i) => (
          <div key={s.id} className={`pt-label-${i} pt-label`} style={{ left: `${(s.x / VIEW_W) * 100}%` }}>
            <span className="pt-label-title">{s.title}</span>
            <p className="pt-label-text">{s.text}</p>
          </div>
        ))}
      </div>

      <style>{`
        .pt-labels { position: relative; margin-top: 34px; height: 128px; }
        .pt-label { position: absolute; top: 0; width: 172px; padding: 0 8px; box-sizing: border-box; transform: translateX(-50%); text-align: center; }
        .pt-label-title { display: block; font-family: 'Fraunces', serif; font-weight: 500; font-size: 14px; color: ${IVORY}; margin-bottom: 8px; line-height: 1.32; }
        .pt-label-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; line-height: 1.55; color: rgba(242,233,216,0.60); margin: 0; }
        @media (max-width: 900px) {
          .pt-labels { height: auto; }
          .pt-label { position: static; width: 100%; transform: none; text-align: left; margin-bottom: 22px; }
        }
      `}</style>
    </div>
  );
}
