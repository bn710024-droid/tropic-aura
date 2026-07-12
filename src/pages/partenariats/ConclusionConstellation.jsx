// Texture de fond pour la conclusion — un semis de points reliés par des
// traits fins dorés, qui se dessine lentement (même technique que
// PartnershipTimeline / ExportRouteMap : stroke-dashoffset + pathLength,
// 100% CSS, aucun JS par frame). Purement décoratif, jamais dans le
// chemin de lecture : opacité très basse, toujours derrière le texte.
const GOLD_LINE = "#C9A84C";
const GOLD_POINT = "#F2D896";

const VIEW_W = 1200;
const VIEW_H = 700;

const POINTS = [
  { x: 150, y: 560 }, { x: 340, y: 190 }, { x: 560, y: 470 }, { x: 700, y: 130 },
  { x: 860, y: 400 }, { x: 990, y: 160 }, { x: 1080, y: 520 }, { x: 240, y: 340 },
];
const ORDER = [7, 1, 3, 5, 6, 4, 2, 0];
const ORDERED = ORDER.map((i) => POINTS[i]);

const PATH = ORDERED.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");

const CYCLE_MS = 16000;
const DRAW_END_PCT = 42;
const HOLD_END_PCT = 88;
const FADE_END_PCT = 96;
const N = ORDERED.length;
const ARRIVE_PCT = ORDERED.map((_, i) => +((i / (N - 1)) * DRAW_END_PCT).toFixed(1));

export default function ConclusionConstellation({ className = "" }) {
  return (
    <div className={`cc-wrap ${className}`} aria-hidden="true">
      <style>{`
        .cc-wrap { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .cc-svg { width: 100%; height: 100%; display: block; }
        .cc-line {
          opacity: 0; stroke: ${GOLD_LINE};
          animation: cc-line-draw ${CYCLE_MS}ms ease-in-out infinite;
        }
        @keyframes cc-line-draw {
          0%                    { opacity: 0; stroke-dashoffset: 100; }
          1%                    { opacity: 0.16; }
          ${DRAW_END_PCT}%      { opacity: 0.16; stroke-dashoffset: 0; }
          ${HOLD_END_PCT}%      { opacity: 0.16; stroke-dashoffset: 0; }
          ${FADE_END_PCT}%      { opacity: 0; stroke-dashoffset: 0; }
          100%                  { opacity: 0; stroke-dashoffset: 0; }
        }
        ${ORDERED.map((p, i) => `
        .cc-point-${i} {
          opacity: 0; transform-box: fill-box; transform-origin: center;
          animation: cc-point-${i} ${CYCLE_MS}ms ease-out infinite;
        }
        @keyframes cc-point-${i} {
          0%, ${Math.max(0, ARRIVE_PCT[i] - 0.5)}% { opacity: 0; transform: scale(0.6); }
          ${ARRIVE_PCT[i]}%                        { opacity: 0.55; transform: scale(1.7); }
          ${Math.min(100, ARRIVE_PCT[i] + 3)}%      { opacity: 0.32; transform: scale(1); }
          ${HOLD_END_PCT}%                          { opacity: 0.32; transform: scale(1); }
          ${FADE_END_PCT}%                          { opacity: 0; transform: scale(0.6); }
          100%                                      { opacity: 0; transform: scale(0.6); }
        }`).join("\n")}
      `}</style>
      <svg className="cc-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice">
        <path
          className="cc-line"
          d={PATH}
          fill="none"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength="100"
          strokeDasharray="100"
        />
        {ORDERED.map((p, i) => (
          <circle key={i} className={`cc-point-${i}`} cx={p.x} cy={p.y} r="2.6" fill={GOLD_POINT} />
        ))}
      </svg>
    </div>
  );
}
