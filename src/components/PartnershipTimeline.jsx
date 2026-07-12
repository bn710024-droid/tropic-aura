import { CSS_EASE_IN_OUT } from "../motion/easing";

// ============================================================
//  Timeline SVG animée — section "Le parcours d'un partenariat".
//  Un seul tracé traversant 5 étapes dans l'ordre (pas un éventail depuis
//  une origine comme la carte export de la page À Propos) : le point
//  lumineux part de la première étape, parcourt toute la ligne, s'arrête
//  brièvement (halo doré) à chaque étape atteinte, puis repart. Une fois
//  arrivé à la dernière étape, tout reste éclairé 2s avant de s'éteindre
//  et de recommencer — boucle infinie, ~11s, aucun JS par frame (100%
//  CSS, même technique que ExportRouteMap.jsx).
// ============================================================

const GOLD_LINE = "#D9A94A";
const GOLD_POINT = "#F2D896";

const VIEW_W = 900;
const VIEW_H = 260;

const STEPS = [
  { id: "echange", x: 60, y: 150, title: "Premier échange", text: "Une conversation simple pour comprendre vos besoins et vos objectifs." },
  { id: "comprehension", x: 255, y: 80, title: "Compréhension de vos besoins", text: "Nous prenons le temps de cerner votre marché, vos contraintes et vos attentes." },
  { id: "preparation", x: 450, y: 190, title: "Préparation export", text: "Sélection, conditionnement et documentation préparés avec rigueur." },
  { id: "expedition", x: 645, y: 80, title: "Première expédition", text: "Un premier envoi, suivi de près, pour poser les bases de la confiance." },
  { id: "developpement", x: 840, y: 150, title: "Développement du partenariat", text: "Une collaboration qui s'approfondit, expédition après expédition." },
];

const PATH = `M ${STEPS[0].x} ${STEPS[0].y} C 130 90, 190 90, ${STEPS[1].x} ${STEPS[1].y} C 330 70, 380 200, ${STEPS[2].x} ${STEPS[2].y} C 520 180, 570 70, ${STEPS[3].x} ${STEPS[3].y} C 715 70, 765 150, ${STEPS[4].x} ${STEPS[4].y}`;

const CYCLE_MS = 11000;
// 5 étapes, budget de parcours 7500ms (~1500ms/étape), tenue 2000ms,
// fondu 800ms, pause 700ms avant la reprise — voir motion/drawSVG.js.
const ARRIVE_PCT = [13.6, 27.3, 40.9, 54.5, 68.2];
const HOLD_END_PCT = 86.4;
const FADE_END_PCT = 95.5;

export default function PartnershipTimeline() {
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
          0.5%                      { opacity: 1; }
          ${ARRIVE_PCT[4]}%         { opacity: 1; stroke-dashoffset: 0; }
          ${HOLD_END_PCT}%          { opacity: 1; stroke-dashoffset: 0; }
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
        .pt-point-${i} { transform-box: fill-box; transform-origin: center; animation: pt-arrive-${i} ${CYCLE_MS}ms ease-out infinite; }
        @keyframes pt-arrive-${i} {
          0%, ${ARRIVE_PCT[i] - 0.3}% { transform: scale(1); opacity: 0.4; }
          ${ARRIVE_PCT[i]}%           { transform: scale(1); opacity: 1; }
          ${ARRIVE_PCT[i] + 2.5}%     { transform: scale(1.8); opacity: 0.5; }
          ${ARRIVE_PCT[i] + 5}%       { transform: scale(1); opacity: 1; }
          ${HOLD_END_PCT}%            { transform: scale(1); opacity: 1; }
          ${FADE_END_PCT}%            { opacity: 0.4; }
          100%                        { opacity: 0.4; }
        }
        .pt-label-${i} { opacity: 0; animation: pt-label-${i} ${CYCLE_MS}ms ease-out infinite; }
        @keyframes pt-label-${i} {
          0%, ${ARRIVE_PCT[i]}%   { opacity: 0; transform: translateY(6px); }
          ${ARRIVE_PCT[i] + 3}%   { opacity: 1; transform: translateY(0); }
          ${HOLD_END_PCT}%        { opacity: 1; transform: translateY(0); }
          ${FADE_END_PCT}%        { opacity: 0; }
          100%                    { opacity: 0; }
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
        <circle className="pt-dot" r="6" fill={GOLD_POINT} />
        {STEPS.map((s, i) => (
          <circle key={s.id} className={`pt-point-${i}`} cx={s.x} cy={s.y} r="6" fill={GOLD_POINT} />
        ))}
      </svg>

      <div className="pt-labels">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`pt-label-${i} pt-label`} style={{ left: `${(s.x / VIEW_W) * 100}%` }}>
            <span className="pt-label-title">{s.title}</span>
            <p className="pt-label-text">{s.text}</p>
          </div>
        ))}
      </div>

      <style>{`
        .pt-labels { position: relative; margin-top: 22px; height: 120px; }
        .pt-label { position: absolute; top: 0; width: 200px; transform: translateX(-50%); text-align: center; }
        .pt-label-title { display: block; font-family: 'Fraunces', serif; font-weight: 500; font-size: 15px; color: ${GOLD_POINT}; margin-bottom: 6px; }
        .pt-label-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12.5px; line-height: 1.55; color: rgba(242,233,216,0.72); margin: 0; }
        @media (max-width: 900px) {
          .pt-labels { height: auto; }
          .pt-label { position: static; width: 100%; transform: none; text-align: left; margin-bottom: 20px; }
        }
      `}</style>
    </div>
  );
}
